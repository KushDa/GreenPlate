import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';

/**
 * GreenPlate Entry Point
 * 
 * Architecture:
 * - SafeAreaProvider: Ensures content is rendered within safe boundaries of the device.
 * - AppNavigator: Handles all routing logic (Auth vs Main).
 * - StatusBar: Configures the system status bar style.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
