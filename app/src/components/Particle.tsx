import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useGameStore from '../store/gameStore';
import * as THREE from 'three';

export default function Particle({ particle }: { particle: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const removeParticle = useGameStore((state: any) => state.removeParticle);
  const enemies = useGameStore((state: any) => state.enemies);
  const currentForm = useGameStore((state: any) => state.player.currentForm);
  
  const damage = particle.damage || 5;
  const hasHitRef = useRef(false);
  
  useFrame(() => {
    if (meshRef.current && !hasHitRef.current) {
      // Move particle
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.lifetime -= 1;
      
      meshRef.current.position.x = particle.x;
      meshRef.current.position.z = particle.y;
      
      // Check collision with enemies
      enemies.forEach((enemy: any) => {
        const dx = enemy.x - particle.x;
        const dy = enemy.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 0.5 && !hasHitRef.current) {
          hasHitRef.current = true;
          enemy.takeDamage?.(damage);
          removeParticle(particle.id);
        }
      });
      
      // Remove if lifetime expired or out of bounds
      if (particle.lifetime <= 0 || Math.abs(particle.x) > 15 || Math.abs(particle.y) > 15) {
        removeParticle(particle.id);
      }
    }
  });
  
  return (
    <mesh ref={meshRef} position={[particle.x, 0.5, particle.y]}>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshStandardMaterial
        color={particle.color || '#9D4EDD'}
        emissive={particle.color || '#9D4EDD'}
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}
