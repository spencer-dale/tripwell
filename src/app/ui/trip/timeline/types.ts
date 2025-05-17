import { Destination } from '@/src/app/lib/types';

export type TransportMode = 'plane' | 'train' | 'car' |'bus' | 'ferry' | 'walk';

export interface Transport {
  transport_id: string;
  from_destination_id: string;
  to_destination_id: string;
  mode: TransportMode;
  departure_time: Date;
  arrival_time: Date;
  duration: number; // in minutes
  notes?: string;
}

export interface TimelineItem {
  id: string;
  type: 'destination' | 'transport';
  data: Destination | Transport;
  order: number;
}

export interface TimelineProps {
  destinations: Destination[];
  transports: Transport[];
  onEdit?: (item: TimelineItem) => void;
  onAdd?: (afterItemId: string | null) => void;
  onReorder?: (items: TimelineItem[]) => void;
} 