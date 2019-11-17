import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import DainaButton from './components/dainaButton/DainaButton';
import Daina from './components/daina/Daina';

import './App.scss';

const infoText = 'LSTM (Long Short Term Memory) model that generates Latvian folk songs - Dainas';
const dainaText = 'šeit būs dainas teksts\nšeit būs dainas teksts\nšeit būs dainas teksts\nšeit būs dainas teksts';

const App = () => {
  const [isModelCreated, setIsModelCreated] = useState(false);
  const [isModelTrained, setIsModelTrained] = useState(false);
  const [LSTMLayers, setLSTMlayers] = useState(128);
  const [numberOfEpochs, setNumberOfEpochs] = useState(5);
  const [examplesPerEpoch, setExamplesPerEpoch] = useState(2048);
  const [batchSize, setBatchSize] = useState(128);
  const [validationSplit, setValidationSplit] = useState(0.0625);
  const [learningRate, setLearningRate] = useState(0.01);
  const [randomness, setRandomness] = useState(15);
  const [dainas, setDainas] = useState([]);

  const onCreateModel = event => {
    event.preventDefault();
    console.log('Create model');
    setIsModelCreated(true);
  };

  const onTrainModel = event => {
    event.preventDefault();
    console.log('Train model');
    setIsModelTrained(true);
  };

  const onGenerateDaina = () => {
    const test = [...dainas];
    test.push(dainaText);
    setDainas(test);
  };

  // // Define a model for linear regression.
  // const model = tf.sequential();
  // model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  // model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

  // // Generate some synthetic data for training.
  // const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
  // const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

  // // Train the model using the data.
  // model.fit(xs, ys, { epochs: 10 }).then(() => {
  //   // Use the model to do inference on a data point the model hasn't seen before:
  //   model.predict(tf.tensor2d([5], [1, 1])).print();
  //   // Open the browser devtools to see the output
  // });

  return (
    <div className="daina-page">
      <h1>Dainas Generator</h1>
      <p>{infoText}</p>
      <h2>Create model</h2>
      <div className="creation-controls">
        <form>
          <div>
            <label htmlFor="randlstm-layer-size">
              LSTM layer size
              <input
                id="randlstm-layer-size"
                name="randlstm-layer-size"
                type="number"
                value={LSTMLayers}
                onChange={event => setLSTMlayers(event.target.value)}
              />
            </label>
          </div>
          <DainaButton onClick={onCreateModel} tooltip="Create model!" type="submit" />
        </form>
      </div>
      <h2>Train model</h2>
      <div className="training-controls">
        <form className={!isModelCreated ? 'disabled' : null}>
          <div>
            <label htmlFor="number-of-epochs">
              Number of Epochs
              <input
                id="randlstm-layer-size"
                name="randlstm-layer-size"
                type="number"
                value={numberOfEpochs}
                onChange={event => setNumberOfEpochs(event.target.value)}
                disabled={!isModelCreated}
              />
            </label>
            <label htmlFor="examples-per-epoch">
              Examples per epoch
              <input
                id="randlstm-layer-size"
                name="randlstm-layer-size"
                type="number"
                value={examplesPerEpoch}
                onChange={event => setExamplesPerEpoch(event.target.value)}
                disabled={!isModelCreated}
              />
            </label>
            <label htmlFor="batch-size">
              Batch size
              <input
                id="randlstm-layer-size"
                name="randlstm-layer-size"
                type="number"
                value={batchSize}
                onChange={event => setBatchSize(event.target.value)}
                disabled={!isModelCreated}
              />
            </label>
            <label htmlFor="validation-spilt">
              Validation spilt
              <input
                id="randlstm-layer-size"
                name="randlstm-layer-size"
                type="number"
                value={validationSplit}
                onChange={event => setValidationSplit(event.target.value)}
                disabled={!isModelCreated}
              />
            </label>
            <label htmlFor="learning-rate">
              Learning rate
              <input
                id="randlstm-layer-size"
                name="randlstm-layer-size"
                type="number"
                value={learningRate}
                onChange={event => setLearningRate(event.target.value)}
                disabled={!isModelCreated}
              />
            </label>
          </div>
          <DainaButton onClick={onTrainModel} tooltip="Train model!" type="submit" disabled={!isModelCreated} />
        </form>
      </div>
      <h2>Generate Dainas</h2>
      <div className="model-controls">
        <label className={!isModelTrained ? 'disabled' : null} htmlFor="randomness">
          Randomness
          <input
            name="randomnes"
            type="range"
            min="0"
            max="100"
            step="5"
            value={randomness}
            onChange={event => setRandomness(event.target.value)}
            disabled={!isModelTrained}
          />
        </label>
        <DainaButton onClick={onGenerateDaina} tooltip="Generate Daina!" disabled={!isModelTrained} />
      </div>
      <div className="content">
        {dainas.map((text, index) => (
          <Daina title={`Daina ${index + 1}`} text={text} key={`Daina_${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default App;
