import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import useGameStore from '../store/gameStore';
import { FORMS } from '../data/forms';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Controls() {
  const movePlayer = useGameStore((state: any) => state.movePlayer);
  const player = useGameStore((state: any) => state.player);
  const spawnParticle = useGameStore((state: any) => state.spawnParticle);
  const isDead = useGameStore((state: any) => state.isDead);
  const isPaused = useGameStore((state: any) => state.isPaused);
  const isManuallyPaused = useGameStore((state: any) => state.isManuallyPaused);
  const togglePause = useGameStore((state: any) => state.togglePause);
  const controlMode = useGameStore((state: any) => state.controlMode);
  const toggleControlMode = useGameStore((state: any) => state.toggleControlMode);
  
  const currentForm = FORMS[player.currentForm] || FORMS.base;
  
  const pan = useRef(new Animated.ValueXY()).current;
  const lastShot = useRef(0);
  const playerPositionRef = useRef({ x: player.x, y: player.y });
  const controlModeRef = useRef(controlMode);
  
  // Update player position reference when player moves
  useEffect(() => {
    playerPositionRef.current = { x: player.x, y: player.y };
  }, [player.x, player.y]);
  
  // Update control mode ref when it changes
  useEffect(() => {
    controlModeRef.current = controlMode;
  }, [controlMode]);
  
  // Joystick handler - switches between move and shoot modes
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderMove: (_, gesture) => {
        if (isDead || isPaused || isManuallyPaused) return;
        
        // Check current control mode
        const currentMode = controlModeRef.current;
        
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
        
        // Only allow movement in move mode, lock player in shoot mode
        if (currentMode === 'move') {
          // Move player based on joystick
          const speed = currentForm.speed;
          movePlayer(gesture.dx * speed * 0.1, gesture.dy * speed * 0.1);
        }
        
        // Only shoot in shoot mode
        if (currentMode === 'shoot') {
          // Shoot mode - fire particles (player locked in place)
          if (distance > 5) {
            const now = Date.now();
            if (now - lastShot.current > 150) {
              lastShot.current = now;
              
              // Calculate direction from joystick
              const angle = Math.atan2(gesture.dy, gesture.dx);
              const speed = 0.2;
              
              spawnParticle({
                x: playerPositionRef.current.x,
                y: playerPositionRef.current.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: currentForm.color,
                damage: currentForm.damage,
                lifetime: 120,
              });
            }
          }
        }
      },
      
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Pause Button */}
      <TouchableOpacity
        style={styles.pauseButton}
        onPress={togglePause}
      >
        <Text style={styles.pauseText}>Pause</Text>
      </TouchableOpacity>
      
      {/* Dynamic Island style health bar at top */}
      <View style={styles.dynamicIslandContainer}>
        <BlurView intensity={80} tint="dark" style={styles.dynamicIslandBlur}>
          <View style={styles.dynamicIslandContent}>
            {/* Empty content - health bar is now the border */}
          </View>
          {/* Health bar as bottom border */}
          <View style={styles.healthBarBorder}>
            <View 
              style={[
                styles.healthBarFill,
                { width: `${(player.health / player.maxHealth) * 100}%` }
              ]}
            />
          </View>
        </BlurView>
        {/* Health text outside the pill */}
        <Text style={styles.healthText}>
          HP: {Math.round(player.health)}/{player.maxHealth}
        </Text>
      </View>
      
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
      
      {/* Mode Toggle Button */}
      <TouchableOpacity
        style={styles.modeToggleContainer}
        onPress={toggleControlMode}
      >
        <View style={[
          styles.modeToggleTrack,
          controlMode === 'shoot' && styles.modeToggleTrackShoot
        ]}>
          <View style={[
            styles.modeToggleThumb,
            controlMode === 'shoot' && styles.modeToggleThumbShoot
          ]} />
          <Text style={[
            styles.modeToggleLabel,
            controlMode === 'shoot' && styles.modeToggleLabelShoot
          ]}>
            {controlMode === 'move' ? 'Move' : 'Shoot'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },
  pauseButton: {
    position: 'absolute',
    top: Platform.select({
      ios: 80,
      default: 60,
    }),
    left: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 1000,
  },
  pauseText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  dynamicIslandContainer: {
    position: 'absolute',
    top: Platform.select({
      ios: 11, // Position exactly where Dynamic Island is
      default: 10,
    }),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dynamicIslandBlur: {
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    width: SCREEN_WIDTH, // 100% of device width
    position: 'relative',
  },
  dynamicIslandContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  healthBarBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(230, 57, 70, 0.2)',
    overflow: 'hidden',
  },
  healthBarFill: {
    height: '100%',
    backgroundColor: '#06FFA5',
    shadowColor: '#06FFA5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  healthText: {
    color: '#06FFA5',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 8,
  },
  joystickContainer: {
    position: 'absolute',
    bottom: 220,
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
  modeToggleContainer: {
    position: 'absolute',
    bottom: 220,
    right: 40,
  },
  modeToggleTrack: {
    width: 180,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(157, 78, 221, 0.3)',
    borderWidth: 3,
    borderColor: '#9D4EDD',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  modeToggleTrackShoot: {
    backgroundColor: 'rgba(230, 57, 70, 0.3)',
    borderColor: '#E63946',
  },
  modeToggleThumb: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modeToggleThumbShoot: {
    marginLeft: 'auto',
  },
  modeToggleLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9D4EDD',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  modeToggleLabelShoot: {
    color: '#E63946',
    marginLeft: 0,
    marginRight: 12,
  },
});