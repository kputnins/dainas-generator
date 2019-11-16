import React from 'react';
import { string } from 'prop-types';

import './Daina.scss';

const Daina = ({ title, text }) => (
  <div className="daina">
    <h2>{title}</h2>
    <pre>{text}</pre>
  </div>
);

Daina.propTypes = {
  title: string.isRequired,
  text: string.isRequired,
};

export default Daina;
