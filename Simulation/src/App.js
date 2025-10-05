// src/App.js

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import * as THREE from 'three';

import SolarSystem from './components/SolarSystem';
import TractorControl from './components/TractorControl';
import StoryCard from './components/StoryCard';
import ControlBar from './components/ControlBar';
import FreeViewControls from './components/FreeViewControls';
import MeasuresPanel from './components/MeasuresPanel';
import MissionStatus from './components/MissionStatus';
import EndScreen from './components/EndScreen';
import InfoModal from './components/InfoModal';
import CrashWarning from './components/CrashWarning';
import ReportPanel from './components/ReportPanel';
import './App.css';

// This calculation function is centralized in App.js
function calculateConsequences(asteroidData) {
    if (!asteroidData) return { crater_km: 0, ejecta_km: 0, blast_km: 0, energy_megatons: 0 };
    
    let diameter_km = 0.3;
    if (asteroidData.diameter_max_km) {
        diameter_km = parseFloat(asteroidData.diameter_max_km);
    } else if (asteroidData.size) {
        const sizeParts = asteroidData.size.match(/[\d.]+/g);
        if (sizeParts && sizeParts.length > 0) {
            diameter_km = parseFloat(sizeParts[sizeParts.length - 1]);
        }
    }

    let velocity_km_s = 15;
    if (asteroidData.velocity_km_s) {
        velocity_km_s = parseFloat(asteroidData.velocity_km_s);
    } else if (asteroidData.velocity) {
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

const CameraLogic = ({ view, earthPositionRef, asteroidPositionRef, vehiclePositionRef, marsPositionRef, cameraControlsRef }) => {
  const followEnabled = useRef(false);

  useFrame((state, delta) => {
    const controls = cameraControlsRef.current;
    if (!controls) return;
    const earthPos = earthPositionRef.current;
    const asteroidPos = asteroidPositionRef.current;
    const vehiclePos = vehiclePositionRef.current;
    const marsPos = marsPositionRef.current;
    const currentPosition = new THREE.Vector3();
    controls.getPosition(currentPosition);

    switch (view) {
      case 'measure_launch': {
        followEnabled.current = false;
        const targetPosition = new THREE.Vector3(earthPos.x + 1, earthPos.y + 1, earthPos.z + 2);
        currentPosition.lerp(targetPosition, 4 * delta);
        controls.setPosition(currentPosition.x, currentPosition.y, currentPosition.z, false);
        controls.setTarget(earthPos.x, earthPos.y, earthPos.z, false);
        break;
      }
      case 'measure_transit': {
        followEnabled.current = false;
        const targetPosition = new THREE.Vector3(vehiclePos.x + 1, vehiclePos.y + 0.5, vehiclePos.z + 1);
        currentPosition.lerp(targetPosition, 4 * delta);
        controls.setPosition(currentPosition.x, currentPosition.y, currentPosition.z, false);
        controls.setTarget(vehiclePos.x, vehiclePos.y, vehiclePos.z, false);
        break;
      }
      case 'measure_intercept': {
        followEnabled.current = false;
        const targetPosition = new THREE.Vector3(asteroidPos.x + 1, asteroidPos.y + 1, asteroidPos.z + 2);
        currentPosition.lerp(targetPosition, 4 * delta);
        controls.setPosition(currentPosition.x, currentPosition.y, currentPosition.z, false);
        controls.setTarget(asteroidPos.x, asteroidPos.y, asteroidPos.z, false);
        break;
      }
      case 'measure_arrival_mars': {
        followEnabled.current = false;
        const targetPosition = new THREE.Vector3(marsPos.x + 1, marsPos.y + 1, marsPos.z + 2);
        currentPosition.lerp(targetPosition, 4 * delta);
        controls.setPosition(currentPosition.x, currentPosition.y, currentPosition.z, false);
        controls.setTarget(marsPos.x, marsPos.y, marsPos.z, false);
        break;
      }
      case 'earth_zoom': {
        if (followEnabled.current) {
          controls.setLookAt(earthPos.x+2, earthPos.y+2, earthPos.z+5, earthPos.x, earthPos.y, earthPos.z, false);
          break;
        }
        const targetPosition = new THREE.Vector3(earthPos.x + 2, earthPos.y + 2, earthPos.z + 5);
        currentPosition.lerp(targetPosition, 4 * delta);
        controls.setPosition(currentPosition.x, currentPosition.y, currentPosition.z, false);
        controls.setTarget(earthPos.x, earthPos.y, earthPos.z, false);
        if (currentPosition.distanceTo(targetPosition) < 0.1) {
          followEnabled.current = true;
        }
        break;
      }
      case 'global': {
        followEnabled.current = false;
        const targetPosition = new THREE.Vector3(0, 35, 70);
        currentPosition.lerp(targetPosition, 4 * delta);
        controls.setPosition(currentPosition.x, currentPosition.y, currentPosition.z, false);
        controls.setTarget(0, 0, 0, false);
        break;
      }
      case 'asteroid': {
        followEnabled.current = false;
        const targetPosition = new THREE.Vector3(asteroidPos.x + 2, asteroidPos.y + 1, asteroidPos.z + 2);
        currentPosition.lerp(targetPosition, 4 * delta);
        controls.setPosition(currentPosition.x, currentPosition.y, currentPosition.z, false);
        controls.setTarget(asteroidPos.x, asteroidPos.y, asteroidPos.z, false);
        break;
      }
      default:
        break;
    }
  });

  return null;
};

function App() {
  const [asteroidData, setAsteroidData] = useState(null);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [endScreenMessage, setEndScreenMessage] = useState('');
  const [showTractorControl, setShowTractorControl] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [storyData, setStoryData] = useState([]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [cameraView, setCameraView] = useState('global');
  const [sandboxModeActive, setSandboxModeActive] = useState(false);
  const [timeScale, setTimeScale] = useState(1);
  const [currentDate, setCurrentDate] = useState("Initializing...");
  const [lastTimeScale, setLastTimeScale] = useState(1);
  const lastTimeScaleRef = useRef(1);
  const timeControlsEnabled = storyIndex >= 3;
  const [showMeasuresPanel, setShowMeasuresPanel] = useState(false);
  const [activeMeasure, setActiveMeasure] = useState(null);
  const [showCrashWarning, setShowCrashWarning] = useState(false);
  const [crashSite, setCrashSite] = useState(null);
  const [crashConsequences, setCrashConsequences] = useState(null);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    let data;
    try {
      const params = new URLSearchParams(window.location.search);
      const dataParam = params.get("data");
      if (dataParam) {
        const cleanDataParam = dataParam.endsWith('*') ? dataParam.slice(0, -1) : dataParam;
        data = JSON.parse(decodeURIComponent(cleanDataParam));
      }
    } catch (error) {
      console.error("Error parsing asteroid data from URL:", error);
    }
    
    const finalAsteroidData = data || {
        name: 'Simulated Asteroid',
        size: '0.2 - 0.5 km',
        composition: 'Hazardous',
        velocity: '15.00 km/s',
        missDistance: '25,000,000 km',
        date: '2025-10-26'
    };
    setAsteroidData(finalAsteroidData);

    const generatedStory = [
        {
            step: 0,
            text: "Welcome, explorer! I'm Astero, your guide to the cosmos. Before us is the majestic Solar System. It's a vast and beautiful place, isn't it?",
            image: '/textures/mascott.png',
            contentImage: '/textures/solar_system.jpg', 
            cameraView: 'global',
        },
        {
            step: 1,
            text: "Let's take a closer look at our home. That blue marble right there is Earth. It's full of life and is our responsibility to protect.",
            image: '/textures/mascott.png',
            contentImage: '/textures/solar_system.jpg',
            cameraView: 'global',
        },
        {
            step: 2,
            text: "Here it is, our beautiful home. But wait... I'm detecting something troubling on my long-range scanners...",
            image: '/textures/mascott.png',
            contentImage: '/textures/earth.jpg',
            cameraView: 'earth_zoom',
        },
        {
            step: 3,
            text: `ALERT! Asteroid ${finalAsteroidData.name || '(unnamed)'} on a collision course with Earth! You now have control of the simulation. What measures will you take?`,
            image: '/textures/mascott.png',
            contentImage: '/textures/asteroid.jpg',
            cameraView: 'asteroid',
            buttonText: "Take Measures",
        },
    ];
    setStoryData(generatedStory);

  }, []);

  const currentStepData = storyData[storyIndex];

  useEffect(() => {
    if (currentStepData && !sandboxModeActive && !activeMeasure) {
      setCameraView(currentStepData.cameraView);
    }
  }, [storyIndex, currentStepData, sandboxModeActive, activeMeasure]);

  useEffect(() => {
    if (storyIndex === 3) setSandboxModeActive(true);
    else setSandboxModeActive(false);
  }, [storyIndex]);

  const handleAccelerate = () => setTimeScale(prev => Math.min(prev * 2, 64));
  const handleReduce = () => setTimeScale(prev => Math.max(prev / 2, 0.25));
  // Keep a ref of the last non-zero timescale to avoid stale state when toggling pause/resume
  useEffect(() => {
    if (timeScale !== 0) {
      lastTimeScaleRef.current = timeScale;
      setLastTimeScale(timeScale);
    }
  }, [timeScale]);

  const handleStopTime = () => {
    setTimeScale(prev => {
      if (prev === 0) {
        // resume to the last non-zero timescale (fallback to 1)
        return lastTimeScaleRef.current || 1;
      }
      // pause: store the current non-zero timescale and set to 0
      lastTimeScaleRef.current = prev;
      setLastTimeScale(prev);
      return 0;
    });
  };
  
  const handleAsteroidInfo = () => {
    setShowInfoModal(true);
  };

  const handleNext = () => {
    if (storyIndex === 3) {
      setShowMeasuresPanel(true);
    } else if (storyIndex < storyData.length - 1) {
      setStoryIndex(storyIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (storyIndex > 0 && !sandboxModeActive) {
      setStoryIndex(storyIndex - 1);
    }
  };

  const handleSelectMeasure = (measureType) => {
    setShowCrashWarning(false);
    if (measureType === 'tractor') {
      setShowTractorControl(true);
      setShowMeasuresPanel(false);
    } else {
      setActiveMeasure({ type: measureType, phase: 'launching' });
      setShowMeasuresPanel(false);
      setCameraView('measure_launch');
      setTimeScale(1);
    }
  };

  const handleTractorLaunch = (mass) => {
    setShowTractorControl(false);
    setActiveMeasure({ type: 'tractor', phase: 'launching', mass });
    setCameraView('measure_launch');
    setTimeScale(1);
  };

  const handleTractorCancel = () => {
    setShowTractorControl(false);
  };
  
  const handlePhaseChange = (newPhase, missionType) => {
    if (!activeMeasure) return;
    setActiveMeasure(prev => ({ ...prev, phase: newPhase }));
    
    switch (missionType) {
      case 'starship':
        if (newPhase === 'in_transit') { setCameraView('measure_transit'); setTimeScale(4); } 
        else if (newPhase === 'arrival') {
          setCameraView('measure_arrival_mars'); setTimeScale(1);
          setTimeout(() => {
            setEndScreenMessage('Earth has been evacuated! Humanity is safe on Mars.');
            setShowEndScreen(true);
          }, 10000);
        }
        break;
      case 'missile':
        if (newPhase === 'in_transit') { setCameraView('measure_transit'); setTimeScale(4); } 
        else if (newPhase === 'intercept') {
          setCameraView('measure_intercept'); setTimeScale(1);
          setTimeout(() => {
            setEndScreenMessage('The nuclear missile has destroyed the asteroid! Earth is saved.');
            setShowEndScreen(true);
          }, 10000);
        }
        break;
      case 'tractor':
      default:
        if (newPhase === 'in_transit') { setCameraView('measure_transit'); setTimeScale(4); } 
        else if (newPhase === 'orbiting') { setCameraView('measure_intercept'); setTimeScale(1); }
        break;
    }
  };

  // Listen for asteroid deviation event from SolarSystem
  const handleAsteroidDeviated = () => {
    setTimeout(() => {
      setEndScreenMessage('Congratulations! The gravity tractor has successfully deviated the asteroid. Earth is safe!');
      setShowEndScreen(true);
    }, 10000);
  };

  const handleBackToMenu = () => {
    setShowEndScreen(false);
    setActiveMeasure(null);
    setStoryIndex(3);
    setCameraView('global');
    setTimeScale(1);
  };

  const handleEndMission = () => {
    setActiveMeasure(null);
    setTimeScale(1);
    setCameraView('global');
  };

  const handleImminentCrash = () => {
    if (showCrashWarning || showReport) return;
    if (!activeMeasure || activeMeasure.type !== 'missile') {
      const consequences = calculateConsequences(asteroidData);
      setCrashConsequences(consequences);
      const randomX = 10 + Math.random() * 80;
      const randomY = 10 + Math.random() * 80;
      setCrashSite({ x: `${randomX}%`, y: `${randomY}%`, name: 'Impact Zone' });
      setShowCrashWarning(true);
      setTimeScale(0);
    }
  };

  const handleGoToReport = () => {
    setShowCrashWarning(false);
    setShowReport(true);
  };

  const handleCloseAndReset = () => {
    setShowReport(false);
    setTimeScale(1);
    setActiveMeasure(null);
    setStoryIndex(3);
    setCameraView('global');
  };

  const earthPositionRef = useRef(new THREE.Vector3(10, 0, 0));
  const asteroidPositionRef = useRef(new THREE.Vector3(30, 5, -30));
  const vehiclePositionRef = useRef(new THREE.Vector3(0, 0, 0));
  const marsPositionRef = useRef(new THREE.Vector3(14, 0, 0));
  const cameraControlsRef = useRef();

  const handleEarthPositionUpdate = (position) => earthPositionRef.current.copy(position);
  const handleAsteroidPositionUpdate = (position) => asteroidPositionRef.current.copy(position);
  const handleVehiclePositionUpdate = (position) => vehiclePositionRef.current.copy(position);
  const handleMarsPositionUpdate = (position) => marsPositionRef.current.copy(position);

  if (storyData.length === 0) {
    return <div>Loading Simulation Data...</div>;
  }

  return (
    <div style={{ height: '100vh', background: 'black' }}>
      {showCrashWarning && (
        <CrashWarning 
          crashSite={crashSite} 
          asteroidData={asteroidData}
          onGoToReport={handleGoToReport}
        />
      )}

      {showReport && (
        <ReportPanel 
          crashSite={crashSite}
          consequences={crashConsequences}
          onClose={handleCloseAndReset}
        />
      )}

      {showInfoModal && (
        <InfoModal 
          asteroidData={asteroidData} 
          onClose={() => setShowInfoModal(false)}
        />
      )}

      {showTractorControl && (
        <TractorControl 
          onLaunch={handleTractorLaunch}
          onCancel={handleTractorCancel}
        />
      )}

      <StoryCard 
        storyStep={currentStepData}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
      {sandboxModeActive && !showMeasuresPanel && !activeMeasure && (
        <FreeViewControls onSetView={setCameraView} />
      )}
      {showMeasuresPanel && <MeasuresPanel onSelectMeasure={handleSelectMeasure} />}
      {activeMeasure && <MissionStatus phase={activeMeasure.phase} onEndMission={handleEndMission} />}

      <ControlBar
        currentDate={currentDate}
        timeControlsEnabled={timeControlsEnabled}
        timeScale={timeScale}
        onAccelerate={handleAccelerate}
        onReduce={handleReduce}
        onStop={handleStopTime}
        onAsteroidInfo={handleAsteroidInfo}
      />

      <Canvas camera={{ fov: 75, position: [0, 35, 70] }}>
         <CameraControls ref={cameraControlsRef} />
      <SolarSystem 
        asteroidData={asteroidData}
        onEarthPositionUpdate={handleEarthPositionUpdate}
        onAsteroidPositionUpdate={handleAsteroidPositionUpdate}
        onVehiclePositionUpdate={handleVehiclePositionUpdate}
        onMarsPositionUpdate={handleMarsPositionUpdate}
        timeScale={timeScale}
        onDateUpdate={setCurrentDate}
        activeMeasure={activeMeasure}
        onPhaseChange={handlePhaseChange}
        onImminentCrash={handleImminentCrash}
        onAsteroidDeviated={handleAsteroidDeviated}
      />
         <CameraLogic 
            view={cameraView} 
            earthPositionRef={earthPositionRef} 
            asteroidPositionRef={asteroidPositionRef}
            vehiclePositionRef={vehiclePositionRef}
            marsPositionRef={marsPositionRef}
            cameraControlsRef={cameraControlsRef} 
         />
      </Canvas>
      {showEndScreen && (
        <EndScreen message={endScreenMessage} onBackToMenu={handleBackToMenu} />
      )}
    </div>
  );
}

export default App;