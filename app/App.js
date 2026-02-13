import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import Game from './src/components/Game';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Game />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
});