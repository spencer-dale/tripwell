'use client';

import { Destination, Activity } from '@/src/app/lib/types';
import { Fragment } from 'react';
import { MapPinIcon, BuildingOfficeIcon, CalendarIcon, ListBulletIcon, PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/src/app/lib/utils';
import { convertToCAD } from '@/src/app/lib/currency';
import { PlansCalendar } from './plans-calendar';
import { useState } from 'react';

interface PlaceDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onAddActivity: () => void;
  onEditActivity: (activity: Activity) => void;
  destination: Destination;
  activities: Activity[];
}

type ViewMode = 'list' | 'calendar';

export function PlaceDetailsPanel({ 
  isOpen, 
  onClose, 
  onEdit,
  onAddActivity,
  onEditActivity,
  destination, 
  activities 
}: PlaceDetailsPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const calculateNights = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights(destination.start_date.toString(), destination.end_date.toString());

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
          <h2 className="text-xl font-semibold">Place Details</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={onEdit}
            >
              <PencilIcon className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Location Details */}
            <div>
              <h3 className="text-2xl font-semibold leading-6 text-gray-900">
                {destination.city || destination.region || destination.country}
              </h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <MapPinIcon className="h-4 w-4" />
                <span>
                  {destination.city && `${destination.city}, `}
                  {destination.region && `${destination.region}, `}
                  {destination.country}
                </span>
              </div>
            </div>

            {/* Accommodation Details */}
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">{destination.accommodation.name}</h4>
                  <p className="mt-1 text-sm text-gray-500">{destination.accommodation.address}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Check-in: {new Date(destination.start_date).toLocaleDateString()}</p>
                    <p>Check-out: {new Date(destination.end_date).toLocaleDateString()}</p>
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
                <div className="flex items-center gap-4">
                  <h4 className="text-lg font-medium text-gray-900">Activities</h4>
                  <button
                    onClick={onAddActivity}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add activity
                  </button>
                </div>
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
                      <div 
                        key={activity.activity_id} 
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => onEditActivity(activity)}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-500">
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
        </div>
      </div>
    </div>
  );
} 