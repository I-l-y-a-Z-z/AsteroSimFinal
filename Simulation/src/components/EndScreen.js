import React from 'react';
import './EndScreen.css';

const EndScreen = ({ message, onBackToMenu }) => (
  <div className="end-screen-overlay">
    <div className="end-screen-window">
      <h2>Congratulations!</h2>
      <p>{message}</p>
      <button
        className="end-screen-button"
        onClick={() => {
          if (typeof onBackToMenu === 'function') onBackToMenu();
          if (typeof window !== 'undefined') window.location.href = 'https://asterosim.vercel.app/';
        }}
      >
        Go Back to Menu
      </button>
    </div>
  </div>
);

export default EndScreen;
