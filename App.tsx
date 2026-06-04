import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CardProvider } from './src/context/CardContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CardProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </CardProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
