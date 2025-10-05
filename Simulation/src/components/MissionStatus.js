import React from 'react';
import './MissionStatus.css';

const MissionStatus = ({ phase, onEndMission }) => {
  const getPhaseText = () => {
    switch(phase) {
      case 'launching': return 'Phase: Launch Sequence';
      case 'in_transit': return 'Phase: In Transit to Asteroid';
      case 'orbiting': return 'Phase: Orbiting Asteroid';
      default: return 'Executing Mission...';
    }
  };

  return (
    <div className="mission-status-card">
      <div className="mission-status-text">{getPhaseText()}</div>
      {phase === 'orbiting' && (
        <button className="end-mission-button" onClick={onEndMission}>
          End Mission
        </button>
      )}
    </div>
  );
};

export default MissionStatus;