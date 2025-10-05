import React from 'react';
import './EndScreen.css';

const EndScreen = ({ message, onBackToMenu }) => (
  <div className="end-screen-overlay">
    <div className="end-screen-window">
      <h2>Congratulations!</h2>
      <p>{message}</p>
      <button className="end-screen-button" onClick={onBackToMenu}>
        Go Back to Menu
      </button>
    </div>
  </div>
);

export default EndScreen;
