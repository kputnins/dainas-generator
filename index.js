import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/App';

import './static/styles/styles.scss';

const mountNode = document.getElementById('app');

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(<App name="Jane" />, mountNode);
