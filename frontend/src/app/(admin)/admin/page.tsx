'use client';

import { useEffect, useState } from 'react';
import { Users, ArrowLeftRight, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import api from '@/services/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalTransactions: number;
  completedTransactions: number;
  pendingKYC: number;
  openTickets: number;
  dailyVolume: number;
  monthlyVolume: number;
  dailyStats: Array<{ date: string; count: number }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard/stats')
      .then((r) => setStats(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader text="Chargement des statistiques..." />;
  if (!stats) return null;

  const statCards = [
    { label: 'Utilisateurs total', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600 bg-blue-50', sub: `+${stats.newUsersToday} aujourd'hui` },
    { label: 'Utilisateurs actifs', value: stats.activeUsers.toLocaleString(), icon: Users, color: 'text-green-600 bg-green-50', sub: `${Math.round(stats.activeUsers / Math.max(stats.totalUsers, 1) * 100)}% du total` },
    { label: 'Transactions totales', value: stats.totalTransactions.toLocaleString(), icon: ArrowLeftRight, color: 'text-purple-600 bg-purple-50', sub: `${stats.completedTransactions} complétées` },
    { label: 'Volume mensuel', value: formatCurrency(stats.monthlyVolume, 'XOF'), icon: TrendingUp, color: 'text-amber-600 bg-amber-50', sub: formatCurrency(stats.dailyVolume, 'XOF') + ' aujourd\'hui' },
    { label: 'KYC en attente', value: stats.pendingKYC.toLocaleString(), icon: Clock, color: 'text-orange-600 bg-orange-50', sub: 'À valider', href: '/admin/kyc' },
    { label: 'Tickets ouverts', value: stats.openTickets.toLocaleString(), icon: AlertCircle, color: 'text-red-600 bg-red-50', sub: 'Support actif' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5 card-hover">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Transactions (7 derniers jours)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [v, 'Transactions']} />
              <Bar dataKey="count" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Activité récente</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <a href="/admin/kyc" className="bg-orange-50 rounded-xl border border-orange-200 p-5 hover:bg-orange-100 transition-colors">
          <Clock className="w-6 h-6 text-orange-600 mb-2" />
          <p className="font-semibold text-orange-900">{stats.pendingKYC} KYC en attente</p>
          <p className="text-sm text-orange-700 mt-0.5">Cliquer pour valider</p>
        </a>
        <a href="/admin/users" className="bg-blue-50 rounded-xl border border-blue-200 p-5 hover:bg-blue-100 transition-colors">
          <Users className="w-6 h-6 text-blue-600 mb-2" />
          <p className="font-semibold text-blue-900">Gérer les utilisateurs</p>
          <p className="text-sm text-blue-700 mt-0.5">{stats.totalUsers} comptes</p>
        </a>
        <a href="/admin/transactions" className="bg-purple-50 rounded-xl border border-purple-200 p-5 hover:bg-purple-100 transition-colors">
          <ArrowLeftRight className="w-6 h-6 text-purple-600 mb-2" />
          <p className="font-semibold text-purple-900">Transactions</p>
          <p className="text-sm text-purple-700 mt-0.5">{stats.completedTransactions} complétées</p>
        </a>
      </div>
    </div>
  );
}
