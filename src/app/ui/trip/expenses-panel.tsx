import { Trip, Transaction } from '@/src/app/lib/types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { TripExpenses } from './trip-expenses';

interface ExpensesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  expenses: Transaction[];
  expenseItems: { [key: string]: JSX.Element };
}

export function ExpensesPanel({
  isOpen,
  onClose,
  trip,
  expenses,
  expenseItems,
}: ExpensesPanelProps) {
  return (
    <div
      className={`fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">All Expenses</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <TripExpenses
              expenseItems={expenseItems}
              expenses={expenses}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 