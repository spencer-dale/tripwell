export type AccommodationType = 'hotel' | 'apartment' | 'hostel' | 'airbnb' | 'other';

export type Accommodation = {
    name: string;
    type: AccommodationType;
    address: string;
    total_cost: number;
    currency: string;
}

export type Destination = {
    destination_id: string;
    start_date: Date;
    end_date: Date;
    country: string;
    city?: string;
    region?: string;
    accommodation: Accommodation;
    activity_ids: string[];
}

export type SerializedDestination = {
    destination_id: string;
    start_date: string;
    end_date: string;
    country: string;
    city?: string;
    region?: string;
    accommodation: Accommodation;
    activity_ids: string[];
}

export type Transaction = {
    transaction_id: string;
    trip_id: string;
    activity_id: string;
    description: string;
    transaction_date: Date;
    amount: number;
    currency: string;
    category: string;
}

export type SerializedTransaction = {
    transaction_id: string;
    trip_id: string;
    activity_id: string;
    description: string;
    transaction_date: string;
    amount: number;
    currency: string;
    category: string;
}

export type Activity = {
    activity_id: string;
    trip_id: string;
    description: string;
    activity_date: Date;
    category: string;
}

export type SerializedActivity = {
    activity_id: string;
    trip_id: string;
    description: string;
    activity_date: string;
    category: string;
    start_time?: string;
    end_time?: string;
}

export type Trip = {
    trip_id: string;
    name: string;
    start_date: Date;
    end_date: Date;
    destinations: Destination[];
}

export type SerializedTrip = {
    trip_id: string;
    name: string;
    start_date: string;
    end_date: string;
    destinations: SerializedDestination[];
}

export type User = {
  user_id: string;
  trips: Array<Trip>;
}