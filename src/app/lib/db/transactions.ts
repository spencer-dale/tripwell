'use server'

import { Transaction } from "../types";
import { connectDb } from "./conn";
import { transactions } from "./models";

export async function createTransaction(transaction: Transaction) {
    await connectDb()
    await transactions.create(transaction)
}

export async function updateTransaction(transaction: Transaction) {
    const filter = { transaction_id: transaction.transaction_id}
    const update = {
      description: transaction.description,
      transaction_date: transaction.transaction_date,
      amount: transaction.amount,
      currency: transaction.currency,
      category: transaction.category,
    }
  
    await connectDb()
    console.log("find one and update: ", update)
    await transactions.findOneAndUpdate(filter, update)
  }

export async function deleteTransaction(transaction: Transaction) {
    const filter = { transaction_id: transaction.transaction_id }
    
    await connectDb()
    await transactions.findOneAndDelete(filter)
}

export async function getTransactionsByTripId(trip_id: string): Promise<Transaction[]> {
    await connectDb()
    return await transactions.find({trip_id: trip_id})
}