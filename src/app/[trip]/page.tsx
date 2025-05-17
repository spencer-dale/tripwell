import { getTransactionsByTripId } from '../lib/db/transactions';
import { getActivitiesByTripId, linkExpensesToActivity, unlinkExpense } from '../lib/db/activities';
import { Trip } from '../ui/trip/trip'
import { getTripById } from '../lib/db/trips';
import { getTransportsByTripId } from '../lib/db/transports';
import { Activity, Transaction } from '../lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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

  return (
    <div className="relative h-[87vh] overflow-hidden">
      <Image
        src="/trip-banner.png"
        alt="Trip banner"
        width={1920}
        height={240}
        priority
        className="w-full h-48 sm:h-56 md:h-64 object-cover fixed top-0 left-0 z-0"
        style={{ minHeight: '12rem', maxHeight: '20vh' }}
      />
      <Link
        href="/trips"
        className="absolute top-4 left-4 z-2 bg-white rounded-full shadow-lg p-2 flex items-center justify-center hover:bg-gray-100 transition-colors"
        style={{ width: 40, height: 40 }}
      >
        <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
      </Link>
      <div className="relative z-1 pt-48 sm:pt-56 md:pt-64 h-full">
        <Trip
          activities={JSON.parse(JSON.stringify(activities))}
          expenses={JSON.parse(JSON.stringify(expenses))}
          transports={JSON.parse(JSON.stringify(transports))}
          linkExpensesToActivity={handleLinkExpensesToActivity}
          trip={trip}
          unlinkExpense={handleUnlinkExpense}
        />
      </div>
    </div>
  );
}
