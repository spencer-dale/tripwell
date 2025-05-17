'use client';

import { useEffect, useState } from 'react';
import { Trip } from '@/src/app/lib/types';
import { PlusIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { getTripsData } from '@/src/app/lib/actions/trips';

interface TripSectionProps {
  title: string;
  trips: Trip[];
  emptyMessage: string;
  icon: React.ComponentType<{ className?: string }>;
}

function TripSection({ title, trips, emptyMessage, icon: Icon }: TripSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {trips.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Link
              key={trip.trip_id}
              href={`/${trip.trip_id}`}
              className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
            >
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">{trip.name}</h3>
                <div className="text-sm text-gray-500">
                  <p>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</p>
                  <p>{trip.destinations.length} destinations</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TripsPage() {
  const [currentTrips, setCurrentTrips] = useState<Trip[]>([]);
  const [pastTrips, setPastTrips] = useState<Trip[]>([]);
  const [invitations, setInvitations] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPastTrips, setShowPastTrips] = useState(false);

  useEffect(() => {
    async function loadTrips() {
      try {
        const data = await getTripsData();
        setCurrentTrips(data.currentTrips);
        setPastTrips(data.pastTrips);
        setInvitations(data.invitations);
      } catch (error) {
        console.error('Error loading trips:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTrips();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
        <Link
          href="/trips/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Trip</span>
        </Link>
      </div>

      <div className="space-y-8">
        <TripSection
          title="Current & Upcoming"
          trips={currentTrips}
          emptyMessage="No current or upcoming trips. Create a new trip to get started!"
          icon={CalendarIcon}
        />

        {pastTrips.length > 0 && (
          <>
            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-gray-200" />
              <button
                onClick={() => setShowPastTrips((prev) => !prev)}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
              >
                <ClockIcon className="h-4 w-4" />
                <span>{showPastTrips ? `Hide Past Trips` : `View Past Trips (${pastTrips.length})`}</span>
              </button>
              <div className="flex-1 border-t border-gray-200" />
            </div>
            {showPastTrips && (
              <TripSection
                title="Past Trips"
                trips={pastTrips}
                emptyMessage="No past trips."
                icon={ClockIcon}
              />
            )}
          </>
        )}

        <TripSection
          title="Trip Invitations"
          trips={invitations}
          emptyMessage="No pending trip invitations"
          icon={CalendarIcon}
        />
      </div>
    </div>
  );
}