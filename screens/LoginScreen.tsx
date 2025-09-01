import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import PrimaryButton from '../components/PrimaryButton';

export default function LoginScreen({ navigation, onLogin, onSignup }: any) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.inner}>
        <Text style={[styles.logo, { color: theme.colors.primary }]}>Swaasth</Text>
        <Text style={[styles.h1, { color: theme.colors.text }]}>Welcome back</Text>
        <Text style={[styles.sub, { color: theme.colors.muted }]}>Login to continue — tailored for Indian meals</Text>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}> 
          <TextInput placeholder="Email" placeholderTextColor={theme.colors.muted} value={email} onChangeText={setEmail} style={[styles.input, { color: theme.colors.text }]} keyboardType="email-address" />
          <TextInput placeholder="Password" placeholderTextColor={theme.colors.muted} value={password} onChangeText={setPassword} style={[styles.input, { color: theme.colors.text }]} secureTextEntry />

          <PrimaryButton onPress={() => onLogin && onLogin()} style={{ marginTop: 10 }}>Login</PrimaryButton>

          <Text style={[styles.or, { color: theme.colors.muted }]}>or continue with</Text>
          <View style={styles.row}> 
            <TouchableOpacity style={[styles.social, { backgroundColor: '#fff' }]}>
              <Text>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.social, { backgroundColor: '#000' }]}> 
              <Text style={{ color: '#fff' }}></Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{ marginTop: 12 }} onPress={() => navigation.navigate('SignUp')}> 
            <Text style={{ color: theme.colors.primary, textAlign: 'center' }}>Create an account</Text>
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
  or: { textAlign: 'center', marginTop: 12 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 8 },
  social: { width: 56, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});