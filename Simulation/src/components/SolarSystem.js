// src/components/SolarSystem.js

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Trail } from '@react-three/drei';
import * as THREE from 'three';
import Planet from './Planet';
import Saturn from './Saturn';
import Asteroid from './Asteroid';
import MeasureVehicle from './MeasureVehicle';

const planetsData = [
  { name: 'mercury', texture: '/textures/mercury.jpg', size: 0.15, speed: 0.04, distance: 4, trailColor: '#a5a5a5' },
  { name: 'venus', texture: '/textures/venus.jpg', size: 0.25, speed: 0.03, distance: 7, trailColor: '#d4a06a' },
  { name: 'earth', texture: '/textures/earth.jpg', size: 0.3, speed: 0.025, distance: 10, trailColor: '#4f86f7' },
  { name: 'mars', texture: '/textures/mars.jpg', size: 0.2, speed: 0.02, distance: 14, trailColor: '#c1440e' },
  { name: 'jupiter', texture: '/textures/jupiter.jpg', size: 0.75, speed: 0.01, distance: 20, trailColor: '#c8a377' },
  { name: 'saturn', texture: '/textures/saturn.jpg', size: 0.6, speed: 0.0075, distance: 28, trailColor: '#e3d1b1', isSaturn: true },
  { name: 'uranus', texture: '/textures/uranus.jpg', size: 0.4, speed: 0.005, distance: 35, trailColor: '#b0e0e6' },
  { name: 'neptune', texture: '/textures/neptune.jpg', size: 0.35, speed: 0.004, distance: 42, trailColor: '#3f54ba' },
];

const ASTEROID_START_POS = new THREE.Vector3(30, 5, -30);
const ASTEROID_SPEED = 0.4;
const IMMINENT_CRASH_DISTANCE = 3.0;

