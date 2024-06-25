'use server'

import { Activity, Transaction } from "../types";
import { connectDb } from "./conn";
import { activities, transactions } from "./models";

export async function createActivity(activity: Activity) {
    await connectDb()
    await activities.create(activity)
}

export async function updateActivity(activity: Activity) {
  return
}

export async function deleteActivity(activity: Activity) {
  const filter = { activity_id: activity.activity_id }
  
  await connectDb()
  await activities.findOneAndDelete(filter)
}

export async function getActivitiesByTripId(trip_id: string) {
    await connectDb()
    return await activities.find({trip_id: trip_id})
}

export async function linkExpenseToActivity(expense: Transaction, activity: Activity) {
  'use server'

  const filter = { transaction_id: expense.transaction_id }
  const updatedExpense: Transaction = {
    transaction_id: expense.transaction_id,
    trip_id: expense.trip_id,
    activity_id: activity.activity_id,
    description: expense.description,
    transaction_date: expense.transaction_date,
    amount: expense.amount,
    currency: expense.currency,
  }

  await connectDb()
  await transactions.updateOne(filter, updatedExpense)
}
