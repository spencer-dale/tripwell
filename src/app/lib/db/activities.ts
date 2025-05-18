'use server'

import { Activity, Transaction } from "../types";
import { connectDb } from "./conn";
import { activities, transactions } from "./models";

export async function createActivity(activity: Activity) {
    await connectDb()
    await activities.create(activity)
}

export async function updateActivity(activity: Activity) {
  const filter = { activity_id: activity.activity_id}
  const update = {
    description: activity.description,
    activity_date: activity.activity_date,
    category: activity.category,
    start_time: activity.start_time,
    end_time: activity.end_time,
  }

  await connectDb()
  console.log("find one and update: ", update)
  await activities.findOneAndUpdate(filter, update)
}

export async function deleteActivity(activity: Activity) {
  const filter = { activity_id: activity.activity_id }
  
  await connectDb()
  await activities.findOneAndDelete(filter)
}

export async function getActivitiesByTripId(trip_id: string): Promise<Activity[]> {
    await connectDb()
    return await activities.find({trip_id: trip_id})
}

export async function linkExpensesToActivity(expenses: Transaction[], activity: Activity) {
  'use server'

  await connectDb()

  for(let i = 0; i < expenses.length; i++) {
    const filter = { transaction_id: expenses[i].transaction_id }
    const updatedExpense: Transaction = {
      transaction_id: expenses[i].transaction_id,
      trip_id: expenses[i].trip_id,
      activity_id: activity.activity_id,
      description: expenses[i].description,
      transaction_date: expenses[i].transaction_date,
      amount: expenses[i].amount,
      currency: expenses[i].currency,
      category: expenses[i].category,
    }

    await transactions.updateOne(filter, updatedExpense)
  }
}

export async function unlinkExpense(expense: Transaction) {
  'use server'

  await connectDb()

  const filter = { transaction_id: expense.transaction_id }
  const updatedExpense: Transaction = {
    transaction_id: expense.transaction_id,
    trip_id: expense.trip_id,
    activity_id: "",
    description: expense.description,
    transaction_date: expense.transaction_date,
    amount: expense.amount,
    currency: expense.currency,
    category: expense.category,
  }

  await transactions.updateOne(filter, updatedExpense)
}
