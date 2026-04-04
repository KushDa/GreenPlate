import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

// Screen Imports
import UserHomeScreen from '../screens/Main/UserHomeScreen';
import MyOrderScreen from '../screens/Main/MyOrderScreen';
import MapViewScreen from '../screens/Main/MapViewScreen';
import DealDetailsScreen from '../screens/Main/DealDetailsScreen';

/**
 * Type Definitions for Navigation
 */
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  DealDetails: undefined; // Assuming it takes route params later, undefined for now
};

export type MainTabParamList = {
  Home: undefined;
  Orders: undefined;
  Map: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Placeholder Components for Auth and Splash
 */
const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
    <Text style={{ fontSize: 18, color: '#6b7280' }}>{name} Screen</Text>
  </View>
);

/**
 * Main Bottom Tab Navigator
 */
function MainTabs() {
  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Orders') iconName = focused ? 'receipt' : 'receipt-outline';
          else if (route.name === 'Map') iconName = focused ? 'map' : 'map-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#16a34a', // GreenPlate Primary
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60,
          paddingBottom: 10,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={UserHomeScreen} />
      <Tab.Screen name="Orders" component={MyOrderScreen} />
      <Tab.Screen name="Map" component={MapViewScreen} />
    </Tab.Navigator>
  );
}

/**
 * Root Navigation Component
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id="RootStack"
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {/* Auth Flow Placeholders */}
        <Stack.Screen name="Splash" component={() => <PlaceholderScreen name="Splash" />} />
        
        {/* Main App Flow */}
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="DealDetails" component={DealDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
