import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../theme';

interface Props {
  onSearch: (city: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export const SearchBar: React.FC<Props> = ({ onSearch, loading, placeholder = 'Buscar cidade...' }) => {
  const { colors } = useTheme();
  const [text, setText] = useState('');

  const handleSearch = () => {
    if (text.trim()) {
      onSearch(text.trim());
      setText('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      <TouchableOpacity
        onPress={handleSearch}
        disabled={loading || !text.trim()}
        style={[styles.btn, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.btnText}>{loading ? '...' : '🔍'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  input: { flex: 1, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, fontSize: FontSize.md },
  btn: { paddingHorizontal: Spacing.md, justifyContent: 'center', alignItems: 'center' },
  btnText: { fontSize: 16 },
});
