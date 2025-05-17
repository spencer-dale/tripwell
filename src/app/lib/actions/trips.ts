'use server';

import { getAllTrips, createTrip } from '../db/trips';
import { Trip } from '../types';

function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

export async function getTripsData() {
  try {
    const allTrips = await getAllTrips();
    const today = new Date();

    const currentTrips = allTrips.filter((trip: Trip) => {
      const startDate = new Date(trip.start_date);
      const endDate = new Date(trip.end_date);
      return isValidDate(startDate) && isValidDate(endDate) && 
             startDate <= today && endDate >= today;
    });

    const upcomingTrips = allTrips.filter((trip: Trip) => {
      const startDate = new Date(trip.start_date);
      return isValidDate(startDate) && startDate > today;
    });

    const pastTrips = allTrips.filter((trip: Trip) => {
      const endDate = new Date(trip.end_date);
      return isValidDate(endDate) && endDate < today;
    });

    // TODO: Implement invitations logic
    const invitations: Trip[] = [];

    return {
      currentTrips: [...currentTrips, ...upcomingTrips],
      pastTrips,
      invitations,
    };
  } catch (error) {
    console.error('Error fetching trips:', error);
    return {
      currentTrips: [],
      pastTrips: [],
      invitations: [],
    };
  }
}

export async function handleCreateTrip({ name, start_date, end_date }: { name: string; start_date: string; end_date: string }) {
  const trip: Trip = {
    trip_id: crypto.randomUUID(),
    name,
    start_date: new Date(start_date),
    end_date: new Date(end_date),
    destinations: [],
  };
  await createTrip(trip);
  return trip;
} 