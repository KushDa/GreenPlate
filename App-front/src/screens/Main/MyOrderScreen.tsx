import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MOCK_ORDERS = [
  { id: '101', restaurant: 'Green Garden Deli', date: 'Oct 24, 2026', total: '$4.99', status: 'Completed' },
  { id: '102', restaurant: 'The Daily Crumb', date: 'Oct 22, 2026', total: '$3.50', status: 'Completed' },
];

const MyOrderScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Orders</Text>
    </View>
    <FlatList
      data={MOCK_ORDERS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.restaurantName}>{item.restaurant}</Text>
            <Text style={styles.orderTotal}>{item.total}</Text>
          </View>
          <View style={styles.orderDetails}>
            <Text style={styles.orderDate}>{item.date}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.reorderButton}>
            <Ionicons name="refresh" size={16} color="white" />
            <Text style={styles.reorderText}>Reorder</Text>
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>No orders yet.</Text>}
    />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  listContent: { padding: 16 },
  orderCard: { 
    backgroundColor: 'white', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  restaurantName: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  orderTotal: { fontSize: 18, fontWeight: 'bold', color: '#16a34a' },
  orderDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  orderDate: { fontSize: 14, color: '#6b7280' },
  statusBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#16a34a', fontSize: 12, fontWeight: '600' },
  reorderButton: { 
    backgroundColor: '#16a34a', 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 10,
    borderRadius: 8 
  },
  reorderText: { color: 'white', fontWeight: 'bold', marginLeft: 6 },
  emptyText: { textAlign: 'center', color: '#9ca3af', marginTop: 40, fontSize: 16 }
});

export default MyOrderScreen;
