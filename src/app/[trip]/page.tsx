import { getTransactionsByTripId } from '../lib/db/transactions';
import { getActivitiesByTripId, linkExpensesToActivity, unlinkExpense } from '../lib/db/activities';
import { Trip as TripComponent } from '../ui/trip/trip'
import { getTripById } from '../lib/db/trips';
import { getTransportsByTripId } from '../lib/db/transports';
import { Activity, Transaction, SerializedActivity, SerializedTransaction, SerializedTrip, SerializedDestination, Destination, Trip } from '../lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Helper function to serialize MongoDB documents
function serializeData<T>(data: T): T extends Date ? string : T extends Array<infer U> ? Array<ReturnType<typeof serializeData<U>>> : T extends object ? { [K in keyof T as K extends '_id' | '__v' ? never : K]: ReturnType<typeof serializeData<T[K]>> } : T {
  if (!data) return null as any;
  if (Array.isArray(data)) {
    return data.map(item => serializeData(item)) as any;
  }
  if (data instanceof Date) {
    return data.toISOString() as any;
  }
  if (typeof data === 'object' && data !== null) {
    // Handle MongoDB documents
    if ('_doc' in data) {
      return serializeData(data._doc) as any;
    }
    const serialized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === '_id' || key === '__v' || key === '$__' || key === '$isNew') continue; // Skip MongoDB specific fields
      serialized[key] = serializeData(value);
    }
    return serialized as any;
  }
  return data as any;
}

// Helper functions to convert serialized objects back to their original types
function deserializeActivity(activity: SerializedActivity): Activity {
  return {
    ...activity,
    activity_date: new Date(activity.activity_date)
  };
}

function deserializeTransaction(transaction: SerializedTransaction): Transaction {
  return {
    ...transaction,
    transaction_date: new Date(transaction.transaction_date)
  };
}

function deserializeDestination(destination: SerializedDestination): Destination {
  return {
    ...destination,
    start_date: new Date(destination.start_date),
    end_date: new Date(destination.end_date)
  };
}

function deserializeTrip(trip: SerializedTrip): Trip {
  return {
    ...trip,
    start_date: new Date(trip.start_date),
    end_date: new Date(trip.end_date),
    destinations: trip.destinations.map(deserializeDestination)
  };
}

// Mark these functions as server actions
async function handleLinkExpensesToActivity(activityId: string, expenseId: string) {
  'use server';
  const activity = await getActivitiesByTripId(activityId);
  const expenses = await getTransactionsByTripId(expenseId);
  if (activity && expenses) {
    await linkExpensesToActivity(expenses, activity[0]);
  }
}

async function handleUnlinkExpense(expenseId: string) {
  'use server';
  const expenses = await getTransactionsByTripId(expenseId);
  if (expenses) {
    await unlinkExpense(expenses[0]);
  }
}

export default async function Page({ params }: { params: { trip: string } }) {
  const trip = await getTripById(params.trip)
  if (!trip) return <div>Trip not found</div>
  
  const [activities, expenses, transports] = await Promise.all([
    getActivitiesByTripId(trip.trip_id),
    getTransactionsByTripId(trip.trip_id),
    getTransportsByTripId(trip.trip_id)
  ])

  // Serialize all data before passing to client components
  const serializedTrip = serializeData(trip);
  const serializedActivities = serializeData(activities);
  // console.log("SERIALIZED ACTIVITIES")
  // console.log(serializedActivities)
  const serializedExpenses = serializeData(expenses);
  const serializedTransports = serializeData(transports);

  return (
    <div className="relative h-screen pb-16 overflow-hidden">
      <Image
        src="/trip-banner.png"
        alt="Trip banner"
        width={1920}
        height={240}
        priority
        className="w-full h-48 sm:h-56 md:h-64 object-cover fixed top-0 left-0 z-0"
        style={{ minHeight: '12rem', maxHeight: '20vh' }}
      />
      <div className="relative z-0 mt-48 sm:mt-56 md:mt-64">
        <TripComponent
          activities={serializedActivities}
          expenses={serializedExpenses}
          transports={serializedTransports}
          linkExpensesToActivity={handleLinkExpensesToActivity}
          trip={serializedTrip}
          unlinkExpense={handleUnlinkExpense}
        />
      </div>
    </div>
  );
}
