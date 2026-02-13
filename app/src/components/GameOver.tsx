import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { BlurView } from 'expo-blur';
import useGameStore from '../store/gameStore';

export default function GameOver() {
  const survivalTime = useGameStore((state: any) => state.survivalTime);
  const shatteredCount = useGameStore((state: any) => state.shatteredCount);
  const restartGame = useGameStore((state: any) => state.restartGame);
  
  // Format time in minutes and seconds
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Game Over</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statsContainer}>
              <Text style={styles.statsLabel}>Survived</Text>
              <Text style={styles.statsValue}>{formatTime(survivalTime)}</Text>
            </View>
            
            <View style={styles.statsDivider} />
            
            <View style={styles.statsContainer}>
              <Text style={styles.statsLabel}>Shattered</Text>
              <Text style={styles.statsValue}>{shatteredCount}</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.restartButton}
            onPress={restartGame}
          >
            <Text style={styles.restartButtonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  blurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    minWidth: 300,
  },
  content: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#E63946',
    marginBottom: 30,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    gap: 20,
  },
  statsContainer: {
    alignItems: 'center',
    flex: 1,
  },
  statsDivider: {
    width: 2,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  statsValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#06FFA5',
    letterSpacing: 1,
  },
  restartButton: {
    backgroundColor: '#9D4EDD',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#9D4EDD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  restartButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 1,
  },
});
