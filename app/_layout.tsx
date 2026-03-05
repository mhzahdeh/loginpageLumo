import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack, useNavigationContainerRef } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { isLoggedIn } = useAuth();
  const rootNav = useNavigationContainerRef();
  const [navReady, setNavReady] = useState(false);

  useEffect(() => {
    if (rootNav?.isReady()) {
      setNavReady(true);
    }
    const unsubscribe = rootNav?.addListener('state', () => {
      setNavReady(true);
    });
    return unsubscribe;
  }, [rootNav]);

  useEffect(() => {
    if (!navReady) return;
    if (!isLoggedIn) {
      router.replace('/login');
    } else {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, navReady]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
