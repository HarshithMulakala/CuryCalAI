import React, { useMemo, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { Toaster } from 'sonner-native';

// Screens
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import ResultsScreen from './screens/ResultsScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';

// Theme hook
import { ThemeProvider } from './hooks/useTheme';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const systemColorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [completedOnboarding, setCompletedOnboarding] = useState(false);

  // Provide a simple context for theme and auth flows via ThemeProvider
  return (
    <SafeAreaProvider style={styles.container}>
      {/* <Toaster /> */}
      <ThemeProvider initialScheme={systemColorScheme === 'dark' ? 'dark' : 'light'}>
        <NavigationContainer theme={systemColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
              // Auth flow
              <>
                <RootStack.Screen name="Login">
                  {props => <LoginScreen {...props} onLogin={() => setIsAuthenticated(true)} onSignup={() => setIsAuthenticated(true)} />}
                </RootStack.Screen>
                <RootStack.Screen name="SignUp">
                  {props => <SignUpScreen {...props} onSignup={() => setIsAuthenticated(true)} />}
                </RootStack.Screen>
              </>
            ) : !completedOnboarding ? (
              // Onboarding flow after auth
              <RootStack.Screen name="Onboarding">
                {props => <OnboardingScreen {...props} onComplete={() => setCompletedOnboarding(true)} />}
              </RootStack.Screen>
            ) : (
              // Main app
              <>
                <RootStack.Screen name="Main" component={MainTabs} />
                <RootStack.Screen name="Results" component={ResultsScreen} />
              </>
            )}
          </RootStack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});