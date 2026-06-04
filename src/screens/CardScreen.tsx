import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { useCard } from '../context/CardContext';
import { VisaCard } from '../components/VisaCard';
import { CustomButton } from '../components/CustomButton';

interface Props {
  onNavigateToRecharge: () => void;
}

export function CardScreen({ onNavigateToRecharge }: Props) {
  const { carte, soldeVisible, toggleSoldeVisibility } = useCard();
  const [showDetails, setShowDetails] = useState(false);

  const handleCopyNumber = () => {
    Alert.alert('Copié !', 'Le numéro de carte a été copié dans le presse-papiers.');
  };

  const handleBlockCard = () => {
    Alert.alert(
      'Bloquer la carte',
      'Êtes-vous sûr de vouloir bloquer votre carte ? Vous ne pourrez plus effectuer de paiements.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Bloquer', style: 'destructive', onPress: () => Alert.alert('Carte bloquée', 'Votre carte a été bloquée. Contactez le support pour la débloquer.') },
      ]
    );
  };

  const handleOrderPhysical = () => {
    Alert.alert('Fonctionnalité à venir', 'La commande de carte physique sera disponible prochainement.');
  };

  const statutConfig = {
    active: { label: 'Active', color: Colors.success, bg: '#E8F5E9' },
    inactive: { label: 'Inactive', color: Colors.warning, bg: '#FFF8E1' },
    bloquee: { label: 'Bloquée', color: Colors.error, bg: '#FFEBEE' },
  };

  const statut = statutConfig[carte.statut];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Ma Carte</Text>
          <View style={[styles.statusBadge, { backgroundColor: statut.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: statut.color }]} />
            <Text style={[styles.statusText, { color: statut.color }]}>{statut.label}</Text>
          </View>
        </View>

        {/* Card Display */}
        <View style={styles.cardWrapper}>
          <VisaCard
            carte={carte}
            soldeVisible={soldeVisible}
            onToggleSolde={toggleSoldeVisibility}
            showDetails={showDetails}
          />
        </View>

        {/* Toggle Details */}
        <TouchableOpacity
          style={styles.detailsToggle}
          onPress={() => setShowDetails(v => !v)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={showDetails ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color="#0F3460"
          />
          <Text style={styles.detailsToggleText}>
            {showDetails ? 'Masquer les détails' : 'Afficher les détails'}
          </Text>
        </TouchableOpacity>

        {/* Copy Number */}
        {showDetails && (
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopyNumber} activeOpacity={0.8}>
            <Ionicons name="copy-outline" size={16} color="#0F3460" />
            <Text style={styles.copyText}>Copier le numéro de carte</Text>
          </TouchableOpacity>
        )}

        {/* Card Info */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informations de la carte</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar-outline" size={18} color={Colors.accent} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date d'expiration</Text>
                <Text style={styles.infoValue}>{carte.dateExpiration}</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="trending-up-outline" size={18} color={Colors.accent} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Limite journalière</Text>
                <Text style={styles.infoValue}>{carte.limiteJournaliere.toFixed(2)} €</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="card-outline" size={18} color={Colors.accent} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Type de carte</Text>
                <Text style={styles.infoValue}>Visa Prépayée</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="shield-checkmark-outline" size={18} color={Colors.accent} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Statut</Text>
                <Text style={[styles.infoValue, { color: statut.color }]}>{statut.label}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <CustomButton
            title="Recharger la carte"
            onPress={onNavigateToRecharge}
            style={styles.actionBtn}
          />

          <TouchableOpacity style={styles.blockBtn} onPress={handleBlockCard} activeOpacity={0.85}>
            <Ionicons name="lock-closed-outline" size={18} color={Colors.error} />
            <Text style={styles.blockText}>Bloquer la carte</Text>
          </TouchableOpacity>
        </View>

        {/* Physical Card Banner */}
        <TouchableOpacity onPress={handleOrderPhysical} activeOpacity={0.85}>
          <LinearGradient
            colors={['#1A1A2E', '#0F3460']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.physicalBanner}
          >
            <View style={styles.physicalContent}>
              <View>
                <Text style={styles.physicalTitle}>Carte physique</Text>
                <Text style={styles.physicalSubtitle}>Commandez votre carte physique</Text>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Bientôt disponible</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24, paddingBottom: 40 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: '800', color: Colors.primary },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '600' },
  cardWrapper: { marginBottom: 16 },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 8,
  },
  detailsToggleText: { color: '#0F3460', fontSize: 14, fontWeight: '600', marginLeft: 6 },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  copyText: { color: '#0F3460', fontSize: 14, fontWeight: '600', marginLeft: 6 },
  infoSection: { marginTop: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 12 },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: Colors.gray, marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: '600', color: Colors.primary },
  separator: { height: 1, backgroundColor: '#F5F5F5', marginHorizontal: 16 },
  actionsSection: { marginBottom: 16 },
  actionBtn: { marginBottom: 12 },
  blockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  blockText: { color: Colors.error, fontSize: 15, fontWeight: '600', marginLeft: 8 },
  physicalBanner: { borderRadius: 16, padding: 20, marginTop: 8 },
  physicalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  physicalTitle: { color: Colors.white, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  physicalSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 8 },
  comingSoonBadge: {
    backgroundColor: '#E94560',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  comingSoonText: { color: Colors.white, fontSize: 10, fontWeight: '700' },
});
