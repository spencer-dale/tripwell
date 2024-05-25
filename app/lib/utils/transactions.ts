'use server'

import { Transaction } from "../data/transactions";
import { connectDb } from "./database";
import { transactions } from "@/app/lib/models/transaction";

export async function createTransaction(transaction: Transaction) {
    await connectDb()
    await transactions.create(transaction)
}

export async function getAllTransactions() {
    await connectDb()
    return await transactions.find()
}