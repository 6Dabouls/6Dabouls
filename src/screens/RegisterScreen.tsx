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
  onNavigateToLogin: () => void;
  onBack: () => void;
}

interface FormState {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  password: string;
  confirmPassword: string;
}

export function RegisterScreen({ onNavigateToLogin, onBack }: Props) {
  const { register, isLoading } = useAuth();
  const [form, setForm] = useState<FormState>({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const set = (k: keyof FormState) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = (): string | null => {
    if (!form.prenom || !form.nom || !form.email || !form.telephone || !form.password) {
      return 'Veuillez remplir tous les champs';
    }
    if (form.password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (form.password !== form.confirmPassword) {
      return 'Les mots de passe ne correspondent pas';
    }
    if (!form.email.includes('@')) {
      return 'Adresse e-mail invalide';
    }
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    await register({
      prenom: form.prenom,
      nom: form.nom,
      email: form.email,
      telephone: form.telephone,
      password: form.password,
    });
  };

  const fields: Array<{
    key: keyof FormState;
    label: string;
    placeholder: string;
    keyboard: 'default' | 'email-address' | 'phone-pad';
    secure?: boolean;
  }> = [
    { key: 'prenom', label: 'Prénom', placeholder: 'Jean', keyboard: 'default' },
    { key: 'nom', label: 'Nom', placeholder: 'Dupont', keyboard: 'default' },
    { key: 'email', label: 'E-mail', placeholder: 'exemple@email.com', keyboard: 'email-address' },
    { key: 'telephone', label: 'Téléphone', placeholder: '+33 6 00 00 00 00', keyboard: 'phone-pad' },
    { key: 'password', label: 'Mot de passe', placeholder: '••••••••', keyboard: 'default', secure: true },
    { key: 'confirmPassword', label: 'Confirmer le mot de passe', placeholder: '••••••••', keyboard: 'default', secure: true },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Rejoignez 6Dabouls et obtenez votre carte gratuite</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {fields.map(field => (
          <View key={field.key}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              value={form[field.key]}
              onChangeText={set(field.key)}
              placeholder={field.placeholder}
              keyboardType={field.keyboard}
              secureTextEntry={field.secure}
              autoCapitalize={field.keyboard === 'email-address' ? 'none' : 'sentences'}
              placeholderTextColor={Colors.gray}
            />
          </View>
        ))}

        <CustomButton
          title="Créer mon compte"
          onPress={handleRegister}
          loading={isLoading}
          style={styles.btn}
        />
        <CustomButton
          title="Déjà un compte ? Se connecter"
          onPress={onNavigateToLogin}
          variant="ghost"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  backBtn: { marginBottom: 24, width: 40 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.gray, marginBottom: 24 },
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
  },
  btn: { marginTop: 24, marginBottom: 8 },
});
