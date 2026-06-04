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
import { CustomButton } from '../components/CustomButton';

const steps = [
  {
    id: 1,
    icon: 'card-outline',
    title: "Pièce d'identité",
    description: "Photographiez votre carte d'identité ou passeport en cours de validité.",
    status: 'pending',
  },
  {
    id: 2,
    icon: 'camera-outline',
    title: 'Selfie de vérification',
    description: 'Prenez un selfie pour confirmer votre identité.',
    status: 'pending',
  },
  {
    id: 3,
    icon: 'shield-checkmark-outline',
    title: 'Validation',
    description: 'Notre équipe vérifie vos documents sous 24h.',
    status: 'pending',
  },
];

export function KYCScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    Alert.alert(
      'Fonctionnalité à venir',
      'La vérification d\'identité sera disponible dans une prochaine mise à jour de l\'application.',
      [{ text: 'Compris', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header Banner */}
        <LinearGradient
          colors={['#1A1A2E', '#0F3460']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.bannerIcon}>
            <Ionicons name="shield-checkmark" size={40} color="#E94560" />
          </View>
          <Text style={styles.bannerTitle}>Vérification d'identité</Text>
          <Text style={styles.bannerSubtitle}>
            Complétez la vérification KYC pour accéder à toutes les fonctionnalités de votre carte.
          </Text>
        </LinearGradient>

        {/* Why KYC */}
        <View style={styles.whySection}>
          <Text style={styles.sectionTitle}>Pourquoi vérifier mon identité ?</Text>
          <View style={styles.whyCard}>
            {[
              { icon: 'lock-closed-outline', text: 'Sécuriser votre compte contre la fraude' },
              { icon: 'checkmark-circle-outline', text: 'Débloquer la limite de paiement élevée' },
              { icon: 'globe-outline', text: 'Utiliser votre carte partout dans le monde' },
            ].map((item, index) => (
              <View key={index} style={styles.whyItem}>
                <View style={styles.whyIcon}>
                  <Ionicons name={item.icon as any} size={18} color="#0F3460" />
                </View>
                <Text style={styles.whyText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Steps */}
        <View style={styles.stepsSection}>
          <Text style={styles.sectionTitle}>Les étapes</Text>
          <View style={styles.stepsList}>
            {steps.map((step, index) => (
              <View key={step.id}>
                <View style={styles.stepItem}>
                  {/* Step connector line */}
                  <View style={styles.stepLeft}>
                    <View style={styles.stepIconContainer}>
                      <Ionicons name={step.icon as any} size={20} color={Colors.accent} />
                    </View>
                    {index < steps.length - 1 && <View style={styles.stepLine} />}
                  </View>
                  <View style={styles.stepContent}>
                    <View style={styles.stepHeader}>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      <View style={styles.stepPendingBadge}>
                        <Text style={styles.stepPendingText}>À faire</Text>
                      </View>
                    </View>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Ionicons name="information-circle-outline" size={18} color="#0F3460" />
          <Text style={styles.securityText}>
            Vos documents sont chiffrés et traités en toute sécurité conformément au RGPD. Ils ne sont jamais partagés avec des tiers.
          </Text>
        </View>

        {/* CTA Button */}
        <CustomButton
          title="Commencer la vérification"
          onPress={handleStart}
          loading={isLoading}
          style={styles.ctaBtn}
        />

        <Text style={styles.disclaimer}>
          Processus sécurisé · Données chiffrées · RGPD conforme
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 40 },
  banner: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 0,
  },
  bannerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(233,69,96,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerTitle: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  whySection: { padding: 24, paddingBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 12 },
  whyCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16 },
  whyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  whyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  whyText: { flex: 1, fontSize: 13, color: Colors.darkGray, lineHeight: 18 },
  stepsSection: { paddingHorizontal: 24, paddingBottom: 8 },
  stepsList: { backgroundColor: Colors.white, borderRadius: 16, padding: 16 },
  stepItem: { flexDirection: 'row', marginBottom: 0 },
  stepLeft: { alignItems: 'center', marginRight: 14, paddingBottom: 16 },
  stepIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 4,
    minHeight: 24,
  },
  stepContent: { flex: 1, paddingBottom: 16 },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.primary },
  stepPendingBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  stepPendingText: { fontSize: 10, fontWeight: '600', color: Colors.warning },
  stepDescription: { fontSize: 12, color: Colors.gray, lineHeight: 18 },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 24,
    marginBottom: 20,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    color: '#0F3460',
    lineHeight: 18,
    marginLeft: 8,
  },
  ctaBtn: { marginHorizontal: 24, marginBottom: 12 },
  disclaimer: { fontSize: 11, color: Colors.gray, textAlign: 'center' },
});
