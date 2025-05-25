'use client';

import { Destination, Activity } from '@/src/app/lib/types';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { MapPinIcon, BuildingOfficeIcon, CalendarIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/src/app/lib/utils';
import { convertToCAD } from '@/src/app/lib/currency';
import { PlansCalendar } from './plans-calendar';

interface PlaceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: Destination;
  activities: Activity[];
}

type ViewMode = 'list' | 'calendar';

export function PlaceDetailsModal({ isOpen, onClose, destination, activities }: PlaceDetailsModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const calculateNights = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights(destination.start_date.toString(), destination.end_date.toString());

  const formatUTCDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-900">
                        {destination.city || destination.region || destination.country}
                      </Dialog.Title>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4" />
                        <span>
                          {destination.city && `${destination.city}, `}
                          {destination.region && `${destination.region}, `}
                          {destination.country}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Accommodation Details */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-start gap-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900">{destination.accommodation.name}</h4>
                        <p className="mt-1 text-sm text-gray-500">{destination.accommodation.address}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Check-in: {formatUTCDate(new Date(destination.start_date))}</p>
                          <p>Check-out: {formatUTCDate(new Date(destination.end_date))}</p>
                          <p>{nights} {nights === 1 ? 'night' : 'nights'}</p>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-900">
                            Total Cost: {formatCurrency(
                              convertToCAD(
                                destination.accommodation.total_cost,
                                destination.accommodation.currency
                              )
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            Average nightly rate: {formatCurrency(
                              convertToCAD(
                                destination.accommodation.total_cost / nights,
                                destination.accommodation.currency
                              )
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activities Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Activities</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-lg ${
                            viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <ListBulletIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setViewMode('calendar')}
                          className={`p-2 rounded-lg ${
                            viewMode === 'calendar' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <CalendarIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {viewMode === 'list' ? (
                      <div className="space-y-4">
                        {activities.length > 0 ? (
                          activities.map((activity) => (
                            <div key={activity.activity_id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{activity.description}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(activity.activity_date).toLocaleString()}
                                </p>
                                {activity.category && (
                                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                    {activity.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 mb-2">No activities planned for this destination</p>
                            <p className="text-sm text-gray-400">Add activities to make the most of your stay</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg border">
                        <PlansCalendar
                          trip={{
                            trip_id: '',
                            name: '',
                            start_date: destination.start_date,
                            end_date: destination.end_date,
                            destinations: [destination],
                          }}
                          destinations={[destination]}
                          activities={activities}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 