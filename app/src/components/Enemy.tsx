import React, { useRef, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import useGameStore from '../store/gameStore';
import { ENEMY_TYPES } from '../data/forms';
import * as THREE from 'three';

function Enemy({ enemy }: { enemy: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const player = useGameStore((state: any) => state.player);
  const isDead = useGameStore((state: any) => state.isDead);
  const isPaused = useGameStore((state: any) => state.isPaused);
  const isManuallyPaused = useGameStore((state: any) => state.isManuallyPaused);
  const removeEnemy = useGameStore((state: any) => state.removeEnemy);
  const damagePlayer = useGameStore((state: any) => state.damagePlayer);
  
  const enemyData = ENEMY_TYPES[enemy.type];
  const healthRef = useRef(enemyData.health);
  
  // Simple AI: Move toward player
  useFrame(() => {
    if (meshRef.current && !isDead && !isPaused && !isManuallyPaused) {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0.5) {
        // Move toward player
        enemy.x += (dx / distance) * enemyData.speed;
        enemy.y += (dy / distance) * enemyData.speed;
        
        meshRef.current.position.x = enemy.x;
        meshRef.current.position.z = enemy.y;
      } else {
        // Attack player
        if (!enemy.lastAttack || Date.now() - enemy.lastAttack > 1000) {
          damagePlayer(enemyData.damage);
          enemy.lastAttack = Date.now();
          
          // Reset enemy position after attacking
          const angle = Math.random() * Math.PI * 2;
          const distance = 8;
          enemy.x = Math.cos(angle) * distance;
          enemy.y = Math.sin(angle) * distance;
        }
      }
      
      // Idle animation
      meshRef.current.position.y = 
        enemyData.scale / 2 + Math.sin(Date.now() * 0.005) * 0.05;
      
      // Check if dead
      if (healthRef.current <= 0) {
        removeEnemy(enemy.id);
      }
    }
  });
  
  // Expose method to take damage
  enemy.takeDamage = (amount) => {
    healthRef.current -= amount;
  };

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[enemyData.scale, enemyData.scale, enemyData.scale]} />
      <meshStandardMaterial
        color={enemyData.color}
        emissive={enemyData.color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

export default memo(Enemy);