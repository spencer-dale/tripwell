"use client"

import React from "react";
import { useForm } from "react-hook-form";
import { createActivity } from "@/app/lib/db/activities";
import { Activity } from "@/app/lib/types";

export function NewActivityForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data: any) => {
    console.log("data", data);
    const fakeId = "12345678-9abc-def0-1234-56789abcdef0"
    var activity: Activity = {
        activity_id: fakeId,
        trip_id: fakeId,
        description: data.description,
        activity_date: data.date,
    }
    createActivity(activity)
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="description">Description</label>
          <input placeholder="Description..." {...register("description")} />
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