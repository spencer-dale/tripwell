import { Trip, Activity, Destination } from '@/src/app/lib/types';
import { Transport } from '@/src/app/lib/types/transport';
import { PlansCalendar } from './plans-calendar';
import { ItineraryTable, ItineraryTableContainer } from '../itinerary/itinerary-table';
import { XMarkIcon, CalendarIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { PlaceDetailsPanel } from './place-details-sheet';

type ItineraryView = 'calendar' | 'list';

interface ItineraryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  destinations: Destination[];
  activities: Activity[];
  transports: Transport[];
  itineraryItems: { [key: string]: JSX.Element };
  onEditDestination: (item: any) => void;
  onAddDestination: (afterItemId: string | null) => void;
  onReorderDestinations: (items: any[]) => void;
  onEditActivity: (activity: Activity) => void;
  onToggleHighlight: (activity: Activity) => void;
}

export function ItineraryPanel({
  isOpen,
  onClose,
  trip,
  destinations,
  activities,
  transports,
  itineraryItems,
  onEditDestination,
  onAddDestination,
  onReorderDestinations,
  onEditActivity,
  onToggleHighlight,
}: ItineraryPanelProps) {
  const [currentView, setCurrentView] = useState<ItineraryView>('list');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);

  return (
    <div
      className={`fixed inset-0 bg-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ height: 'calc(100vh - 4rem)' }} // 4rem for bottom nav
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Itinerary</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* View Switcher */}
        <div className="flex justify-center gap-4 p-4 border-b">
          <button
            onClick={() => setCurrentView('calendar')}
            className={`p-2 rounded-full transition-colors ${
              currentView === 'calendar'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Calendar"
          >
            <CalendarIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => setCurrentView('list')}
            className={`p-2 rounded-full transition-colors ${
              currentView === 'list'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="List"
          >
            <ListBulletIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {currentView === 'calendar' && (
              <PlansCalendar
                trip={trip}
                destinations={destinations}
                activities={activities}
              />
            )}
            {currentView === 'list' && (
              <ItineraryTableContainer>
                <ItineraryTable
                  activities={activities}
                  itineraryItems={itineraryItems}
                />
              </ItineraryTableContainer>
            )}
          </div>
        </div>
      </div>

      {/* Place Details Panel */}
      {selectedDestination && (
        <PlaceDetailsPanel
          isOpen={!!selectedDestination}
          onClose={() => setSelectedDestination(null)}
          onEdit={() => {
            onEditDestination(selectedDestination);
            setSelectedDestination(null);
          }}
          onDelete={() => {
            onEditDestination(selectedDestination);
            setSelectedDestination(null);
          }}
          onAddActivity={() => {
            setShowNewActivityModal(true);
            setSelectedDestination(null);
          }}
          onEditActivity={onEditActivity}
          onToggleHighlight={onToggleHighlight}
          destination={selectedDestination}
          activities={activities.filter(activity => activity.destination_id === selectedDestination.destination_id)}
        />
      )}
    </div>
  );
} 