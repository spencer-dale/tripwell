'use client'

import { Activity } from '@/app/lib/types';
import { ItineraryModal } from './itinerary-modal';
import { useState } from 'react';
import { ActivityEditor } from './activity-editor';
import { deleteActivity } from '@/app/lib/db/activities';

export default function ItineraryTable(props: any) {
  const [showActivityDetails, setShowActivityDetails] = useState(false);
  const [showActivityEditor, setShowActivityEditor] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  console.log(selectedActivity)

  if (!props.show) { return <></> }

  let toEditingMode = () => {
    setShowActivityDetails(false);
    setShowActivityEditor(true);
  }
  let toViewingMode = () => {
    setShowActivityEditor(false);
    setShowActivityDetails(true);
  }
  let updateActivity = (activity: Activity) => {
    toViewingMode()
    setSelectedActivity(activity)
  }
  let deleteSelectedActivity = (activity: Activity) => {
    setShowActivityEditor(false);
    setShowActivityDetails(false);
    setSelectedActivity(null);
    deleteActivity(activity)
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {props.activities?.map((activity: any, idx: number) => (
              <div
                key={activity.activity_id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <ItineraryItem
                    key={idx}
                    activity={activity}
                    onClick={
                      () => {
                        setShowActivityDetails(true);
                        setSelectedActivity(activity);
                      }
                    }
                  />
                </div>
              </div>
            ))}
            <ItineraryModal
              activity={selectedActivity}
              toEditingMode={toEditingMode}
              expenses={props.expenses}
              linkExpenseToActivity={props.linkExpenseToActivity}
              onHide={() => setShowActivityDetails(false)}
              show={showActivityDetails}
            />
            <ActivityEditor
              activity={selectedActivity}
              onDelete={deleteSelectedActivity}
              setSelectedActivity={setSelectedActivity}
              onHide={toViewingMode}
              show={showActivityEditor}
              trip={props.trip}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ItineraryItem(props: any) {
  var activity: Activity = props.activity
  return (
    <div onClick={props.onClick}>
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <div className="mb-2 flex items-center">
            <p>{activity.description}</p>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <p>{activity.activity_date}</p>
        </div>
      </div>
    </div>
  );
}
