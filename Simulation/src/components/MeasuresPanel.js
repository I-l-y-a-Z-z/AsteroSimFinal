import React from 'react';
import './MeasuresPanel.css';

const MeasuresPanel = ({ onSelectMeasure }) => {
  return (
    <div className="measures-panel-card">
      <button className="measure-button" onClick={() => onSelectMeasure('tractor')}>
        Deploy Gravity Tractor
      </button>
      <button className="measure-button" onClick={() => onSelectMeasure('missile')}>
        Launch Nuclear Missile
      </button>
      <button className="measure-button" onClick={() => onSelectMeasure('starship')}>
        Evacuate Earth
      </button>
    </div>
  );
};

export default MeasuresPanel;