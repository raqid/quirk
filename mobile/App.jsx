import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthContext } from './src/context/AuthContext';
import { getToken } from './src/services/storage';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import { registerForPushNotifications, setupNotificationListeners } from './src/utils/notifications';
import { useLoadFonts } from './src/theme/fonts';
import { colors } from './src/theme/colors';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = useRef(null);
  const fontsLoaded = useLoadFonts();

  useEffect(() => {
    getToken().then((token) => {
      setIsAuthenticated(!!token);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      registerForPushNotifications();
      const cleanup = setupNotificationListeners(navigationRef.current);
      return cleanup;
    }
  }, [isAuthenticated]);

  if (isLoading || !fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar style="light" />
        {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
});
