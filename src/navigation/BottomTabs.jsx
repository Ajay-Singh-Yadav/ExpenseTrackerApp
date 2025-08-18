import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import WalletScreen from '../screens/WalletScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useTheme } from '../constants/ThemeContext';

const Tabs = createBottomTabNavigator();

const ICONS = {
  Home: (focused, size, color) => (
    <Ionicons
      name={focused ? 'home' : 'home-outline'}
      size={size}
      color={color}
    />
  ),
  Statistics: (focused, size, color) => (
    <Ionicons
      name={focused ? 'bar-chart' : 'bar-chart-outline'}
      size={size}
      color={color}
    />
  ),
  Wallet: (_, size, color) => (
    <MaterialCommunityIcons name="wallet" size={size} color={color} />
  ),
  Profile: (focused, size, color) => (
    <Ionicons
      name={focused ? 'person' : 'person-outline'}
      size={size}
      color={color}
    />
  ),
};

const BottomTabs = () => {
  const { theme } = useTheme();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) =>
          ICONS[route.name](focused, size, color),
        tabBarStyle: {
          backgroundColor: theme.bgColor,
          paddingBottom: 5,
          paddingTop: 5,

          elevation: 10,
          height: 70,
          borderTopWidth: 1,
          borderTopColor: theme.borderTopColor,
        },

        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Statistics" component={StatisticsScreen} />
      <Tabs.Screen name="Wallet" component={WalletScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
};

export default React.memo(BottomTabs);
