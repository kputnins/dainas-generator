import React, { useState } from 'react';
import DainaButton from './components/dainaButton/DainaButton';
import Daina from './components/daina/Daina';

import './App.scss';

const infoText = 'LSTM (Long Short Term Memory) model that generates Latvian folk songs - Dainas';
const dainaText = 'šeit būs dainas teksts\nšeit būs dainas teksts\nšeit būs dainas teksts\nšeit būs dainas teksts';

const App = () => {
  const [randomness, setRandomness] = useState(15);
  const [dainas, setDainas] = useState([]);

  const onRNDChange = event => {
    setRandomness(event.target.value);
  };

  const onGenerateDaina = () => {
    const test = [...dainas];
    test.push(dainaText);
    setDainas(test);
  };

  return (
    <div className="daina-page">
      <h1>Dainu Generator</h1>
      <p>{infoText}</p>
      <div className="controls">
        <div className="rnd-slider">
          <h3>Randomness</h3>
          <input type="range" name="randomnes" min="0" max="100" step="5" value={randomness} onChange={onRNDChange} />
        </div>
        <DainaButton onClick={onGenerateDaina} />
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
