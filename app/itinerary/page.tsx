import ItineraryTable from "@/app/ui/itinerary/itinerary-table";
import Link from "next/link";

export default async function Page() {
  return <div>
    <Link
      key={"New Activity"}
      href={"/itinerary/new"}
      className="mt-4 w-half">
        + New Activity
    </Link>
    <ItineraryTable/>
  </div>
  }