import Link from 'next/link';
import { AcmeLogoSmall } from '../ui/acme-logo';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="flex flex-col px-3 py-4 md:px-2 items-center">
        <AcmeLogoSmall />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      <div className="flex flex-col px-3 py-4 md:px-2 items-center">
        <Link
          key={"New Trip"}
          href={"/new-trip"}
          className="mt-4 w-half">
            + New Trip
        </Link>
      </div>
    </div>
  );
}