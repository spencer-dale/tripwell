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
      category: details.category,
      destination_id: details.destination_id,
      is_highlight: false
    }
    console.log("creating activity, ", activity)
    createActivity(activity)
  }

  async readByTripId() {
    let activities = await getActivitiesByTripId(this.trip_id)
    return activities.map((activity: Activity) => ({
      ...activity,
      activity_date: new Date(activity.activity_date)
    }))
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