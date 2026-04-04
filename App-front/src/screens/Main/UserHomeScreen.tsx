import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FoodDealCard from '../../components/FoodDealCard';

/**
 * Mock Data for GreenPlate
 */
const MOCK_DEALS = [
  {
    id: '1',
    title: 'Veggie Surprise Box',
    restaurant: 'Green Garden Deli',
    price: '$4.99',
    originalPrice: '$15.00',
    distance: '0.4 mi',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '2',
    title: 'Assorted Pastry Bag',
    restaurant: 'The Daily Crumb',
    price: '$3.50',
    originalPrice: '$12.00',
    distance: '0.9 mi',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '3',
    title: 'Salmon Bento Set',
    restaurant: 'Zen Sushi Bar',
    price: '$7.99',
    originalPrice: '$18.50',
    distance: '1.2 mi',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '4',
    title: 'Artisan Sourdough',
    restaurant: 'Baker\'s Hearth',
    price: '$2.00',
    originalPrice: '$6.50',
    distance: '1.5 mi',
    image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&q=80&w=800',
  },
];

/**
 * UserHomeScreen Component
 * 
 * Architecture:
 * - Uses FlatList for optimized rendering of long lists.
 * - Includes a custom header and search bar.
 * - Modern, clean design with GreenPlate branding.
 */
const UserHomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Good Morning,</Text>
          <Text style={styles.locationText}>San Francisco, CA</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput 
            placeholder="Search surplus food..." 
            style={styles.searchInput}
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Deals List */}
      <FlatList
        data={MOCK_DEALS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FoodDealCard 
            {...item} 
            onPress={() => console.log(`Selected: ${item.title}`)}
          />
        )}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Nearby Deals</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: '#16a34a',
    borderRadius: 15,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 30,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAll: {
    color: '#16a34a',
    fontWeight: '600',
  },
});

export default UserHomeScreen;
