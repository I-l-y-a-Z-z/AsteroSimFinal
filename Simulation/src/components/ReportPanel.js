// src/components/ReportPanel.js
import React from 'react';
import './ReportPanel.css';

const ReportPanel = ({ consequences, crashSite, onClose }) => {
  if (!consequences || !crashSite) return null;

  return (
    <div className="report-overlay">
      <div className="report-window">
        <div className="report-header">Impact Assessment</div>
        
        <p className="report-summary">
          Asteroid impact at target location **{crashSite.name || 'Unknown'}** has resulted in catastrophic damage. Simulation paused. Review the assessment below.
        </p>

        <div className="report-grid">
          <div className="report-item">
            <div className="report-label">Impact Energy</div>
            <div className="report-value">{consequences.energy_megatons.toLocaleString()} MT</div>
          </div>
          <div className="report-item">
            <div className="report-label">Crater Diameter</div>
            <div className="report-value">{consequences.crater_km} km</div>
          </div>
          <div className="report-item">
            <div className="report-label">Ejecta Radius</div>
            <div className="report-value">{consequences.ejecta_km} km</div>
          </div>
          <div className="report-item">
            <div className="report-label">Air Blast Radius</div>
            <div className="report-value">{consequences.blast_km} km</div>
          </div>
        </div>

        <button className="report-close-button" onClick={onClose}>
          Go Back to Menu
        </button>
      </div>
    </div>
  );
};

export default ReportPanel;