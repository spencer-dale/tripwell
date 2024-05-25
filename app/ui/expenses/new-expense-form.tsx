"use client"

import React from "react";
import { useForm } from "react-hook-form";
import { createTransaction } from "@/app/lib/utils/transactions";
import { Transaction } from "@/app/lib/data/transactions";

export function NewExpenseForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data: any) => {
    console.log("data", data);
    const fakeId = "12345678-9abc-def0-1234-56789abcdef0"
    var transaction: Transaction = {
        transaction_id: fakeId,
        trip_id: fakeId,
        linked_activity_id: "",
        description: data.description,
        transaction_date: data.date,
        amount: data.amount,
        currency: data.currency,
    }
    createTransaction(transaction)
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="amount">Amount</label>
          <input placeholder="$ ..." {...register("amount")} />
        </div>
        <div>
          <label htmlFor="currency">Currency</label>
          <input placeholder="CAD, USD, etc..." {...register("currency")} />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input placeholder="Name or description" {...register("description")} />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input placeholder="Jan 1, 2024" {...register("date")} />
        </div>
        <input type="submit" />
      </form>
    </div>
  );
}