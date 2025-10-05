// src/components/InfoModal.js
import React from 'react';
import './InfoModal.css';

const InfoModal = ({ asteroidData, onClose }) => {
  if (!asteroidData) return null;

  // --- THIS IS THE FIX ---
  // We now access data using the keys from your actual URL data.
  const size = asteroidData.size;
  const velocity = asteroidData.velocity;
  const missDistance = asteroidData.missDistance;
  const approachDate = asteroidData.date;
  
  // We derive the hazardous status from the 'composition' field.
  const isHazardous = asteroidData.composition !== 'Non-hazardous';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <div className="modal-title">{asteroidData.name || 'Asteroid Data'}</div>
        
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">Status</div>
            <div className="info-value" style={{ color: isHazardous ? '#ff4d4d' : '#4dff4d' }}>
              {isHazardous ? 'Hazardous' : 'Non-Hazardous'}
            </div>
          </div>

          <div className="info-item">
            <div className="info-label">Estimated Size</div>
            <div className="info-value">
              {/* Display the pre-formatted string directly */}
              {size || 'N/A'}
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-label">Velocity</div>
            <div className="info-value">
              {velocity || 'N/A'}
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-label">Close Approach</div>
            <div className="info-value">
              {approachDate || 'N/A'}
            </div>
          </div>

          <div className="info-item" style={{ gridColumn: 'span 2' }}>
            <div className="info-label">Miss Distance</div>
            <div className="info-value">
              {missDistance || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;