// src/components/models/NuclearMissile.js

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Missile(props) {
  const { nodes, materials } = useGLTF('/models/nuclear_missile.glb')
  
  // --- THIS IS THE DEFINITIVE FIX FOR DARKNESS ---
  // We create a completely new material that does NOT inherit from the original.
  // This gives us full control over its appearance.
  const brightMaterial = (
    <meshStandardMaterial 
      color="#cccccc"          // A bright, light-gray color
      metalness={0.6}           // Gives it a metallic sheen
      roughness={0.4}           // Not too shiny, not too matte
      emissive="white"        // Make it glow
      emissiveIntensity={0.4}   // A strong but not overpowering glow
    />
  );

  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        {/* All meshes now use the new, fully independent brightMaterial */}
        <mesh castShadow receiveShadow geometry={nodes.Body_low_Rocket_0.geometry} position={[0.002, 14.26, -7.067]} rotation={[-Math.PI / 2, 0, -0.881]} scale={100}>
          {brightMaterial}
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Ring2_low_Rocket_0.geometry} position={[0.002, 14.26, -7.067]} rotation={[-Math.PI / 2, 0, -0.881]} scale={100}>
          {brightMaterial}
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Ring1_low_Rocket_0.geometry} position={[0.002, 14.26, -7.067]} rotation={[-Math.PI / 2, 0, -0.881]} scale={100}>
          {brightMaterial}
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Nosik_low_Rocket_0.geometry} position={[0.002, 42.425, -7.067]} rotation={[-Math.PI / 2, 0, -0.881]} scale={100}>
          {brightMaterial}
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Hvost_low_Rocket_0.geometry} position={[0.002, 14.26, -7.067]} rotation={[-Math.PI / 2, 0, -0.881]} scale={100}>
          {brightMaterial}
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.turbina_low_Rocket_0.geometry} position={[0.08, 12.031, -7.983]} rotation={[-Math.PI / 2, 0, -0.881]} scale={100}>
          {brightMaterial}
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Line1_low_Rocket_0.geometry} position={[1.769, 29.224, -7.044]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          {brightMaterial}
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Line2_low_Rocket_0.geometry} position={[-1.754, 29.224, -7.044]} rotation={[-Math.PI / 2, 0, Math.PI]} scale={100}>
          {brightMaterial}
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Cylinder007_Rocket_0.geometry} position={[0.002, -7.763, -7.067]} rotation={[-Math.PI / 2, 0, -0.881]} scale={[1.754, 1.754, 2.979]}>
          {brightMaterial}
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload('/models/nuclear_missile.glb')