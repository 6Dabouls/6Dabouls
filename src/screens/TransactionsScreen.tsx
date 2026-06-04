import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useCard } from '../context/CardContext';
import { TransactionItem } from '../components/TransactionItem';
import { Transaction } from '../types';

type FilterType = 'tous' | 'debits' | 'credits';

export function TransactionsScreen() {
  const { transactions } = useCard();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('tous');

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch =
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        (tx.marchand?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesFilter =
        filter === 'tous' ||
        (filter === 'debits' && tx.type === 'debit') ||
        (filter === 'credits' && tx.type === 'credit');
      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, filter]);

  const totalDepenses = useMemo(
    () => transactions.filter(tx => tx.type === 'debit').reduce((sum, tx) => sum + Math.abs(tx.montant), 0),
    [transactions]
  );

  const totalRecharges = useMemo(
    () => transactions.filter(tx => tx.type === 'credit').reduce((sum, tx) => sum + tx.montant, 0),
    [transactions]
  );

  const filterTabs: Array<{ key: FilterType; label: string }> = [
    { key: 'tous', label: 'Tous' },
    { key: 'debits', label: 'Débits' },
    { key: 'credits', label: 'Crédits' },
  ];

  const renderItem = ({ item, index }: { item: Transaction; index: number }) => (
    <View>
      {index > 0 && <View style={styles.divider} />}
      <TransactionItem transaction={item} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Ionicons name="arrow-up-circle-outline" size={20} color={Colors.error} />
          <Text style={styles.summaryLabel}>Dépenses</Text>
          <Text style={[styles.summaryAmount, { color: Colors.error }]}>
            -{totalDepenses.toFixed(2)} €
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryCard}>
          <Ionicons name="arrow-down-circle-outline" size={20} color={Colors.success} />
          <Text style={styles.summaryLabel}>Recharges</Text>
          <Text style={[styles.summaryAmount, { color: Colors.success }]}>
            +{totalRecharges.toFixed(2)} €
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={Colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher une transaction..."
          placeholderTextColor={Colors.gray}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabs}>
        {filterTabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, filter === tab.key && styles.tabActive]}
            onPress={() => setFilter(tab.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, filter === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transactions List */}
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color={Colors.lightGray} />
            <Text style={styles.emptyText}>Aucune transaction trouvée</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 24, fontWeight: '800', color: Colors.primary },
  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
  },
  summaryCard: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: '#F0F0F0', marginVertical: 4 },
  summaryLabel: { fontSize: 11, color: Colors.gray, marginTop: 4, marginBottom: 4 },
  summaryAmount: { fontSize: 15, fontWeight: '700' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.primary },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 12,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#E94560' },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.gray },
  tabTextActive: { color: Colors.white },
  list: { flex: 1 },
  listContent: {
    marginHorizontal: 24,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    paddingBottom: 24,
  },
  divider: { height: 1, backgroundColor: '#F5F5F5', marginHorizontal: 16 },
  emptyContainer: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { fontSize: 14, color: Colors.gray, marginTop: 12 },
});
