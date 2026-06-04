import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types';
import { Colors } from '../constants/colors';

interface Props { transaction: Transaction; }

const categoryConfig: Record<string, { icon: string; color: string; label: string }> = {
  alimentation: { icon: 'fast-food-outline', color: '#FF7043', label: 'Alimentation' },
  transport: { icon: 'bus-outline', color: '#42A5F5', label: 'Transport' },
  divertissement: { icon: 'game-controller-outline', color: '#AB47BC', label: 'Divertissement' },
  sante: { icon: 'medical-outline', color: '#26C6DA', label: 'Sante' },
  shopping: { icon: 'bag-outline', color: '#EC407A', label: 'Shopping' },
  recharge: { icon: 'add-circle-outline', color: '#66BB6A', label: 'Recharge' },
  autre: { icon: 'ellipse-outline', color: Colors.gray, label: 'Autre' },
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export function TransactionItem({ transaction: tx }: Props) {
  const config = categoryConfig[tx.categorie] || categoryConfig.autre;
  const isCredit = tx.type === 'credit';
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
        <Ionicons name={config.icon as any} size={22} color={config.color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.description} numberOfLines={1}>{tx.description}</Text>
        <Text style={styles.meta}>{tx.marchand ? `${tx.marchand} · ` : ''}{formatDate(tx.date)}</Text>
      </View>
      <Text style={[styles.montant, { color: isCredit ? Colors.success : Colors.error }]}>
        {isCredit ? '+' : ''}{tx.montant.toFixed(2)} €
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  info: { flex: 1 },
  description: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  meta: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  montant: { fontSize: 15, fontWeight: '700' },
});
