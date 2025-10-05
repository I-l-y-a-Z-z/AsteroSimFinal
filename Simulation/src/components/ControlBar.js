// src/components/ControlBar.js
import React from 'react';
import './ControlBar.css'; // Import the new CSS file

const ControlBar = (props) => {
  const { 
    currentDate,
    timeControlsEnabled,
    onAccelerate,
    onReduce,
    onStop,
    onAsteroidInfo,
  } = props;

  return (
    <div className="control-bar">
      <div className="control-section">
        {/* The disabled prop is controlled by the story step */}
        <button 
          className="control-bar-button" 
          onClick={onReduce}
          disabled={!timeControlsEnabled}
          title="Reduce Time"
        >
          {'<<'}
        </button>
        <button 
          className="control-bar-button" 
          onClick={onStop}
          disabled={!timeControlsEnabled}
          title="Stop Time"
        >
          {'||'}
        </button>
        <button 
          className="control-bar-button" 
          onClick={onAccelerate}
          disabled={!timeControlsEnabled}
          title="Accelerate Time"
        >
          {'>>'}
        </button>
      </div>

      <div className="control-section">
        <div className="date-display">
          {currentDate}
        </div>
      </div>
      
      <div className="control-section">
        <button 
            className="control-bar-button" 
            onClick={onAsteroidInfo}
            title="Asteroid Info"
        >
            i
        </button>
      </div>
    </div>
  );
};

export default ControlBar;