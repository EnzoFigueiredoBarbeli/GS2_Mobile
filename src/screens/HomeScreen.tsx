import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  RefreshControl, TouchableOpacity, StatusBar,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useWeather } from '../hooks/useWeather';
import { useSpaceEvents } from '../hooks/useSpaceEvents';
import { useFavorites } from '../hooks/useFavorites';
import { StorageService } from '../storage';
import { WeatherCard } from '../components/WeatherCard';
import { SpaceEventCard } from '../components/SpaceEventCard';
import { SearchBar } from '../components/SearchBar';
import { WeatherSkeleton, EventSkeleton } from '../components/SkeletonLoader';
import { Spacing, FontSize, BorderRadius } from '../theme';

export const HomeScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { data: weather, loading: wLoading, error: wError, fetchByCity } = useWeather();
  const { events, loading: eLoading } = useSpaceEvents();
  const { addFavorite, checkIsFavorite } = useFavorites();
  const [isFav, setIsFav] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    StorageService.getLastCity().then(fetchByCity);
  }, []);

  useEffect(() => {
    if (weather) {
      checkIsFavorite(weather.city, weather.country).then(setIsFav);
    }
  }, [weather]);

  const handleSearch = (city: string) => fetchByCity(city);

  const handleFavorite = async () => {
    if (!weather) return;
    await addFavorite({ city: weather.city, country: weather.country, lat: weather.lat, lon: weather.lon });
    setIsFav(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const city = await StorageService.getLastCity();
    await fetchByCity(city);
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textMuted }]}>🛰️ SpaceWeather</Text>
            <Text style={[styles.title, { color: colors.text }]}>Clima & Espaço</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.primary + '22' }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>NASA + OWM</Text>
          </View>
        </View>

        {/* Busca */}
        <SearchBar onSearch={handleSearch} loading={wLoading} />

        {/* Clima */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>🌍 Condições Atuais</Text>
        {wLoading ? (
          <WeatherSkeleton />
        ) : wError ? (
          <View style={[styles.errorBox, { backgroundColor: colors.danger + '22', borderColor: colors.danger }]}>
            <Text style={[styles.errorText, { color: colors.danger }]}>{wError}</Text>
          </View>
        ) : weather ? (
          <WeatherCard data={weather} onFavorite={handleFavorite} isFavorite={isFav} />
        ) : null}

        {/* Alerta espacial */}
        {events.length > 0 && (
          <View style={[styles.alertBanner, { backgroundColor: colors.accent + '22', borderColor: colors.accent }]}>
            <Text style={[styles.alertText, { color: colors.accent }]}>
              ⚡ {events.length} evento(s) espacial(is) recente(s) detectado(s) pela NASA
            </Text>
          </View>
        )}

        {/* Eventos espaciais (preview) */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>☀️ Eventos Espaciais</Text>
          <Text style={[styles.seeAll, { color: colors.primary }]}>NASA DONKI</Text>
        </View>

        {eLoading ? (
          <>
            <EventSkeleton /><EventSkeleton />
          </>
        ) : (
          events.slice(0, 3).map(event => (
            <SpaceEventCard key={event.id} event={event} />
          ))
        )}

        {/* Métricas resumo */}
        {weather && (
          <View style={styles.metricsRow}>
            <MetricCard label="Temperatura" value={`${weather.temperature}°C`} emoji="🌡️" colors={colors} />
            <MetricCard label="Umidade" value={`${weather.humidity}%`} emoji="💧" colors={colors} />
            <MetricCard label="Vento" value={`${weather.windSpeed}m/s`} emoji="💨" colors={colors} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const MetricCard = ({ label, value, emoji, colors }: any) => (
  <View style={[styles.metric, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <Text style={{ fontSize: 20 }}>{emoji}</Text>
    <Text style={[styles.metricValue, { color: colors.primary }]}>{value}</Text>
    <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  greeting: { fontSize: FontSize.sm },
  title: { fontSize: FontSize.xxl, fontWeight: '800' },
  badge: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 4 },
  badgeText: { fontSize: FontSize.xs, fontWeight: '700' },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', marginBottom: Spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  seeAll: { fontSize: FontSize.sm, fontWeight: '600' },
  errorBox: { borderRadius: BorderRadius.md, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.sm },
  errorText: { fontSize: FontSize.sm, fontWeight: '500' },
  alertBanner: { borderRadius: BorderRadius.md, borderWidth: 1, padding: Spacing.sm, marginBottom: Spacing.md },
  alertText: { fontSize: FontSize.sm, fontWeight: '600' },
  metricsRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  metric: { flex: 1, borderRadius: BorderRadius.md, borderWidth: 1, padding: Spacing.sm, alignItems: 'center', gap: 4 },
  metricValue: { fontSize: FontSize.lg, fontWeight: '800' },
  metricLabel: { fontSize: FontSize.xs },
});
