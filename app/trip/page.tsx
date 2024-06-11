import { getAllTransactions } from '../lib/db/transactions';
import { getAllActivities } from '../lib/db/activities';
import { Trip } from '../ui/trip/trip'

export default async function Page() {
  

  const activities = await getAllActivities()
  const expenses = await getAllTransactions()

  return (
    <>
      <Trip
        activities={JSON.parse(JSON.stringify(activities))}
        expenses={JSON.parse(JSON.stringify(expenses))}
      />
    </>
  );
}