import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import PrimaryButton from '../components/PrimaryButton';

export default function OnboardingScreen({ navigation, onComplete }: any) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);

  // Step 1
  const goals = [
    { key: 'weight_loss', label: 'Lose weight' },
    { key: 'build_muscle', label: 'Build muscle' },
    { key: 'manage_diabetes', label: 'Manage diabetes' },
    { key: 'general_health', label: 'General health' },
  ];
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Step 2
  const preferences = ['Veg', 'Non-veg', 'Eggetarian', 'Vegan'];
  const [preference, setPreference] = useState<string | null>(null);
  const [mealsPerDay, setMealsPerDay] = useState<number | null>(3);

  // Step 3
  const concerns = ['Low oil', 'More protein', 'Low carb', 'Low sodium', 'No dairy', 'Gluten-free'];
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

  function toggleSelection(key: string, cur: string[], set: (v: string[]) => void) {
    if (cur.includes(key)) set(cur.filter(k => k !== key));
    else set([key, ...cur]);
  }

  function renderStep() {
    if (step === 1) {
      return (
        <View>
          <Text style={[styles.question, { color: theme.colors.text }]}>What are your goals?</Text>
          <Text style={[styles.help, { color: theme.colors.muted }]}>Select all that apply — tailored for Indian diets</Text>
          <View style={styles.grid}>
            {goals.map(g => {
              const active = selectedGoals.includes(g.key);
              return (
                <TouchableOpacity key={g.key} onPress={() => toggleSelection(g.key, selectedGoals, setSelectedGoals)} style={[styles.option, { backgroundColor: active ? theme.colors.primary : theme.colors.surface }]}> 
                  <Text style={{ color: active ? '#fff' : theme.colors.text, fontWeight: '700' }}>{g.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    }

    if (step === 2) {
      return (
        <View>
          <Text style={[styles.question, { color: theme.colors.text }]}>Food habits</Text>
          <Text style={[styles.help, { color: theme.colors.muted }]}>Pick one that matches how you usually eat</Text>
          <View style={styles.gridSingle}>
            {preferences.map(p => (
              <TouchableOpacity key={p} onPress={() => setPreference(p)} style={[styles.optionSingle, { borderColor: preference === p ? theme.colors.primary : 'transparent', backgroundColor: theme.colors.surface }]}> 
                <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.question, { marginTop: 18, color: theme.colors.text }]}>How many meals do you typically eat per day?</Text>
          <View style={styles.rowOptions}>
            {[2, 3, 4].map(n => (
              <TouchableOpacity key={n} onPress={() => setMealsPerDay(n)} style={[styles.pill, { backgroundColor: mealsPerDay === n ? theme.colors.primary : theme.colors.surface }]}> 
                <Text style={{ color: mealsPerDay === n ? '#fff' : theme.colors.text, fontWeight: '700' }}>{n}{n===4?'+':''}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    return (
      <View>
        <Text style={[styles.question, { color: theme.colors.text }]}>Any special concerns?</Text>
        <Text style={[styles.help, { color: theme.colors.muted }]}>Choose what we should prioritize</Text>
        <View style={styles.grid}>
          {concerns.map(c => {
            const active = selectedConcerns.includes(c);
            return (
              <TouchableOpacity key={c} onPress={() => toggleSelection(c, selectedConcerns, setSelectedConcerns)} style={[styles.option, { backgroundColor: active ? theme.colors.primary : theme.colors.surface }]}> 
                <Text style={{ color: active ? '#fff' : theme.colors.text, fontWeight: '700' }}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}> 
      <View style={[styles.headerRow, { paddingTop: 8 }]}> 
        <Text style={{ color: theme.colors.muted }}>Step {step} of 3</Text>
        <TouchableOpacity onPress={() => onComplete && onComplete()}>
          <Text style={{ color: theme.colors.primary }}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 20, paddingBottom: 24 }}>
        {renderStep()}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(16, insets.bottom + 8) }]}>
        {step > 1 ? (
          <TouchableOpacity onPress={() => setStep(s => s - 1)} style={[styles.footerBtn, { marginRight: 12 }]}>
            <Text style={{ color: theme.colors.text }}>Back</Text>
          </TouchableOpacity>
        ) : null}

        {step < 3 ? (
          <PrimaryButton onPress={() => setStep(s => s + 1)} style={{ flex: 1 }}>{'Next'}</PrimaryButton>
        ) : (
          <PrimaryButton onPress={() => onComplete && onComplete()} style={{ flex: 1 }}>{'Finish'}</PrimaryButton>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  question: { fontSize: 22, fontWeight: '800', marginBottom: 6 },
  help: { fontSize: 14, marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  option: { padding: 18, borderRadius: 14, minWidth: '48%', marginVertical: 6 },
  gridSingle: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  optionSingle: { padding: 18, borderRadius: 14, minWidth: '48%', marginVertical: 6, borderWidth: 1 },
  rowOptions: { flexDirection: 'row', marginTop: 14, gap: 14 },
  pill: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, marginRight: 12 },
  footer: { padding: 16, flexDirection: 'row', alignItems: 'center' },
  footerBtn: { padding: 14, borderRadius: 12 },
});