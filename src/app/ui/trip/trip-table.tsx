'use server'

import { Trip } from '@/src/app/lib/types';
import TripCard from '../home/trip-card';

export async function TripTable(props: any) {

  return (
    <div>
      <div className="inline-block min-w-full align-middle pb-4">
        <div className="rounded-lg md:pt-0">
          <div className="md:hidden">
            {props.trips?.map((trip: Trip, idx: number) => (
              <div
                key={trip.trip_id}
                className="mb-2 w-full rounded-md bg-white"
              >
                <div className="flex items-center justify-between pb-2">
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
