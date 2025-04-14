'use server'

import { Trip } from "../types";
import { connectDb } from "./conn";
import { trips } from "./models";

export async function createTrip(trip: Trip) {
    await connectDb()
    await trips.create(trip)
}

export async function getAllTrips() : Promise<Trip[]> {
    try {
        await connectDb()
        return await trips.find().lean().exec()
    } catch (error) {
        console.error('Error fetching trips:', error)
        return []
    }
}

export async function getTripById(trip_id: string) : Promise<Trip | null> {
    try {
        await connectDb()
        return await trips.findOne({trip_id: trip_id}).lean().exec()
    } catch (error) {
        console.error('Error fetching trip:', error)
        return null
    }
}
