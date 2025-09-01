import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import PrimaryButton from '../components/PrimaryButton';
import { authService } from '../lib/auth';

export default function LoginScreen({ navigation, onLogin, onSignup }: any) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await authService.signIn(email.trim(), password);
      onLogin && onLogin();
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await authService.signInWithGoogle();
      onLogin && onLogin();
    } catch (error: any) {
      Alert.alert('Google Sign-In Failed', error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 20}
      > 
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: theme.colors.primary }]}>CurryCal</Text>
          <Text style={[styles.h1, { color: theme.colors.text }]}>Welcome back</Text>
          <Text style={[styles.sub, { color: theme.colors.muted }]}>Login to continue — tailored for South Asian meals</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}> 
          <TextInput 
            placeholder="Email" 
            placeholderTextColor={theme.colors.muted} 
            value={email} 
            onChangeText={setEmail} 
            style={[styles.input, { color: theme.colors.text, borderBottomColor: theme.colors.muted }]} 
            keyboardType="email-address" 
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
          <TextInput 
            placeholder="Password" 
            placeholderTextColor={theme.colors.muted} 
            value={password} 
            onChangeText={setPassword} 
            style={[styles.input, { color: theme.colors.text, borderBottomColor: theme.colors.muted }]} 
            secureTextEntry 
            autoCapitalize="none"
            editable={!loading}
          />

          <PrimaryButton 
            onPress={handleEmailLogin} 
            style={{ marginTop: 16 }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              'Login'
            )}
          </PrimaryButton>

          <Text style={[styles.or, { color: theme.colors.muted }]}>or continue with</Text>
          <View style={styles.row}> 
            <TouchableOpacity 
              style={[styles.social, { backgroundColor: '#fff', borderWidth: 1, borderColor: theme.colors.muted }]}
              onPress={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <ActivityIndicator color="#4285F4" size="small" />
              ) : (
                <Text style={styles.googleText}>G</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.social, { backgroundColor: '#000', opacity: 0.5 }]}
              disabled={true}
            > 
              <Text style={{ color: '#fff' }}>🍎</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={{ marginTop: 16 }} 
            onPress={() => navigation.navigate('SignUp')}
            disabled={loading}
          > 
            <Text style={{ color: theme.colors.primary, textAlign: 'center', fontSize: 16 }}>
              Create an account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  inner: { 
    paddingHorizontal: 24, 
    paddingVertical: 20, 
    flex: 1, 
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%'
  },
  header: {
    alignItems: 'center',
    marginBottom: 32
  },
  logo: { 
    fontSize: 36, 
    fontWeight: '800', 
    textAlign: 'center', 
    marginBottom: 8 
  },
  h1: { 
    fontSize: 24, 
    fontWeight: '700', 
    textAlign: 'center',
    marginBottom: 8
  },
  sub: { 
    fontSize: 16, 
    textAlign: 'center', 
    lineHeight: 22,
    paddingHorizontal: 20
  },
  card: { 
    padding: 24, 
    borderRadius: 20, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: { 
    borderBottomWidth: 1, 
    paddingVertical: 16, 
    marginBottom: 16,
    fontSize: 18
  },
  or: { 
    textAlign: 'center', 
    marginTop: 24,
    marginBottom: 16,
    fontSize: 14
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 16, 
    marginBottom: 8 
  },
  social: { 
    width: 68, 
    height: 56, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#4285F4' 
  },
});