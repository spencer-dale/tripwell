'use client';

import { Destination } from '@/src/app/lib/types';
import { MapPinIcon, BuildingOfficeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { formatCurrency } from '@/src/app/lib/utils';
import { convertToCAD } from '@/src/app/lib/currency';
import { PlaceDetailsModal } from '../place-details-modal';
import { Activity } from '@/src/app/lib/types';
import { Transport, TransportMode } from '@/src/app/lib/types/transport';

const transportIcons: Record<TransportMode, string> = {
  flight: '✈️',
  train: '🚂',
  car: '🚗',
  bus: '🚌',
  ferry: '⛴️',
};

interface TimelineProps {
  destinations: Destination[];
  transports: Transport[];
  activities: Activity[];
  onEdit: (item: any) => void;
  onAdd: (afterItemId: string | null) => void;
  onReorder: (items: any[]) => void;
  hideControls?: boolean;
}

export default function Timeline({
  destinations,
  activities,
  onEdit,
  onAdd,
  onReorder,
  hideControls = false,
}: TimelineProps) {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // Sort destinations by start date
  const sortedDestinations = [...destinations].sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  const renderLocation = (destination: Destination) => {
    if (destination.city) {
      return (
        <div>
          <div className="font-medium">{destination.city}</div>
          <div className="text-sm text-gray-500">
            {destination.region && <div>{destination.region}, {destination.country}</div>}
          </div>
        </div>
      );
    } else if (destination.region) {
      return (
        <div>
          <div className="font-medium">{destination.region}</div>
          <div className="text-sm text-gray-500">{destination.country}</div>
        </div>
      );
    } else {
      return <div className="font-medium">{destination.country}</div>;
    }
  };

  const getDestinationActivities = (destination: Destination) => {
    if (!activities) return [];
    return activities.filter(activity => {
      const activityDate = new Date(activity.activity_date);
      return activityDate >= new Date(destination.start_date) && 
             activityDate <= new Date(destination.end_date);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 relative">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {/* Destinations */}
          {sortedDestinations.map((destination, index) => (
            <div key={destination.destination_id} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center relative">
                <span className="text-sm font-medium text-blue-500">{index + 1}</span>
              </div>
              <div className="flex-1">
                {/* Collapsed View */}
                <div className="flex items-center justify-between">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => setSelectedDestination(destination)}
                  >
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mt-1" />
                      {renderLocation(destination)}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <BuildingOfficeIcon className="h-4 w-4" />
                      <span>{destination.accommodation.name} • {calculateNights(destination.start_date.toString(), destination.end_date.toString())} nights</span>
                    </div>
                  </div>
                  {!hideControls && (
                    <button
                      onClick={() => onEdit(destination)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Place Details Modal */}
      {selectedDestination && (
        <PlaceDetailsModal
          isOpen={!!selectedDestination}
          onClose={() => setSelectedDestination(null)}
          destination={selectedDestination}
          activities={getDestinationActivities(selectedDestination)}
        />
      )}
    </div>
  );
}

function calculateNights(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatShortDate(date: Date): string {
  const day = date.toLocaleDateString('en-US', { weekday: 'short' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const dayNum = date.toLocaleDateString('en-US', { day: '2-digit' });
  return `${day} ${month} ${dayNum}`;
}

function formatDateBox(date: Date): string {
  const day = date.toLocaleDateString('en-US', { weekday: 'short' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const dayNum = date.toLocaleDateString('en-US', { day: '2-digit' });
  return `${day}\n${month} ${dayNum}`;
}

function getNightsCount(start: Date, end: Date): number {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function DestinationBlock({ 
  destination, 
  isExpanded, 
  onToggleExpand, 
  onEdit 
}: { 
  destination: Destination; 
  isExpanded: boolean; 
  onToggleExpand: () => void;
  onEdit?: () => void;
}) {
  const nights = getNightsCount(new Date(destination.start_date), new Date(destination.end_date));
  
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-gray-100 text-center p-2">
            <span className="text-xs font-medium text-gray-600 whitespace-pre-line">
              {formatDateBox(new Date(destination.start_date))}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{destination.city || destination.country}</h3>
            <div className="text-sm text-gray-500">
              {destination.accommodation.name} • {nights} {nights === 1 ? 'night' : 'nights'}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onEdit && (
            <button onClick={onEdit} className="p-1 text-gray-400 hover:text-gray-600">
              <PencilIcon className="h-4 w-4" />
            </button>
          )}
          <button onClick={onToggleExpand} className="p-1 text-gray-400 hover:text-gray-600">
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-2 text-sm text-gray-500">
          <p>Dates: {new Date(destination.start_date).toLocaleDateString()} - {new Date(destination.end_date).toLocaleDateString()}</p>
          {destination.city && <p>City: {destination.city}</p>}
          {destination.region && <p>Region: {destination.region}</p>}
          <p>Accommodation: {destination.accommodation.name}</p>
        </div>
      )}
    </div>
  );
}

function TransportBlock({ 
  transport, 
  isExpanded, 
  onToggleExpand, 
  onEdit 
}: { 
  transport: Transport; 
  isExpanded: boolean; 
  onToggleExpand: () => void;
  onEdit?: () => void;
}) {
  const duration = Math.floor(transport.duration / 60);
  const minutes = transport.duration % 60;
  
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{transportIcons[transport.mode]}</span>
          <span className="font-medium">{transport.mode.charAt(0).toUpperCase() + transport.mode.slice(1)}</span>
          <span className="text-sm text-gray-500">
            ({duration}h {minutes > 0 ? `${minutes}m` : ''})
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {onEdit && (
            <button onClick={onEdit} className="p-1 text-gray-400 hover:text-gray-600">
              <PencilIcon className="h-4 w-4" />
            </button>
          )}
          <button onClick={onToggleExpand} className="p-1 text-gray-400 hover:text-gray-600">
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-2 text-sm text-gray-500">
          <p>Departure: {new Date(transport.departure_time).toLocaleString()}</p>
          <p>Arrival: {new Date(transport.arrival_time).toLocaleString()}</p>
          {transport.notes && <p>Notes: {transport.notes}</p>}
        </div>
      )}
    </div>
  );
} 