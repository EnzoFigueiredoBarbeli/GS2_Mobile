import { useState, useCallback, useEffect } from 'react';
import { SpaceEvent } from '../types';
import { NasaService } from '../services/api';

export const useSpaceEvents = () => {
  const [events, setEvents] = useState<SpaceEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await NasaService.getAllEvents();
      setEvents(data);
    } catch {
      setError('Erro ao carregar eventos espaciais da NASA.');
      // Dados mock para demonstração quando API falha
      setEvents(getMockEvents());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
};

// Dados mock para quando a API está indisponível
function getMockEvents(): SpaceEvent[] {
  return [
    {
      id: 'mock-1',
      type: 'CME',
      title: 'Ejeção de Massa Coronal',
      description: 'Evento de ejeção de plasma solar detectado na região ativa AR3500.',
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      link: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/',
      intensity: '850 km/s',
    },
    {
      id: 'mock-2',
      type: 'GST',
      title: 'Tempestade Geomagnética',
      description: 'Tempestade geomagnética moderada com potencial impacto em sistemas GPS.',
      startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      link: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/',
      intensity: 'Kp 6',
    },
    {
      id: 'mock-3',
      type: 'FLR',
      title: 'Explosão Solar (Flare)',
      description: 'Explosão solar classe M detectada, possível interferência em comunicações de rádio.',
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      link: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/',
      intensity: 'M2.5',
    },
    {
      id: 'mock-4',
      type: 'CME',
      title: 'Ejeção de Massa Coronal',
      description: 'Ejeção lenta detectada com potencial chegada em 3-4 dias.',
      startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      link: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/',
      intensity: '420 km/s',
    },
  ];
}
