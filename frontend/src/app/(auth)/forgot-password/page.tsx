'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Phone } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { forgotPassword, resetPassword } from '@/services/auth.service';

type Step = 'identifier' | 'otp' | 'password';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('identifier');
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleSendOTP() {
    if (!identifier) { toast.error('Email ou téléphone requis'); return; }
    setLoading(true);
    try {
      await forgotPassword(identifier);
      setStep('otp');
      toast.success('Code envoyé !');
    } catch {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!otp || !password) { toast.error('Tous les champs sont requis'); return; }
    if (password.length < 8) { toast.error('Mot de passe trop court'); return; }
    setLoading(true);
    try {
      await resetPassword(identifier, otp, password);
      toast.success('Mot de passe réinitialisé !');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Code invalide');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Mot de passe oublié</h1>
      <p className="text-slate-600 mb-8">Réinitialisez votre mot de passe en quelques étapes</p>

      {step === 'identifier' && (
        <div className="space-y-4">
          <Input
            label="Email ou téléphone"
            placeholder="+225 0700000000 ou email@exemple.com"
            leftIcon={<Phone className="w-4 h-4" />}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <Button className="w-full" size="lg" loading={loading} onClick={handleSendOTP}>
            Envoyer le code
          </Button>
        </div>
      )}

      {step === 'otp' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Un code a été envoyé à <strong>{identifier}</strong></p>
          <Input
            label="Code de vérification"
            placeholder="123456"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Input
            label="Nouveau mot de passe"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimum 8 caractères"
            rightIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full" size="lg" loading={loading} onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setStep('identifier')}>
            Retour
          </Button>
        </div>
      )}

      <p className="text-center text-sm text-slate-600 mt-6">
        <Link href="/login" className="text-blue-900 font-semibold">← Retour à la connexion</Link>
      </p>
    </div>
  );
}
