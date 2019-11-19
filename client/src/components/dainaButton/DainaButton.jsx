import React from 'react';
import { func, string, bool } from 'prop-types';
import tree from '../../../static/img/austraskoks.svg';

import './DainaButton.scss';

const baseClass = 'daina-button';

const DainaButton = ({ onClick, tooltip, loading }) => {
  const disabled = loading ? '--disabled' : '';

  return (
    <>
      <button className={`${baseClass} ${disabled}`} onClick={onClick} disabled={loading}>
        <img src={tree} alt="Generate new daina" />
        <span className="tooltip">{tooltip}</span>
        <div className={`${baseClass}__border ${disabled}`} />
      </button>
    </>
  );
};

DainaButton.defaultProps = {
  loading: false,
};

DainaButton.propTypes = {
  onClick: func.isRequired,
  tooltip: string.isRequired,
  loading: bool,
};

export default DainaButton;
