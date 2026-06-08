import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useSpaceEvents } from '../hooks/useSpaceEvents';
import { SpaceEventCard } from '../components/SpaceEventCard';
import { EventSkeleton } from '../components/SkeletonLoader';
import { SpaceEvent } from '../types';
import { Spacing, FontSize, BorderRadius } from '../theme';

const FILTERS = [
  { key: 'ALL', label: 'Todos' },
  { key: 'CME', label: '☀️ CME' },
  { key: 'GST', label: '🌍 Tempestade' },
  { key: 'FLR', label: '⚡ Flare' },
];

export const EventsScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { events, loading, error, refetch } = useSpaceEvents();
  const [filter, setFilter] = useState('ALL');

  const filtered = filter === 'ALL' ? events : events.filter(e => e.type === filter);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>☀️ Eventos Espaciais</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Monitoramento NASA DONKI</Text>
      </View>

      {/* Filtros */}
      <View style={styles.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[
              styles.filterBtn,
              {
                backgroundColor: filter === f.key ? colors.primary : colors.surface,
                borderColor: filter === f.key ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={[styles.filterText, { color: filter === f.key ? '#fff' : colors.textSecondary }]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contagem */}
      {!loading && (
        <Text style={[styles.count, { color: colors.textMuted }]}>
          {filtered.length} evento(s) nos últimos 30 dias
        </Text>
      )}

      {loading ? (
        <View style={{ padding: Spacing.md }}>
          {[1, 2, 3, 4].map(i => <EventSkeleton key={i} />)}
        </View>
      ) : error ? (
        <View style={[styles.errorBox, { backgroundColor: colors.danger + '22' }]}>
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
          <Text style={[styles.errorSub, { color: colors.textMuted }]}>Exibindo dados de exemplo</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <SpaceEventCard event={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🔭</Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                Nenhum evento deste tipo encontrado.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.md, paddingBottom: 0 },
  title: { fontSize: FontSize.xxl, fontWeight: '800' },
  subtitle: { fontSize: FontSize.sm, marginTop: 2 },
  filters: { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.md, flexWrap: 'wrap' },
  filterBtn: { borderRadius: BorderRadius.full, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: 6 },
  filterText: { fontSize: FontSize.sm, fontWeight: '600' },
  count: { paddingHorizontal: Spacing.md, fontSize: FontSize.xs, marginBottom: Spacing.xs },
  list: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  errorBox: { margin: Spacing.md, padding: Spacing.md, borderRadius: BorderRadius.md },
  errorText: { fontSize: FontSize.sm, fontWeight: '600' },
  errorSub: { fontSize: FontSize.xs, marginTop: 4 },
  empty: { alignItems: 'center', padding: Spacing.xxl },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { fontSize: FontSize.md, textAlign: 'center' },
});
