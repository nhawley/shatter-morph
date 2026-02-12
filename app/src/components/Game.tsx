import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { View, StyleSheet } from 'react-native';
import Player from './Player';
import Enemy from './Enemy';
import Controls from './Controls';
import FormSelector from './FormSelector';
import useGameStore from '../store/gameStore';
import { ENEMY_TYPES } from '../data/forms';

export default function Game() {
  // Add at the top of Game component
  const spawnEnemy = useGameStore((state: any) => state.spawnEnemy);
  const MAX_ENEMIES = 10;

  useEffect(() => {
    // Spawn 10 enemies periodically
    const interval = setInterval(() => {
      if (enemies.length < MAX_ENEMIES) {
        const types = Object.keys(ENEMY_TYPES);
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 8;
        
        spawnEnemy({
          type: randomType,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
        });
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const enemies = useGameStore((state: any) => state.enemies);
  const cores = useGameStore((state: any) => state.cores);

  return (
    <View style={styles.container}>
      <Canvas
        camera={{ position: [0, 10, 10], fov: 50 }}
        style={styles.canvas}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#1B263B" />
          </mesh>
          
          {/* Player */}
          <Player />
          
          {/* Enemies */}
          {enemies.map((enemy) => (
            <Enemy key={enemy.id} enemy={enemy} />
          ))}
          
          {/* Morphic Cores */}
          {cores.map((core) => (
            <mesh key={core.id} position={[core.x, 0.5, core.y]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial
                color="#9D4EDD"
                emissive="#9D4EDD"
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <Controls />
      <FormSelector />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
});