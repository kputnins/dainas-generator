module.exports = {
  MODEL_PATH: [
    'https://raw.githubusercontent.com/djentelmenis/dainas-generator/master/lstm/model/test/model.json',
    'https://raw.githubusercontent.com/djentelmenis/dainas-generator/master/lstm/model/test/weights.bin',
  ],
  SAMPLE_LENGTH: 60,
  SAMPLE_STEP: 3,
  LSTM_LAYER_SIZES: [256, 256, 256],
  EPOCHS: 500,
  EXAMPLES_PER_EPOCH: 10000,
  BATCH_SIZE: 256,
  VALIDATION_SPLIT: 0.1,
  LEARNING_RATE: 1e-2,
  DISPLAY_LENGTH: 160,
  MODEL_OUTPUT_PATH: ['lstm', 'model'],
};
