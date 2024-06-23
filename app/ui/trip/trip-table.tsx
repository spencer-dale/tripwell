'use client'

import { Trip } from '@/app/lib/types';
import TripCard from '../home/trip-card';

export default function TripTable(props: any) {

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {props.trips?.map((trip: Trip, idx: number) => (
              <div
                key={trip.trip_id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <TripCard
                    key={idx}
                    trip={trip}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
