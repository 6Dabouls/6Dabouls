'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search, Send, User } from 'lucide-react';
import api from '@/services/api';
import { transfer } from '@/services/wallet.service';
import { useWalletStore } from '@/store/wallet.store';
import { getWallets } from '@/services/wallet.service';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { formatCurrency, getUserDisplayName } from '@/lib/utils';
import { SUPPORTED_CURRENCIES } from '@/lib/constants';

interface SearchUser {
  id: string;
  email: string | null;
  phone: string | null;
  profile: { firstName: string | null; lastName: string | null; profilePicture: string | null } | null;
}

export default function TransfersPage() {
  const { wallets, setWallets } = useWalletStore();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('XOF');
  const [description, setDescription] = useState('');
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feeEstimate, setFeeEstimate] = useState(0);

  useEffect(() => {
    getWallets().then(setWallets);
  }, []);

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const fee = Math.max(Math.floor(parseFloat(amount) * 0.005), 100);
      setFeeEstimate(fee);
    } else {
      setFeeEstimate(0);
    }
  }, [amount]);

  useEffect(() => {
    if (query.length < 3) { setSearchResults([]); return; }
    const timeout = setTimeout(() => {
      setSearching(true);
      api.get('/users/search', { params: { q: query } })
        .then((r) => setSearchResults(r.data.data || []))
        .catch(() => {})
        .finally(() => setSearching(false));
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  async function handleTransfer() {
    if (!selectedUser) { toast.error('Sélectionnez un destinataire'); return; }
    if (!amount || parseFloat(amount) < 100) { toast.error('Montant minimum : 100'); return; }

    setLoading(true);
    try {
      const result = await transfer({
        amount: parseFloat(amount),
        currency,
        recipientIdentifier: selectedUser.email || selectedUser.phone || '',
        description,
      });
      toast.success(`${formatCurrency(result.amount, result.currency)} envoyés à ${result.recipient.name}`);
      const updated = await getWallets();
      setWallets(updated);
      setSelectedUser(null);
      setAmount('');
      setQuery('');
      setDescription('');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Erreur lors du transfert');
    } finally {
      setLoading(false);
    }
  }

  const selectedWallet = wallets.find((w) => w.currency === currency);
  const canTransfer = selectedWallet && parseFloat(selectedWallet.balance) >= (parseFloat(amount || '0') + feeEstimate);

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="font-semibold text-slate-900">Envoyer de l&apos;argent</h2>

      {/* Recipient Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-medium text-slate-900 mb-3">Destinataire</h3>
        {selectedUser ? (
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
                {getUserDisplayName(selectedUser).charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-slate-900 text-sm">{getUserDisplayName(selectedUser)}</p>
                <p className="text-xs text-slate-500">{selectedUser.email || selectedUser.phone}</p>
              </div>
            </div>
            <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-red-500 text-lg">✕</button>
          </div>
        ) : (
          <div className="relative">
            <Input
              placeholder="Rechercher par téléphone ou email..."
              leftIcon={searching ? <div className="animate-spin w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full" /> : <Search className="w-4 h-4" />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 text-left"
                    onClick={() => { setSelectedUser(user); setQuery(''); setSearchResults([]); }}
                  >
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-900 font-bold text-sm">{getUserDisplayName(user).charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{getUserDisplayName(user)}</p>
                      <p className="text-xs text-slate-500">{user.email || user.phone}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Amount & Currency */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-medium text-slate-900 mb-3">Montant</h3>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="number"
              placeholder="0"
              min="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <select
            className="input w-28"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {SUPPORTED_CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
          </select>
        </div>

        {selectedWallet && (
          <p className="text-xs text-slate-500 mt-2">
            Solde disponible : <strong>{formatCurrency(selectedWallet.balance, currency)}</strong>
          </p>
        )}

        {feeEstimate > 0 && (
          <div className="mt-3 bg-slate-50 rounded-lg p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Montant envoyé</span>
              <span>{formatCurrency(amount, currency)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-slate-600">Frais (0.5%)</span>
              <span>{formatCurrency(feeEstimate, currency)}</span>
            </div>
            <div className="flex justify-between mt-1 font-semibold border-t border-slate-200 pt-1">
              <span>Total débité</span>
              <span>{formatCurrency(parseFloat(amount || '0') + feeEstimate, currency)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <Input
          label="Message (optionnel)"
          placeholder="Raison du transfert..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Button
        className="w-full"
        size="lg"
        loading={loading}
        disabled={!selectedUser || !amount || parseFloat(amount) < 100 || !canTransfer}
        onClick={handleTransfer}
      >
        <Send className="w-4 h-4 mr-2" />
        Envoyer {amount && `${formatCurrency(amount, currency)}`}
      </Button>

      {amount && !canTransfer && (
        <p className="text-sm text-red-500 text-center">Solde insuffisant</p>
      )}
    </div>
  );
}
