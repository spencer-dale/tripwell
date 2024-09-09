'use client'

import { Trip } from '@/app/lib/types';
import TripCard from '../home/trip-card';
import { NewItemButton } from '../itinerary/itinerary-table';

export default function TripTable(props: any) {

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle pb-4">
        <div className="rounded-lg p-2 md:pt-0">
          <div className="md:hidden">
            {props.trips?.map((trip: Trip, idx: number) => (
              <div
                key={trip.trip_id}
                className="mb-2 w-full rounded-md bg-white px-4 py-2"
              >
                <div className="flex items-center justify-between pb-4 drop-shadow-md">
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
      <NewItemButton/>
    </div>
  );
}
