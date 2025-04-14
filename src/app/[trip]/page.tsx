import { getTransactionsByTripId } from '../lib/db/transactions';
import { getActivitiesByTripId, linkExpensesToActivity, unlinkExpense } from '../lib/db/activities';
import { Trip } from '../ui/trip/trip'
import { getTripById } from '../lib/db/trips';

export default async function Page({ params }: { params: { trip: string } }) {
  const trip = await getTripById(params.trip)
  if (!trip) return <div>Trip not found</div>
  
  const activities = await getActivitiesByTripId(trip.trip_id)
  const expenses = await getTransactionsByTripId(trip.trip_id)

  return (
    <>
      <Trip
        activities={JSON.parse(JSON.stringify(activities))}
        expenses={JSON.parse(JSON.stringify(expenses))}
        linkExpensesToActivity={linkExpensesToActivity}
        trip={trip}
        unlinkExpense={unlinkExpense}
      />
    </>
  );
}
