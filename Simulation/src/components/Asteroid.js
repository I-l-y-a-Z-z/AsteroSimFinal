import React from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const Asteroid = React.forwardRef((props, ref) => {
  const { size, position } = props;
  const texture = useLoader(THREE.TextureLoader, '/textures/asteroid.jpg');

  // Make sure you have an asteroid.jpg in your public/textures folder
  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[size, 1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
});

export default Asteroid;