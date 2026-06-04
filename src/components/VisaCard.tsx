import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { CarteVisa } from '../types';

interface Props {
  carte: CarteVisa;
  soldeVisible: boolean;
  onToggleSolde?: () => void;
  showDetails?: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = CARD_WIDTH * 0.585;

export function VisaCard({ carte, soldeVisible, onToggleSolde, showDetails = false }: Props) {
  return (
    <View style={[styles.container, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
      <LinearGradient
        colors={['#1A1A2E', '#16213E', '#0F3460']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Top row */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.bankName}>6DABOULS</Text>
            <View style={styles.prepayeBadge}>
              <Text style={styles.prepayeText}>PREPAYEE GRATUITE</Text>
            </View>
          </View>
          {/* Contactless icon */}
          <View style={styles.contactless}>
            <Ionicons name="wifi" size={24} color="rgba(255,255,255,0.8)" style={{ transform: [{ rotate: '90deg' }] }} />
          </View>
        </View>

        {/* Chip */}
        <View style={styles.chip}>
          <View style={styles.chipInner}>
            <View style={styles.chipLine} />
            <View style={styles.chipLine} />
            <View style={styles.chipLine} />
          </View>
        </View>

        {/* Balance */}
        <TouchableOpacity style={styles.balanceRow} onPress={onToggleSolde} activeOpacity={0.8}>
          <Text style={styles.balanceLabel}>Solde disponible</Text>
          <View style={styles.balanceValueRow}>
            <Text style={styles.balanceValue}>
              {soldeVisible ? `${carte.solde.toFixed(2)} €` : '••••• €'}
            </Text>
            <Ionicons
              name={soldeVisible ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color="rgba(255,255,255,0.7)"
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>

        {/* Card Number */}
        <Text style={styles.cardNumber}>
          {showDetails ? carte.numeroComplet : carte.numeroMasque}
        </Text>

        {/* Bottom row */}
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.label}>TITULAIRE</Text>
            <Text style={styles.value}>{carte.titulaire}</Text>
          </View>
          <View>
            <Text style={styles.label}>EXPIRE</Text>
            <Text style={styles.value}>{carte.dateExpiration}</Text>
          </View>
          {showDetails && (
            <View>
              <Text style={styles.label}>CVV</Text>
              <Text style={styles.value}>{carte.cvv}</Text>
            </View>
          )}
          <Text style={styles.visaLogo}>VISA</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  gradient: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bankName: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 3,
  },
  prepayeBadge: {
    backgroundColor: 'rgba(233, 69, 96, 0.3)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E94560',
  },
  prepayeText: {
    color: '#E94560',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },
  contactless: { marginTop: 4 },
  chip: {
    width: 40,
    height: 30,
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  chipInner: { width: '80%' },
  chipLine: { height: 1, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 1, marginVertical: 2 },
  balanceRow: { marginVertical: 4 },
  balanceLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  balanceValueRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  balanceValue: { color: Colors.white, fontSize: 22, fontWeight: '700', letterSpacing: 1 },
  cardNumber: {
    color: Colors.white,
    fontSize: 16,
    letterSpacing: 4,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 8, letterSpacing: 1, textTransform: 'uppercase' },
  value: { color: Colors.white, fontSize: 12, fontWeight: '600', marginTop: 2 },
  visaLogo: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 2,
  },
});
