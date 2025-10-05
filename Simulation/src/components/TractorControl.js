// src/components/TractorControl.js
import React, { useState } from 'react';
import './TractorControl.css';

const TractorControl = ({ onLaunch, onCancel }) => {
  // State to hold the value of the slider
  // Mass in kg, default 10,000 kg
  const [mass, setMass] = useState(10000);

  return (
    <div className="tractor-panel-overlay">
      <div className="tractor-panel-window">
        <div className="tractor-panel-title">Gravity Tractor Configuration</div>
        
        <div className="slider-container">
          <div className="slider-label">
            <span>Select Tractor Mass:</span>
            <span className="slider-value">{mass.toLocaleString()} kg</span>
          </div>
          <input
            type="range"
            min="1000"
            max="1000000"
            step="1000"
            value={mass}
            onChange={(e) => setMass(parseInt(e.target.value, 10))}
            className="slider"
          />
        </div>

        <div className="tractor-panel-buttons">
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="launch-button" onClick={() => onLaunch(mass)}>
            Launch Tractor
          </button>
        </div>
      </div>
    </div>
  );
};

export default TractorControl;