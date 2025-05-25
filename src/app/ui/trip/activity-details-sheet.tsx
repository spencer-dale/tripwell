import { Activity, Transaction } from '@/src/app/lib/types';
import { Sheet } from '../sheet';
import { Button } from '../button';
import { commissioner, questrial } from '../fonts';
import { formatDate } from '@/src/app/lib/utils';
import { LinkedExpenseTable } from '../itinerary/link-expense-modal';
import { useState } from 'react';
import { ArrowLeftIcon, PencilIcon, TrashIcon, ClockIcon, TagIcon, MapPinIcon, LinkIcon } from '@heroicons/react/24/outline';

interface ActivityDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddExpense: () => void;
  activity: Activity;
  linkedExpenses: Transaction[];
  onUnlinkExpense: (expenseId: string) => void;
}

export function ActivityDetailsPanel({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onAddExpense,
  activity,
  linkedExpenses,
  onUnlinkExpense,
}: ActivityDetailsPanelProps) {
  const [notes, setNotes] = useState(activity.notes || '');

  return (
    <div
      className={`fixed inset-0 bg-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ height: 'calc(100vh - 4rem)' }} // 4rem for bottom nav
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
            <h2 className="text-xl font-semibold">Activity Details</h2>
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
            {/* Activity Details */}
            <div>
              <h3 className="text-2xl font-semibold leading-6 text-gray-900">
                {activity.description}
              </h3>
            </div>

            {/* Time and Category */}
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ClockIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Date & Time</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(activity.activity_date).toLocaleString('en-US', {
                        timeZone: 'UTC',
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                </div>

                {activity.category && (
                  <div className="flex items-start gap-3">
                    <TagIcon className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Category</h4>
                      <p className="mt-1 text-sm text-gray-500">{activity.category}</p>
                    </div>
                  </div>
                )}

                {activity.location && (
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Location</h4>
                      <p className="mt-1 text-sm text-gray-500">{activity.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Notes</h4>
              <textarea
                className={`${questrial.className} w-full h-32 p-3 border rounded-lg resize-none`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this activity..."
              />
            </div>

            {/* Linked Expenses */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Linked Expenses</h4>
                <button
                  onClick={onAddExpense}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  <LinkIcon className="h-4 w-4" />
                  Link expense
                </button>
              </div>
              {linkedExpenses.length > 0 ? (
                <LinkedExpenseTable
                  expenses={linkedExpenses}
                  unlinkExpense={onUnlinkExpense}
                />
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-2">No expenses linked to this activity</p>
                  <p className="text-sm text-gray-400">Link expenses to track costs</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 