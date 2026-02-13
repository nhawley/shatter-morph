import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { View, StyleSheet } from 'react-native';
import Player from './Player';
import Enemy from './Enemy';
import Particle from './Particle';
import Controls from './Controls';
import FormSelector from './FormSelector';
import GameOver from './GameOver';
import PauseOverlay from './PauseOverlay';
import PauseScreen from './PauseScreen';
import useGameStore from '../store/gameStore';
import { ENEMY_TYPES } from '../data/forms';

export default function Game() {
  // Add at the top of Game component
  const spawnEnemy = useGameStore((state: any) => state.spawnEnemy);
  const enemies = useGameStore((state: any) => state.enemies);
  const cores = useGameStore((state: any) => state.cores);
  const particles = useGameStore((state: any) => state.particles);
  const isDead = useGameStore((state: any) => state.isDead);
  const isPaused = useGameStore((state: any) => state.isPaused);
  const isManuallyPaused = useGameStore((state: any) => state.isManuallyPaused);
  const MAX_ENEMIES = 5;

  useEffect(() => {
    // Spawn 5 enemies periodically
    const interval = setInterval(() => {
      if (enemies.length < MAX_ENEMIES && !isDead && !isPaused && !isManuallyPaused) {
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
  }, [enemies.length, isDead, isPaused, isManuallyPaused]);

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
          
          {/* Particles */}
          {particles.map((particle) => (
            <Particle key={particle.id} particle={particle} />
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
      
      {/* Pause Overlay for core selection */}
      {isPaused && !isDead && !isManuallyPaused && <PauseOverlay />}
      
      {/* Manual Pause Screen */}
      {isManuallyPaused && !isDead && <PauseScreen />}
      
      {/* Game Over Screen */}
      {isDead && <GameOver />}
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