import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  XOF: 'FCFA', XAF: 'FCFA', USD: '$', EUR: '€',
  GBP: '£', NGN: '₦', GHS: 'GH₵', KES: 'KSh', MAD: 'MAD', CDF: 'FC',
};

export function formatCurrency(amount: string | number, currency: string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return `0 ${CURRENCY_SYMBOLS[currency] || currency}`;

  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'XOF' || currency === 'XAF' ? 0 : 2,
  }).format(num);

  return `${formatted} ${symbol}`;
}

export function formatDate(date: string, includeTime = true): string {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' }),
  };
  return d.toLocaleDateString('fr-FR', options);
}

export function formatRelativeTime(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "À l'instant";
  if (diffMins < 60) return `il y a ${diffMins} min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays < 7) return `il y a ${diffDays}j`;
  return formatDate(date, false);
}

export function getTransactionIcon(type: string): string {
  const icons: Record<string, string> = {
    DEPOSIT: '↓', WITHDRAWAL: '↑', TRANSFER_IN: '↙', TRANSFER_OUT: '↗',
    PAYMENT: '◆', REFUND: '↩', FEE: '⚙', CURRENCY_CONVERSION: '⇄',
  };
  return icons[type] || '●';
}

export function isTransactionCredit(type: string): boolean {
  return ['DEPOSIT', 'TRANSFER_IN', 'REFUND'].includes(type);
}

export function getTransactionLabel(type: string): string {
  const labels: Record<string, string> = {
    DEPOSIT: 'Dépôt', WITHDRAWAL: 'Retrait', TRANSFER_IN: 'Reçu',
    TRANSFER_OUT: 'Envoyé', PAYMENT: 'Paiement', REFUND: 'Remboursement',
    FEE: 'Frais', CURRENCY_CONVERSION: 'Conversion',
  };
  return labels[type] || type;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    COMPLETED: 'text-green-600 bg-green-50',
    PENDING: 'text-yellow-600 bg-yellow-50',
    PROCESSING: 'text-blue-600 bg-blue-50',
    FAILED: 'text-red-600 bg-red-50',
    CANCELLED: 'text-gray-600 bg-gray-50',
    REVERSED: 'text-orange-600 bg-orange-50',
    ACTIVE: 'text-green-600 bg-green-50',
    SUSPENDED: 'text-red-600 bg-red-50',
    BLOCKED: 'text-red-600 bg-red-50',
    APPROVED: 'text-green-600 bg-green-50',
    REJECTED: 'text-red-600 bg-red-50',
    OPEN: 'text-blue-600 bg-blue-50',
    IN_PROGRESS: 'text-yellow-600 bg-yellow-50',
    RESOLVED: 'text-green-600 bg-green-50',
    CLOSED: 'text-gray-600 bg-gray-50',
  };
  return colors[status] || 'text-gray-600 bg-gray-50';
}

export function getKYCLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    NONE: 'Non vérifié', LEVEL_1: 'Niveau 1', LEVEL_2: 'Niveau 2', LEVEL_3: 'Niveau 3',
  };
  return labels[level] || level;
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str;
}

export function getUserDisplayName(user: { profile?: { firstName?: string | null; lastName?: string | null } | null; email?: string | null; phone?: string | null }): string {
  if (user.profile?.firstName || user.profile?.lastName) {
    return `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim();
  }
  return user.email || user.phone || 'Utilisateur';
}
