import { v4 } from 'uuid';
import { Activity } from "../types";
import { createActivity, deleteActivity, getActivitiesByTripId, updateActivity } from '../db/activities';
import { ActivityDetails } from './types'

export class ActivityManager {
  trip_id: string

  constructor(trip_id: string) {
    this.trip_id = trip_id
  }

  private new_id(): string {
    return v4()
  }

  create(details: ActivityDetails): void {
    let activity: Activity = {
      activity_id: this.new_id(),
      trip_id: this.trip_id,
      description: details.description,
      activity_date: details.date,
    }
    console.log("creating activity, ", activity)
    createActivity(activity)
  }

  async readByTripId() {
    return await getActivitiesByTripId(this.trip_id)
  }

  update(activity: Activity): void {
    console.log("updating activity, ", activity)
    updateActivity(activity)
  }

  delete(activity: Activity): void {
    console.log("deleting: ", activity)
    deleteActivity(activity)
  }
}