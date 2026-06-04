import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useCard } from '../context/CardContext';
import { CustomButton } from '../components/CustomButton';

const quickAmounts = [20, 50, 100, 200];

const paymentMethods = [
  { id: 'card', label: 'Carte bancaire', icon: 'card-outline', description: 'Visa, Mastercard' },
  { id: 'transfer', label: 'Virement bancaire', icon: 'swap-horizontal-outline', description: 'SEPA instantané' },
  { id: 'paypal', label: 'PayPal', icon: 'logo-paypal', description: 'Via votre compte PayPal' },
];

export function RechargeScreen() {
  const { carte, recharger } = useCard();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newBalance, setNewBalance] = useState<number | null>(null);

  const getMontant = (): number => {
    if (selectedAmount !== null) return selectedAmount;
    const parsed = parseFloat(customAmount);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleRecharge = async () => {
    const montant = getMontant();
    if (montant <= 0) {
      Alert.alert('Montant invalide', 'Veuillez saisir un montant valide supérieur à 0 €.');
      return;
    }
    if (montant > 1000) {
      Alert.alert('Montant trop élevé', 'Le montant maximum par recharge est de 1 000 €.');
      return;
    }
    setIsLoading(true);
    await recharger(montant);
    setIsLoading(false);
    setNewBalance(carte.solde + montant);
    setSuccess(true);
  };

  const handleReset = () => {
    setSuccess(false);
    setSelectedAmount(null);
    setCustomAmount('');
    setSelectedMethod('card');
    setNewBalance(null);
  };

  if (success) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>Recharge réussie !</Text>
          <Text style={styles.successSubtitle}>
            Votre carte a été rechargée avec succès.
          </Text>
          {newBalance !== null && (
            <View style={styles.newBalanceBox}>
              <Text style={styles.newBalanceLabel}>Nouveau solde</Text>
              <Text style={styles.newBalanceValue}>{newBalance.toFixed(2)} €</Text>
            </View>
          )}
          <CustomButton
            title="Retour"
            onPress={handleReset}
            style={styles.successBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Recharger</Text>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Solde actuel</Text>
              <Text style={styles.balanceValue}>{carte.solde.toFixed(2)} €</Text>
            </View>
          </View>

          {/* Quick Amounts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Montant rapide</Text>
            <View style={styles.quickAmounts}>
              {quickAmounts.map(amount => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.amountBtn,
                    selectedAmount === amount && styles.amountBtnActive,
                  ]}
                  onPress={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.amountBtnText,
                      selectedAmount === amount && styles.amountBtnTextActive,
                    ]}
                  >
                    {amount} €
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Custom Amount */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Montant personnalisé</Text>
            <View style={styles.customAmountContainer}>
              <Text style={styles.currencySymbol}>€</Text>
              <TextInput
                style={styles.customAmountInput}
                value={customAmount}
                onChangeText={text => {
                  setCustomAmount(text);
                  setSelectedAmount(null);
                }}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={Colors.gray}
              />
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Moyen de paiement</Text>
            <View style={styles.methodsList}>
              {paymentMethods.map((method, index) => (
                <View key={method.id}>
                  {index > 0 && <View style={styles.methodDivider} />}
                  <TouchableOpacity
                    style={styles.methodItem}
                    onPress={() => setSelectedMethod(method.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.methodIconContainer}>
                      <Ionicons name={method.icon as any} size={22} color={Colors.accent} />
                    </View>
                    <View style={styles.methodInfo}>
                      <Text style={styles.methodLabel}>{method.label}</Text>
                      <Text style={styles.methodDescription}>{method.description}</Text>
                    </View>
                    <View
                      style={[
                        styles.radioBtn,
                        selectedMethod === method.id && styles.radioBtnActive,
                      ]}
                    >
                      {selectedMethod === method.id && (
                        <View style={styles.radioDot} />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Summary */}
          {getMontant() > 0 && (
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Montant</Text>
                <Text style={styles.summaryValue}>{getMontant().toFixed(2)} €</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Frais</Text>
                <Text style={[styles.summaryValue, { color: Colors.success }]}>Gratuit</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.totalLabel}>Total débité</Text>
                <Text style={styles.totalValue}>{getMontant().toFixed(2)} €</Text>
              </View>
            </View>
          )}

          {/* Recharge Button */}
          <CustomButton
            title={`Recharger ${getMontant() > 0 ? getMontant().toFixed(2) + ' €' : ''}`}
            onPress={handleRecharge}
            loading={isLoading}
            disabled={getMontant() <= 0}
            style={styles.rechargeBtn}
          />

          <Text style={styles.disclaimer}>
            Toutes les transactions sont sécurisées et chiffrées. Aucun frais caché.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24, paddingBottom: 40 },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 8 },
  balanceInfo: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: { fontSize: 13, color: Colors.gray },
  balanceValue: { fontSize: 20, fontWeight: '700', color: Colors.primary },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginBottom: 12 },
  quickAmounts: { flexDirection: 'row', justifyContent: 'space-between' },
  amountBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  amountBtnActive: { borderColor: '#E94560', backgroundColor: '#FFF0F3' },
  amountBtnText: { fontSize: 15, fontWeight: '700', color: Colors.darkGray },
  amountBtnTextActive: { color: '#E94560' },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  currencySymbol: { fontSize: 24, fontWeight: '700', color: Colors.primary, marginRight: 8 },
  customAmountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    paddingVertical: 14,
  },
  methodsList: { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden' },
  methodDivider: { height: 1, backgroundColor: '#F5F5F5', marginHorizontal: 16 },
  methodItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  methodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodInfo: { flex: 1 },
  methodLabel: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  methodDescription: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  radioBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioBtnActive: { borderColor: '#E94560' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E94560' },
  summaryBox: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 13, color: Colors.gray },
  summaryValue: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  totalValue: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  rechargeBtn: { marginBottom: 12 },
  disclaimer: { fontSize: 11, color: Colors.gray, textAlign: 'center', lineHeight: 16 },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successIcon: { marginBottom: 24 },
  successTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  newBalanceBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  newBalanceLabel: { fontSize: 12, color: Colors.success, marginBottom: 4 },
  newBalanceValue: { fontSize: 32, fontWeight: '800', color: Colors.success },
  successBtn: { width: '100%' },
});
