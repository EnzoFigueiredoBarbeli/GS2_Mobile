import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, StatusBar,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../hooks/useFavorites';
import { useWeather } from '../hooks/useWeather';
import { WeatherCard } from '../components/WeatherCard';
import { WeatherSkeleton } from '../components/SkeletonLoader';
import { FavoriteLocation } from '../types';
import { Spacing, FontSize, BorderRadius } from '../theme';

export const FavoritesScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { favorites, loading, removeFavorite, reload } = useFavorites();

  useEffect(() => { reload(); }, []);

  const handleRemove = (fav: FavoriteLocation) => {
    Alert.alert(
      'Remover favorito',
      `Deseja remover ${fav.city} dos favoritos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => removeFavorite(fav.id) },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>⭐ Favoritos</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          {favorites.length} local(is) salvo(s)
        </Text>
      </View>

      {loading ? (
        <View style={{ padding: Spacing.md }}>
          <WeatherSkeleton /><WeatherSkeleton />
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🌍</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhum favorito ainda</Text>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Busque uma cidade na tela inicial e toque na estrela para salvar.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <FavoriteItem fav={item} onRemove={handleRemove} />}
          contentContainerStyle={styles.list}
          onRefresh={reload}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const FavoriteItem = ({ fav, onRemove }: { fav: FavoriteLocation; onRemove: (f: FavoriteLocation) => void }) => {
  const { colors } = useTheme();
  const { data, loading, fetchByCoords } = useWeather();

  useEffect(() => { fetchByCoords(fav.lat, fav.lon); }, [fav.lat, fav.lon]);

  return (
    <View style={{ marginBottom: Spacing.sm }}>
      {loading ? (
        <WeatherSkeleton />
      ) : data ? (
        <View>
          <WeatherCard data={data} compact />
          <TouchableOpacity
            onPress={() => onRemove(fav)}
            style={[styles.removeBtn, { backgroundColor: colors.danger + '22', borderColor: colors.danger }]}
          >
            <Text style={[styles.removeBtnText, { color: colors.danger }]}>🗑 Remover dos favoritos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.fallback, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.fallbackCity, { color: colors.text }]}>{fav.city}, {fav.country}</Text>
          <Text style={[styles.fallbackSub, { color: colors.textMuted }]}>
            Salvo em {new Date(fav.savedAt).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.md, paddingBottom: 0 },
  title: { fontSize: FontSize.xxl, fontWeight: '800' },
  subtitle: { fontSize: FontSize.sm, marginTop: 2, marginBottom: Spacing.md },
  list: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl },
  emptyEmoji: { fontSize: 64, marginBottom: Spacing.md },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', marginBottom: Spacing.sm },
  emptyText: { fontSize: FontSize.md, textAlign: 'center', lineHeight: 22 },
  removeBtn: { borderRadius: BorderRadius.md, borderWidth: 1, padding: Spacing.sm, alignItems: 'center', marginTop: 4 },
  removeBtnText: { fontSize: FontSize.sm, fontWeight: '600' },
  fallback: { borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md },
  fallbackCity: { fontSize: FontSize.lg, fontWeight: '700' },
  fallbackSub: { fontSize: FontSize.sm, marginTop: 4 },
});
