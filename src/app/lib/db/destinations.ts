import { connectDb } from './conn';
import { Destination } from '../types';
import { DestinationFormState } from '../../ui/trip/destination-form/types';
import { trips } from './models';
import { Document } from 'mongoose';

interface DestinationDocument extends Document, Omit<Destination, 'destination_id'> {
  destination_id: string;
}

export async function createDestination(tripId: string, data: Partial<Destination>): Promise<Destination> {
  await connectDb();

  const destination = {
    destination_id: crypto.randomUUID(),
    start_date: data.start_date,
    end_date: data.end_date,
    country: data.country,
    city: data.city,
    region: data.region,
    accommodation: {
      name: data.accommodation?.name || '',
      type: data.accommodation?.type || 'hotel',
      address: data.accommodation?.address || '',
      total_cost: data.accommodation?.total_cost || 0,
      currency: data.accommodation?.currency || 'USD',
    },
    activity_ids: [],
  };

  const trip = await trips.findOneAndUpdate(
    { trip_id: tripId },
    { $push: { destinations: destination } },
    { new: true }
  );

  if (!trip) {
    throw new Error('Trip not found');
  }

  return trip.destinations[trip.destinations.length - 1];
}

export async function updateDestination(destinationId: string, data: Partial<Destination>): Promise<Destination | null> {
  await connectDb();

  const trip = await trips.findOneAndUpdate(
    { 'destinations.destination_id': destinationId },
    {
      $set: {
        'destinations.$.start_date': data.start_date,
        'destinations.$.end_date': data.end_date,
        'destinations.$.country': data.country,
        'destinations.$.city': data.city,
        'destinations.$.region': data.region,
        'destinations.$.accommodation': {
          name: data.accommodation?.name || '',
          type: data.accommodation?.type || 'hotel',
          address: data.accommodation?.address || '',
          total_cost: data.accommodation?.total_cost || 0,
          currency: data.accommodation?.currency || 'USD',
        },
      }
    },
    { new: true }
  );

  if (!trip) {
    return null;
  }

  return trip.destinations.find((d: Destination) => d.destination_id === destinationId) || null;
}

export async function deleteDestination(destinationId: string): Promise<boolean> {
  await connectDb();

  const result = await trips.updateOne(
    { 'destinations.destination_id': destinationId },
    { $pull: { destinations: { destination_id: destinationId } } }
  );

  return result.modifiedCount > 0;
}

export async function getDestinationsByTripId(tripId: string): Promise<Destination[]> {
  await connectDb();

  const trip = await trips.findOne({ trip_id: tripId });
  return trip?.destinations || [];
} 