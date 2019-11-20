import React, { useState, useEffect } from 'react';
import { SAMPLE_LENGTH } from '../../lstm/constants/modelSettings';
import { loadModel, getCharSet, getRandomSlice, generateText } from '../../lstm/lib/LSTMModel';
import { data } from '../../lstm/data/text.json';
import DainaButton from './components/dainaButton/DainaButton';
import Daina from './components/daina/Daina';

import './App.scss';

const baseClass = 'dainas-generator';

const App = () => {
  const [temperature, setTemperature] = useState(0.75);
  const [displayLength, setDisplayLength] = useState(200);
  const [model, setModel] = useState(null);
  const [text, setText] = useState('');
  const [textLength, setTextLength] = useState(0);
  const [charSet, setCharSet] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedChar, setGeneratedChar] = useState('');
  const [dainas, setDainas] = useState([]);

  useEffect(() => {
    setText(data);
    setTextLength(data.length);
  }, []);

  useEffect(() => {
    loadModel().then(loadedModel => {
      setModel(loadedModel);
    });
    setCharSet(getCharSet(text, textLength));
  }, [text]);

  useEffect(() => {
    if (dainas.length > 0) {
      const oldDainas = dainas.slice(0, -1);
      const newDaina = dainas[dainas.length - 1] + generatedChar;
      setDainas([...oldDainas, newDaina]);
    }
  }, [generatedChar]);

  const onGenerateChar = async (c) => {
    setGeneratedChar(c.replace('x', '\n'));
  };

  const onGenerateDaina = async () => {
    setIsGenerating(true);
    setDainas([...dainas, '']);
    const seedIndices = getRandomSlice(text, textLength, SAMPLE_LENGTH, charSet);
    await generateText(model, charSet, seedIndices, displayLength, temperature, onGenerateChar);
    setIsGenerating(false);
    setGeneratedChar('');
  };

  return (
    <div className={baseClass}>
      <h1 className={`${baseClass}__title-1`}>Dainas Generator</h1>
      <p className={`${baseClass}__about`}>
        LSTM (Long Short Term Memory) model that generates Latvian folk songs -&nbsp;
        <a href="https://en.wikipedia.org/wiki/Daina_(Latvia)">Dainas</a>
      </p>
      <p className={`${baseClass}__about`}>
        Browser executed text generation in real-time using a pre-trained model
      </p>
      <p className={`${baseClass}__about`}>
        Created using&nbsp;
        <a href="https://www.tensorflow.org/js">Tensorflow.js</a>
        , based on the LSTM&nbsp;
        <a href="https://github.com/tensorflow/tfjs-examples/tree/master/lstm-text-generation">example</a>
      </p>
      <p className={`${baseClass}__about`}>
        Full project code <a href="https://github.com/djentelmenis/dainas-generator">here</a>
      </p>
      <h2 className={`${baseClass}__title-2`}>Generate Dainas</h2>
      <div className={`${baseClass}__controls`}>
        <label htmlFor="length">
          {`Length - ${displayLength}`}
          <input
            name="length"
            type="range"
            min="50"
            max="1000"
            step="50"
            value={displayLength}
            onChange={event => setDisplayLength(event.target.value)}
          />
        </label>
        <label htmlFor="temperature">
          {`Temperature - ${temperature}`}
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
        {/* <textarea className="monospace" id="generated-text" value="test" rows="10" style={{ color: 'black' }} /> */}
        <DainaButton onClick={onGenerateDaina} tooltip="Dainafy!" loading={isGenerating} />
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
