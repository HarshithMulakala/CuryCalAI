import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

export default function Header({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.surface, paddingTop: Math.max(12, insets.top) }
    ]}> 
      <View style={styles.row}>
        <TouchableOpacity onPress={onBack} style={styles.left} disabled={!onBack}>
          <Text style={[styles.back, { color: theme.colors.primary }]}>{onBack ? '←' : ''}</Text>
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: theme.colors.muted }]}>{subtitle}</Text> : null}
        </View>
        <View style={styles.right}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 0,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  left: { width: 40 },
  back: { fontSize: 22 },
  center: { flex: 1, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 2 },
  right: { width: 40, alignItems: 'flex-end' },
});