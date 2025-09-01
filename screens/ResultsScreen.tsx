import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'react-native';
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
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<any | null>(null);

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
      // Navigate to nested tab 'History' inside Main tabs
      navigation.navigate('Main', { screen: 'History' });
    }, 600);
  }

  function generateCustomSwap() {
    setCustomModalOpen(false);
    const swapped = { ...meal, id: `swap-${Date.now()}`, name: `${meal.name} (Custom)`, totalCalories: Math.round(meal.totalCalories * 0.92) };
    navigation.push('Results', { meal: swapped, swapped: true, swapLabel: 'Custom Swap', customText });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}> 
      <Header title={route.params?.swapped ? `${route.params?.swapLabel}` : 'Scan Results'} subtitle={`${meal.name} • ${Math.round(meal.totalCalories)} kcal`} onBack={() => navigation.goBack()} />

      <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ padding: 16 }}>
        {meal.photo ? (
          <View style={{ marginBottom: 12, borderRadius: 14, overflow: 'hidden' }}>
            <Image source={{ uri: meal.photo }} style={{ width: '100%', height: 180 }} resizeMode="cover" />
          </View>
        ) : null}
        <View style={styles.metaRow}> 
          <View style={[styles.metaCard, { backgroundColor: theme.colors.surface }]}> 
            <Text style={[styles.metaLabel, { color: theme.colors.muted }]}>Calories</Text>
            <Text style={[styles.metaValue, { color: theme.colors.text }]}>{Math.round(meal.totalCalories)} cal</Text>
          </View>
          <View style={[styles.metaCard, { backgroundColor: theme.colors.surface }]}> 
            <Text style={[styles.metaLabel, { color: theme.colors.muted }]}>Protein</Text>
            <Text style={[styles.metaValue, { color: theme.colors.text }]}>{round(meal.totalMacros?.protein)} g</Text>
          </View>
          <View style={[styles.metaCard, { backgroundColor: theme.colors.surface }]}> 
            <Text style={[styles.metaLabel, { color: theme.colors.muted }]}>Carbs</Text>
            <Text style={[styles.metaValue, { color: theme.colors.text }]}>{round(meal.totalMacros?.carbs)} g</Text>
          </View>
          <View style={[styles.metaCard, { backgroundColor: theme.colors.surface }]}> 
            <Text style={[styles.metaLabel, { color: theme.colors.muted }]}>Fats</Text>
            <Text style={[styles.metaValue, { color: theme.colors.text }]}>{round(meal.totalMacros?.fat)} g</Text>
          </View>
          {meal.totalMacros?.fiber !== undefined ? (
            <View style={[styles.metaCard, { backgroundColor: theme.colors.surface }]}> 
              <Text style={[styles.metaLabel, { color: theme.colors.muted }]}>Fiber</Text>
              <Text style={[styles.metaValue, { color: theme.colors.text }]}>{round(meal.totalMacros?.fiber || 0)} g</Text>
            </View>
          ) : null}
          {meal.totalMacros?.sodium !== undefined ? (
            <View style={[styles.metaCard, { backgroundColor: theme.colors.surface }]}> 
              <Text style={[styles.metaLabel, { color: theme.colors.muted }]}>Sodium</Text>
              <Text style={[styles.metaValue, { color: theme.colors.text }]}>{round(meal.totalMacros?.sodium || 0)} mg</Text>
            </View>
          ) : null}
        </View>

        <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: '700', marginTop: 8, marginBottom: 4 }}>Ingredients</Text>
        {meal.items.map((it: any) => (
          <FoodItemCard key={it.id} item={it} compact onPress={() => { setActiveItem(it); setItemModalOpen(true); }} />
        ))}

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

      <Modal visible={itemModalOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}> 
            {activeItem ? (
              <>
                <Text style={{ fontWeight: '800', fontSize: 18, color: theme.colors.text }}>{activeItem.name}</Text>
                <Text style={{ color: theme.colors.muted, marginTop: 2 }}>{activeItem.quantity || ''}</Text>
                <View style={{ height: 10 }} />
                <View style={styles.metaRow}> 
                  <View style={[styles.metaCard, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.metaLabel, { color: theme.colors.muted }]}>Calories</Text>
                    <Text style={[styles.metaValue, { color: theme.colors.text }]}>{round(activeItem.calories)} cal</Text>
                  </View>
                  <View style={[styles.metaCard, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.metaLabel, { color: theme.colors.muted }]}>Protein</Text>
                    <Text style={[styles.metaValue, { color: theme.colors.text }]}>{round(activeItem.macros?.protein)} g</Text>
                  </View>
                  <View style={[styles.metaCard, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.metaLabel, { color: theme.colors.muted }]}>Carbs</Text>
                    <Text style={[styles.metaValue, { color: theme.colors.text }]}>{round(activeItem.macros?.carbs)} g</Text>
                  </View>
                  <View style={[styles.metaCard, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.metaLabel, { color: theme.colors.muted }]}>Fats</Text>
                    <Text style={[styles.metaValue, { color: theme.colors.text }]}>{round(activeItem.macros?.fat)} g</Text>
                  </View>
                  {activeItem.macros?.fiber !== undefined ? (
                    <View style={[styles.metaCard, { backgroundColor: theme.colors.card }]}>
                      <Text style={[styles.metaLabel, { color: theme.colors.muted }]}>Fiber</Text>
                      <Text style={[styles.metaValue, { color: theme.colors.text }]}>{round(activeItem.macros?.fiber || 0)} g</Text>
                    </View>
                  ) : null}
                  {activeItem.macros?.sodium !== undefined ? (
                    <View style={[styles.metaCard, { backgroundColor: theme.colors.card }]}>
                      <Text style={[styles.metaLabel, { color: theme.colors.muted }]}>Sodium</Text>
                      <Text style={[styles.metaValue, { color: theme.colors.text }]}>{round(activeItem.macros?.sodium || 0)} mg</Text>
                    </View>
                  ) : null}
                </View>
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <PrimaryButton onPress={() => setItemModalOpen(false)} style={{ flex: 1 }}>Close</PrimaryButton>
                </View>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function round(n: number) {
  return Math.round((n + Number.EPSILON) * 10) / 10;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  metaCard: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, minWidth: '30%' },
  metaLabel: { fontSize: 12 },
  metaValue: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  totals: { padding: 12, borderRadius: 12, marginTop: 12 },
  totalText: { fontSize: 18, fontWeight: '800' },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 8 },
  action: { padding: 12, borderRadius: 10, minWidth: '48%', alignItems: 'center', marginVertical: 6 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  modal: { padding: 18, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
});