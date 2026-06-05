import { Transaction } from '@/types';
import { formatCurrency, formatRelativeTime, getTransactionLabel, isTransactionCredit, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Badge from './Badge';

const transactionIcons: Record<string, { bg: string; text: string; symbol: string }> = {
  DEPOSIT: { bg: 'bg-green-100', text: 'text-green-600', symbol: '↓' },
  WITHDRAWAL: { bg: 'bg-red-100', text: 'text-red-600', symbol: '↑' },
  TRANSFER_IN: { bg: 'bg-blue-100', text: 'text-blue-600', symbol: '↙' },
  TRANSFER_OUT: { bg: 'bg-orange-100', text: 'text-orange-600', symbol: '↗' },
  PAYMENT: { bg: 'bg-purple-100', text: 'text-purple-600', symbol: '◆' },
  REFUND: { bg: 'bg-teal-100', text: 'text-teal-600', symbol: '↩' },
  FEE: { bg: 'bg-slate-100', text: 'text-slate-600', symbol: '⚙' },
  CURRENCY_CONVERSION: { bg: 'bg-indigo-100', text: 'text-indigo-600', symbol: '⇄' },
};

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

export default function TransactionItem({ transaction, onClick }: TransactionItemProps) {
  const icon = transactionIcons[transaction.type] || transactionIcons.PAYMENT;
  const isCredit = isTransactionCredit(transaction.type);
  const amount = parseFloat(transaction.amount);

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg transition-colors',
        onClick && 'cursor-pointer hover:bg-slate-50'
      )}
      onClick={onClick}
    >
      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', icon.bg)}>
        <span className={cn('text-lg', icon.text)}>{icon.symbol}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">
          {transaction.description || getTransactionLabel(transaction.type)}
        </p>
        <p className="text-xs text-slate-500">{formatRelativeTime(transaction.createdAt)}</p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className={cn('text-sm font-semibold', isCredit ? 'text-green-600' : 'text-red-600')}>
          {isCredit ? '+' : '-'}{formatCurrency(amount, transaction.currency)}
        </p>
        <Badge status={transaction.status} className="mt-0.5" />
      </div>
    </div>
  );
}
