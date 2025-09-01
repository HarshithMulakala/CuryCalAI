import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FoodItem } from '../types';
import { useTheme } from '../hooks/useTheme';

export default function FoodItemCard({ item, compact = false, onPress }: { item: FoodItem; compact?: boolean; onPress?: () => void }) {
  const theme = useTheme();
  if (compact) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.cardCompact, { backgroundColor: theme.colors.card }]}> 
        <View style={styles.left}>
          <View style={[styles.thumbSmall, { backgroundColor: theme.colors.surface }]}> 
            <Text style={{ fontSize: 22 }}>{getEmojiForFood(item.name)}</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.qty, { color: theme.colors.muted }]} numberOfLines={1}>{item.quantity || ''}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', minWidth: 80 }}>
          <Text style={[styles.calCompact, { color: theme.colors.text }]}>{round(item.calories)} cal</Text>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <View style={styles.left}>
        <View style={[styles.thumb, { backgroundColor: theme.colors.surface }]}>
          <Text style={{ fontSize: 28 }}>{getEmojiForFood(item.name)}</Text>
        </View>
      </View>
      <View style={styles.middle}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{item.name}</Text>
        <Text style={[styles.qty, { color: theme.colors.muted }]}>{item.quantity || ''}</Text>
        <View style={styles.macrosRow}>
          <MetricPill label="Cal" value={`${round(item.calories)} kcal`} color={theme.colors.text} bg={theme.colors.surface} />
          <MetricPill label="Protein" value={`${round(item.macros.protein)} g`} color={theme.colors.text} bg={theme.colors.surface} />
          <MetricPill label="Carbs" value={`${round(item.macros.carbs)} g`} color={theme.colors.text} bg={theme.colors.surface} />
          <MetricPill label="Fats" value={`${round(item.macros.fat)} g`} color={theme.colors.text} bg={theme.colors.surface} />
        </View>
        <View style={[styles.macrosRow, { marginTop: 6 }]}>
          {item.macros.fiber !== undefined ? (
            <MetricPill label="Fiber" value={`${round(item.macros.fiber)} g`} color={theme.colors.text} bg={theme.colors.surface} />
          ) : null}
          {item.macros.sodium !== undefined ? (
            <MetricPill label="Sodium" value={`${round(item.macros.sodium)} mg`} color={theme.colors.text} bg={theme.colors.surface} />
          ) : null}
        </View>
      </View>
    </View>
  );
}

function getEmojiForFood(name: string) {
  const n = name.toLowerCase();
  if (n.includes('roti') || n.includes('chapati')) return '🥘';
  if (n.includes('dal') || n.includes('lentil')) return '🥣';
  if (n.includes('rice')) return '🍚';
  if (n.includes('chicken')) return '🍗';
  if (n.includes('paneer')) return '🧀';
  if (n.includes('samosa') || n.includes('fried')) return '🥟';
  return '🍛';
}

function round(n: number) {
  return Math.round((n + Number.EPSILON) * 10) / 10;
}

function MetricPill({ label, value, color, bg }: { label: string; value: string; color: string; bg: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}> 
      <Text style={[styles.pillLabel, { color }]}>{label}</Text>
      <Text style={[styles.pillValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  cardCompact: { flexDirection: 'row', padding: 12, borderRadius: 12, marginTop: 10, alignItems: 'center' },
  left: { marginRight: 12 },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbSmall: { width: 48, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  middle: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700' },
  qty: { fontSize: 12, marginTop: 3 },
  calCompact: { fontSize: 16, fontWeight: '800' },
  macrosRow: { flexDirection: 'row', marginTop: 8, gap: 8, flexWrap: 'wrap' },
  pill: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 },
  pillLabel: { fontSize: 11, opacity: 0.8 },
  pillValue: { fontSize: 13, fontWeight: '700' },
});