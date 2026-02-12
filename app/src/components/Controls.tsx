import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  TouchableOpacity,
  Text,
} from 'react-native';
import useGameStore from '../store/gameStore';
import { FORMS } from '../data/forms';

export default function Controls() {
  const movePlayer = useGameStore((state: any) => state.movePlayer);
  const player = useGameStore((state: any) => state.player);
  const enemies = useGameStore((state: any) => state.enemies);
  
  const currentForm = FORMS[player.currentForm] || FORMS.base;
  
  const pan = useRef(new Animated.ValueXY()).current;
  const lastAttack = useRef(0);
  
  // Joystick handler
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderMove: (_, gesture) => {
        // Limit joystick range
        const maxDistance = 50;
        const distance = Math.sqrt(
          gesture.dx ** 2 + gesture.dy ** 2
        );
        
        if (distance < maxDistance) {
          pan.setValue({ x: gesture.dx, y: gesture.dy });
        } else {
          const angle = Math.atan2(gesture.dy, gesture.dx);
          pan.setValue({
            x: Math.cos(angle) * maxDistance,
            y: Math.sin(angle) * maxDistance,
          });
        }
        
        // Move player based on joystick
        const speed = currentForm.speed;
        movePlayer(gesture.dx * speed * 0.1, gesture.dy * speed * 0.1);
      },
      
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;
  
  // Attack handler
  const handleAttack = () => {
    const now = Date.now();
    if (now - lastAttack.current < currentForm.attackCooldown) {
      return; // Cooldown not ready
    }
    
    lastAttack.current = now;
    
    // Find enemies in range
    enemies.forEach((enemy) => {
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= currentForm.attackRange) {
        enemy.takeDamage?.(currentForm.damage);
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Joystick */}
      <View style={styles.joystickContainer}>
        <View style={styles.joystickOuter}>
          <Animated.View
            style={[
              styles.joystickInner,
              {
                transform: [
                  { translateX: pan.x },
                  { translateY: pan.y },
                ],
              },
            ]}
            {...panResponder.panHandlers}
          />
        </View>
      </View>
      
      {/* Attack button */}
      <View style={styles.attackContainer}>
        <TouchableOpacity
          style={[styles.attackButton, { backgroundColor: currentForm.color }]}
          onPress={handleAttack}
        >
          <Text style={styles.attackText}>⚔</Text>
        </TouchableOpacity>
        
        {/* Health display */}
        <View style={styles.healthContainer}>
          <Text style={styles.healthText}>
            HP: {Math.round(player.health)}/{player.maxHealth}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },
  joystickContainer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
  },
  joystickOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  joystickInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(157, 78, 221, 0.8)',
    borderWidth: 2,
    borderColor: '#9D4EDD',
  },
  attackContainer: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    alignItems: 'center',
  },
  attackButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  attackText: {
    fontSize: 32,
    color: '#FFF',
  },
  healthContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  healthText: {
    color: '#06FFA5',
    fontSize: 14,
    fontWeight: 'bold',
  },
});