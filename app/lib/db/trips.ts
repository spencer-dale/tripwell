'use server'

import { Trip } from "../types";
import { connectDb } from "./conn";
import { trips } from "./models";

export async function createTrip(trip: Trip) {
    await connectDb()
    await trips.create(trip)
}

export async function getAllTrips() {
    await connectDb()
    return await trips.find()
}

export async function getTripById(trip_id: string) {
  await connectDb()
  return await trips.findOne({trip_id: trip_id})
}
