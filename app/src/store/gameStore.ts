import { create } from 'zustand';
import * as Haptics from 'expo-haptics';

// ID counter for unique IDs
let idCounter = 0;

const useGameStore = create((set, get) => ({
  // Player state
  player: {
    x: 0,
    y: 0,
    currentForm: 'base',
    health: 100,
    maxHealth: 100,
  },
  
  // Form inventory (3 slots)
  forms: ['base', null, null],
  
  // Enemies
  enemies: [],
  
  // Available morphic cores
  cores: [],
  
  // Game state
  isDead: false,
  isPaused: false,
  isManuallyPaused: false,
  gameStartTime: Date.now(),
  survivalTime: 0,
  shatteredCount: 0,
  controlMode: 'move', // 'move' or 'shoot'
  
  // Particles for ranged attacks
  particles: [],
  
  // Play area bounds - restricted to visible screen area
  // Camera is at [0, 10, 10] with fov: 50, visible area is approximately -8 to 8
  // These bounds ensure player never moves off screen
  bounds: {
    minX: -8,
    maxX: 8,
    minY: -6,
    maxY: 8,
  },
  
  // Actions
  movePlayer: (dx, dy) => set((state) => {
    const newX = state.player.x + dx;
    const newY = state.player.y + dy;
    
    // Clamp position within bounds
    const clampedX = Math.max(state.bounds.minX, Math.min(state.bounds.maxX, newX));
    const clampedY = Math.max(state.bounds.minY, Math.min(state.bounds.maxY, newY));
    
    return {
      player: {
        ...state.player,
        x: clampedX,
        y: clampedY,
      }
    };
  }),
  
  switchForm: (formIndex) => set((state) => ({
    player: {
      ...state.player,
      currentForm: state.forms[formIndex],
      health: state.player.health, // Health persists across forms
    }
  })),
  
  absorbCore: (coreType, slotIndex) => set((state) => {
    const newForms = [...state.forms];
    newForms[slotIndex] = coreType;
    return {
      forms: newForms,
      cores: state.cores.filter(c => c.type !== coreType || c.used),
      isPaused: false, // Resume game after absorbing core
    };
  }),
  
  spawnEnemy: (enemy) => set((state) => {
    idCounter++;
    return {
      enemies: [...state.enemies, { ...enemy, id: `enemy-${idCounter}` }]
    };
  }),
  
  removeEnemy: (id) => set((state) => {
    const enemy = state.enemies.find(e => e.id === id);
    if (!enemy) return state;
    
    idCounter++;
    return {
      enemies: state.enemies.filter(e => e.id !== id),
      cores: [...state.cores, { 
        type: enemy.type,
        x: enemy.x,
        y: enemy.y,
        id: `core-${idCounter}`,
      }],
      shatteredCount: state.shatteredCount + 1,
      isPaused: true, // Pause game when enemy dies
    };
  }),
  
  damagePlayer: (amount) => {
    // Trigger haptic feedback when player is hit
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    return set((state) => {
      const newHealth = Math.max(0, state.player.health - amount);
      const isDead = newHealth <= 0;
      
      return {
        player: {
          ...state.player,
          health: newHealth
        },
        isDead,
        survivalTime: isDead ? Date.now() - state.gameStartTime : state.survivalTime,
      };
    });
  },
  
  restartGame: () => set((state) => {
    idCounter = 0;
    return {
      player: {
        x: 0,
        y: 0,
        currentForm: 'base',
        health: 100,
        maxHealth: 100,
      },
      forms: ['base', null, null],
      enemies: [],
      cores: [],
      particles: [],
      isDead: false,
      isPaused: false,
      isManuallyPaused: false,
      gameStartTime: Date.now(),
      survivalTime: 0,
      shatteredCount: 0,
      controlMode: 'move',
    };
  }),
  
  togglePause: () => set((state) => ({
    isManuallyPaused: !state.isManuallyPaused,
  })),
  
  toggleControlMode: () => set((state) => ({
    controlMode: state.controlMode === 'move' ? 'shoot' : 'move',
  })),
  
  spawnParticle: (particle) => set((state) => {
    idCounter++;
    return {
      particles: [...state.particles, { ...particle, id: `particle-${idCounter}` }]
    };
  }),
  
  removeParticle: (id) => set((state) => ({
    particles: state.particles.filter(p => p.id !== id)
  })),
}));

export default useGameStore;