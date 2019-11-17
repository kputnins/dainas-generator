import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { data } from '../static/text.json';
import DainaButton from './components/dainaButton/DainaButton';
import Daina from './components/daina/Daina';

import './App.scss';

const baseClass = 'dainas-generator';
const infoText = 'LSTM (Long Short Term Memory) model that generates Latvian folk songs - Dainas';

const loadModel = async () =>
  // eslint-disable-next-line implicit-arrow-linebreak
  tf.loadLayersModel(
    'https://raw.githubusercontent.com/djentelmenis/dainas-generator-model/master/model.json',
    'https://raw.githubusercontent.com/djentelmenis/dainas-generator-model/master/weights.bin',
  );

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
  return textToIndices(textSlice, charSet);
};

const text = data;
const textLength = text.length;
const sampleLength = 60;
const charSet = getCharSet(text, textLength);
const seedIndices = getRandomSlice(text, textLength, sampleLength, charSet);
const displayLength = 100;

const App = () => {
  const [model, setModel] = useState(null);
  const [temperature, setTemperature] = useState(0.75);
  const [dainas, setDainas] = useState([]);

  useEffect(() => {
    loadModel().then(loadedModel => {
      setModel(loadedModel);
    });
  }, []);

  const onGenerateDaina = async () => {
    const generatedDaina = await generateText(model, text, charSet, seedIndices, displayLength, temperature);
    const parsedDaina = generatedDaina.split('x').join('\n');
    setDainas([...dainas, parsedDaina]);
  };

  return (
    <div className={baseClass}>
      <h1 className={`${baseClass}__title-1`}>Dainas Generator</h1>
      <p className={`${baseClass}__about`}>{infoText}</p>
      <h2 className={`${baseClass}__title-2`}>Generate Dainas</h2>
      <div className={`${baseClass}__controls`}>
        <label htmlFor="temperature">
          Randomness
          <input
            name="temperature"
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={temperature}
            onChange={event => setTemperature(event.target.value)}
          />
        </label>
        <DainaButton onClick={onGenerateDaina} tooltip="Dainafy!" />
      </div>
      <div className={`${baseClass}__dainas`}>
        {dainas.map((generatedDaina, index) => (
          <Daina title={`Daina ${index + 1}`} text={generatedDaina} key={`Daina_${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default App;
