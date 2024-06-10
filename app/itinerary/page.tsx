import ItineraryTable from "@/app/ui/itinerary/itinerary-table";
import Link from "next/link";
import { getAllActivities } from '@/app/lib/db/activities';

export default async function Page() {
  const activities = await getAllActivities()

  return <div>
    <Link
      key={"New Activity"}
      href={"/itinerary/new"}
      className="mt-4 w-half">
        + New Activity
    </Link>
    <ItineraryTable
      activities={JSON.parse(JSON.stringify(activities))}
    />
  </div>
  }