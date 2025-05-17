'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { HomeIcon, MapIcon, CalendarIcon, CurrencyDollarIcon, UserIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, MapIcon as MapIconSolid, CalendarIcon as CalendarIconSolid, CurrencyDollarIcon as CurrencyDollarIconSolid, UserIcon as UserIconSolid } from '@heroicons/react/24/solid';

const tabs = [
  {
    name: 'Trips',
    href: '/trips',
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
  },
  {
    name: 'Explore',
    href: '/explore',
    icon: MapIcon,
    activeIcon: MapIconSolid,
  },
  {
    name: 'Planner',
    href: '/planner',
    icon: CalendarIcon,
    activeIcon: CalendarIconSolid,
  },
  {
    name: 'Expenses',
    href: '/expenses',
    icon: CurrencyDollarIcon,
    activeIcon: CurrencyDollarIconSolid,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: UserIcon,
    activeIcon: UserIconSolid,
  },
];

const disabledTabs = ['Explore', 'Planner', 'Expenses'];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <nav className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          const isDisabled = disabledTabs.includes(tab.name);
          const Icon = isActive ? tab.activeIcon : tab.icon;

          if (isDisabled) {
            return (
              <div
                key={tab.name}
                className="flex flex-col items-center justify-center flex-1 h-full text-gray-300 cursor-not-allowed select-none"
                aria-disabled="true"
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1">{tab.name}</span>
              </div>
            );
          }

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 h-full
                ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 