'use server'

import { Transaction } from "../types";
import { connectDb } from "./conn";
import { transactions } from "./models";

export async function createTransaction(transaction: Transaction) {
    await connectDb()
    await transactions.create(transaction)
}

export async function getAllTransactions() {
    await connectDb()
    return await transactions.find()
}