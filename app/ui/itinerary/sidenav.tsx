'use client'

import Link from 'next/link';
// import NavLinks from '@/app/ui/itinerary/nav-links';
import { ArrowLeftIcon, DocumentDuplicateIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Button } from '../button';

export default function SideNav(props: any) {
  return (
    <>
      <div className="flex h-full flex-col px-3 py-4 md:px-2">
        <div className="flex flex-col px-3 py-4 md:px-2 items-center">
          <p className="text-[40px]">
            Canada
          </p>
        </div>
        <Link
          key={"Home"}
          href={"/home"}
          className={'flex h-[64px] w-[90px] grow items-center justify-center gap-2 rounded-md p-3 text-blue-600 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'}
        >
          <ArrowLeftIcon className="ml-auto h-5 w-5 text-blue-600" /> Home
        </Link>
        <div className="flex space-x-2">
          <Button
            className={'flex h-[64px] w-[90px] grow items-center justify-center gap-2 rounded-md p-3 text-blue-600 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'}
            onClick={props.switchToActivities}
          >
            <HomeIcon className="w-6 gap-2"/>
          </Button>
          <Button
            className={'flex h-[64px] w-[90px] grow items-center justify-center gap-2 rounded-md p-3 text-blue-600 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'}
            onClick={props.switchToExpenses}
          >
            <DocumentDuplicateIcon className="w-6"/>
          </Button>
        </div>
      </div>
    </>
  );
}
