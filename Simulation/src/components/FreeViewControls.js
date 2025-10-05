// src/components/FreeViewControls.js
import React from 'react';
import './FreeViewControls.css';

const FreeViewControls = (props) => {
  const { onSetView } = props;

  return (
    <div className="free-view-card">
      <div className="free-view-title">Free Camera Control</div>
      
      <button className="view-button" onClick={() => onSetView('global')}>
        Solar System View
      </button>
      <button className="view-button" onClick={() => onSetView('earth_zoom')}>
        Earth View
      </button>
      <button className="view-button" onClick={() => onSetView('asteroid')}>
        Asteroid View
      </button>
    </div>
  );
};

export default FreeViewControls;