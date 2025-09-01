import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import PrimaryButton from '../components/PrimaryButton';

export default function SignUpScreen({ navigation, onSignup }: any) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.inner}>
        <Text style={[styles.logo, { color: theme.colors.primary }]}>Swaasth</Text>
        <Text style={[styles.h1, { color: theme.colors.text }]}>Create your account</Text>
        <Text style={[styles.sub, { color: theme.colors.muted }]}>Sign up to personalize your Indian meal recommendations</Text>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}> 
          <TextInput placeholder="Full name" placeholderTextColor={theme.colors.muted} value={name} onChangeText={setName} style={[styles.input, { color: theme.colors.text }]} />
          <TextInput placeholder="Email" placeholderTextColor={theme.colors.muted} value={email} onChangeText={setEmail} style={[styles.input, { color: theme.colors.text }]} keyboardType="email-address" />
          <TextInput placeholder="Password" placeholderTextColor={theme.colors.muted} value={password} onChangeText={setPassword} style={[styles.input, { color: theme.colors.text }]} secureTextEntry />

          <PrimaryButton onPress={() => onSignup && onSignup()} style={{ marginTop: 10 }}>Create account</PrimaryButton>

          <TouchableOpacity style={{ marginTop: 12 }} onPress={() => navigation.navigate('Login')}> 
            <Text style={{ color: theme.colors.primary, textAlign: 'center' }}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: 20, flex: 1, justifyContent: 'center' },
  logo: { fontSize: 32, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  h1: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  sub: { fontSize: 14, textAlign: 'center', marginBottom: 18 },
  card: { padding: 16, borderRadius: 16, marginTop: 18 },
  input: { borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 10, marginBottom: 12 },
});