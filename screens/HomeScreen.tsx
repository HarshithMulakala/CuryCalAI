import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import PrimaryButton from '../components/PrimaryButton';
import FoodItemCard from '../components/FoodItemCard';

export default function HomeScreen({ navigation }: any) {
  const theme = useTheme();

  const sampleMeal = {
    id: 'm-1',
    name: 'Lunch Thali',
    items: [
      { id: '1', name: '2 Rotis', quantity: '2 rotis', calories: 200, macros: { carbs: 28, protein: 6, fat: 4 } },
      { id: '2', name: 'Dal Tadka', quantity: '1 cup', calories: 180, macros: { carbs: 20, protein: 10, fat: 6 } },
      { id: '3', name: 'Jeera Rice', quantity: '1 cup', calories: 220, macros: { carbs: 45, protein: 4, fat: 3 } },
    ],
    totalCalories: 600,
    totalMacros: { carbs: 93, protein: 20, fat: 13 },
    timestamp: Date.now(),
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.headerRow}>
        <Text style={[styles.greeting, { color: theme.colors.text }]}>Hi there 👋</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}> 
          <Text style={{ fontSize: 22 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.hero, { backgroundColor: theme.colors.surface }]}> 
        <Text style={[styles.heroTitle, { color: theme.colors.text }]}>Track Indian meals effortlessly</Text>
        <Text style={[styles.heroSub, { color: theme.colors.muted }]}>Scan thalis, biryanis, chole, dosa — get calories & smart swaps</Text>

        <PrimaryButton onPress={() => navigation.navigate('Scan')} style={{ marginTop: 18, borderRadius: 14 }}>Scan My Meal</PrimaryButton>

        <TouchableOpacity onPress={() => navigation.navigate('History')} style={{ marginTop: 12 }}>
          <Text style={{ color: theme.colors.primary, textAlign: 'center' }}>View History</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 18 }]}>Quick Suggestions</Text>
      <View>
        <FoodItemCard item={sampleMeal.items[0]} />
        <FoodItemCard item={sampleMeal.items[1]} />
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  greeting: { fontSize: 20, fontWeight: '700' },
  hero: { padding: 18, borderRadius: 16 },
  heroTitle: { fontSize: 20, fontWeight: '800' },
  heroSub: { marginTop: 6, fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
});