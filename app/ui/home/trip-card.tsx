import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function TripCard(props: any) {
  return (
    <Link
      key={"Trip"}
      href={"/" + props.trip.trip_id}
      className={'flex h-[64px] grow items-center justify-center gap-2 rounded-md bg-sky-100 p-3 text-blue-600 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'}
    >
      {props.trip.name} <ArrowRightIcon className="ml-auto h-5 w-5 text-blue-600" />
    </Link>
  );
}