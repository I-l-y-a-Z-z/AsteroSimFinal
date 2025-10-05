// src/components/CrashWarning.js
import React, { useState, useMemo } from 'react';
import './CrashWarning.css';

function calculateConsequences(asteroidData) {
  if (!asteroidData) return { crater_km: 0, ejecta_km: 0, blast_km: 0, energy_megatons: 0 };

  let diameter_km = 0.3;
  let velocity_km_s = 15;

  if (asteroidData.size) {
    const sizeParts = asteroidData.size.match(/[\d.]+/g);
    if (sizeParts && sizeParts.length > 0) {
      diameter_km = parseFloat(sizeParts[sizeParts.length - 1]);
    }
  }

  if (asteroidData.velocity) {
    const velocityParts = asteroidData.velocity.match(/[\d.]+/g);
    if (velocityParts && velocityParts.length > 0) {
      velocity_km_s = parseFloat(velocityParts[0]);
    }
  }

  const density = 2000;
  const radius_m = (diameter_km * 1000) / 2;
  const volume_m3 = (4/3) * Math.PI * Math.pow(radius_m, 3);
  const mass_kg = volume_m3 * density;
  const velocity_ms = velocity_km_s * 1000;
  const kineticEnergy_Joules = 0.5 * mass_kg * Math.pow(velocity_ms, 2);
  const megatons_TNT = kineticEnergy_Joules / (4.184e15);

  const crater_km = 1.2 * Math.pow(megatons_TNT, 1/3.4);
  const ejecta_km = crater_km * 5;
  const blast_km = 5 * Math.pow(megatons_TNT, 0.4);

  return {
    energy_megatons: Math.round(megatons_TNT),
    crater_km: Math.round(crater_km),
    ejecta_km: Math.round(ejecta_km),
    blast_km: Math.round(blast_km),
  };
}


const CrashWarning = ({ asteroidData, crashSite, onClose, onGoToReport }) => { // 1. Accept the new onGoToReport prop
  const [briefingStep, setBriefingStep] = useState(0);

  const consequences = useMemo(() => calculateConsequences(asteroidData), [asteroidData]);
  const pinPosition = crashSite;

  // 2. Update the final step's button text
  const briefingSteps = [
    { text: `Target Acquired: Impact zone pinpointed.`, button: "Analyze Impact Crater" },
    { text: `Estimated Crater: ${consequences.crater_km} km`, button: "Assess Ejecta Fallout" },
    { text: `Fireball & Debris fallout zone estimated: ${consequences.ejecta_km} km`, button: "Analyze Blast Wave" },
    { text: `Total destruction zone from shockwave estimated: ${consequences.blast_km} km`, button: "Go to Report" },
  ];

  // 3. Update the handler to call onGoToReport on the final step
  const handleNext = () => {
    if (briefingStep < briefingSteps.length - 1) {
      setBriefingStep(prev => prev + 1);
    } else {
      // Instead of onClose, we now call onGoToReport
      onGoToReport();
    }
  };

  const getMapTransform = () => {
    if (briefingStep > 0 && pinPosition) {
      const zoomLevel = 16;
      return `scale(${zoomLevel}) translate(calc(50% - ${pinPosition.x}), calc(50% - ${pinPosition.y}))`;
    }
    return 'scale(1) translate(0, 0)';
  };
  
  const getPinTransform = () => {
      const zoomLevel = briefingStep > 0 ? 4 : 1;
      return `scale(${1 / zoomLevel})`;
  };
  
  const circleSizes = {
      crater: '20px',
      ejecta: '60px',
      blast: '120px',
  };

  return (
    <div className="crash-overlay">
      <div className="crash-window">
        <div className="crash-text">IMMINENT CRASH</div>
        <div className="briefing-text">{briefingSteps[briefingStep].text}</div>
        
        <div className="map-viewport">
          <div className="map-container" style={{ transform: getMapTransform() }}>
            <img src="/textures/earth.jpg" alt="World Map" className="map-image" />
            
            {pinPosition && (
              <div 
                className="crash-pinpoint"
                style={{ left: pinPosition.x, top: pinPosition.y, transform: getPinTransform() }}
              >
                {briefingStep === 0 && (
                  <div className="pin-marker" />
                )}
                <div 
                  id="crater-circle"
                  className={`effect-circle ${briefingStep >= 1 ? 'visible' : ''}`}
                  style={{ width: circleSizes.crater, height: circleSizes.crater }}
                />
                <div 
                  id="ejecta-circle"
                  className={`effect-circle ${briefingStep >= 2 ? 'visible' : ''}`}
                  style={{ width: circleSizes.ejecta, height: circleSizes.ejecta }}
                />
                <div 
                  id="blast-circle"
                  className={`effect-circle ${briefingStep >= 3 ? 'visible' : ''}`}
                  style={{ width: circleSizes.blast, height: circleSizes.blast }}
                />
              </div>
            )}
          </div>
        </div>

        <button className="briefing-button" onClick={handleNext}>
          {briefingSteps[briefingStep].button}
        </button>
      </div>
    </div>
  );
};

export default CrashWarning;