/* eslint-disable no-console */
const path = require('path');
const settings = require('../../lstm/constants/modelSettings');
const model = require('../../lstm/lib/LSTMModelNode');
const textCorpus = require('../../lstm/data/text.json');

const { getCharSet, textToIndices, createModel, compileModel, getRandomSlice, fitModel, generateText } = model;

const {
  SAMPLE_LENGTH,
  SAMPLE_STEP,
  LSTM_LAYER_SIZES,
  EPOCHS,
  EXAMPLES_PER_EPOCH,
  BATCH_SIZE,
  VALIDATION_SPLIT,
  LEARNING_RATE,
  DISPLAY_LENGTH,
  MODEL_OUTPUT_PATH,
} = settings;

const buildModel = async () => {
  const text = textCorpus.data;
  const textLength = text.length;
  const charSet = getCharSet(text, textLength);
  const charSetSize = charSet.length;
  const indices = textToIndices(text, charSet);

  console.log('TCL: main -> textLength', textLength);
  console.log('TCL: main -> charSet', charSet);

  const LSTMModel = createModel(SAMPLE_LENGTH, charSetSize, LSTM_LAYER_SIZES);
  compileModel(LSTMModel, LEARNING_RATE);

  const [seed, seedIndices] = getRandomSlice(text, textLength, SAMPLE_LENGTH, charSet);
  console.log(`Seed text:\n"${seed}"\n`);

  const DISPLAY_TEMPERATURES = [0, 0.25, 0.5, 0.75];
  let epochCount = 0;

  await fitModel(
    LSTMModel,
    textLength,
    SAMPLE_LENGTH,
    SAMPLE_STEP,
    charSetSize,
    indices,
    EPOCHS,
    EXAMPLES_PER_EPOCH,
    BATCH_SIZE,
    VALIDATION_SPLIT,
    {
      onTrainBegin: async () => {
        epochCount++;
        console.log(`Epoch ${epochCount} of ${EPOCHS}:`);
      },
      onTrainEnd: async () => {
        if (epochCount % (EPOCHS / 5) === 0) {
          DISPLAY_TEMPERATURES.forEach(async temperature => {
            const generated = await generateText(LSTMModel, charSet, seedIndices, DISPLAY_LENGTH, temperature);
            console.log(`Generated text (temperature=${temperature}):`);
            console.log(`"${generated}"\n`);
          });
        }
      },
    },
  );

  await LSTMModel.save(`file://${path.join(...MODEL_OUTPUT_PATH)}`);
  console.log(`\nSaved model to ${path.join(...MODEL_OUTPUT_PATH)}\n`);
};

buildModel();
