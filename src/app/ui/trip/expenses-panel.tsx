import { Trip as TripType, Transaction, Activity } from '@/src/app/lib/types';
import { useState } from 'react';
import { ArrowLeftIcon, ChartBarIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { ExpenseCard } from './expense-card';
import { ExpenseDetailsPanel } from './expense-details-sheet';
import { ExpensesSummary } from '../expenses/expenses-summary';

type ViewMode = 'summary' | 'list';

interface ExpensesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripType;
  expenses: Transaction[];
  expenseItems: { [key: string]: JSX.Element };
  onEditExpense: (expense: Transaction) => void;
  onDeleteExpense: (expense: Transaction) => void;
  onLinkActivity: (expense: Transaction) => void;
  onUnlinkActivity: (expenseId: string, activityId: string) => void;
}

export function ExpensesPanel({
  isOpen,
  onClose,
  trip,
  expenses,
  expenseItems,
  onEditExpense,
  onDeleteExpense,
  onLinkActivity,
  onUnlinkActivity,
}: ExpensesPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('summary');
  const [selectedExpense, setSelectedExpense] = useState<Transaction | null>(null);

  return (
    <div
      className={`fixed inset-0 bg-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
            </button>
            <h2 className="text-xl font-semibold">Expenses</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('summary')}
              className={`p-2 rounded-lg ${
                viewMode === 'summary' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <ChartBarIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'summary' ? (
            <div className="space-y-6">
              <div className="space-y-6">
                <ExpensesSummary expenses={expenses} />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <ExpenseCard
                  key={expense.transaction_id}
                  expense={expense}
                  onClick={() => setSelectedExpense(expense)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expense Details Panel */}
      {selectedExpense && (
        <ExpenseDetailsPanel
          isOpen={!!selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onEdit={() => {
            setSelectedExpense(null);
            onEditExpense(selectedExpense);
          }}
          onDelete={() => {
            setSelectedExpense(null);
            onDeleteExpense(selectedExpense);
          }}
          onLinkActivity={() => {
            setSelectedExpense(null);
            onLinkActivity(selectedExpense);
          }}
          expense={selectedExpense}
          linkedActivities={[]} // TODO: Get linked activities
          onUnlinkActivity={(activityId) => onUnlinkActivity(selectedExpense.transaction_id, activityId)}
        />
      )}
    </div>
  );
} 