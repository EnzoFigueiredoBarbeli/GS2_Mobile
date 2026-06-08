import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Linking, StatusBar, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../theme';

export const SettingsScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );

  const SettingRow = ({
    label, subtitle, right, onPress, last,
  }: { label: string; subtitle?: string; right?: React.ReactNode; onPress?: () => void; last?: boolean }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
        {subtitle && <Text style={[styles.rowSub, { color: colors.textMuted }]}>{subtitle}</Text>}
      </View>
      {right}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.text }]}>⚙️ Configurações</Text>

        <Section title="APARÊNCIA">
          <SettingRow
            label="Modo Escuro"
            subtitle={isDark ? 'Ativado' : 'Desativado'}
            last
            right={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#ffffff"
              />
            }
          />
        </Section>

        <Section title="DADOS">
          <SettingRow
            label="Clima Terrestre"
            subtitle="OpenWeatherMap API"
          />
          <SettingRow
            label="Eventos Espaciais"
            subtitle="NASA DONKI API"
            last
          />
        </Section>

        <Section title="LINKS ÚTEIS">
          <SettingRow
            label="NASA Space Weather"
            subtitle="Monitoramento oficial da NASA"
            onPress={() => Linking.openURL('https://www.nasa.gov/topics/earth/features/sun_activity.html')}
          />
          <SettingRow
            label="NOAA Space Weather"
            subtitle="Centro de previsão espacial"
            onPress={() => Linking.openURL('https://www.swpc.noaa.gov/')}
          />
          <SettingRow
            label="NASA DONKI"
            subtitle="Banco de dados de eventos solares"
            last
            onPress={() => Linking.openURL('https://kauai.ccmc.gsfc.nasa.gov/DONKI/')}
          />
        </Section>

        <Section title="SOBRE">
          <SettingRow label="Versão" subtitle="1.0.0" />
          <SettingRow label="Desenvolvido por" subtitle="FIAP — Global Solution 2026" />
          <SettingRow
            label="Tema"
            subtitle="Nova Economia Espacial"
            last
          />
        </Section>

        <View style={[styles.credCard, { backgroundColor: colors.primary + '22', borderColor: colors.primary }]}>
          <Text style={[styles.credTitle, { color: colors.primary }]}>🛸 SpaceWeather</Text>
          <Text style={[styles.credText, { color: colors.textSecondary }]}>
            Monitoramento de clima terrestre integrado com dados de eventos espaciais da NASA.
            Tecnologia espacial aplicada ao cotidiano.
          </Text>
          <Text style={[styles.credOds, { color: colors.textMuted }]}>
            ODS 9 · ODS 11 · ODS 13
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  title: { fontSize: FontSize.xxl, fontWeight: '800', marginBottom: Spacing.lg },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 1, marginBottom: Spacing.xs },
  sectionCard: { borderRadius: BorderRadius.lg, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md },
  rowLabel: { fontSize: FontSize.md, fontWeight: '500' },
  rowSub: { fontSize: FontSize.xs, marginTop: 2 },
  credCard: { borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md, marginTop: Spacing.md },
  credTitle: { fontSize: FontSize.lg, fontWeight: '800', marginBottom: Spacing.xs },
  credText: { fontSize: FontSize.sm, lineHeight: 20, marginBottom: Spacing.sm },
  credOds: { fontSize: FontSize.xs, fontWeight: '600', letterSpacing: 1 },
});
