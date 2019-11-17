import React from 'react';
import { func, string } from 'prop-types';
import tree from '../../../static/img/austraskoks.svg';

import './DainaButton.scss';

const DainaButton = ({ onClick, tooltip }) => (
  <>
    <button className="daina-button" onClick={onClick}>
      <img src={tree} alt="Generate new daina" />
      <span className="tooltip">{tooltip}</span>
    </button>
  </>
);

DainaButton.propTypes = {
  onClick: func.isRequired,
  tooltip: string.isRequired,
};

export default DainaButton;
