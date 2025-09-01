import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FoodItem } from '../types';
import { useTheme } from '../hooks/useTheme';

export default function FoodItemCard({ item }: { item: FoodItem }) {
  const theme = useTheme();
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
          <Text style={[styles.macro, { color: theme.colors.muted }]}>{item.calories} kcal</Text>
          <Text style={[styles.macro, { color: theme.colors.muted }]}>{item.macros.protein}g P</Text>
          <Text style={[styles.macro, { color: theme.colors.muted }]}>{item.macros.carbs}g C</Text>
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

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  left: { marginRight: 12 },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700' },
  qty: { fontSize: 12, marginTop: 3 },
  macrosRow: { flexDirection: 'row', marginTop: 8, gap: 12 },
  macro: { marginRight: 12, fontSize: 12 },
});