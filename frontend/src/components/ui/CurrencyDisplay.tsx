import { cn, formatCurrency } from '@/lib/utils';

interface CurrencyDisplayProps {
  amount: string | number;
  currency: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  positive?: boolean;
  negative?: boolean;
  className?: string;
  showSign?: boolean;
}

export default function CurrencyDisplay({
  amount, currency, size = 'md', positive, negative, className, showSign = false,
}: CurrencyDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl font-semibold',
    xl: 'text-3xl font-bold',
  };

  const colorClass = positive
    ? 'text-green-600'
    : negative
    ? 'text-red-600'
    : 'text-slate-900';

  const sign = showSign ? (positive ? '+' : negative ? '-' : '') : '';
  const formatted = formatCurrency(Math.abs(Number(amount)), currency);

  return (
    <span className={cn(sizeClasses[size], colorClass, className)}>
      {sign}{formatted}
    </span>
  );
}
