import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DealDetailsScreen = ({ navigation }: any) => (
  <SafeAreaView style={styles.container}>
    <ScrollView bounces={false}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' }} 
          style={styles.image} 
        />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Veggie Surprise Box</Text>
          <Text style={styles.price}>$4.99</Text>
        </View>
        <Text style={styles.restaurant}>Green Garden Deli • 0.4 mi away</Text>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>What you might get</Text>
        <Text style={styles.description}>
          A surprise assortment of fresh vegetables and salads that weren't sold today. Expect leafy greens, root vegetables, and perhaps a daily special side!
        </Text>
        <TouchableOpacity style={styles.reserveButton}>
          <Text style={styles.reserveButtonText}>Reserve Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageContainer: { height: 300, position: 'relative' },
  image: { width: '100%', height: '100%' },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  contentContainer: {
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
    marginTop: -30,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', flex: 1 },
  price: { fontSize: 28, fontWeight: 'bold', color: '#16a34a', marginLeft: 16 },
  restaurant: { fontSize: 16, color: '#6b7280', marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 12 },
  description: { fontSize: 16, color: '#6b7280', lineHeight: 24, marginBottom: 30 },
  reserveButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  reserveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default DealDetailsScreen;
