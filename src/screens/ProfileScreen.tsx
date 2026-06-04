import React from 'react';
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
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

interface Props {
  onNavigateToKYC: () => void;
}

const kycSteps = [
  { step: 1, label: 'Informations personnelles', done: true },
  { step: 2, label: "Vérification d'identité", done: false },
  { step: 3, label: 'Validation', done: false },
];

const settingsItems = [
  { id: 'info', icon: 'person-outline', label: 'Mes informations' },
  { id: 'security', icon: 'shield-outline', label: 'Sécurité et confidentialité' },
  { id: 'notifs', icon: 'notifications-outline', label: 'Notifications' },
  { id: 'help', icon: 'help-circle-outline', label: 'Aide et support' },
  { id: 'terms', icon: 'document-text-outline', label: "Conditions d'utilisation" },
];

const kycStatusConfig = {
  non_commence: { label: 'Non commencé', color: Colors.gray, bg: '#F5F5F5' },
  en_cours: { label: 'En cours', color: Colors.warning, bg: '#FFF8E1' },
  verifie: { label: 'Vérifié', color: Colors.success, bg: '#E8F5E9' },
  rejete: { label: 'Rejeté', color: Colors.error, bg: '#FFEBEE' },
};

export function ProfileScreen({ onNavigateToKYC }: Props) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se déconnecter', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleSettingPress = (id: string) => {
    Alert.alert('Fonctionnalité à venir', 'Cette section sera disponible prochainement.');
  };

  if (!user) return null;

  const kycStatus = kycStatusConfig[user.kycStatus];
  const initials = `${user.prenom[0]}${user.nom[0]}`;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profil</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.prenom} {user.nom}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userPhone}>{user.telephone}</Text>
          </View>
        </View>

        {/* KYC Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vérification d'identité</Text>
            <View style={[styles.kycBadge, { backgroundColor: kycStatus.bg }]}>
              <Text style={[styles.kycBadgeText, { color: kycStatus.color }]}>
                {kycStatus.label}
              </Text>
            </View>
          </View>

          <View style={styles.kycCard}>
            {kycSteps.map((step, index) => (
              <View key={step.step}>
                {index > 0 && <View style={styles.kycSeparator} />}
                <View style={styles.kycStep}>
                  <View style={[styles.kycStepIcon, step.done && styles.kycStepIconDone]}>
                    {step.done ? (
                      <Ionicons name="checkmark" size={14} color={Colors.white} />
                    ) : (
                      <Text style={styles.kycStepNumber}>{step.step}</Text>
                    )}
                  </View>
                  <Text style={[styles.kycStepLabel, step.done && styles.kycStepLabelDone]}>
                    {step.label}
                  </Text>
                  {!step.done && (
                    <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
                  )}
                </View>
              </View>
            ))}

            {user.kycStatus !== 'verifie' && (
              <TouchableOpacity
                style={styles.kycBtn}
                onPress={onNavigateToKYC}
                activeOpacity={0.85}
              >
                <Text style={styles.kycBtnText}>Commencer la vérification</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.white} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          <View style={styles.settingsCard}>
            {settingsItems.map((item, index) => (
              <View key={item.id}>
                {index > 0 && <View style={styles.settingsDivider} />}
                <TouchableOpacity
                  style={styles.settingsItem}
                  onPress={() => handleSettingPress(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingsIconContainer}>
                    <Ionicons name={item.icon as any} size={20} color={Colors.accent} />
                  </View>
                  <Text style={styles.settingsLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>6Dabouls v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2024 6Dabouls. Tous droits réservés.</Text>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.primary },
  userCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: { color: Colors.white, fontSize: 22, fontWeight: '800' },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  userEmail: { fontSize: 13, color: Colors.gray, marginBottom: 2 },
  userPhone: { fontSize: 13, color: Colors.gray },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  kycBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  kycBadgeText: { fontSize: 11, fontWeight: '700' },
  kycCard: { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden' },
  kycSeparator: { height: 1, backgroundColor: '#F5F5F5', marginHorizontal: 16 },
  kycStep: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  kycStepIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  kycStepIconDone: { backgroundColor: Colors.success },
  kycStepNumber: { fontSize: 12, fontWeight: '700', color: Colors.gray },
  kycStepLabel: { flex: 1, fontSize: 14, color: Colors.gray },
  kycStepLabelDone: { color: Colors.primary, fontWeight: '600' },
  kycBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A2E',
    margin: 16,
    borderRadius: 10,
    paddingVertical: 12,
  },
  kycBtnText: { color: Colors.white, fontSize: 14, fontWeight: '600', marginRight: 8 },
  settingsCard: { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden' },
  settingsDivider: { height: 1, backgroundColor: '#F5F5F5', marginHorizontal: 16 },
  settingsItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  settingsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: Colors.primary },
  appInfo: { alignItems: 'center', marginBottom: 16 },
  appInfoText: { fontSize: 11, color: Colors.gray, marginBottom: 2 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: { color: Colors.error, fontSize: 15, fontWeight: '600', marginLeft: 8 },
});
