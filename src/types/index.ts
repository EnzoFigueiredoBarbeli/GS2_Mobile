// Clima terrestre (OpenWeatherMap)
export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  lat: number;
  lon: number;
}

// Evento espacial NASA DONKI
export interface SpaceEvent {
  id: string;
  type: 'CME' | 'GST' | 'FLR' | 'SEP' | 'MPC' | 'RBE' | 'HSS';
  title: string;
  description: string;
  startTime: string;
  link: string;
  intensity?: string;
}

// Favorito salvo localmente
export interface FavoriteLocation {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  savedAt: string;
}

// Configurações do usuário
export interface AppSettings {
  darkMode: boolean;
  temperatureUnit: 'C' | 'F';
  notifications: boolean;
}

// Tipos de navegação
export type RootTabParamList = {
  Home: undefined;
  Events: undefined;
  Favorites: undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  CityDetail: { city: string; lat: number; lon: number };
};
