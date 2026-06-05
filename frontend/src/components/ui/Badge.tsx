import { cn, getStatusColor } from '@/lib/utils';

interface BadgeProps {
  status?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variantClasses = {
  default: 'text-slate-600 bg-slate-100',
  success: 'text-green-700 bg-green-50',
  warning: 'text-yellow-700 bg-yellow-50',
  danger: 'text-red-700 bg-red-50',
  info: 'text-blue-700 bg-blue-50',
};

const statusLabels: Record<string, string> = {
  ACTIVE: 'Actif', SUSPENDED: 'Suspendu', PENDING_VERIFICATION: 'En attente',
  CLOSED: 'Fermé', COMPLETED: 'Complété', PENDING: 'En attente',
  PROCESSING: 'En cours', FAILED: 'Échoué', CANCELLED: 'Annulé',
  REVERSED: 'Inversé', BLOCKED: 'Bloqué', EXPIRED: 'Expiré',
  APPROVED: 'Approuvé', REJECTED: 'Refusé', OPEN: 'Ouvert',
  IN_PROGRESS: 'En cours', RESOLVED: 'Résolu',
  NONE: 'Non vérifié', LEVEL_1: 'Niveau 1', LEVEL_2: 'Niveau 2', LEVEL_3: 'Niveau 3',
  VIRTUAL: 'Virtuelle', PHYSICAL: 'Physique',
  FROZEN: 'Gelé', PENDING_ACTIVATION: 'À activer',
};

export default function Badge({ status, children, variant, className }: BadgeProps) {
  const colorClass = status ? getStatusColor(status) : (variant ? variantClasses[variant] : variantClasses.default);
  const label = status ? (statusLabels[status] || status) : children;

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', colorClass, className)}>
      {label}
    </span>
  );
}
