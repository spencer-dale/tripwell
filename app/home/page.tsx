import { getAllTrips } from '../lib/db/trips';
import TripTable from '../ui/trip/trip-table';

export default async function Page() {
  const trips = await getAllTrips()
    return (
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        <TripTable
          trips={trips}
        />
      </div>
    );
  }