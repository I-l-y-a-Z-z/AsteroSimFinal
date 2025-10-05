import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const Planet = (props) => {
  const { texturePath, size, position, rotationSpeed, isEmissive } = props;

  // The useLoader hook makes it easy to load assets like textures.
  const texture = useLoader(THREE.TextureLoader, texturePath);
  
  // The useRef hook gives us direct access to the 3D mesh object.
  const planetRef = useRef();

  // The useFrame hook runs on every rendered frame, which is perfect for animation.
  useFrame((state, delta) => {
    // This will rotate the planet on its Y-axis.
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed * delta; // delta ensures smooth animation on all refresh rates
    }
  });

  return (
    <mesh ref={planetRef} position={position}>
      {/* A sphereGeometry creates the spherical shape. */}
      {/* args are [radius, widthSegments, heightSegments] */}
      <sphereGeometry args={[size, 32, 32]} />

      {/* The material determines the surface appearance. */}
      {/* If isEmissive is true, the material will glow, perfect for a sun. */}
      <meshStandardMaterial 
        map={texture} 
        emissive={isEmissive ? '#ffd700' : 'black'}
        emissiveIntensity={isEmissive ? 0/65 : 0}
      />
    </mesh>
  );
};

export default Planet;