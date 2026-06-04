import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    emoji: '💳',
    titre: 'Carte Visa Gratuite',
    description: 'Obtenez votre carte Visa prépayée 100% gratuite en quelques minutes seulement.',
  },
  {
    id: '2',
    emoji: '🌍',
    titre: 'Paiement Partout',
    description: 'Payez en ligne et en magasin dans le monde entier sans frais cachés.',
  },
  {
    id: '3',
    emoji: '🔒',
    titre: 'Sécurisé & Fiable',
    description: 'Votre argent est protégé avec les dernières technologies de sécurité bancaire.',
  },
];

interface Props { onFinish: () => void; }

export function OnboardingScreen({ onFinish }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    } else {
      onFinish();
    }
  };

  return (
    <LinearGradient colors={['#1A1A2E', '#0F3460']} style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={onFinish}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.titre}>{item.titre}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
          <LinearGradient
            colors={['#E94560', '#C62A47']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextGradient}
          >
            <Text style={styles.nextText}>
              {currentIndex === slides.length - 1 ? 'Commencer' : 'Suivant'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skip: { position: 'absolute', top: 56, right: 24, zIndex: 10 },
  skipText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emoji: { fontSize: 80, marginBottom: 32 },
  titre: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottom: { paddingHorizontal: 24, paddingBottom: 48 },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  dotActive: { width: 24, backgroundColor: '#E94560' },
  nextBtn: { borderRadius: 14, overflow: 'hidden' },
  nextGradient: { paddingVertical: 16, alignItems: 'center' },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
