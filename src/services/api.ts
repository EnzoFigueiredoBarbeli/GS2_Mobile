import axios from 'axios';
import { WeatherData, SpaceEvent } from '../types';

// 🔑 CHAVES DE API — substitua pelas suas
// OpenWeatherMap: https://openweathermap.org/api (gratuito)
// NASA: https://api.nasa.gov (gratuito, use DEMO_KEY para testar)
const OWM_API_KEY = 'SUA_CHAVE_OPENWEATHERMAP';
const NASA_API_KEY = 'DEMO_KEY';

const owmApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
});

const nasaApi = axios.create({
  baseURL: 'https://api.nasa.gov/DONKI',
  timeout: 10000,
});

// Interceptor para log de erros
owmApi.interceptors.response.use(
  response => response,
  error => {
    console.error('[WeatherAPI Error]', error.message);
    return Promise.reject(error);
  }
);

export const WeatherService = {
  // Busca clima por nome da cidade
  async getByCity(city: string): Promise<WeatherData> {
    const { data } = await owmApi.get('/weather', {
      params: {
        q: city,
        appid: OWM_API_KEY,
        units: 'metric',
        lang: 'pt_br',
      },
    });
    return mapWeatherData(data);
  },

  // Busca clima por coordenadas
  async getByCoords(lat: number, lon: number): Promise<WeatherData> {
    const { data } = await owmApi.get('/weather', {
      params: {
        lat,
        lon,
        appid: OWM_API_KEY,
        units: 'metric',
        lang: 'pt_br',
      },
    });
    return mapWeatherData(data);
  },

  // Busca múltiplas cidades
  async getMultiple(cities: string[]): Promise<WeatherData[]> {
    const results = await Promise.allSettled(
      cities.map(city => WeatherService.getByCity(city))
    );
    return results
      .filter((r): r is PromiseFulfilledResult<WeatherData> => r.status === 'fulfilled')
      .map(r => r.value);
  },
};

export const NasaService = {
  // Ejeções de massa coronal
  async getCME(): Promise<SpaceEvent[]> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data } = await nasaApi.get('/CME', {
      params: { startDate, endDate, api_key: NASA_API_KEY },
    });
    return (data || []).slice(0, 10).map((item: any) => ({
      id: item.activityID || String(Math.random()),
      type: 'CME' as const,
      title: 'Ejeção de Massa Coronal',
      description: item.note || 'Evento de ejeção de plasma solar detectado.',
      startTime: item.startTime,
      link: item.link || '',
      intensity: item.cmeAnalyses?.[0]?.speed ? `${item.cmeAnalyses[0].speed} km/s` : undefined,
    }));
  },

  // Tempestades geomagnéticas
  async getGST(): Promise<SpaceEvent[]> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data } = await nasaApi.get('/GST', {
      params: { startDate, endDate, api_key: NASA_API_KEY },
    });
    return (data || []).slice(0, 10).map((item: any) => ({
      id: item.gstID || String(Math.random()),
      type: 'GST' as const,
      title: 'Tempestade Geomagnética',
      description: `Índice Kp: ${item.allKpIndex?.[0]?.kpIndex || 'N/A'}`,
      startTime: item.startTime,
      link: item.link || '',
      intensity: item.allKpIndex?.[0]?.kpIndex ? `Kp ${item.allKpIndex[0].kpIndex}` : undefined,
    }));
  },

  // Todos os eventos
  async getAllEvents(): Promise<SpaceEvent[]> {
    const [cme, gst] = await Promise.allSettled([
      NasaService.getCME(),
      NasaService.getGST(),
    ]);
    const result: SpaceEvent[] = [];
    if (cme.status === 'fulfilled') result.push(...cme.value);
    if (gst.status === 'fulfilled') result.push(...gst.value);
    return result.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  },
};

// Mapeia resposta da API para nosso tipo
function mapWeatherData(data: any): WeatherData {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    icon: data.weather[0].icon,
    lat: data.coord.lat,
    lon: data.coord.lon,
  };
}
