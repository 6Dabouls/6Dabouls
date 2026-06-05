'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Phone } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { login } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { setAccessToken } from '@/services/api';

const schema = z.object({
  identifier: z.string().min(3, 'Email ou téléphone requis'),
  password: z.string().min(6, 'Mot de passe requis'),
  twoFAToken: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [requiresTwoFA, setRequiresTwoFA] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const result = await login(data);

      if (result.requiresTwoFA) {
        setRequiresTwoFA(true);
        toast('Code 2FA requis', { icon: '🔐' });
        setLoading(false);
        return;
      }

      setAccessToken(result.tokens.accessToken);
      setUser(result.user);
      setTokens(result.tokens.accessToken, result.tokens.refreshToken);

      toast.success('Connexion réussie !');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Connexion</h1>
      <p className="text-slate-600 mb-8">Accédez à votre compte Neero</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email ou téléphone"
          placeholder="+225 0700000000 ou email@exemple.com"
          leftIcon={<Phone className="w-4 h-4" />}
          error={errors.identifier?.message}
          {...register('identifier')}
        />

        <Input
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          placeholder="Votre mot de passe"
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
        />

        {requiresTwoFA && (
          <Input
            label="Code d'authentification (2FA)"
            placeholder="123456"
            maxLength={6}
            error={errors.twoFAToken?.message}
            hint="Entrez le code depuis votre application d'authentification"
            {...register('twoFAToken')}
          />
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-slate-300" />
            <span className="text-sm text-slate-600">Se souvenir de moi</span>
          </label>
          <Link href="/forgot-password" className="text-sm text-blue-900 hover:text-blue-700 font-medium">
            Mot de passe oublié ?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Se connecter
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600 mt-6">
        Pas encore de compte ?{' '}
        <Link href="/register" className="text-blue-900 font-semibold hover:text-blue-700">
          S&apos;inscrire gratuitement
        </Link>
      </p>
    </div>
  );
}
