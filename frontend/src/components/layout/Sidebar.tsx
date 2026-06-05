'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { getUserDisplayName, cn } from '@/lib/utils';
import {
  LayoutDashboard, Wallet, ArrowLeftRight, CreditCard, ShoppingBag,
  Send, Shield, Settings, Users, BarChart3, HelpCircle, LogOut, X, Menu,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/wallet', label: 'Portefeuille', icon: Wallet },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/cards', label: 'Cartes', icon: CreditCard },
  { href: '/payments', label: 'Paiements', icon: ShoppingBag },
  { href: '/transfers', label: 'Transferts', icon: Send },
  { href: '/kyc', label: 'Vérification', icon: Shield },
  { href: '/settings', label: 'Paramètres', icon: Settings },
];

const adminNavItems = [
  { href: '/admin', label: 'Admin', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users },
  { href: '/admin/kyc', label: 'KYC', icon: Shield },
  { href: '/admin/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/admin/reports', label: 'Rapports', icon: BarChart3 },
];

interface SidebarProps {
  onClose?: () => void;
  mobile?: boolean;
}

export default function Sidebar({ onClose, mobile }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role !== 'USER';

  const displayName = getUserDisplayName(user || {});
  const initial = displayName.charAt(0).toUpperCase();

  const items = pathname.startsWith('/admin') ? adminNavItems : navItems;

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-xl text-blue-900">Neero</span>
        </div>
        {mobile && (
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(isActive ? 'nav-link-active' : 'nav-link')}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}

        {isAdmin && !pathname.startsWith('/admin') && (
          <>
            <div className="pt-4 pb-2">
              <p className="text-xs font-semibold text-slate-400 uppercase px-3">Administration</p>
            </div>
            {adminNavItems.slice(0, 2).map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={onClose} className="nav-link">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            {user?.profile?.profilePicture ? (
              <img src={user.profile.profilePicture} alt="" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <span className="text-blue-900 font-semibold text-sm">{initial}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || user?.phone}</p>
          </div>
        </div>
        <Link href="/settings/support" className="nav-link mb-1">
          <HelpCircle className="w-4 h-4" />
          <span className="text-sm">Support</span>
        </Link>
        <button
          onClick={logout}
          className="nav-link w-full text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
