import { Transaction } from '@/src/app/lib/types';
import { formatCurrency } from '@/src/app/lib/utils';

interface ExpenseCardProps {
  expense: Transaction;
  onClick: () => void;
}

export function ExpenseCard({ expense, onClick }: ExpenseCardProps) {
  return (
    <div 
      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex-1">
        <p className="font-medium text-gray-900">{expense.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(expense.amount)} {expense.currency}
          </span>
          {expense.category && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
              {expense.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 