'use server'

import { getAllTrips } from '../lib/db/trips';
import { TripTable } from '../ui/trip/trip-table';
import { commissioner, questrial } from '../ui/fonts';
import { TripTables } from '../ui/trip/trips-nav'
import { Trip } from '../lib/types';
import { TripsTab } from '../ui/trip/trip-tabs'
import TripCard from '../ui/home/trip-card'

function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

export default async function Page() {
  const trips: Trip[] = await getAllTrips() || []
  const today = new Date()

  var currentTrip: Trip | undefined = trips.find((trip: Trip) => {
    const startDate = new Date(trip.start_date)
    const endDate = new Date(trip.end_date)
    return isValidDate(startDate) && isValidDate(endDate) && 
           startDate <= today && endDate >= today
  })

  var upcomingTrips: Trip[] = trips.filter((trip: Trip) => {
    const startDate = new Date(trip.start_date)
    return isValidDate(startDate) && startDate > today
  })

  var pastTrips: Trip[] = trips.filter((trip: Trip) => {
    const endDate = new Date(trip.end_date)
    return isValidDate(endDate) && endDate < today
  })

  let tripTables = new Map<TripsTab, JSX.Element>([
    [
      TripsTab.Past,
      <div>
        {pastTrips.length === 0 ? 
          <p className={`${questrial.className} text-center text-md text-gray-400 mb-0 pt-6`}>
            No past trips
          </p> :
          <></>
        }
        <TripTable
          trips={pastTrips}
        />
      </div>
    ],
    [
      TripsTab.Upcoming,
      <div>
        {upcomingTrips.length === 0 ? 
          <p className={`${questrial.className} text-center text-md text-gray-400 mb-0 pt-6`}>
            No upcoming trips - plan one!
          </p> :
          <></>
        }
        <TripTable
          trips={upcomingTrips}
        />
      </div>
    ],
  ])

  return (
    <div className="flex-grow pt-8">
      {currentTrip ? (
        <TripCard
          key={currentTrip.trip_id}
          trip={currentTrip}
        />
      ) : null}
      <div className="pt-8">
        <TripTables
          tripTables={tripTables}
        />
      </div>
    </div>
  );
}

function CurrentTrip(props: any) {
  return (
    <div>

    </div>
  );
}