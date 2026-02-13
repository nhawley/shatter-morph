import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

export default function PauseOverlay() {
  return (
    <View style={styles.overlay} pointerEvents="none" />
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
