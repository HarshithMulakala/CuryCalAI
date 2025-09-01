import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { getMeals } from '../lib/history';

export default function HistoryScreen({ navigation }: any) {
  const theme = useTheme();
  const [meals, setMeals] = useState<any[]>([]);

  useEffect(() => {
    setMeals(getMeals());
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 16 }}>
      <Text style={[styles.title, { color: theme.colors.text }]}>History</Text>
      {meals.length === 0 ? (
        <Text style={{ color: theme.colors.muted, marginTop: 12 }}>No saved meals yet. Scan a meal to get started.</Text>
      ) : (
        meals.map(m => (
          <TouchableOpacity key={m.id} style={[styles.card, { backgroundColor: theme.colors.surface }]} onPress={() => navigation.navigate('Results', { meal: m })}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{m.name || 'Meal'}</Text>
              <Text style={{ color: theme.colors.muted }}>{new Date(m.timestamp).toLocaleString()}</Text>
            </View>
            <Text style={{ color: theme.colors.muted, fontWeight: '700' }}>{m.totalCalories} kcal</Text>
          </TouchableOpacity>
        ))
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, fontWeight: '800' },
  card: { padding: 12, borderRadius: 12, marginTop: 12, flexDirection: 'row', alignItems: 'center' },
});