import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function TripCard() {
    return (
        <Link
            key={"Trip"}
            href={"/dashboard"}
            className={'flex h-[64px] grow items-center justify-center gap-2 rounded-md bg-sky-100 p-3 text-blue-600 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'}
        >
            Canada <ArrowRightIcon className="ml-auto h-5 w-5 text-blue-600" />
        </Link>
    );
}