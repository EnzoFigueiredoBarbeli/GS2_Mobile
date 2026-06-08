import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { EventsScreen } from '../screens/EventsScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useTheme } from '../contexts/ThemeContext';
import { RootTabParamList } from '../types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const ICONS: Record<string, string> = {
  Home: '🏠', Events: '☀️', Favorites: '⭐', Settings: '⚙️',
};

export const AppNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20 }}>{ICONS[route.name]}</Text>
          ),
        })}
      >
        <Tab.Screen name="Home"      component={HomeScreen}      options={{ title: 'Início',    headerTitle: '🛸 SpaceWeather' }} />
        <Tab.Screen name="Events"    component={EventsScreen}    options={{ title: 'Eventos',   headerTitle: '☀️ Eventos NASA' }} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoritos', headerTitle: '⭐ Favoritos' }} />
        <Tab.Screen name="Settings"  component={SettingsScreen}  options={{ title: 'Config',    headerTitle: '⚙️ Configurações' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
