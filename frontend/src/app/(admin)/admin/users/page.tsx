'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';
import api from '@/services/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { formatDate, getUserDisplayName } from '@/lib/utils';

interface AdminUser {
  id: string;
  email: string | null;
  phone: string | null;
  role: string;
  status: string;
  kycLevel: string;
  createdAt: string;
  lastLoginAt: string | null;
  profile: { firstName: string | null; lastName: string | null } | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/admin/users', { params: { search: search || undefined, status: statusFilter || undefined, page, limit: 20 } })
      .then((r) => { setUsers(r.data.users || []); setPagination(r.data.pagination); })
      .finally(() => setLoading(false));
  }, [search, statusFilter, page]);

  async function handleStatusChange(userId: string, newStatus: string) {
    setActionLoading(true);
    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus } : u));
      if (selected?.id === userId) setSelected((s) => s ? { ...s, status: newStatus } : null);
      toast.success('Statut mis à jour');
    } catch {
      toast.error('Erreur');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3">
        <Input
          placeholder="Rechercher..."
          leftIcon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
        <select
          className="input w-auto"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">Tous les statuts</option>
          <option value="ACTIVE">Actif</option>
          <option value="SUSPENDED">Suspendu</option>
          <option value="PENDING_VERIFICATION">En attente</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? <PageLoader /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-600">Utilisateur</th>
                  <th className="text-left p-4 font-medium text-slate-600">Contact</th>
                  <th className="text-left p-4 font-medium text-slate-600">KYC</th>
                  <th className="text-left p-4 font-medium text-slate-600">Statut</th>
                  <th className="text-left p-4 font-medium text-slate-600">Inscription</th>
                  <th className="text-left p-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-bold text-xs">
                          {getUserDisplayName(user).charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900">{getUserDisplayName(user)}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{user.email || user.phone}</td>
                    <td className="p-4"><Badge status={user.kycLevel} /></td>
                    <td className="p-4"><Badge status={user.status} /></td>
                    <td className="p-4 text-slate-500">{formatDate(user.createdAt, false)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {user.status === 'ACTIVE' ? (
                          <Button
                            variant="danger"
                            size="sm"
                            loading={actionLoading}
                            onClick={() => handleStatusChange(user.id, 'SUSPENDED')}
                          >
                            Suspendre
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            loading={actionLoading}
                            onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                          >
                            Activer
                          </Button>
                        )}
                      </div>
                    </td>
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
    </div>
  );
}
