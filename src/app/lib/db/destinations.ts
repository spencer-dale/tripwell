import { connectDb } from './conn';
import { Destination } from '../types';
import { DestinationFormState } from '../../ui/trip/destination-form/types';
import { destinations } from './models';
import { Document } from 'mongoose';

interface DestinationDocument extends Document, Omit<Destination, 'destination_id'> {
  destination_id: string;
}

export async function createDestination(tripId: string, data: DestinationFormState): Promise<Destination> {
  await connectDb();

  const destination = new destinations({
    destination_id: crypto.randomUUID(),
    trip_id: tripId,
    start_date: data.start_date,
    end_date: data.end_date,
    country: data.country,
    city: data.city,
    region: data.region,
    accommodation: {
      name: data.accommodation.name,
      type: data.accommodation.type,
      address: data.accommodation.address,
      total_cost: data.accommodation.cost,
      currency: data.accommodation.currency,
    },
  });

  await destination.save();
  return destination.toObject();
}

export async function updateDestination(destinationId: string, data: DestinationFormState): Promise<Destination | null> {
  await connectDb();

  const destination = await destinations.findOneAndUpdate(
    { destination_id: destinationId },
    {
      start_date: data.start_date,
      end_date: data.end_date,
      country: data.country,
      city: data.city,
      region: data.region,
      accommodation: {
        name: data.accommodation.name,
        type: data.accommodation.type,
        address: data.accommodation.address,
        total_cost: data.accommodation.cost,
        currency: data.accommodation.currency,
      },
    },
    { new: true }
  );

  return destination?.toObject() || null;
}

export async function deleteDestination(destinationId: string): Promise<boolean> {
  await connectDb();

  const result = await destinations.deleteOne({ destination_id: destinationId });
  return result.deletedCount > 0;
}

export async function getDestinationsByTripId(tripId: string): Promise<Destination[]> {
  await connectDb();

  const results = await destinations.find({ trip_id: tripId });
  return results.map((doc: DestinationDocument) => doc.toObject());
} 