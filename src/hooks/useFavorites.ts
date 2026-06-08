import { useState, useEffect, useCallback } from 'react';
import { FavoriteLocation } from '../types';
import { StorageService } from '../storage';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    const data = await StorageService.getFavorites();
    setFavorites(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadFavorites(); }, [loadFavorites]);

  const addFavorite = async (location: Omit<FavoriteLocation, 'id' | 'savedAt'>) => {
    await StorageService.saveFavorite(location);
    await loadFavorites();
  };

  const removeFavorite = async (id: string) => {
    await StorageService.removeFavorite(id);
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const checkIsFavorite = async (city: string, country: string) => {
    return StorageService.isFavorite(city, country);
  };

  return { favorites, loading, addFavorite, removeFavorite, checkIsFavorite, reload: loadFavorites };
};
