import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { CustomButton } from '../components/CustomButton';

interface Props {
  onNavigateToRegister: () => void;
  onBack: () => void;
}

export function LoginScreen({ onNavigateToRegister, onBack }: Props) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    const result = await login(email, password);
    if (!result.success) setError(result.error || 'Erreur de connexion');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={styles.title}>Bon retour ! 👋</Text>
        <Text style={styles.subtitle}>Connectez-vous à votre compte 6Dabouls</Text>

        <View style={styles.hintBox}>
          <Ionicons name="information-circle-outline" size={16} color="#0F3460" />
          <Text style={styles.hintText}>  Compte démo: demo@6dabouls.com / Demo1234</Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Adresse e-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="exemple@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={Colors.gray}
        />

        <Text style={styles.label}>Mot de passe</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            placeholderTextColor={Colors.gray}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(v => !v)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.gray}
            />
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Se connecter"
          onPress={handleLogin}
          loading={isLoading}
          style={styles.btn}
        />

        <CustomButton
          title="Pas encore de compte ? S'inscrire"
          onPress={onNavigateToRegister}
          variant="ghost"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24, paddingTop: 60 },
  backBtn: { marginBottom: 24, width: 40 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.gray, marginBottom: 24 },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  hintText: { color: '#0F3460', fontSize: 12, flex: 1 },
  errorBox: { backgroundColor: '#FFEBEE', borderRadius: 8, padding: 12, marginBottom: 16 },
  errorText: { color: Colors.error, fontSize: 13 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.darkGray,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.primary,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 4,
  },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  passwordInput: { flex: 1, marginBottom: 0, marginRight: 8 },
  eyeBtn: {
    padding: 14,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  btn: { marginTop: 24, marginBottom: 8 },
});
