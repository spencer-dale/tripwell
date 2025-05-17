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

export type Activity = {
    activity_id: string;
    trip_id: string;
    description: string;
    activity_date: Date;
    category: string;
}

export type Trip = {
    trip_id: string;
    name: string;
    start_date: Date;
    end_date: Date;
    destinations: Destination[];
}

export type User = {
  user_id: string;
  trips: Array<Trip>;
}