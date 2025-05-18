export type TransportMode = 'flight' | 'train' | 'bus' | 'car' | 'ferry';

export interface Transport {
  transport_id: string;
  mode: TransportMode;
  departure_location: string;
  arrival_location: string;
  departure_time: string;
  arrival_time: string;
  duration: number;
  cost: number;
  currency: string;
  notes?: string;
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