import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SpaceEvent } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../theme';

const EVENT_CONFIG = {
  CME: { emoji: '☀️', label: 'Ejeção Solar',     color: '#ff7043' },
  GST: { emoji: '🌍', label: 'Tempestade Mag.',   color: '#7c4dff' },
  FLR: { emoji: '⚡', label: 'Explosão Solar',    color: '#ffd54f' },
  SEP: { emoji: '☢️', label: 'Partículas Solares',color: '#ef5350' },
  MPC: { emoji: '🪐', label: 'Contato Magnético', color: '#42a5f5' },
  RBE: { emoji: '🔴', label: 'Cinturão Radiação', color: '#ec407a' },
  HSS: { emoji: '💨', label: 'Fluxo Solar',       color: '#26c6da' },
};

interface Props {
  event: SpaceEvent;
}

export const SpaceEventCard: React.FC<Props> = ({ event }) => {
  const { colors } = useTheme();
  const config = EVENT_CONFIG[event.type] || EVENT_CONFIG.CME;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.typeBadge, { backgroundColor: config.color + '22' }]}>
        <Text style={styles.typeEmoji}>{config.emoji}</Text>
        <Text style={[styles.typeLabel, { color: config.color }]}>{config.label}</Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{event.title}</Text>
      <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>
        {event.description}
      </Text>

      <View style={styles.footer}>
        <Text style={[styles.date, { color: colors.textMuted }]}>
          🗓 {formatDate(event.startTime)}
        </Text>
        {event.intensity && (
          <View style={[styles.intensityBadge, { backgroundColor: config.color + '33' }]}>
            <Text style={[styles.intensityText, { color: config.color }]}>{event.intensity}</Text>
          </View>
        )}
        {event.link ? (
          <TouchableOpacity onPress={() => Linking.openURL(event.link)}>
            <Text style={[styles.link, { color: colors.primary }]}>Ver →</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginBottom: Spacing.xs,
    gap: 4,
  },
  typeEmoji: { fontSize: 14 },
  typeLabel: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.5 },
  title: { fontSize: FontSize.md, fontWeight: '700', marginBottom: 4 },
  desc: { fontSize: FontSize.sm, lineHeight: 20 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  date: { fontSize: FontSize.xs },
  intensityBadge: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  intensityText: { fontSize: FontSize.xs, fontWeight: '700' },
  link: { fontSize: FontSize.sm, fontWeight: '600' },
});
