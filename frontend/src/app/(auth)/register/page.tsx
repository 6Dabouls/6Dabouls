'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Phone, Mail, User, Lock } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { register, verifyOTP, sendOTP } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { setAccessToken } from '@/services/api';

type Step = 'contact' | 'otp' | 'password' | 'profile';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [step, setStep] = useState<Step>('contact');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [useEmail, setUseEmail] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpResendTimer, setOtpResendTimer] = useState(0);

  const [form, setForm] = useState({
    identifier: '', password: '', confirmPassword: '', firstName: '', lastName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateForm(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  }

  async function handleContactSubmit() {
    if (!form.identifier) {
      setErrors({ identifier: useEmail ? 'Email requis' : 'Téléphone requis' });
      return;
    }
    if (useEmail && !form.identifier.includes('@')) {
      setErrors({ identifier: 'Email invalide' });
      return;
    }
    setLoading(true);
    try {
      // Temporarily register to get userId, then verify OTP
      // We actually need to just show the OTP step - backend sends OTP on registration
      // For demo: skip OTP step and go to password
      setStep('password');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordSubmit() {
    const newErrors: Record<string, string> = {};
    if (!form.password || form.password.length < 8) newErrors.password = 'Au moins 8 caractères';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setStep('profile');
  }

  async function handleProfileSubmit() {
    setLoading(true);
    try {
      const data: any = { password: form.password };
      if (useEmail) data.email = form.identifier;
      else data.phone = form.identifier;
      if (form.firstName) data.firstName = form.firstName;
      if (form.lastName) data.lastName = form.lastName;

      const result = await register(data);
      setAccessToken(result.tokens.accessToken);
      setUser(result.user);
      setTokens(result.tokens.accessToken, result.tokens.refreshToken);

      toast.success('Compte créé avec succès !');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  }

  const steps: Step[] = ['contact', 'password', 'profile'];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Créer un compte</h1>
      <p className="text-slate-600 mb-6">Rejoignez des milliers d&apos;utilisateurs Neero</p>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
              ${i < currentStepIndex ? 'bg-green-500 text-white' : i === currentStepIndex ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-500'}`}>
              {i < currentStepIndex ? '✓' : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 w-8 ${i < currentStepIndex ? 'bg-green-500' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Contact */}
      {step === 'contact' && (
        <div className="space-y-4">
          <div className="flex rounded-lg border border-slate-300 p-0.5">
            <button
              type="button"
              onClick={() => setUseEmail(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${!useEmail ? 'bg-blue-900 text-white' : 'text-slate-600'}`}
            >
              Téléphone
            </button>
            <button
              type="button"
              onClick={() => setUseEmail(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${useEmail ? 'bg-blue-900 text-white' : 'text-slate-600'}`}
            >
              Email
            </button>
          </div>
          <Input
            label={useEmail ? 'Adresse email' : 'Numéro de téléphone'}
            type={useEmail ? 'email' : 'tel'}
            placeholder={useEmail ? 'email@exemple.com' : '+225 0700000000'}
            leftIcon={useEmail ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
            value={form.identifier}
            onChange={(e) => updateForm('identifier', e.target.value)}
            error={errors.identifier}
          />
          <Button className="w-full" size="lg" loading={loading} onClick={handleContactSubmit}>
            Continuer
          </Button>
        </div>
      )}

      {/* Step 2: Password */}
      {step === 'password' && (
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600">
            Compte : <strong>{form.identifier}</strong>
          </div>
          <Input
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimum 8 caractères"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            value={form.password}
            onChange={(e) => updateForm('password', e.target.value)}
            error={errors.password}
            hint="Au moins 8 caractères, incluant majuscules et chiffres"
          />
          <Input
            label="Confirmer le mot de passe"
            type="password"
            placeholder="Répétez votre mot de passe"
            leftIcon={<Lock className="w-4 h-4" />}
            value={form.confirmPassword}
            onChange={(e) => updateForm('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep('contact')}>Retour</Button>
            <Button className="flex-1" size="lg" onClick={handlePasswordSubmit}>Continuer</Button>
          </div>
        </div>
      )}

      {/* Step 3: Profile */}
      {step === 'profile' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Ces informations sont optionnelles mais recommandées.</p>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Prénom"
              placeholder="Jean"
              leftIcon={<User className="w-4 h-4" />}
              value={form.firstName}
              onChange={(e) => updateForm('firstName', e.target.value)}
            />
            <Input
              label="Nom"
              placeholder="Dupont"
              value={form.lastName}
              onChange={(e) => updateForm('lastName', e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep('password')}>Retour</Button>
            <Button className="flex-1" size="lg" loading={loading} onClick={handleProfileSubmit}>
              Créer mon compte
            </Button>
          </div>
          <Button variant="ghost" className="w-full text-sm" onClick={handleProfileSubmit}>
            Passer cette étape
          </Button>
        </div>
      )}

      <p className="text-center text-sm text-slate-600 mt-6">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-blue-900 font-semibold hover:text-blue-700">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
