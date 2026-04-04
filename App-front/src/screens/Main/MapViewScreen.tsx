import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MapViewScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Nearby Deals</Text>
    </View>
    <View style={styles.mapContainer}>
      {/* Map Placeholder Content */}
      <Ionicons name="map" size={80} color="#cbd5e1" />
      <Text style={styles.mapText}>Map integration requires</Text>
      <Text style={styles.mapText}>react-native-maps</Text>
      <TouchableOpacity style={styles.refreshButton}>
        <Text style={styles.refreshText}>Search Area</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
    margin: 16,
    borderRadius: 20,
  },
  mapText: { color: '#64748b', fontSize: 16, marginTop: 8 },
  refreshButton: {
    marginTop: 20,
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  refreshText: { color: 'white', fontWeight: 'bold' }
});

export default MapViewScreen;
