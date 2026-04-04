import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Onboarding = ({ navigation }: any) => (
  <View style={styles.container}>
    <Text style={styles.title}>Welcome to GreenPlate</Text>
    <Text style={styles.subtitle}>Save food, save money, save the planet.</Text>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
      <Text style={styles.buttonText}>Get Started</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 30 },
  button: { backgroundColor: '#22c55e', padding: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default Onboarding;
