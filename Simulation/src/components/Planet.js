// src/components/Planet.js
import React, { useRef } from 'react'; // Make sure React is imported
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

// Wrap the component definition with React.forwardRef
const Planet = React.forwardRef((props, ref) => {
  const { texturePath, size, position, rotationSpeed, isEmissive } = props;
  const texture = useLoader(THREE.TextureLoader, texturePath);
  
  // Use the forwarded ref if it exists, otherwise use a local one
  const internalRef = useRef();
  const planetRef = ref || internalRef;
  
  // ... rest of the component is the same ...
  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed * delta;
    }
  });

  if (!isEmissive) {
    return (
      <mesh ref={planetRef} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    );
  }

  return (
    <group position={position}>
      <mesh ref={planetRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          map={texture} 
          emissive="#ffd700"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial 
          color="#ffd700" 
          transparent={true} 
          opacity={0.3} 
        />
      </mesh>
    </group>
  );
});

export default Planet;