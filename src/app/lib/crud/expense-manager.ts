import { v4 } from 'uuid';
import { Transaction } from "../types";
import { createTransaction, deleteTransaction, getTransactionsByTripId, updateTransaction } from '../db/transactions';
import { TransactionDetails } from './types'

export class ExpenseManager {
  trip_id: string

  constructor(trip_id: string) {
    this.trip_id = trip_id
  }

  private new_id(): string {
    return v4()
  }

  create(details: TransactionDetails): void {
    let expense: Transaction = {
      transaction_id: this.new_id(),
      trip_id: this.trip_id,
      activity_id: details.activity_id,
      description: details.description,
      transaction_date: details.date,
      amount: details.amount,
      currency: details.currency,
      category: details.category,
    }
    console.log("creating expense, ", expense)
    createTransaction(expense)
  }

  async readByTripId() {
    return await getTransactionsByTripId(this.trip_id)
    // var activitiesLocalTime: Transaction[] = []
    // expenses.map((activity: Transaction, idx: number) => {
    //   let localDatetime: number = new Date(activity.activity_date).getTime() + activity.activity_date.getTimezoneOffset() * 60000
    //   activitiesLocalTime.push({
    //     activity_id: activity.activity_id,
    //     trip_id: activity.trip_id,
    //     description: activity.description,
    //     activity_date: new Date(localDatetime)
    //   })
    // })
    // return activitiesLocalTime
  }

  update(expense: Transaction): void {
    console.log("updating expense, ", expense)
    updateTransaction(expense)
  }

  delete(expense: Transaction): void {
    console.log("deleting: ", expense)
    deleteTransaction(expense)
  }
}