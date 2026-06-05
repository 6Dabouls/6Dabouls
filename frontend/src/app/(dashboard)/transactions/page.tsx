'use client';

import { useEffect, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { getTransactions } from '@/services/transaction.service';
import TransactionItem from '@/components/ui/TransactionItem';
import Badge from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { Transaction, Pagination } from '@/types';
import { TRANSACTION_TYPES } from '@/lib/constants';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState({ type: '', status: '', page: 1 });

  useEffect(() => {
    setLoading(true);
    getTransactions({ ...filters, limit: 20 })
      .then(({ transactions, pagination }) => {
        setTransactions(transactions);
        setPagination(pagination);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3">
          <select
            className="input w-auto min-w-[140px]"
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value, page: 1 }))}
          >
            <option value="">Tous les types</option>
            {TRANSACTION_TYPES.map((t) => (
              <option key={t.code} value={t.code}>{t.label}</option>
            ))}
          </select>
          <select
            className="input w-auto min-w-[140px]"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))}
          >
            <option value="">Tous les statuts</option>
            <option value="COMPLETED">Complété</option>
            <option value="PENDING">En attente</option>
            <option value="FAILED">Échoué</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <PageLoader text="Chargement des transactions..." />
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Aucune transaction trouvée</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} onClick={() => setSelected(tx)} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-50"
            disabled={filters.page === 1}
            onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
          >
            Précédent
          </button>
          <span className="text-sm text-slate-600">
            Page {filters.page} / {pagination.totalPages}
          </span>
          <button
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-50"
            disabled={filters.page === pagination.totalPages}
            onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
          >
            Suivant
          </button>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Détails de la transaction</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Référence</span>
                <span className="font-mono text-xs text-slate-700">{selected.reference.slice(0, 20)}...</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Type</span>
                <span className="font-medium">{selected.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Montant</span>
                <span className="font-bold text-lg">{formatCurrency(selected.amount, selected.currency)}</span>
              </div>
              {parseFloat(selected.fee) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Frais</span>
                  <span>{formatCurrency(selected.fee, selected.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Statut</span>
                <Badge status={selected.status} />
              </div>
              {selected.description && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Description</span>
                  <span className="text-right max-w-[60%]">{selected.description}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
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
