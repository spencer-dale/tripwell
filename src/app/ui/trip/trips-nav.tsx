'use client'

import { useState } from 'react';
import { commissioner } from '../fonts';
import { TripsTab } from './trip-tabs'
import { NewItemButton } from './trip';

export function TripTables(props: any) {
  const [activeTab, setActiveTab] = useState<TripsTab>(TripsTab.Upcoming)

  let tabContents = new Map<TripsTab, JSX.Element>([
    [
      TripsTab.Past,
      <PastTripsTabSelected
        switchToUpcoming={() => setActiveTab(TripsTab.Upcoming)}
      />,
    ],
    [
      TripsTab.Upcoming,
      <UpcomingTripsTabSelected
        switchToPast={() => setActiveTab(TripsTab.Past)}
      />,
    ]
  ])

  return (
    <div>
      {tabContents.get(activeTab)}
      {props.tripTables.get(activeTab)}
      {activeTab == TripsTab.Upcoming ? <NewItemButton/> : <></>}
    </div>
  );
}

function PastTripsTabSelected(props: any) {
  return (
    <>
      <div className={`${commissioner.className} text-base text-center text-gray-500 border-gray-200`}>
        <ul className="m-0 p-0 flex flex-row grid grid-cols-2">
          <li className="col-span-1" onClick={props.switchToUpcoming}>
            <p className="font-light p-1 text-gray-500">
              Upcoming
            </p>
          </li>
          <li className="col-span-1">
            <p className="font-medium inline-block p-1 text-[#4A5957] border-b-2 border-black rounded-t-lg">
              Past
            </p>
          </li>
        </ul>
      </div>
    </>
  )
}

function UpcomingTripsTabSelected(props: any) {
  return (
    <>
      <div className={`${commissioner.className} text-base text-center text-gray-500 border-gray-200`}>
        <ul className="m-0 p-0 flex flex-row grid grid-cols-2">
          <li className="col-span-1">
            <p className="font-medium inline-block p-1 text-[#4A5957] border-b-2 border-black rounded-t-lg">
              Upcoming
            </p>
          </li>
          <li className="col-span-1" onClick={props.switchToPast}>
            <p className="font-light p-1 text-gray-500">
              Past
            </p>
          </li>
        </ul>
      </div>
    </>
  )
}