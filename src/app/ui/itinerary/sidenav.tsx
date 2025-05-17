'use client'

import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { commissioner, questrial } from '../fonts';
import { Trip } from '@/src/app/lib/types';
import { Tab } from './types';
import { Users } from "lucide-react"

interface SideNavProps {
  activeTab: Tab;
  switchToOverview: () => void;
  switchToTrip: () => void;
  switchToPlans: () => void;
  switchToSpend: () => void;
  trip: Trip;
}

interface TabSelectedProps {
  isSelected: boolean;
  onClick: () => void;
  label: string;
}

export default function SideNav({ activeTab, switchToOverview, switchToTrip, switchToPlans, switchToSpend, trip }: SideNavProps) {
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
    <>
      <div className="flex h-full flex-col">
        <div className="flex flex-col py-2 items-left">
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
        <div className={`${commissioner.className} text-base text-center text-gray-500 border-gray-200`}>
          <ul className="m-0 p-0 flex flex-row grid grid-cols-4">
            <li className="col-span-1" onClick={switchToOverview}>
              <p className={`font-${activeTab === Tab.Overview ? 'medium' : 'light'} inline-block p-1 ${activeTab === Tab.Overview ? 'text-[#4A5957] border-b-2 border-black rounded-t-lg' : 'text-gray-500'}`}>
                Overview
              </p>
            </li>
            <li className="col-span-1" onClick={switchToTrip}>
              <p className={`font-${activeTab === Tab.Trip ? 'medium' : 'light'} inline-block p-1 ${activeTab === Tab.Trip ? 'text-[#4A5957] border-b-2 border-black rounded-t-lg' : 'text-gray-500'}`}>
                Trip
              </p>
            </li>
            <li className="col-span-1" onClick={switchToPlans}>
              <p className={`font-${activeTab === Tab.Plans ? 'medium' : 'light'} inline-block p-1 ${activeTab === Tab.Plans ? 'text-[#4A5957] border-b-2 border-black rounded-t-lg' : 'text-gray-500'}`}>
                Plans
              </p>
            </li>
            <li className="col-span-1" onClick={switchToSpend}>
              <p className={`font-${activeTab === Tab.Spend ? 'medium' : 'light'} inline-block p-1 ${activeTab === Tab.Spend ? 'text-[#4A5957] border-b-2 border-black rounded-t-lg' : 'text-gray-500'}`}>
                Spend
              </p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
