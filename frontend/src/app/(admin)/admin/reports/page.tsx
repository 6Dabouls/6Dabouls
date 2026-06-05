'use client';

import { useEffect, useState } from 'react';
import { Download, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';
import api from '@/services/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

interface DailyReport {
  date: string;
  totalTransactions: number;
  completedTransactions: number;
  totalVolume: number;
  totalFees: number;
  newUsers: number;
  byType: Record<string, number>;
}

interface MonthlyReport {
  month: string;
  totalTransactions: number;
  totalVolume: number;
  totalFees: number;
  newUsers: number;
  byType: Record<string, number>;
}

const COLORS = ['#1e3a5f', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316'];

const TYPE_LABELS: Record<string, string> = {
  DEPOSIT: 'Dépôts', WITHDRAWAL: 'Retraits', TRANSFER_SENT: 'Envois',
  TRANSFER_RECEIVED: 'Réceptions', PAYMENT: 'Paiements', CURRENCY_CONVERSION: 'Conversions',
};

export default function AdminReportsPage() {
  const [view, setView] = useState<'daily' | 'monthly'>('daily');
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    const month = today.slice(0, 7);

    Promise.all([
      api.get('/admin/reports/daily', { params: { date: today } }),
      api.get('/admin/reports/monthly', { params: { month } }),
    ]).then(([daily, monthly]) => {
      setDailyReport(daily.data.data);
      setMonthlyReport(monthly.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader text="Chargement des rapports..." />;

  const report = view === 'daily' ? dailyReport : monthlyReport;
  if (!report) return null;

  const pieData = Object.entries(report.byType || {}).map(([type, count]) => ({
    name: TYPE_LABELS[type] || type,
    value: count,
  })).filter((d) => d.value > 0);

  const summaryCards = [
    {
      label: 'Transactions',
      value: report.totalTransactions.toLocaleString(),
      icon: ArrowLeftRight,
      color: 'text-blue-600 bg-blue-50',
      sub: `${(report as DailyReport).completedTransactions ?? '—'} complétées`,
    },
    {
      label: 'Volume total',
      value: formatCurrency(report.totalVolume, 'XOF'),
      icon: TrendingUp,
      color: 'text-green-600 bg-green-50',
      sub: 'Montant traité',
    },
    {
      label: 'Frais collectés',
      value: formatCurrency(report.totalFees, 'XOF'),
      icon: TrendingDown,
      color: 'text-amber-600 bg-amber-50',
      sub: 'Revenus plateforme',
    },
    {
      label: 'Nouveaux utilisateurs',
      value: report.newUsers.toLocaleString(),
      icon: ArrowLeftRight,
      color: 'text-purple-600 bg-purple-50',
      sub: view === 'daily' ? "Aujourd'hui" : 'Ce mois',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header + Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1">
          <button
            onClick={() => setView('daily')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'daily' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => setView('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'monthly' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Ce mois
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          <Download className="w-4 h-4" />
          Exporter CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">{card.label}</p>
                <p className="text-xl font-bold text-slate-900">{card.value}</p>
                <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Transactions by type - bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Transactions par type</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pieData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip formatter={(v) => [v, 'Transactions']} />
                <Bar dataKey="value" fill="#1e3a5f" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-slate-400 text-sm">Aucune donnée</div>
          )}
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Répartition</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [v, 'Transactions']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-slate-400 text-sm">Aucune donnée</div>
          )}
        </div>
      </div>

      {/* Volume & Fees table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Récapitulatif financier</h3>
        </div>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-4 text-slate-500">Volume total traité</td>
              <td className="p-4 font-bold text-slate-900 text-right">{formatCurrency(report.totalVolume, 'XOF')}</td>
            </tr>
            <tr>
              <td className="p-4 text-slate-500">Frais plateforme (0.5% transferts)</td>
              <td className="p-4 font-bold text-green-600 text-right">{formatCurrency(report.totalFees, 'XOF')}</td>
            </tr>
            <tr>
              <td className="p-4 text-slate-500">Transactions totales</td>
              <td className="p-4 font-bold text-slate-900 text-right">{report.totalTransactions.toLocaleString()}</td>
            </tr>
            <tr>
              <td className="p-4 text-slate-500">Taux de conversion (frais/volume)</td>
              <td className="p-4 font-bold text-amber-600 text-right">
                {report.totalVolume > 0 ? ((report.totalFees / report.totalVolume) * 100).toFixed(2) + '%' : '—'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
