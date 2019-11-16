import React from 'react';
import { func } from 'prop-types';
import tree from '../../../static/img/austraskoks.svg';

import './DainaButton.scss';

const DainaButton = ({ onClick }) => (
  <>
    <button className="daina-button" type="button" onClick={onClick}>
      <img src={tree} alt="Generate new daina" />
      <span className="tooltip">Dainafy!</span>
    </button>
  </>
);

DainaButton.propTypes = {
  onClick: func.isRequired,
};

export default DainaButton;
