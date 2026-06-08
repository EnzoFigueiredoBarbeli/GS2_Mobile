import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { WeatherData } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../theme';

interface Props {
  data: WeatherData;
  onFavorite?: () => void;
  isFavorite?: boolean;
  compact?: boolean;
}

export const WeatherCard: React.FC<Props> = ({ data, onFavorite, isFavorite, compact }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.city, { color: colors.text }]}>
            {data.city}, {data.country}
          </Text>
          <Text style={[styles.desc, { color: colors.textSecondary }]}>
            {data.description.charAt(0).toUpperCase() + data.description.slice(1)}
          </Text>
        </View>
        <View style={styles.tempRow}>
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${data.icon}@2x.png` }}
            style={styles.icon}
          />
          <Text style={[styles.temp, { color: colors.primary }]}>{data.temperature}°C</Text>
        </View>
      </View>

      {!compact && (
        <View style={[styles.details, { borderTopColor: colors.border }]}>
          <DetailItem label="Sensação" value={`${data.feelsLike}°C`} colors={colors} />
          <DetailItem label="Umidade" value={`${data.humidity}%`} colors={colors} />
          <DetailItem label="Vento" value={`${data.windSpeed} m/s`} colors={colors} />
        </View>
      )}

      {onFavorite && (
        <TouchableOpacity
          onPress={onFavorite}
          style={[styles.favBtn, { backgroundColor: isFavorite ? colors.accent + '33' : colors.surface }]}
        >
          <Text style={{ color: isFavorite ? colors.accent : colors.textMuted, fontSize: 18 }}>
            {isFavorite ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const DetailItem = ({ label, value, colors }: any) => (
  <View style={styles.detailItem}>
    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>{label}</Text>
    <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  city: { fontSize: FontSize.lg, fontWeight: '700' },
  desc: { fontSize: FontSize.sm, marginTop: 2 },
  tempRow: { alignItems: 'center' },
  temp: { fontSize: FontSize.xxl, fontWeight: '800' },
  icon: { width: 50, height: 50 },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  detailItem: { alignItems: 'center' },
  detailLabel: { fontSize: FontSize.xs },
  detailValue: { fontSize: FontSize.sm, fontWeight: '600', marginTop: 2 },
  favBtn: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
