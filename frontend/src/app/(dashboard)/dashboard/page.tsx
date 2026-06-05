'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownLeft, Send, Zap, TrendingUp, Shield, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useWalletStore } from '@/store/wallet.store';
import { getWallets } from '@/services/wallet.service';
import { getTransactions } from '@/services/transaction.service';
import { formatCurrency, getUserDisplayName, getKYCLevelLabel } from '@/lib/utils';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay';
import TransactionItem from '@/components/ui/TransactionItem';
import Badge from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import type { Transaction, Wallet } from '@/types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { wallets, setWallets } = useWalletStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getWallets().then(setWallets),
      getTransactions({ limit: 5 }).then((r) => setTransactions(r.transactions)),
    ])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const displayName = getUserDisplayName(user || {});
  const mainWallet = wallets.find((w) => w.currency === 'XOF') || wallets[0];
  const totalXOF = wallets.reduce((sum, w) => {
    if (w.currency === 'XOF' || w.currency === 'XAF') return sum + parseFloat(w.balance);
    return sum;
  }, 0);

  if (loading) return <PageLoader text="Chargement du tableau de bord..." />;

  const quickActions = [
    { label: 'Déposer', icon: ArrowDownLeft, href: '/wallet', color: 'bg-green-100 text-green-700' },
    { label: 'Envoyer', icon: Send, href: '/transfers', color: 'bg-blue-100 text-blue-700' },
    { label: 'Payer', icon: Zap, href: '/payments', color: 'bg-purple-100 text-purple-700' },
    { label: 'Retirer', icon: ArrowUpRight, href: '/wallet', color: 'bg-orange-100 text-orange-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Bonjour, {displayName.split(' ')[0]} 👋</h2>
        <p className="text-slate-500 text-sm mt-0.5">Bienvenue sur votre tableau de bord</p>
      </div>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-blue-200 text-sm mb-2">Solde total</p>
        <div className="text-4xl font-bold mb-4">{formatCurrency(totalXOF, 'XOF')}</div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-xs">Niveau KYC</p>
            <p className="text-white font-medium text-sm">{getKYCLevelLabel(user?.kycLevel || 'NONE')}</p>
          </div>
          <Link href="/wallet" className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-lg transition-colors">
            Voir détails →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 hover:shadow-sm transition-all"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-700">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* KYC Notice */}
      {(user?.kycLevel === 'NONE' || user?.kycLevel === 'LEVEL_1') && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900">Augmentez vos limites de transaction</p>
            <p className="text-xs text-amber-700 mt-0.5">Vérifiez votre identité pour débloquer jusqu&apos;à 1 000 000 FCFA/jour</p>
          </div>
          <Link href="/kyc" className="text-xs font-semibold text-amber-700 hover:text-amber-900">
            Vérifier →
          </Link>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Wallets */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Mes Portefeuilles</h3>
            <Link href="/wallet" className="text-xs text-blue-900 font-medium">Gérer</Link>
          </div>
          <div className="space-y-3">
            {wallets.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">Aucun portefeuille</p>
            ) : (
              wallets.slice(0, 3).map((wallet) => (
                <div key={wallet.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-900">{wallet.currency.slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{wallet.currency}</p>
                      <Badge status={wallet.status} className="text-[10px] py-0" />
                    </div>
                  </div>
                  <CurrencyDisplay amount={wallet.balance} currency={wallet.currency} size="sm" className="font-semibold" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Transactions récentes</h3>
            <Link href="/transactions" className="text-xs text-blue-900 font-medium">Voir tout</Link>
          </div>
          <div className="space-y-1">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Aucune transaction</p>
                <Link href="/wallet" className="text-xs text-blue-900 font-medium mt-1 block">
                  Faire un dépôt →
                </Link>
              </div>
            ) : (
              transactions.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
