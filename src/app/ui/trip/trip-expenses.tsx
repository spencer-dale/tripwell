'use client'

import { ExpensesTable } from '../expenses/expenses-table';
import { ExpensesSummary } from '../expenses/expenses-summary';
import { Transaction } from '@/src/app/lib/types';

interface LinkedItems {
  [key: string]: JSX.Element;
}

interface TripExpensesProps {
  expenseItems: LinkedItems;
  expenses: Transaction[];
}

export function TripExpenses({ expenseItems, expenses }: TripExpensesProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ExpensesSummary expenses={expenses} />
        </div>
        <div>
          <ExpensesTable
            expenses={expenses}
            expenseItems={expenseItems}
          />
        </div>        
      </div>
    </div>
  );
}