import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function SideNav() {
  return (
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
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
      </div>
    </div>
  );
}
