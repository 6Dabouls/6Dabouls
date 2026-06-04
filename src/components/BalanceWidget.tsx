import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface Props {
  solde: number;
  soldeVisible: boolean;
  onToggle: () => void;
}

export function BalanceWidget({ solde, soldeVisible, onToggle }: Props) {
  return (
    <LinearGradient
      colors={['#1A1A2E', '#0F3460']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Solde disponible</Text>
          <Text style={styles.amount}>
            {soldeVisible ? `${solde.toFixed(2)} €` : '••••• €'}
          </Text>
        </View>
        <TouchableOpacity onPress={onToggle} style={styles.eyeBtn} activeOpacity={0.7}>
          <Ionicons
            name={soldeVisible ? 'eye-outline' : 'eye-off-outline'}
            size={22}
            color="rgba(255,255,255,0.8)"
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  amount: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
  },
  eyeBtn: {
    padding: 8,
  },
});
