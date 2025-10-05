import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Planet from './Planet';

// Define some constants for our solar system
const planetsData = [
  { name: 'mercury', texture: '/textures/mercury.jpg', size: 0.3, speed: 0.8, distance: 4 },
  { name: 'venus', texture: '/textures/venus.jpg', size: 0.5, speed: 0.6, distance: 6 },
  { name: 'earth', texture: '/textures/earth.jpg', size: 0.6, speed: 0.5, distance: 8 },
  { name: 'mars', texture: '/textures/mars.jpg', size: 0.4, speed: 0.4, distance: 12 },
  { name: 'jupiter', texture: '/textures/jupiter.jpg', size: 1.5, speed: 0.2, distance: 18 },
];

const SolarSystem = () => {
  // Create a ref for each planet's group
  const planetRefs = useRef([]);

  // The main animation loop
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    
    // Update the position of each planet based on its orbit
    planetsData.forEach((planet, index) => {
      const planetRef = planetRefs.current[index];
      if (planetRef) {
        planetRef.position.x = Math.cos(elapsedTime * planet.speed) * planet.distance;
        planetRef.position.z = Math.sin(elapsedTime * planet.speed) * planet.distance;
      }
    });
  });

  return (
    <>
      <ambientLight intensity={1} />
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* The Sun */}
      <Planet 
        texturePath="/textures/sun.jpg"
        size={1.5}
        position={[0, 0, 0]}
        rotationSpeed={0.1}
        isEmissive={true}
      />
      <pointLight position={[0, 0, 0]} intensity={4} />

      {/* Render each planet from our data array */}
      {planetsData.map((planet, index) => (
        // We use a group to control the position (orbit) of the planet
        <group 
          key={planet.name}
          ref={(el) => (planetRefs.current[index] = el)}
        >
          <Planet 
            texturePath={planet.texture}
            size={planet.size}
            position={[0, 0, 0]} // Position is relative to the orbiting group
            rotationSpeed={0.5} // This is the planet's own axis rotation
          />
        </group>
      ))}
    </>
  );
};

export default SolarSystem;