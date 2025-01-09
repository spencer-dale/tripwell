import { AcmeLogoSmall } from '../ui/acme-logo';
import { commissioner, questrial } from '../ui/fonts';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col m-4">
      {/* <div className="flex flex-col px-3 py-4 md:px-2 items-center">
        <AcmeLogoSmall />
      </div> */}
      <p className={`${commissioner.className} text-2xl font-bold`}>
        My trips
      </p>
      <div className="flex-grow">{children}</div>
    </div>
  );
}