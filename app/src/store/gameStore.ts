import { create } from 'zustand';

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
  
  // Actions
  movePlayer: (dx, dy) => set((state) => ({
    player: {
      ...state.player,
      x: state.player.x + dx,
      y: state.player.y + dy,
    }
  })),
  
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
    };
  }),
  
  spawnEnemy: (enemy) => set((state) => ({
    enemies: [...state.enemies, { ...enemy, id: Date.now() }]
  })),
  
  removeEnemy: (id) => set((state) => ({
    enemies: state.enemies.filter(e => e.id !== id),
    cores: [...state.cores, { 
      type: state.enemies.find(e => e.id === id)?.type,
      x: state.enemies.find(e => e.id === id)?.x,
      y: state.enemies.find(e => e.id === id)?.y,
      id: Date.now(),
    }]
  })),
  
  damagePlayer: (amount) => set((state) => ({
    player: {
      ...state.player,
      health: Math.max(0, state.player.health - amount)
    }
  })),
}));

export default useGameStore;