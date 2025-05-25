export type ActivityDetails = {
  date: Date
  description: string
  category: string
  destination_id: string
}

export type TransactionDetails = {
  activity_id: string
  date: Date
  description: string
  amount: number
  currency: string
  category: string
}