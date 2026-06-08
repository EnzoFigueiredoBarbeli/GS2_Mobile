import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteLocation, AppSettings } from '../types';

const KEYS = {
  FAVORITES: '@spaceweather:favorites',
  SETTINGS:  '@spaceweather:settings',
  LAST_CITY: '@spaceweather:lastcity',
};

export const StorageService = {
  // Favoritos
  async getFavorites(): Promise<FavoriteLocation[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.FAVORITES);
      return json ? JSON.parse(json) : [];
    } catch { return []; }
  },

  async saveFavorite(location: Omit<FavoriteLocation, 'id' | 'savedAt'>): Promise<void> {
    const favorites = await StorageService.getFavorites();
    const exists = favorites.some(f => f.city === location.city && f.country === location.country);
    if (exists) return;
    const newFav: FavoriteLocation = {
      ...location,
      id: `${location.city}-${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify([...favorites, newFav]));
  },

  async removeFavorite(id: string): Promise<void> {
    const favorites = await StorageService.getFavorites();
    const updated = favorites.filter(f => f.id !== id);
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
  },

  async isFavorite(city: string, country: string): Promise<boolean> {
    const favorites = await StorageService.getFavorites();
    return favorites.some(f => f.city === city && f.country === country);
  },

  // Configurações
  async getSettings(): Promise<AppSettings> {
    try {
      const json = await AsyncStorage.getItem(KEYS.SETTINGS);
      return json ? JSON.parse(json) : { darkMode: true, temperatureUnit: 'C', notifications: false };
    } catch {
      return { darkMode: true, temperatureUnit: 'C', notifications: false };
    }
  },

  async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    const current = await StorageService.getSettings();
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify({ ...current, ...settings }));
  },

  // Última cidade pesquisada
  async getLastCity(): Promise<string> {
    return (await AsyncStorage.getItem(KEYS.LAST_CITY)) || 'São Paulo';
  },

  async saveLastCity(city: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.LAST_CITY, city);
  },
};
