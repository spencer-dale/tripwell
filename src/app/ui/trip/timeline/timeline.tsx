'use client';

import { useState } from 'react';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Destination } from '@/src/app/lib/types';
import { TimelineProps, TimelineItem, Transport, TransportMode } from './types';

const transportIcons: Record<TransportMode, string> = {
  plane: '✈️',
  train: '🚂',
  car: '🚗',
  bus: '🚌',
  ferry: '⛴️',
  walk: '🚶',
};

export default function Timeline({ destinations, transports, onEdit, onAdd, onReorder }: TimelineProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Combine destinations and transports into a single timeline
  const timelineItems: TimelineItem[] = [
    // Add all destinations and transports in order
    ...destinations.flatMap((dest, index) => {
      const items: TimelineItem[] = [];
      
      // Add transport to this destination if it exists
      const transport = transports.find(t => t.to_destination_id === dest.destination_id);
      if (transport) {
        items.push({
          id: transport.transport_id,
          type: 'transport' as const,
          data: transport,
          order: index * 2 + 1,
        });
      }

      // Add the destination
      items.push({
        id: dest.destination_id,
        type: 'destination' as const,
        data: dest,
        order: index * 2 + 2,
      });

      return items;
    }),
  ].sort((a, b) => a.order - b.order);

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="relative">
      {/* Edit mode toggle */}
      <button
        onClick={() => setIsEditMode(!isEditMode)}
        className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700"
      >
        <PencilIcon className="h-5 w-5" />
      </button>

      {/* Timeline */}
      <div className="space-y-4">
        {/* Start marker */}
        <div className="text-center text-sm text-gray-400">
          <div>Departure</div>
          <div className="text-xs">
            {destinations[0]?.city || destinations[0]?.country}
            <span className="mx-2">•</span>
            <span>{formatShortDate(new Date(destinations[0]?.start_date))}</span>
          </div>
        </div>

        {/* Timeline items with insert buttons */}
        {timelineItems.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Add button before first item */}
            {isEditMode && index === 0 && (
              <div className="flex justify-center mb-2">
                <button
                  onClick={() => onAdd?.(null)}
                  className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Timeline item */}
            <div
              className={`p-4 rounded-lg border ${
                item.type === 'destination' ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              {item.type === 'destination' ? (
                <DestinationBlock
                  destination={item.data as Destination}
                  isExpanded={expandedItems.has(item.id)}
                  onToggleExpand={() => toggleExpand(item.id)}
                  onEdit={isEditMode ? () => onEdit?.(item) : undefined}
                />
              ) : (
                <TransportBlock
                  transport={item.data as Transport}
                  isExpanded={expandedItems.has(item.id)}
                  onToggleExpand={() => toggleExpand(item.id)}
                  onEdit={isEditMode ? () => onEdit?.(item) : undefined}
                />
              )}
            </div>

            {/* Add button between items */}
            {isEditMode && index < timelineItems.length - 1 && (
              <div className="flex justify-center my-2">
                <button
                  onClick={() => onAdd?.(item.id)}
                  className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Add button after last item */}
            {isEditMode && index === timelineItems.length - 1 && (
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => onAdd?.(item.id)}
                  className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* End marker */}
        <div className="text-center text-sm text-gray-400">
          <div>Return</div>
          <div className="text-xs">
            {destinations[destinations.length - 1]?.city || destinations[destinations.length - 1]?.country}
            <span className="mx-2">•</span>
            <span>{formatShortDate(new Date(destinations[destinations.length - 1]?.end_date))}</span>
          </div>
        </div>
      </div>
    </div>
  );
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