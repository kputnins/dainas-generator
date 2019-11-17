/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');

// Get the set of unique characters from text
const getCharSet = (text, textLength) => {
  const charSet = [];
  for (let i = 0; i < textLength; ++i) {
    if (charSet.indexOf(text[i]) === -1) {
      charSet.push(text[i]);
    }
  }
  return charSet;
};

// Convert text string to integer indices
const textToIndices = (text, charSet) => {
  const indices = [];
  for (let i = 0; i < text.length; ++i) {
    indices.push(charSet.indexOf(text[i]));
  }
  return indices;
};

// Get a random slice of text data
const getRandomSlice = (text, textLength, sampleLength, charSet) => {
  const startIndex = Math.round(Math.random() * (textLength - sampleLength - 1));
  const textSlice = text.slice(startIndex, startIndex + sampleLength);
  return [textSlice, textToIndices(textSlice, charSet)];
};

// Creates LSTM model
const createModel = (sampleLen, charSetSize, lstmLayerSizes) => {
  const model = tf.sequential();

  for (let i = 0; i < lstmLayerSizes.length; ++i) {
    const lstmLayerSize = lstmLayerSizes[i];
    model.add(
      tf.layers.lstm({
        units: lstmLayerSize,
        returnSequences: i < lstmLayerSizes.length - 1,
        inputShape: i === 0 ? [sampleLen, charSetSize] : undefined,
      }),
    );
  }
  model.add(tf.layers.dense({ units: charSetSize, activation: 'softmax' }));

  return model;
};

// Compiles model
const compileModel = (model, learningRate) => {
  const optimizer = tf.train.rmsprop(learningRate);
  model.compile({ optimizer, loss: 'categoricalCrossentropy' });
  console.log(`Compiled model with learning rate ${learningRate}`);
  model.summary();
};

// Trains model
const fitModel = async (
  model,
  textLength,
  sampleLength,
  sampleStep,
  charSetSize,
  indices,
  numEpochs,
  examplesPerEpoch,
  batchSize,
  validationSplit,
  callbacks,
) => {
  for (let index = 0; index < numEpochs; ++index) {
    // Prepare beginning indices of examples.
    const exampleBeginIndices = [];
    for (let j = 0; j < textLength - sampleLength - 1; j += sampleStep) {
      exampleBeginIndices.push(j);
    }

    // Randomly shuffle the beginning indices.
    tf.util.shuffle(exampleBeginIndices);
    let examplePosition = 0;

    const xsBuffer = new tf.TensorBuffer([examplesPerEpoch, sampleLength, charSetSize]);
    const ysBuffer = new tf.TensorBuffer([examplesPerEpoch, charSetSize]);
    for (let i = 0; i < examplesPerEpoch; ++i) {
      const beginIndex = exampleBeginIndices[examplePosition % exampleBeginIndices.length];
      for (let j = 0; j < sampleLength; ++j) {
        xsBuffer.set(1, i, j, indices[beginIndex + j]);
      }
      ysBuffer.set(1, i, indices[beginIndex + sampleLength]);
      examplePosition++;
    }

    const xs = xsBuffer.toTensor();
    const ys = ysBuffer.toTensor();

    await model.fit(xs, ys, {
      epochs: 1,
      batchSize,
      validationSplit,
      callbacks,
    });
    xs.dispose();
    ys.dispose();
  }
};

// Draw a sample based on probabilities.
// eslint-disable-next-line arrow-body-style
const sample = (probs, temperature) => {
  return tf.tidy(() => {
    const logits = tf.div(tf.log(probs), Math.max(temperature, 1e-6));
    const isNormalized = false;
    // `logits` is for a multinomial distribution, scaled by the temperature.
    // We randomly draw a sample from the distribution.
    return tf.multinomial(logits, 1, null, isNormalized).dataSync()[0];
  });
};

// Generate text using a next-char-prediction model.
const generateText = async (model, text, charSet, sentenceIndices, length, temperature, onTextGenerationChar) => {
  const sampleLen = model.inputs[0].shape[1];
  const charSetSize = model.inputs[0].shape[2];

  // Avoid overwriting the original input.
  // eslint-disable-next-line no-param-reassign
  sentenceIndices = sentenceIndices.slice();

  let generated = '';
  while (generated.length < length) {
    // Encode the current input sequence as a one-hot Tensor.
    const inputBuffer = new tf.TensorBuffer([1, sampleLen, charSetSize]);

    // Make the one-hot encoding of the seeding sentence.
    for (let i = 0; i < sampleLen; ++i) {
      inputBuffer.set(1, 0, i, sentenceIndices[i]);
    }
    const input = inputBuffer.toTensor();

    // Call model.predict() to get the probability values of the next
    // character.
    const output = model.predict(input);

    // Sample randomly based on the probability values.
    const winnerIndex = sample(tf.squeeze(output), temperature);
    const winnerChar = charSet[winnerIndex];
    if (onTextGenerationChar != null) {
      await onTextGenerationChar(winnerChar);
    }

    generated += winnerChar;
    // eslint-disable-next-line no-param-reassign
    sentenceIndices = sentenceIndices.slice(1);
    sentenceIndices.push(winnerIndex);

    // Memory cleanups.
    input.dispose();
    output.dispose();
  }
  return generated;
};

const main = async () => {
  const text = fs.readFileSync(path.join('server', 'data', 'text.txt'), { encoding: 'utf-8' });
  const textLength = text.length;
  const sampleLength = 60;
  const sampleStep = 1;
  // const lstmLayerSizes = [128, 128, 128];
  const lstmLayerSizes = [2, 2, 2];
  const epochs = 2;
  const examplesPerEpoch = 2048;
  const batchSize = 128;
  const validationSplit = 0.0625;
  const learningRate = 0.05;
  const displayLength = 100;
  const savePath = path.join('client', 'static', 'model');

  const charSet = getCharSet(text, textLength);
  const charSetSize = charSet.length;
  const indices = textToIndices(text, charSet);

  const model = createModel(sampleLength, charSetSize, lstmLayerSizes);
  compileModel(model, learningRate);

  const [seed, seedIndices] = getRandomSlice(text, textLength, sampleLength, charSet);
  console.log(`Seed text:\n"${seed}"\n`);

  const DISPLAY_TEMPERATURES = [0, 0.25, 0.5, 0.75];

  let epochCount = 0;

  await fitModel(
    model,
    textLength,
    sampleLength,
    sampleStep,
    charSetSize,
    indices,
    epochs,
    examplesPerEpoch,
    batchSize,
    validationSplit,
    {
      onTrainBegin: async () => {
        epochCount++;
        console.log(`Epoch ${epochCount} of ${epochs}:`);
      },
      onTrainEnd: async () => {
        if (epochCount % 5 === 0) {
          DISPLAY_TEMPERATURES.forEach(async temperature => {
            const generated = await generateText(model, text, charSet, seedIndices, displayLength, temperature);
            console.log(`Generated text (temperature=${temperature}):`);
            console.log(`"${generated}"\n`);
          });
        }
      },
    },
  );

  await model.save(`file://${savePath}`);
  console.log(`\nSaved model to ${savePath}\n`);
};

main();
