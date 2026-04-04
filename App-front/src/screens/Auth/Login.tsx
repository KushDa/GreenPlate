import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const Login = ({ navigation }: any) => (
  <View style={styles.container}>
    <Text style={styles.title}>Login</Text>
    <TextInput placeholder="Email" style={styles.input} />
    <TextInput placeholder="Password" style={styles.input} secureTextEntry />
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Main')}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
      <Text style={styles.link}>Don't have an account? Register</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 10 },
  button: { backgroundColor: '#22c55e', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  link: { marginTop: 15, color: '#22c55e', textAlign: 'center' },
});

export default Login;
