'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/wallet': 'Portefeuille',
  '/transactions': 'Transactions',
  '/cards': 'Mes Cartes',
  '/payments': 'Paiements',
  '/transfers': 'Transferts',
  '/kyc': 'Vérification d\'identité',
  '/settings': 'Paramètres',
  '/admin': 'Administration',
  '/admin/users': 'Gestion des utilisateurs',
  '/admin/kyc': 'Validation KYC',
  '/admin/transactions': 'Toutes les transactions',
  '/admin/reports': 'Rapports',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const title = pageTitles[pathname] || 'Neero';

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 shadow-xl">
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
