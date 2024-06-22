'use client'

import InvoiceStatus from '@/app/ui/expenses/status';
import { formatCurrency } from '@/app/lib/utils';
import { Activity, Transaction } from '../../lib/types';

export function ExpensesTable(props: any) {

  if (!props.show) { return <></> }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {props.expenses?.map((expense: Transaction) => (
              <div key={expense.transaction_id}>
                <ExpenseTableItem
                  expense={expense}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SelectableExpenseTable(props: any) {
  let activity: Activity = props.activity
  
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {props.expenses?.map((expense: Transaction) => (
              <button
                key={expense.transaction_id}
                onClick={async () => await props.linkExpenseToActivity(expense, activity)}
              >
                <ExpenseTableItem
                  expense={expense}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExpenseTableItem(props: any) {
  let expense: Transaction = props.expense
  return (
    <div
      key={expense.transaction_id}
      className="mb-2 w-full rounded-md bg-white p-4"
    >
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <div className="mb-2 flex items-center">
            <p>{expense.description}</p>
          </div>
          <p className="text-sm text-gray-500">{expense.currency}</p>
        </div>
        <InvoiceStatus status="paid" />
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <p className="text-xl font-medium">
            {formatCurrency(expense.amount)}
          </p>
          <p>{expense.transaction_date}</p>
        </div>
      </div>
    </div>
  );
}
