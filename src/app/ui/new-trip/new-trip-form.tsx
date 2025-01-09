"use client"

import React from "react";
import { useForm } from "react-hook-form";
import { createTrip } from "@/src/app/lib/db/trips";
import { Trip } from "@/src/app/lib/types";

export function NewTripForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("data", data);
    // const fakeId = "12345678-9abc-def0-1234-56789abcdef0"
    const fakeId = "23456789-abcd-ef01-2345-6789abcdef01"
    var trip: Trip = {
        trip_id: fakeId,
        name: data.tripName,
        start_date: data.startDate,
        end_date: data.endDate,
    }
    createTrip(trip)
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="tripName">Trip Name</label>
          <input placeholder="Around The World in 80 Days" {...register("tripName")} />
        </div>
        <div>
          <label htmlFor="startDate">Start Date</label>
          <input placeholder="Jan 1, 2024" {...register("startDate")} />
        </div>
        <div>
          <label htmlFor="endDate">End Date</label>
          <input placeholder="Jan 80, 2024" {...register("endDate")} />
        </div>
        <input type="submit" />
      </form>
    </div>
  );
}