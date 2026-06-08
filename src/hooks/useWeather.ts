import { useState, useCallback } from 'react';
import { WeatherData } from '../types';
import { WeatherService } from '../services/api';
import { StorageService } from '../storage';

interface UseWeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export const useWeather = () => {
  const [state, setState] = useState<UseWeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchByCity = useCallback(async (city: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await WeatherService.getByCity(city);
      await StorageService.saveLastCity(city);
      setState({ data, loading: false, error: null });
    } catch (err: any) {
      setState(s => ({
        ...s,
        loading: false,
        error: err.response?.status === 404
          ? 'Cidade não encontrada.'
          : 'Erro ao carregar clima. Verifique sua conexão.',
      }));
    }
  }, []);

  const fetchByCoords = useCallback(async (lat: number, lon: number) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await WeatherService.getByCoords(lat, lon);
      setState({ data, loading: false, error: null });
    } catch {
      setState(s => ({ ...s, loading: false, error: 'Erro ao buscar localização.' }));
    }
  }, []);

  return { ...state, fetchByCity, fetchByCoords };
};
