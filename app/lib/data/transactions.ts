export type Transaction = {
    transaction_id: string,
    trip_id: string,
    linked_activity_id: string,
    description: string,
    transaction_date: string,
    amount: number,
    currency: string,
}