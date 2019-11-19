import React, { useState, useEffect } from 'react';
import { SAMPLE_LENGTH } from '../../lstm/constants/modelSettings';
import { loadModel, getCharSet, getRandomSlice, generateText } from '../../lstm/lib/LSTMModel';
import { data } from '../static/text.json';
import DainaButton from './components/dainaButton/DainaButton';
import Daina from './components/daina/Daina';

import './App.scss';

const baseClass = 'dainas-generator';
const infoLine1 = 'LSTM (Long Short Term Memory) model that generates Latvian folk songs - Dainas';
const infoLine2 = 'Created using Tensorflow.js, based on the LSTM example';
const infoLine3 = 'Full project code here';

const App = () => {
  const [temperature, setTemperature] = useState(0.75);
  const [displayLength, setDisplayLength] = useState(200);
  const [model, setModel] = useState(null);
  const [text, setText] = useState('');
  const [textLength, setTextLength] = useState(0);
  const [charSet, setCharSet] = useState([]);
  const [dainas, setDainas] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const onGenerateDaina = async () => {
    setIsGenerating(true);
    setTimeout(async () => {
      const seedIndices = getRandomSlice(text, textLength, SAMPLE_LENGTH, charSet);
      const generatedDaina = await generateText(model, charSet, seedIndices, displayLength, temperature);
      const parsedDaina = generatedDaina
        // .split('xx')
        // .slice(1, -1)
        // .join('xx')
        .split('x')
        .join('\n');
      setDainas([...dainas, parsedDaina]);
      setIsGenerating(false);
    }, 1);
  };

  return (
    <div className={baseClass}>
      <h1 className={`${baseClass}__title-1`}>Dainas Generator</h1>
      <p className={`${baseClass}__about`}>{infoLine1}</p>
      <p className={`${baseClass}__about`}>{infoLine2}</p>
      <p className={`${baseClass}__about`}>{infoLine3}</p>
      <h2 className={`${baseClass}__title-2`}>Generate Dainas</h2>
      <div className={`${baseClass}__controls`}>
        <label htmlFor="length">
          {`Length - ${displayLength}`}
          <input
            name="length"
            type="range"
            min="100"
            max="500"
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
