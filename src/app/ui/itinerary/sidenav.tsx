'use client'

import { commissioner, questrial } from '../fonts';
import { Trip } from '@/src/app/lib/types';
import { Users } from "lucide-react"

interface SideNavProps {
  trip: Trip;
}

export default function SideNav({ trip }: SideNavProps) {
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!isFinite(dateObj.getTime())) {
      return 'Invalid date';
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(dateObj);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col px-6 py-2">
        <p className={`${commissioner.className} text-2xl font-bold m-0`}>
          {trip.name}
        </p>
        <p className={`${questrial.className} text-md text-gray-400 m-0`}>
          {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
        </p>
        <div className="my-2">
          <button
            className="rounded-full border-dashed border-2 flex items-center gap-2 px-4"
            // onClick={...} // To be implemented later
          >
            <Users className="h-5 w-5" />
            <span>Invite</span>
          </button>
        </div>
      </div>
    </div>
  );
}
