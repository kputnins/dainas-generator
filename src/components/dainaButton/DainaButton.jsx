import React from 'react';
import { func, string, bool } from 'prop-types';
import tree from '../../../static/img/austraskoks.svg';

import './DainaButton.scss';

const DainaButton = ({ onClick, tooltip, type, disabled }) => (
  <>
    <button className="daina-button" type={type} onClick={onClick} disabled={disabled}>
      <img src={tree} alt="Generate new daina" />
      <span className="tooltip">{tooltip}</span>
    </button>
  </>
);

DainaButton.defaultProps = {
  disabled: false,
  type: 'button',
};

DainaButton.propTypes = {
  onClick: func.isRequired,
  tooltip: string.isRequired,
  type: string,
  disabled: bool,
};

export default DainaButton;
