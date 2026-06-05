'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { User, Lock, Bell, Trash2, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import api from '@/services/api';
import { setup2FA, enable2FA, disable2FA } from '@/services/auth.service';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

type Tab = 'profile' | 'security' | 'notifications';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [tab, setTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    address: user?.profile?.address || '',
    city: user?.profile?.city || '',
    country: user?.profile?.country || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '', newPassword: '', confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false });

  const [twoFAData, setTwoFAData] = useState<{ secret: string; qrCodeUrl: string } | null>(null);
  const [twoFAToken, setTwoFAToken] = useState('');
  const [disablePassword, setDisablePassword] = useState('');

  async function handleUpdateProfile() {
    setLoading(true);
    try {
      await api.put('/users/me', profileForm);
      updateUser({ profile: { ...user?.profile, ...profileForm } as any });
      toast.success('Profil mis à jour !');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword() {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Mot de passe trop court');
      return;
    }
    setLoading(true);
    try {
      await api.put('/users/me/password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Mot de passe changé !');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Mot de passe actuel incorrect');
    } finally {
      setLoading(false);
    }
  }

  async function handleSetup2FA() {
    setLoading(true);
    try {
      const data = await setup2FA();
      setTwoFAData(data);
    } catch {
      toast.error('Erreur');
    } finally {
      setLoading(false);
    }
  }

  async function handleEnable2FA() {
    if (!twoFAToken) { toast.error('Code requis'); return; }
    setLoading(true);
    try {
      await enable2FA(twoFAToken);
      updateUser({ twoFAEnabled: true });
      setTwoFAData(null);
      setTwoFAToken('');
      toast.success('2FA activé !');
    } catch {
      toast.error('Code invalide');
    } finally {
      setLoading(false);
    }
  }

  async function handleDisable2FA() {
    if (!disablePassword) { toast.error('Mot de passe requis'); return; }
    setLoading(true);
    try {
      await disable2FA(disablePassword);
      updateUser({ twoFAEnabled: false });
      setDisablePassword('');
      toast.success('2FA désactivé');
    } catch {
      toast.error('Mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: 'profile' as Tab, label: 'Profil', icon: User },
    { id: 'security' as Tab, label: 'Sécurité', icon: Lock },
    { id: 'notifications' as Tab, label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${tab === t.id ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <t.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Profile */}
      {tab === 'profile' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-semibold text-slate-900">Informations personnelles</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Prénom" value={profileForm.firstName} onChange={(e) => setProfileForm((f) => ({ ...f, firstName: e.target.value }))} />
            <Input label="Nom" value={profileForm.lastName} onChange={(e) => setProfileForm((f) => ({ ...f, lastName: e.target.value }))} />
          </div>
          <Input label="Adresse" value={profileForm.address} onChange={(e) => setProfileForm((f) => ({ ...f, address: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Ville" value={profileForm.city} onChange={(e) => setProfileForm((f) => ({ ...f, city: e.target.value }))} />
            <Input label="Pays" value={profileForm.country} onChange={(e) => setProfileForm((f) => ({ ...f, country: e.target.value }))} />
          </div>
          <div className="pt-2">
            <p className="text-sm text-slate-500 mb-3">Compte : <strong>{user?.email || user?.phone}</strong></p>
            <Button loading={loading} onClick={handleUpdateProfile}>Sauvegarder</Button>
          </div>
        </div>
      )}

      {/* Security */}
      {tab === 'security' && (
        <div className="space-y-4">
          {/* Password */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-semibold text-slate-900">Changer le mot de passe</h3>
            <Input
              label="Mot de passe actuel"
              type={showPasswords.old ? 'text' : 'password'}
              rightIcon={<button type="button" onClick={() => setShowPasswords((s) => ({ ...s, old: !s.old }))}>{showPasswords.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, oldPassword: e.target.value }))}
            />
            <Input
              label="Nouveau mot de passe"
              type={showPasswords.new ? 'text' : 'password'}
              rightIcon={<button type="button" onClick={() => setShowPasswords((s) => ({ ...s, new: !s.new }))}>{showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
            />
            <Input
              label="Confirmer"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            />
            <Button loading={loading} onClick={handleChangePassword}>Changer</Button>
          </div>

          {/* 2FA */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900">Authentification 2FA</h3>
                <p className="text-sm text-slate-500">Protégez votre compte avec une deuxième couche de sécurité</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${user?.twoFAEnabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                {user?.twoFAEnabled ? 'Activé' : 'Désactivé'}
              </div>
            </div>

            {!user?.twoFAEnabled ? (
              <div>
                {!twoFAData ? (
                  <Button variant="outline" loading={loading} onClick={handleSetup2FA}>
                    <Shield className="w-4 h-4 mr-2" /> Configurer le 2FA
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <img src={twoFAData.qrCodeUrl} alt="QR 2FA" className="w-40 h-40 border border-slate-200 rounded-lg" />
                    <p className="text-xs text-slate-500 font-mono bg-slate-50 p-2 rounded">{twoFAData.secret}</p>
                    <Input label="Code de vérification" placeholder="123456" maxLength={6} value={twoFAToken} onChange={(e) => setTwoFAToken(e.target.value)} />
                    <Button loading={loading} onClick={handleEnable2FA}>Activer le 2FA</Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <Input label="Mot de passe pour désactiver" type="password" value={disablePassword} onChange={(e) => setDisablePassword(e.target.value)} />
                <Button variant="danger" loading={loading} onClick={handleDisable2FA}>Désactiver le 2FA</Button>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl border border-red-200 p-6">
            <h3 className="font-semibold text-red-700 mb-2">Zone dangereuse</h3>
            <p className="text-sm text-slate-600 mb-4">La suppression de votre compte est irréversible.</p>
            <Button variant="danger" size="sm">
              <Trash2 className="w-4 h-4 mr-1.5" /> Supprimer mon compte
            </Button>
          </div>
        </div>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Préférences de notifications</h3>
          <div className="space-y-4">
            {[
              { label: 'Dépôts reçus', key: 'deposits' },
              { label: 'Retraits effectués', key: 'withdrawals' },
              { label: 'Transferts', key: 'transfers' },
              { label: 'Paiements', key: 'payments' },
              { label: 'Activités suspectes', key: 'suspicious' },
              { label: 'Mises à jour KYC', key: 'kyc' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-700">{item.label}</span>
                <div className="flex gap-4">
                  {['SMS', 'Email', 'Push'].map((channel) => (
                    <label key={channel} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-900" />
                      <span className="text-xs text-slate-500">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-4" loading={loading} onClick={() => toast.success('Préférences sauvegardées')}>
            Sauvegarder
          </Button>
        </div>
      )}
    </div>
  );
}
