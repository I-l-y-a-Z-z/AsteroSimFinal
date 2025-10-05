// src/components/UI.js
import React from 'react';

// Renamed the props for clarity
const UI = ({ onZoomInEarth, onResetView, onAsteroidView }) => {
  const buttonStyle = {
    padding: '10px 15px',
    margin: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    border: '1px solid white',
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    borderRadius: '5px'
  };

  return (
    <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 100 }}>
      {/* This button will reset to the main solar system view */}
      <button style={buttonStyle} onClick={onResetView}>
        Reset View
      </button>
      
      {/* This button will trigger the zoom-in */}
      <button style={buttonStyle} onClick={onZoomInEarth}>
        Zoom In on Earth
      </button>
      
      <button style={buttonStyle} onClick={onAsteroidView}>
        Asteroid View
      </button>
    </div>
  );
};

export default UI;