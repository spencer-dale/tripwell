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
    }
    console.log("creating activity, ", activity)
    createActivity(activity)
  }

  async readByTripId() {
    let activities = await getActivitiesByTripId(this.trip_id)
    var activitiesLocalTime: Activity[] = []
    activities.map((activity: Activity, idx: number) => {
      let localDatetime: number = new Date(activity.activity_date).getTime() + activity.activity_date.getTimezoneOffset() * 60000
      activitiesLocalTime.push({
        activity_id: activity.activity_id,
        trip_id: activity.trip_id,
        description: activity.description,
        activity_date: new Date(localDatetime),
        category: activity.category,
      })
    })
    return activitiesLocalTime
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