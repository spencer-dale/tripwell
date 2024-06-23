export type Transaction = {
    transaction_id: string,
    trip_id: string,
    activity_id: string,
    description: string,
    transaction_date: string,
    amount: number,
    currency: string,
}

export type Activity = {
    activity_id: string,
    trip_id: string,
    description: string,
    activity_date: string,
}

export type Trip = {
  trip_id: string,
  name: string,
  start_date: string,
  end_date: string,
}