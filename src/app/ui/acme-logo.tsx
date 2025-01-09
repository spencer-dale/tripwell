import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { galada } from '@/src/app/ui/fonts';

export function AcmeLogo() {
  return (
    <div className={`${galada.className} flex flex-row items-center leading-none text-white`}>
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px]">
        Tripwell
      </p>
    </div>
  );
}

export function AcmeLogoSmall() {
  return (
    <div className={`${galada.className} flex flex-row items-center leading-none`}>
      <p className="text-[28px] text-lightBlue justify-center">
        Tripwell
      </p>
    </div>
  );
}
