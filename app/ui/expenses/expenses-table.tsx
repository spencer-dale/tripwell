'use client'

import InvoiceStatus from '@/app/ui/expenses/status';
import { formatCurrency } from '@/app/lib/utils';

export default function ExpensesTable(props: any) {

  if (!props.show) { return <></> }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {props.expenses?.map((expense: any) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
