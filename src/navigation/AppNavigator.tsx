import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

// Import all screens
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CardScreen } from '../screens/CardScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { RechargeScreen } from '../screens/RechargeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { KYCScreen } from '../screens/KYCScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs({ navigation }: any) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#E94560',
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, string> = {
            Accueil: focused ? 'home' : 'home-outline',
            'Ma Carte': focused ? 'card' : 'card-outline',
            Transactions: focused ? 'list' : 'list-outline',
            Profil: focused ? 'person' : 'person-outline',
          };
          return (
            <Ionicons
              name={(icons[route.name] || 'ellipse-outline') as any}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Accueil">
        {() => (
          <HomeScreen
            onNavigateToRecharge={() => navigation.navigate('Recharge')}
            onNavigateToTransactions={() => navigation.navigate('Transactions')}
            onNavigateToCard={() => navigation.navigate('Carte')}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Ma Carte">
        {() => (
          <CardScreen onNavigateToRecharge={() => navigation.navigate('Recharge')} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Profil">
        {() => (
          <ProfileScreen onNavigateToKYC={() => navigation.navigate('KYC')} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onFinish={() => setShowOnboarding(false)} />;
  }

  if (!isAuthenticated) {
    if (authScreen === 'register') {
      return (
        <RegisterScreen
          onNavigateToLogin={() => setAuthScreen('login')}
          onBack={() => setAuthScreen('login')}
        />
      );
    }
    return (
      <LoginScreen
        onNavigateToRegister={() => setAuthScreen('register')}
        onBack={() => setShowOnboarding(true)}
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Recharge" component={RechargeScreen} />
        <Stack.Screen name="Carte">
          {() => <CardScreen onNavigateToRecharge={() => {}} />}
        </Stack.Screen>
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
        <Stack.Screen name="KYC" component={KYCScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
