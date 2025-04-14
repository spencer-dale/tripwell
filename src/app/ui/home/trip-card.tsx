import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function TripCard(props: any) {
  const dateToDisplay = (uncastDate: Date) => {
    let date: Date = new Date(uncastDate)
    let localDate: Date = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
    return localDate.toDateString()
  }

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(dateObj);
  }

  return (
    <Link
      key={"Trip"}
      href={"/" + props.trip.trip_id}
      className={'flex h-[64px] grow items-center justify-center gap-2 rounded-md bg-[#F4F3F7] p-3 text-[#4A5957] text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3 drop-shadow-md'}
    >
      <div>
        <p className="decoration-0 mb-0">
          {props.trip.name}
        </p>
        <p className="decoration-0 mb-0 text-gray-400">
          {formatDate(props.trip.start_date)} - {formatDate(props.trip.end_date)}
        </p>
      </div>
      <ArrowRightIcon className="ml-auto h-5 w-5 text-[#4A5957]" />
    </Link>
  );
}