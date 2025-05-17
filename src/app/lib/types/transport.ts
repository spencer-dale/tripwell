export type TransportMode = 'plane' | 'train' | 'bus' | 'ferry' | 'car' | 'walk';

export interface Transport {
  transport_id: string;
  trip_id: string;
  from_destination_id: string;
  to_destination_id: string;
  mode: TransportMode;
  departure_time: Date;
  arrival_time: Date;
  duration: number; // in minutes
  notes?: string;
  booking_reference?: string;
  cost?: number;
  currency?: string;
}

export interface CreateTransportInput {
  trip_id: string;
  from_destination_id: string;
  to_destination_id: string;
  mode: TransportMode;
  departure_time: Date;
  arrival_time: Date;
  notes?: string;
  booking_reference?: string;
  cost?: number;
  currency?: string;
}

export interface UpdateTransportInput {
  mode?: TransportMode;
  departure_time?: Date;
  arrival_time?: Date;
  notes?: string;
  booking_reference?: string;
  cost?: number;
  currency?: string;
} 