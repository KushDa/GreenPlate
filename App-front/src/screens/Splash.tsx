import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Splash = () => (
  <View style={styles.container}>
    <Text style={styles.text}>GreenPlate</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#22c55e' },
  text: { color: 'white', fontSize: 32, fontWeight: 'bold' },
});

export default Splash;
