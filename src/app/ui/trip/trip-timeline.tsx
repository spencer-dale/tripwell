'use client'

import { Trip, Destination } from '@/src/app/lib/types';
import { convertToCAD, formatCurrency } from '@/src/app/lib/currency';
import { ArrowRightIcon, HomeIcon, MapPinIcon, BuildingOfficeIcon, ChevronDownIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Button } from '../button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface TripTimelineProps {
  trip: Trip;
  onViewItinerary: () => void;
}

export function TripTimeline({ trip, onViewItinerary }: TripTimelineProps) {
  const router = useRouter();
  const [expandedDestinations, setExpandedDestinations] = useState<Set<string>>(new Set());

  // Sort destinations by start date
  const sortedDestinations = [...trip.destinations].sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  const toggleDestination = (destinationId: string) => {
    const newExpanded = new Set(expandedDestinations);
    if (newExpanded.has(destinationId)) {
      newExpanded.delete(destinationId);
    } else {
      newExpanded.add(destinationId);
    }
    setExpandedDestinations(newExpanded);
  };

  const renderLocation = (destination: Destination) => {
    if (destination.city) {
      return (
        <div>
          <div className="font-medium">{destination.city}</div>
          <div className="text-sm text-gray-500">
            {destination.region && <div>{destination.region}, {destination.country}</div>}
          </div>
        </div>
      );
    } else if (destination.region) {
      return (
        <div>
          <div className="font-medium">{destination.region}</div>
          <div className="text-sm text-gray-500">{destination.country}</div>
        </div>
      );
    } else {
      return <div className="font-medium">{destination.country}</div>;
    }
  };

  const formatUTCDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Timeline</h2>
        <Button
          onClick={onViewItinerary}
          className="flex items-center gap-2"
        >
          View Itinerary
          <ArrowRightIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {/* Departure (Start) */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center relative">
              <HomeIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Departure</div>
              <div className="text-sm text-gray-500">
                {new Date(trip.start_date).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Destinations */}
          {sortedDestinations.map((destination, index) => (
            <div key={destination.destination_id} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center relative">
                <span className="text-sm font-medium text-blue-500">{index + 1}</span>
              </div>
              <div className="flex-1">
                {/* Collapsed View */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mt-1" />
                      {renderLocation(destination)}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <BuildingOfficeIcon className="h-4 w-4" />
                      <span>{destination.accommodation.name} • {calculateNights(destination.start_date, destination.end_date)} nights</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleDestination(destination.destination_id)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ChevronDownIcon 
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        expandedDestinations.has(destination.destination_id) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Expanded View */}
                {expandedDestinations.has(destination.destination_id) && (
                  <div className="mt-4 pl-7 border-l-2 border-gray-100">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Dates</div>
                        <div className="mt-1 text-sm text-gray-900">
                          {formatUTCDate(new Date(destination.start_date))} - 
                          {formatUTCDate(new Date(destination.end_date))}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">Accommodation Details</div>
                        <div className="mt-1 text-sm text-gray-900">{destination.accommodation.address}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">Accommodation Cost</div>
                        <div className="mt-1 text-sm text-gray-900">
                          {formatCurrency(
                            convertToCAD(
                              destination.accommodation.total_cost,
                              destination.accommodation.currency
                            )
                          )}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          Average nightly rate: {formatCurrency(
                            convertToCAD(
                              destination.accommodation.total_cost / calculateNights(destination.start_date, destination.end_date),
                              destination.accommodation.currency
                            )
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                          <PencilIcon className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Return (End) */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center relative">
              <HomeIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Return</div>
              <div className="text-sm text-gray-500">
                {new Date(trip.end_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateNights(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
