import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import PrimaryButton from '../components/PrimaryButton';

export default function ScanScreen({ navigation }: any) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  function startScan() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Generate a sample detected meal
      const meal = {
        id: `meal-${Date.now()}`,
        name: 'Mixed Indian Thali',
        items: [
          { id: 'i1', name: '2 Rotis', quantity: '2 rotis', calories: 200, macros: { carbs: 28, protein: 6, fat: 4 } },
          { id: 'i2', name: 'Paneer Butter Masala', quantity: '1 cup', calories: 320, macros: { carbs: 12, protein: 14, fat: 24 } },
          { id: 'i3', name: 'Jeera Rice', quantity: '1 cup', calories: 220, macros: { carbs: 45, protein: 4, fat: 3 } },
        ],
        totalCalories: 740,
        totalMacros: { carbs: 85, protein: 24, fat: 31 },
        timestamp: Date.now(),
      };
      navigation.navigate('Results', { meal });
    }, 2200);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.cameraPlaceholder, { backgroundColor: theme.colors.surface }]}> 
        <Text style={{ color: theme.colors.muted }}>Camera preview (placeholder)</Text>
      </View>

      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity style={[styles.smallBtn, { backgroundColor: theme.colors.surface }]}> 
            <Text style={{ color: theme.colors.text }}>Upload from gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.smallBtn, { backgroundColor: theme.colors.surface }]}> 
            <Text style={{ color: theme.colors.text }}>Flash</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 24 }}>
          {!loading ? (
            <PrimaryButton onPress={startScan} icon={<Text>📷</Text>}>
              Scan
            </PrimaryButton>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <ActivityIndicator color={theme.colors.primary} size="large" />
              <Text style={{ marginTop: 12, color: theme.colors.muted }}>Analyzing your meal…</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraPlaceholder: { height: 320, margin: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  smallBtn: { padding: 12, borderRadius: 10 },
});