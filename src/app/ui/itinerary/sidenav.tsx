'use client'

import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { commissioner, questrial } from '../fonts';

export enum Tab {
  Overview = 1,
  Plans,
  Spend,
}

export default function SideNav(props: any) {
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(dateObj);
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <Link
          key={"Trips"}
          href={"/trips"}
        >
          <ArrowLeftIcon className="ml-auto h-5 w-5 text-black m-0 mb-2" />
        </Link>
        <div className="flex flex-col py-2 items-left">
          <p className={`${commissioner.className} text-2xl font-bold m-0`}>
            {props.trip.name}
          </p>
          <p className={`${questrial.className} text-md text-gray-400`}>
          {formatDate(props.trip.start_date)} - {formatDate(props.trip.end_date)}
          </p>
        </div>
        {props.activeTab === Tab.Overview ?
          <OverviewTabSelected
            switchToPlans={props.switchToPlans}
            switchToSpend={props.switchToSpend}
          /> : <></>
        }
        {props.activeTab === Tab.Plans ?
          <PlansTabSelected
            switchToOverview={props.switchToOverview}
            switchToSpend={props.switchToSpend}
          /> : <></>
        }
        {props.activeTab === Tab.Spend ?
          <SpendTabSelected
            switchToOverview={props.switchToOverview}
            switchToPlans={props.switchToPlans}
          /> : <></>
        }
      </div>
    </>
  )
}

function OverviewTabSelected(props: any) {
  return (
    <>
      <div className={`${commissioner.className} text-base text-center text-gray-500 border-gray-200`}>
        <ul className="m-0 p-0 flex flex-row grid grid-cols-3">
          <li className="col-span-1">
            <p className="font-medium inline-block p-1 text-[#4A5957] border-b-2 border-black rounded-t-lg">
              Overview
            </p>
          </li>
          <li className="col-span-1" onClick={props.switchToPlans}>
            <p className="font-light p-1 text-gray-500">
              Plans
            </p>
          </li>
          <li className="col-span-1" onClick={props.switchToSpend}>
            <p className="font-light p-1 text-gray-500">
              Spend
            </p>
          </li>
        </ul>
      </div>
    </>
  )
}

function PlansTabSelected(props: any) {
  return (
    <>
      <div className={`${commissioner.className} text-base text-center text-gray-500 border-gray-200`}>
        <ul className="m-0 p-0 flex flex-row grid grid-cols-3">
          <li className="col-span-1" onClick={props.switchToOverview}>
            <p className="font-light p-1 text-gray-500">
              Overview
            </p>
          </li>
          <li className="col-span-1">
            <p className="font-medium inline-block p-1 text-[#4A5957] border-b-2 border-black rounded-t-lg">
              Plans
            </p>
          </li>
          <li className="col-span-1" onClick={props.switchToSpend}>
            <p className="font-light p-1 text-gray-500">
              Spend
            </p>
          </li>
        </ul>
      </div>
    </>
  )
}

function SpendTabSelected(props: any) {
  return (
    <>
      <div className={`${commissioner.className} text-base text-center text-gray-500 border-gray-200`}>
        <ul className="m-0 p-0 flex flex-row grid grid-cols-3">
          <li className="col-span-1" onClick={props.switchToOverview}>
            <p className="font-light p-1 text-gray-500">
              Overview
            </p>
          </li>
          <li className="col-span-1" onClick={props.switchToPlans}>
            <p className="font-light p-1 text-gray-500">
              Plans
            </p>
          </li>
          <li className="col-span-1">
            <p className="font-medium inline-block p-1 text-[#4A5957] border-b-2 border-black rounded-t-lg">
              Spend
            </p>
          </li>
        </ul>
      </div>
    </>
  )
}
