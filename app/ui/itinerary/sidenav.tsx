'use client'

import Link from 'next/link';
import { ArrowLeftIcon, DocumentDuplicateIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Button } from '../button';
import { commissioner, questrial } from '../fonts';
import { useState } from 'react';

export default function SideNav(props: any) {
  return (
    <>
      <div className="flex h-full flex-col">
        <Link
          key={"Home"}
          href={"/home"}
        >
          <ArrowLeftIcon className="ml-auto h-5 w-5 text-black m-0 mb-2" />
        </Link>
        <div className="flex flex-col py-2 items-left">
          <p className={`${commissioner.className} text-2xl font-bold m-0`}>
            {props.trip.name}
          </p>
          <p className={`${questrial.className} text-sm text-gray-500`}>
            Trip details here
          </p>
        </div>
        {props.plansTabSelected ?
          <PlansTabSelected
            switchToExpenses={props.switchToExpenses}
          /> :
          <SpendTabSelected
            switchToActivities={props.switchToActivities}
          />
        }
      </div>
    </>
  )
}

function PlansTabSelected(props: any) {
  return (
    <>
      <div className={`${commissioner.className} text-base text-center text-gray-500 border-gray-200`}>
        <ul className="flex flex-row">
          <li className="ms-5 me-5">
            <p className="font-medium inline-block p-1 text-lightBlue border-b-2 border-lightBlue rounded-t-lg">
              Plans
            </p>
          </li>
          <li className="ms-5 me-2" onClick={props.switchToExpenses}>
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
        <ul className="flex flex-row">
          <li className="ms-5 me-5" onClick={props.switchToActivities}>
            <p className="font-light p-1 text-gray-500">
              Plans
            </p>
          </li>
          <li className="ms-5 me-2">
            <p className="font-medium inline-block p-1 text-lightBlue border-b-2 border-lightBlue rounded-t-lg">
              Spend
            </p>
          </li>
        </ul>
      </div>
    </>
  )
}