const SolarSystem = (props) => {
  const { 
    asteroidData,
    onEarthPositionUpdate, 
    onAsteroidPositionUpdate, 
    onVehiclePositionUpdate,
    onMarsPositionUpdate,
    timeScale, 
    onDateUpdate,
    activeMeasure,
    onPhaseChange,
    onImminentCrash,
    onAsteroidDeviated,
  } = props;
  
  const simulationTime = useRef(0);
  const startDate = useMemo(() => new Date(), []);
  const planetGroupRefs = useRef([]);
  const planetMeshRefs = useMemo(() => Array.from({ length: planetsData.length }).map(() => React.createRef()), []);
  const asteroidRef = useRef();
  const [earthWorldPosition] = useState(() => new THREE.Vector3());
  const [marsWorldPosition] = useState(() => new THREE.Vector3());
  const vehicleRef = useRef();

  const planetsWithOrbits = useMemo(() => {
    return planetsData.map(planet => {
      const randomOffset = Math.random() * Math.PI * 2;
      return { ...planet, randomOffset, initialX: Math.cos(randomOffset) * planet.distance, initialZ: Math.sin(randomOffset) * planet.distance };
    });
  }, []);

  const [showTrails, setShowTrails] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => { setShowTrails(true); }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (asteroidRef.current) {
      asteroidRef.current.position.copy(ASTEROID_START_POS);
    }
  }, []);

  useEffect(() => {
    if (activeMeasure && activeMeasure.phase === 'launching' && vehicleRef.current) {
        const launchOffset = new THREE.Vector3(0, 0.5, 0);
        vehicleRef.current.position.copy(earthWorldPosition).add(launchOffset);
    }
  }, [activeMeasure, earthWorldPosition]);

  // Track if asteroid has been deviated
  const [asteroidDeviated, setAsteroidDeviated] = useState(false);

  useFrame((state, delta) => {
    simulationTime.current += delta * timeScale;
    const elapsedTime = simulationTime.current;

    if (onDateUpdate) {
      const hoursPassed = elapsedTime * 6;
      const newDate = new Date(startDate.getTime() + hoursPassed * 60 * 60 * 1000);
      const dateString = `${newDate.toLocaleDateString()} - ${newDate.toLocaleTimeString()}`;
      onDateUpdate(dateString);
    }
    
    planetsWithOrbits.forEach((planet, index) => {
      const groupRef = planetGroupRefs.current[index];
      if (groupRef) {
        const angle = elapsedTime * planet.speed + planet.randomOffset;
        groupRef.position.x = Math.cos(angle) * planet.distance;
        groupRef.position.z = Math.sin(angle) * planet.distance;
        if (planet.name === 'earth') {
          groupRef.getWorldPosition(earthWorldPosition);
          if (onEarthPositionUpdate) onEarthPositionUpdate(groupRef.position);
        } else if (planet.name === 'mars') {
            groupRef.getWorldPosition(marsWorldPosition);
            if (onMarsPositionUpdate) onMarsPositionUpdate(groupRef.position);
        }
      }
    });
    
    if (asteroidRef.current) {
      const asteroid = asteroidRef.current;
      // Estimate asteroid mass from diameter and density
  let asteroidMass = 1e6; // realistic fallback (10 billion kg)
      if (asteroidData) {
        let diameter_km = 0.3;
        if (asteroidData.diameter_max_km) {
          diameter_km = parseFloat(asteroidData.diameter_max_km);
        } else if (asteroidData.size) {
          const sizeParts = asteroidData.size.match(/[\d.]+/g);
          if (sizeParts && sizeParts.length > 0) {
            diameter_km = parseFloat(sizeParts[sizeParts.length - 1]);
          }
        }
        const density = 2000; // kg/m^3
        const radius_m = (diameter_km * 1000) / 2;
        const volume_m3 = (4/3) * Math.PI * Math.pow(radius_m, 3);
        asteroidMass = volume_m3 * density;
        // Cap asteroid mass to a maximum to avoid unrealistically large values
        const MAX_ASTEROID_MASS = 1e8; // kg
        asteroidMass = Math.min(asteroidMass, MAX_ASTEROID_MASS);
      }

      // Tractor deviation logic
      if (
            activeMeasure &&
            activeMeasure.type === 'tractor' &&
            activeMeasure.phase === 'orbiting' &&
            !asteroidDeviated
          ) {
    const tractorMass = activeMeasure.mass || 0;
  // Require an absolute minimum mass and a relative threshold before deviation is possible
  const MIN_TRACTOR_MASS = 100000; // kg - tractor must reach at least 100,000 kg
  const RELATIVE_THRESHOLD = 1 / 1000; // 0.001 (1/1000)
  if (tractorMass >= MIN_TRACTOR_MASS && tractorMass >= asteroidMass * RELATIVE_THRESHOLD) {
              // Deviate asteroid: move it far from Earth
              const deviationVector = new THREE.Vector3(1, 0, 1).normalize().multiplyScalar(100);
              asteroid.position.add(deviationVector);
              setAsteroidDeviated(true);
              if (typeof window !== 'undefined') {
                console.log('Asteroid deviated! Tractor mass:', tractorMass, 'Asteroid mass:', asteroidMass);
              }
              if (onAsteroidDeviated) onAsteroidDeviated();
            } else {
              if (typeof window !== 'undefined') {
                console.log('Tractor mass insufficient to deviate asteroid.', 'Tractor mass:', tractorMass, 'Asteroid mass:', asteroidMass);
              }
            }
          }

      const distanceToEarth = asteroid.position.distanceTo(earthWorldPosition);
      if (!asteroidDeviated && distanceToEarth < IMMINENT_CRASH_DISTANCE) {
        onImminentCrash();
      }
      const earthRadius = 0.3;
      const asteroidRadius = 0.3;
      if (!asteroidDeviated && distanceToEarth < earthRadius + asteroidRadius) {
        asteroid.position.copy(ASTEROID_START_POS);
        return;
      }

      if (!asteroidDeviated) {
        const moveDistance = (ASTEROID_SPEED) * delta * timeScale;
        const direction = new THREE.Vector3().subVectors(earthWorldPosition, asteroid.position).normalize();
        if (moveDistance >= distanceToEarth) {
          asteroid.position.copy(earthWorldPosition);
        } else {
          asteroid.position.add(direction.multiplyScalar(moveDistance));
        }
        if (onAsteroidPositionUpdate) onAsteroidPositionUpdate(asteroid.position);
      } else {
        // After deviation, keep asteroid far from Earth
        // Optionally, you could animate it further away or freeze its position
        if (onAsteroidPositionUpdate) onAsteroidPositionUpdate(asteroid.position);
      }
    }

    if (activeMeasure && vehicleRef.current) {
        const vehicle = vehicleRef.current;
        const vehicleSpeed = ASTEROID_SPEED * 1.5;
        const moveDistance = vehicleSpeed * delta * timeScale;
        let target, onArrivalPhase;
        switch (activeMeasure.type) {
            case 'starship':
                target = marsWorldPosition;
                onArrivalPhase = 'arrival';
                break;
            case 'missile':
            case 'tractor':
            default:
                target = asteroidRef.current.position;
                onArrivalPhase = (activeMeasure.type === 'missile') ? 'intercept' : 'orbiting';
                break;
        }
        if (activeMeasure.phase === 'launching') {
            const launchDirection = new THREE.Vector3().subVectors(vehicle.position, earthWorldPosition).normalize();
            vehicle.position.add(launchDirection.multiplyScalar( (vehicleSpeed / 4) * delta * timeScale ));
            if (vehicle.position.distanceTo(earthWorldPosition) > 3) {
                onPhaseChange('in_transit', activeMeasure.type);
            }
        } 
        else if (activeMeasure.phase === 'in_transit') {
            const direction = new THREE.Vector3().subVectors(target, vehicle.position).normalize();
            if (moveDistance >= vehicle.position.distanceTo(target)) {
                vehicle.position.copy(target);
                onPhaseChange(onArrivalPhase, activeMeasure.type);
                if(activeMeasure.type === 'missile') {
                    asteroidRef.current.position.copy(ASTEROID_START_POS);
                }
            } else {
                vehicle.position.add(direction.multiplyScalar(moveDistance));
            }
        }
        else if (activeMeasure.phase === 'orbiting' || activeMeasure.phase === 'arrival') {
            const orbitTarget = (activeMeasure.type === 'starship') ? marsWorldPosition : asteroidRef.current.position;
            const orbitRadius = 1;
            const orbitSpeed = 1;
            const orbitAngle = elapsedTime * orbitSpeed;
            const offsetX = Math.cos(orbitAngle) * orbitRadius;
            const offsetZ = Math.sin(orbitAngle) * orbitRadius;
            vehicle.position.set(orbitTarget.x + offsetX, orbitTarget.y, orbitTarget.z + offsetZ);
        }
        onVehiclePositionUpdate(vehicle.position);
    }
  });

  return (
    <>
      <ambientLight intensity={1} />
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Planet 
        texturePath="/textures/sun.jpg"
        size={1}
        position={[0, 0, 0]}
        rotationSpeed={0.1}
      />
      <pointLight position={[0, 0, 0]} intensity={4} />
      <Asteroid ref={asteroidRef} size={0.07} asteroidData={asteroidData} />
      {activeMeasure && <MeasureVehicle ref={vehicleRef} type={activeMeasure.type} />}
      {planetsWithOrbits.map((planet, index) => {
        const planetMeshRef = planetMeshRefs[index];
        return (
          <group 
            key={planet.name}
            position={[planet.initialX, 0, planet.initialZ]}
            ref={(el) => (planetGroupRefs.current[index] = el)}
          >
            {showTrails ? (
              <Trail
                width={1}
                length={5}
                color={"white"}
                attenuation={(width) => width * 0.8}
              >
                {planet.isSaturn ? (
                  <Saturn ref={planetMeshRef} size={planet.size} position={[0,0,0]} rotationSpeed={0.5} />
                ) : (
                  <Planet ref={planetMeshRef} texturePath={planet.texture} size={planet.size} position={[0,0,0]} rotationSpeed={0.5} />
                )}
              </Trail>
            ) : (
              planet.isSaturn ? (
                <Saturn ref={planetMeshRef} size={planet.size} position={[0,0,0]} rotationSpeed={0.5} />
              ) : (
                <Planet ref={planetMeshRef} texturePath={planet.texture} size={planet.size} position={[0,0,0]} rotationSpeed={0.5} />
              )
            )}
          </group>
        );
      })}
    </>
  );
};

export default SolarSystem;
