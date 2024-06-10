'use server'

import { Activity } from "../types";
import { connectDb } from "./conn";
import { activities } from "./models";

export async function createActivity(activity: Activity) {
    await connectDb()
    await activities.create(activity)
}

export async function getAllActivities() {
    await connectDb()
    return await activities.find()
}