import React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import Planet from './Planet'; // We can reuse our Planet component for the sphere

// This component must also be wrapped in forwardRef to be a target for the <Trail>
const Saturn = React.forwardRef((props, ref) => {
  const { size, position, rotationSpeed } = props;

  // Load the texture for the rings
  const ringTexture = useLoader(TextureLoader, '/textures/saturn_ring.png');

  return (
    // A group to hold both the planet and its rings
    <group ref={ref} position={position}>
      {/* The planet itself */}
      <Planet 
        texturePath="/textures/saturn.jpg" 
        size={size} 
        position={[0, 0, 0]} 
        rotationSpeed={rotationSpeed} 
      />
      
      {/* The rings */}
      <mesh rotation-x={Math.PI / 2}> {/* Rotate the rings to be horizontal */}
        <ringGeometry args={[size * 1.2, size * 2, 64]} /> {/* Inner radius, outer radius, segments */}
        <meshBasicMaterial 
          map={ringTexture} 
          side={2} // THREE.DoubleSide, so it's visible from top and bottom
          transparent={true} 
          opacity={0.8}
        />
      </mesh>
    </group>
  );
});

export default Saturn;