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
