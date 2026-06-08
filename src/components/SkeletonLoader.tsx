import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { BorderRadius, Spacing } from '../theme';

interface Props { width?: number | string; height?: number; borderRadius?: number; }

export const SkeletonBox: React.FC<Props> = ({ width = '100%', height = 20, borderRadius = BorderRadius.sm }) => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={{ width: width as any, height, borderRadius, backgroundColor: colors.border, opacity, marginBottom: Spacing.xs }}
    />
  );
};

export const WeatherSkeleton: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <SkeletonBox width="60%" height={22} />
        <SkeletonBox width="40%" height={14} />
      </View>
      <SkeletonBox width={80} height={80} borderRadius={BorderRadius.full} />
    </View>
    <SkeletonBox height={1} />
    <View style={styles.row}>
      <SkeletonBox width="28%" height={40} />
      <SkeletonBox width="28%" height={40} />
      <SkeletonBox width="28%" height={40} />
    </View>
  </View>
);

export const EventSkeleton: React.FC = () => (
  <View style={styles.card}>
    <SkeletonBox width="30%" height={24} borderRadius={BorderRadius.full} />
    <SkeletonBox width="80%" height={18} />
    <SkeletonBox width="100%" height={14} />
    <SkeletonBox width="60%" height={14} />
  </View>
);

const styles = StyleSheet.create({
  card: { padding: Spacing.md, marginBottom: Spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm, gap: Spacing.sm },
});
