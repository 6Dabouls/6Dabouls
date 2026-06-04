import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props { onFinish: () => void; }

export function SplashScreen({ onFinish }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#1A1A2E', '#16213E', '#0F3460']} style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }], alignItems: 'center' }}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>6D</Text>
        </View>
        <Text style={styles.appName}>6DABOULS</Text>
        <Text style={styles.tagline}>Votre carte Visa prépayée gratuite</Text>
      </Animated.View>
      <Text style={styles.footer}>Sécurisé · Gratuit · Instantané</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#E94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: { color: '#fff', fontSize: 32, fontWeight: '900' },
  appName: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: 4, marginBottom: 8 },
  tagline: { color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center' },
  footer: {
    position: 'absolute',
    bottom: 40,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    letterSpacing: 2,
  },
});
