import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function CustomButton({ title, onPress, variant = 'primary', loading, disabled, style }: Props) {
  const isDisabled = disabled || loading;
  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={isDisabled} style={[styles.wrapper, style, isDisabled && styles.disabled]} activeOpacity={0.85}>
        <LinearGradient colors={['#E94560', '#C62A47']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient}>
          {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.primaryText}>{title}</Text>}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  if (variant === 'secondary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={isDisabled} style={[styles.secondary, style, isDisabled && styles.disabled]} activeOpacity={0.85}>
        {loading ? <ActivityIndicator color={Colors.primary} /> : <Text style={styles.secondaryText}>{title}</Text>}
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} disabled={isDisabled} style={[styles.ghost, style]} activeOpacity={0.7}>
      <Text style={styles.ghostText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderRadius: 12, overflow: 'hidden' },
  gradient: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  secondary: { borderRadius: 12, borderWidth: 2, borderColor: Colors.primary, paddingVertical: 14, alignItems: 'center' },
  secondaryText: { color: Colors.primary, fontSize: 16, fontWeight: '600' },
  ghost: { paddingVertical: 12, alignItems: 'center' },
  ghostText: { color: Colors.gray, fontSize: 14 },
  disabled: { opacity: 0.5 },
});
