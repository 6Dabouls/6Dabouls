import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { useCard } from '../context/CardContext';
import { VisaCard } from '../components/VisaCard';
import { TransactionItem } from '../components/TransactionItem';

interface Props {
  onNavigateToRecharge: () => void;
  onNavigateToTransactions: () => void;
  onNavigateToCard: () => void;
}

const quickActions = [
  { icon: 'add-circle', label: 'Recharger', color: '#4CAF50', action: 'recharge' },
  { icon: 'phone-portrait', label: 'Payer', color: '#2196F3', action: 'pay' },
  { icon: 'paper-plane', label: 'Envoyer', color: '#9C27B0', action: 'send' },
  { icon: 'lock-closed', label: 'Bloquer', color: '#FF5722', action: 'block' },
];

export function HomeScreen({ onNavigateToRecharge, onNavigateToTransactions, onNavigateToCard }: Props) {
  const { user } = useAuth();
  const { carte, transactions, soldeVisible, toggleSoldeVisibility } = useCard();

  const handleQuickAction = (action: string) => {
    if (action === 'recharge') onNavigateToRecharge();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour, {user?.prenom} 👋</Text>
            <Text style={styles.subGreeting}>Bienvenue sur 6Dabouls</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.prenom?.[0]}{user?.nom?.[0]}</Text>
          </View>
        </View>

        {/* Visa Card */}
        <TouchableOpacity onPress={onNavigateToCard} activeOpacity={0.95} style={styles.cardWrapper}>
          <VisaCard
            carte={carte}
            soldeVisible={soldeVisible}
            onToggleSolde={toggleSoldeVisibility}
          />
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.action}
              style={styles.actionItem}
              onPress={() => handleQuickAction(action.action)}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions récentes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transactions récentes</Text>
            <TouchableOpacity onPress={onNavigateToTransactions}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.transactionsList}>
            {transactions.slice(0, 4).map((tx, index) => (
              <View key={tx.id}>
                {index > 0 && <View style={styles.divider} />}
                <TransactionItem transaction={tx} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  subGreeting: { fontSize: 13, color: Colors.gray, marginTop: 2 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E94560',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  cardWrapper: { paddingHorizontal: 24, marginBottom: 24 },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 28,
    justifyContent: 'space-between',
  },
  actionItem: { alignItems: 'center' },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: { fontSize: 11, color: Colors.darkGray, fontWeight: '500' },
  section: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  seeAll: { fontSize: 13, color: '#E94560', fontWeight: '600' },
  transactionsList: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 24,
    overflow: 'hidden',
  },
  divider: { height: 1, backgroundColor: '#F5F5F5', marginHorizontal: 16 },
});
