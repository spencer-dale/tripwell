import { Transaction, Activity } from '@/src/app/lib/types';
import { useState } from 'react';
import { ArrowLeftIcon, PencilIcon, TrashIcon, ClockIcon, TagIcon, CurrencyDollarIcon, LinkIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/src/app/lib/utils';
import { LinkedActivitiesTable } from '../itinerary/itinerary-table';

interface ExpenseDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onLinkActivity: () => void;
  expense: Transaction;
  linkedActivities: Activity[];
  onUnlinkActivity: (activityId: string) => void;
}

export function ExpenseDetailsPanel({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onLinkActivity,
  expense,
  linkedActivities,
  onUnlinkActivity,
}: ExpenseDetailsPanelProps) {
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
            <h2 className="text-xl font-semibold">Expense Details</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={onEdit}
            >
              <PencilIcon className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-full hover:bg-red-100"
            >
              <TrashIcon className="h-5 w-5 text-red-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Expense Details */}
            <div>
              <h3 className="text-2xl font-semibold leading-6 text-gray-900">
                {expense.description}
              </h3>
            </div>

            {/* Amount, Date, and Category */}
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Amount</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatCurrency(expense.amount)} {expense.currency}
                    </p>
                  </div>
                </div>

                {expense.category && (
                  <div className="flex items-start gap-3">
                    <TagIcon className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Category</h4>
                      <p className="mt-1 text-sm text-gray-500">{expense.category}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Linked Activities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Linked Activities</h4>
                <button
                  onClick={onLinkActivity}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  <LinkIcon className="h-4 w-4" />
                  Link activity
                </button>
              </div>
              {linkedActivities.length > 0 ? (
                <LinkedActivitiesTable
                  activities={linkedActivities}
                  unlinkActivity={onUnlinkActivity}
                />
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-2">No activities linked to this expense</p>
                  <p className="text-sm text-gray-400">Link activities to track what you spent on</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 