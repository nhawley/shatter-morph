import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import useGameStore from '../store/gameStore';
import { FORMS } from '../data/forms';
import * as THREE from 'three';

export default function Player() {
  const meshRef = useRef<THREE.Mesh>(null);
  const player = useGameStore((state: any) => state.player);
  const currentFormData = FORMS[player.currentForm] || FORMS.base;
  
  // Smooth position interpolation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = player.x;
      meshRef.current.position.z = player.y;
      
      // Idle animation - gentle bobbing
      meshRef.current.position.y = 
        currentFormData.scale / 2 + Math.sin(Date.now() * 0.003) * 0.1;
      
      // Rotate mesh slowly
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      {/* Main character mesh */}
      <mesh ref={meshRef} castShadow>
        {/* Different geometry based on form type */}
        {currentFormData.type === 'striker' && (
          <boxGeometry args={[
            currentFormData.scale,
            currentFormData.scale,
            currentFormData.scale
          ]} />
        )}
        
        {currentFormData.type === 'ranged' && (
          <octahedronGeometry args={[currentFormData.scale * 0.6, 0]} />
        )}
        
        {currentFormData.type === 'tank' && (
          <sphereGeometry args={[currentFormData.scale * 0.7, 8, 8]} />
        )}
        
        {!currentFormData.type && (
          <coneGeometry args={[
            currentFormData.scale * 0.5,
            currentFormData.scale * 1.2,
            4
          ]} />
        )}
        
        <meshStandardMaterial
          color={currentFormData.color}
          emissive={currentFormData.color}
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}