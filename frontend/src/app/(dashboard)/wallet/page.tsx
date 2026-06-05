'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import { useWalletStore } from '@/store/wallet.store';
import { getWallets, deposit, withdraw, createWallet } from '@/services/wallet.service';
import { getExchangeRates, convertCurrency } from '@/services/currency.service';
import { formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { MOBILE_MONEY_PROVIDERS, SUPPORTED_CURRENCIES } from '@/lib/constants';
import type { Wallet } from '@/types';

type Modal = null | 'deposit' | 'withdraw' | 'convert' | 'new-wallet';

export default function WalletPage() {
  const { wallets, setWallets, selectedCurrency, setSelectedCurrency } = useWalletStore();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rates, setRates] = useState<Record<string, number>>({});

  const [depositForm, setDepositForm] = useState({ amount: '', provider: 'MTN', phone: '', description: '' });
  const [withdrawForm, setWithdrawForm] = useState({ amount: '', provider: 'MTN', phone: '', description: '' });
  const [convertForm, setConvertForm] = useState({ amount: '', from: 'XOF', to: 'USD' });

  useEffect(() => {
    Promise.all([
      getWallets().then(setWallets),
      getExchangeRates('XOF').then((r) => setRates(r.rates)),
    ]).finally(() => setLoading(false));
  }, []);

  const activeWallet = wallets.find((w) => w.currency === selectedCurrency) || wallets[0];

  async function handleDeposit() {
    if (!depositForm.amount || !depositForm.phone) { toast.error('Remplissez tous les champs'); return; }
    setActionLoading(true);
    try {
      await deposit({
        amount: parseFloat(depositForm.amount),
        currency: selectedCurrency,
        provider: depositForm.provider as any,
        phone: depositForm.phone,
        description: depositForm.description,
      });
      toast.success('Dépôt effectué avec succès !');
      const updated = await getWallets();
      setWallets(updated);
      setModal(null);
      setDepositForm({ amount: '', provider: 'MTN', phone: '', description: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Erreur lors du dépôt');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleWithdraw() {
    if (!withdrawForm.amount || !withdrawForm.phone) { toast.error('Remplissez tous les champs'); return; }
    setActionLoading(true);
    try {
      await withdraw({
        amount: parseFloat(withdrawForm.amount),
        currency: selectedCurrency,
        provider: withdrawForm.provider as any,
        phone: withdrawForm.phone,
        description: withdrawForm.description,
      });
      toast.success('Retrait effectué !');
      const updated = await getWallets();
      setWallets(updated);
      setModal(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Erreur lors du retrait');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleConvert() {
    if (!convertForm.amount) { toast.error('Montant requis'); return; }
    setActionLoading(true);
    try {
      const result = await convertCurrency({
        amount: parseFloat(convertForm.amount),
        from: convertForm.from,
        to: convertForm.to,
      });
      toast.success(`Converti : ${formatCurrency(result.convertedAmount, result.to)}`);
      const updated = await getWallets();
      setWallets(updated);
      setModal(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Erreur lors de la conversion');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <PageLoader />;

  const convertedAmount = convertForm.amount && convertForm.from !== convertForm.to
    ? (parseFloat(convertForm.amount) * (rates[convertForm.to] || 0)).toFixed(2)
    : '0';

  return (
    <div className="space-y-6">
      {/* Currency Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {wallets.map((w) => (
          <button
            key={w.currency}
            onClick={() => setSelectedCurrency(w.currency)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${w.currency === selectedCurrency
                ? 'bg-blue-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            {w.currency}
          </button>
        ))}
        <button
          onClick={() => setModal('new-wallet')}
          className="flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Wallet Card */}
      {activeWallet && (
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 text-white">
          <p className="text-blue-200 text-sm">Solde disponible</p>
          <CurrencyDisplay
            amount={parseFloat(activeWallet.balance) - parseFloat(activeWallet.frozenBalance)}
            currency={activeWallet.currency}
            size="xl"
            className="text-white mt-1 mb-1"
          />
          {parseFloat(activeWallet.frozenBalance) > 0 && (
            <p className="text-blue-300 text-sm">
              {formatCurrency(activeWallet.frozenBalance, activeWallet.currency)} en attente
            </p>
          )}
          <div className="flex items-center gap-3 mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setModal('deposit')}
              className="flex items-center gap-1.5"
            >
              <ArrowDownLeft className="w-4 h-4" /> Déposer
            </Button>
            <Button
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              size="sm"
              onClick={() => setModal('withdraw')}
            >
              <ArrowUpRight className="w-4 h-4 mr-1.5" /> Retirer
            </Button>
            <Button
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              size="sm"
              onClick={() => setModal('convert')}
            >
              <ArrowLeftRight className="w-4 h-4 mr-1.5" /> Convertir
            </Button>
          </div>
        </div>
      )}

      {/* Wallet Info */}
      {activeWallet && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-1">Limite journalière</p>
            <CurrencyDisplay amount={activeWallet.dailyLimit} currency={activeWallet.currency} size="md" />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-1">Statut</p>
            <Badge status={activeWallet.status} />
          </div>
        </div>
      )}

      {/* Modals */}
      {modal === 'deposit' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Déposer de l&apos;argent</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Opérateur</label>
                <div className="grid grid-cols-2 gap-2">
                  {MOBILE_MONEY_PROVIDERS.slice(0, 2).map((p) => (
                    <button
                      key={p.code}
                      onClick={() => setDepositForm((f) => ({ ...f, provider: p.code }))}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors
                        ${depositForm.provider === p.code ? 'border-blue-900 bg-blue-50' : 'border-slate-200'}`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label="Numéro de téléphone"
                placeholder="+225 0700000000"
                value={depositForm.phone}
                onChange={(e) => setDepositForm((f) => ({ ...f, phone: e.target.value }))}
              />
              <Input
                label={`Montant (${selectedCurrency})`}
                type="number"
                placeholder="0"
                min="100"
                value={depositForm.amount}
                onChange={(e) => setDepositForm((f) => ({ ...f, amount: e.target.value }))}
              />
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setModal(null)}>Annuler</Button>
                <Button className="flex-1" loading={actionLoading} onClick={handleDeposit}>Confirmer</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal === 'withdraw' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Retirer de l&apos;argent</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Opérateur</label>
                <div className="grid grid-cols-2 gap-2">
                  {MOBILE_MONEY_PROVIDERS.slice(0, 2).map((p) => (
                    <button
                      key={p.code}
                      onClick={() => setWithdrawForm((f) => ({ ...f, provider: p.code }))}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors
                        ${withdrawForm.provider === p.code ? 'border-blue-900 bg-blue-50' : 'border-slate-200'}`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label="Numéro de téléphone destination"
                placeholder="+225 0700000000"
                value={withdrawForm.phone}
                onChange={(e) => setWithdrawForm((f) => ({ ...f, phone: e.target.value }))}
              />
              <Input
                label={`Montant (${selectedCurrency})`}
                type="number"
                placeholder="0"
                value={withdrawForm.amount}
                onChange={(e) => setWithdrawForm((f) => ({ ...f, amount: e.target.value }))}
              />
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setModal(null)}>Annuler</Button>
                <Button className="flex-1" loading={actionLoading} onClick={handleWithdraw}>Confirmer</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal === 'convert' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Convertir des devises</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">De</label>
                  <select className="input" value={convertForm.from} onChange={(e) => setConvertForm((f) => ({ ...f, from: e.target.value }))}>
                    {SUPPORTED_CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Vers</label>
                  <select className="input" value={convertForm.to} onChange={(e) => setConvertForm((f) => ({ ...f, to: e.target.value }))}>
                    {SUPPORTED_CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
                  </select>
                </div>
              </div>
              <Input
                label="Montant"
                type="number"
                placeholder="0"
                value={convertForm.amount}
                onChange={(e) => setConvertForm((f) => ({ ...f, amount: e.target.value }))}
              />
              {convertForm.amount && (
                <div className="bg-blue-50 rounded-lg p-3 text-sm">
                  <span className="text-slate-600">Vous recevrez environ :</span>
                  <span className="font-bold text-blue-900 ml-2">{formatCurrency(parseFloat(convertedAmount) * 0.985, convertForm.to)}</span>
                  <span className="text-xs text-slate-500 block mt-0.5">Frais de conversion : 1.5%</span>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setModal(null)}>Annuler</Button>
                <Button className="flex-1" loading={actionLoading} onClick={handleConvert}>Convertir</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
