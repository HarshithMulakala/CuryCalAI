import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function ProfileScreen() {
  const theme = useTheme();
  const [veg, setVeg] = useState(true);
  const [eggetarian, setEggetarian] = useState(false);
  const [noDairy, setNoDairy] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: theme.colors.text }}>Profile</Text>
        <Text style={{ color: theme.colors.muted, marginTop: 6 }}>Manage dietary preferences</Text>

        <View style={styles.row}>
          <Text style={{ color: theme.colors.text }}>Veg</Text>
          <Switch value={veg} onValueChange={setVeg} thumbColor={theme.colors.primary} />
        </View>
        <View style={styles.row}>
          <Text style={{ color: theme.colors.text }}>Eggetarian</Text>
          <Switch value={eggetarian} onValueChange={setEggetarian} thumbColor={theme.colors.primary} />
        </View>
        <View style={styles.row}>
          <Text style={{ color: theme.colors.text }}>No dairy</Text>
          <Switch value={noDairy} onValueChange={setNoDairy} thumbColor={theme.colors.primary} />
        </View>

        <View style={{ height: 20 }} />
        <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.text }}>Appearance</Text>
        <View style={styles.row}>
          <Text style={{ color: theme.colors.text }}>Dark theme</Text>
          <Switch value={theme.scheme === 'dark'} onValueChange={() => theme.toggle()} thumbColor={theme.colors.primary} />
        </View>

        <View style={{ height: 20 }} />
        <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.text }}>App</Text>
        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface, marginTop: 12 }]}>
          <Text style={{ color: theme.colors.text }}>Send feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface, marginTop: 12 }]}>
          <Text style={{ color: theme.colors.text }}>About Swaasth</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  card: { padding: 12, borderRadius: 12 },
});