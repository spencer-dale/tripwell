'use client'

import InvoiceStatus from '@/app/ui/expenses/status';
import { formatCurrency } from '@/app/lib/utils';
import { Activity, Transaction } from '../../lib/types';
import { commissioner, questrial } from '../fonts';

export function ExpensesTable(props: any) {

  if (!props.show) { return <></> }

  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
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
        <div className="rounded-lg p-2 bg-gray-50 md:pt-0">
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
      className="mb-2 w-full rounded-md"
    >
      <p>{expense.transaction_date}</p>
      <div className="flex items-center justify-between ps-4">
        <div>
          <div className="flex items-center">
            <p className={`${questrial.className} text-me`}>
              {expense.description}
            </p>
          </div>
        </div>
        <InvoiceStatus status="paid" />
      </div>
      <div className="flex w-full items-center justify-between ps-4">
        <div>
          <p className={`${commissioner.className} text-me font-semibold`}>
            {formatCurrency(expense.amount)}
          </p>
        </div>
        <p className="text-sm text-gray-500">{expense.currency}</p>
      </div>
    </div>
  );
}
