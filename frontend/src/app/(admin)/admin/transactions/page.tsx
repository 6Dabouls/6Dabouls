'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api from '@/services/api';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { formatDate, formatCurrency } from '@/lib/utils';

interface AdminTransaction {
  id: string;
  type: string;
  status: string;
  amount: number;
  fee: number;
  currency: string;
  description: string | null;
  reference: string;
  createdAt: string;
  user: {
    id: string;
    email: string | null;
    phone: string | null;
    profile: { firstName: string | null; lastName: string | null } | null;
  };
}

const TYPE_LABELS: Record<string, string> = {
  DEPOSIT: 'Dépôt', WITHDRAWAL: 'Retrait', TRANSFER_SENT: 'Envoi',
  TRANSFER_RECEIVED: 'Réception', PAYMENT: 'Paiement', CURRENCY_CONVERSION: 'Conversion',
  CARD_PAYMENT: 'Carte', FEE: 'Frais',
};

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminTransaction | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get('/admin/transactions', {
      params: { search: search || undefined, type: typeFilter || undefined, status: statusFilter || undefined, page, limit: 20 },
    })
      .then((r) => { setTransactions(r.data.transactions || []); setPagination(r.data.pagination); })
      .finally(() => setLoading(false));
  }, [search, typeFilter, statusFilter, page]);

  function getUserName(user: AdminTransaction['user']) {
    if (user.profile?.firstName || user.profile?.lastName) {
      return [user.profile.firstName, user.profile.lastName].filter(Boolean).join(' ');
    }
    return user.email || user.phone || 'Inconnu';
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3">
        <Input
          placeholder="Rechercher par référence..."
          leftIcon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
        <select
          className="input w-auto"
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
        >
          <option value="">Tous les types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select
          className="input w-auto"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">Tous les statuts</option>
          <option value="COMPLETED">Complété</option>
          <option value="PENDING">En attente</option>
          <option value="FAILED">Échoué</option>
          <option value="CANCELLED">Annulé</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? <PageLoader /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-600">Référence</th>
                  <th className="text-left p-4 font-medium text-slate-600">Utilisateur</th>
                  <th className="text-left p-4 font-medium text-slate-600">Type</th>
                  <th className="text-left p-4 font-medium text-slate-600">Montant</th>
                  <th className="text-left p-4 font-medium text-slate-600">Frais</th>
                  <th className="text-left p-4 font-medium text-slate-600">Statut</th>
                  <th className="text-left p-4 font-medium text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-400">Aucune transaction</td></tr>
                ) : transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelected(tx)}
                  >
                    <td className="p-4 font-mono text-xs text-slate-500">{tx.reference}</td>
                    <td className="p-4 text-slate-700">{getUserName(tx.user)}</td>
                    <td className="p-4">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                        {TYPE_LABELS[tx.type] || tx.type}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-900">
                      {formatCurrency(tx.amount, tx.currency)}
                    </td>
                    <td className="p-4 text-slate-500 text-xs">
                      {tx.fee > 0 ? formatCurrency(tx.fee, tx.currency) : '—'}
                    </td>
                    <td className="p-4"><Badge status={tx.status} /></td>
                    <td className="p-4 text-slate-500">{formatDate(tx.createdAt, false)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </button>
          <span className="text-sm text-slate-600">Page {page} / {pagination.totalPages}</span>
          <button
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-50"
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Détail transaction</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Référence</span>
                <span className="font-mono text-xs">{selected.reference}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Utilisateur</span>
                <span>{getUserName(selected.user)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Type</span>
                <span>{TYPE_LABELS[selected.type] || selected.type}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Montant</span>
                <span className="font-bold">{formatCurrency(selected.amount, selected.currency)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Frais</span>
                <span>{selected.fee > 0 ? formatCurrency(selected.fee, selected.currency) : '—'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Statut</span>
                <Badge status={selected.status} />
              </div>
              {selected.description && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Description</span>
                  <span className="text-right max-w-[60%]">{selected.description}</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Date</span>
                <span>{formatDate(selected.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
