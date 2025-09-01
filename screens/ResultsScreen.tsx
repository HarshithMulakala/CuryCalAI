import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import Header from '../components/Header';
import FoodItemCard from '../components/FoodItemCard';
import PrimaryButton from '../components/PrimaryButton';
import { addMeal } from '../lib/history';

export default function ResultsScreen({ navigation, route }: any) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const meal = route.params?.meal;
  const [saving, setSaving] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customText, setCustomText] = useState('');

  function createSwap(mode: string) {
    // Mocked swap: tweak items and calories
    const swapped = {
      ...meal,
      id: `swap-${Date.now()}`,
      name: `${meal.name} (${mode})`,
      items: meal.items.map((it: any) => ({ ...it, calories: Math.max(40, Math.round(it.calories * (mode === 'Protein' ? 0.95 : mode === 'Carb' ? 0.8 : 0.9))) })),
      totalCalories: Math.max(1, Math.round(meal.totalCalories * (mode === 'Protein' ? 0.95 : mode === 'Carb' ? 0.82 : 0.9))),
    };
    navigation.push('Results', { meal: swapped, swapped: true, swapLabel: mode === 'Protein' ? 'Swap for Protein' : mode === 'Carb' ? 'Lower Carbs' : 'Healthy Swap' });
  }

  function saveToHistory() {
    setSaving(true);
    addMeal({
      ...meal,
      id: `saved-${Date.now()}`,
    });
    setTimeout(() => {
      setSaving(false);
      navigation.navigate('History');
    }, 600);
  }

  function generateCustomSwap() {
    setCustomModalOpen(false);
    const swapped = { ...meal, id: `swap-${Date.now()}`, name: `${meal.name} (Custom)`, totalCalories: Math.round(meal.totalCalories * 0.92) };
    navigation.push('Results', { meal: swapped, swapped: true, swapLabel: 'Custom Swap', customText });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}> 
      <Header title={route.params?.swapped ? `${route.params?.swapLabel}` : 'Scan Results'} subtitle={`${meal.name} • ${meal.totalCalories} kcal`} onBack={() => navigation.goBack()} />

      <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ padding: 16 }}>
        {meal.items.map((it: any) => (
          <FoodItemCard key={it.id} item={it} />
        ))}

        <View style={[styles.totals, { backgroundColor: theme.colors.surface }]}> 
          <Text style={[styles.totalText, { color: theme.colors.text }]}>Total: {meal.totalCalories} kcal</Text>
          <Text style={{ color: theme.colors.muted }}>{meal.totalMacros?.protein || 0}g P • {meal.totalMacros?.carbs || 0}g C</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.action, { backgroundColor: theme.colors.surface }]} onPress={() => createSwap('Health')}>
            <Text style={{ color: theme.colors.text }}>Make Healthier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.action, { backgroundColor: theme.colors.surface }]} onPress={() => createSwap('Protein')}>
            <Text style={{ color: theme.colors.text }}>Swap for Protein</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.action, { backgroundColor: theme.colors.surface }]} onPress={() => createSwap('Carb')}>
            <Text style={{ color: theme.colors.text }}>Lower Carbs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.action, { backgroundColor: theme.colors.surface }]} onPress={() => setCustomModalOpen(true)}>
            <Text style={{ color: theme.colors.text }}>Custom</Text>
          </TouchableOpacity>
        </View>

        <PrimaryButton onPress={saveToHistory} style={{ marginTop: 16 }}>{saving ? 'Saving…' : 'Save to History'}</PrimaryButton>
      </ScrollView>

      <Modal visible={customModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}> 
            <Text style={{ fontWeight: '800', fontSize: 18, color: theme.colors.text }}>Describe your swap</Text>
            <TextInput placeholder="E.g. more protein, replace rice with millet" placeholderTextColor={theme.colors.muted} value={customText} onChangeText={setCustomText} style={{ marginTop: 12, borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 6, color: theme.colors.text }} />

            <View style={{ flexDirection: 'row', marginTop: 18 }}>
              <TouchableOpacity onPress={() => setCustomModalOpen(false)} style={{ padding: 12, marginRight: 12 }}>
                <Text style={{ color: theme.colors.muted }}>Cancel</Text>
              </TouchableOpacity>
              <PrimaryButton onPress={generateCustomSwap} style={{ flex: 1 }}>Generate Swap</PrimaryButton>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  totals: { padding: 12, borderRadius: 12, marginTop: 12 },
  totalText: { fontSize: 18, fontWeight: '800' },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 8 },
  action: { padding: 12, borderRadius: 10, minWidth: '48%', alignItems: 'center', marginVertical: 6 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  modal: { padding: 18, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
});