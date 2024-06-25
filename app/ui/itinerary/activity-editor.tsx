import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { ActivityEditorForm } from './activity-editor-form';
import { Activity } from '@/app/lib/types';
import { v4 } from 'uuid';
import { createActivity, updateActivity } from '@/app/lib/db/activities';

export function NewActivityButton(props: any) {
  return (
    <Button
      onClick={props.onClick}
    >
      <p>+ New activity</p>
    </Button>
  );
}

export function ActivityEditor(props: any) {
  let activity: Activity = props.activity
  let modal_title = activity ? "Edit activity" : "New activity"

  let original_description = activity ? activity.description : ""
  let original_activity_date = activity ? activity.activity_date : ""

  const [description, setDescription] = useState<string>(original_description)
  const [activityDate, setActivityDate] = useState<string>(original_activity_date)

  const onSubmit = async () => {
    var updatedActivity: Activity = {
      activity_id: activity ? activity.activity_id : v4(),
      trip_id: props.trip.trip_id,
      description: description,
      activity_date: activityDate,
    }
    if (activity) {
      console.log("updating activity, ", updatedActivity)
      updateActivity(updatedActivity)
    } else {
      console.log("creating activity, ", updatedActivity)
      // createActivity(updatedActivity)
    }
    props.setSelectedActivity(updatedActivity)
    props.toViewingMode()
  }

  const onHide = () => {
    setDescription(original_description)
    setActivityDate(original_activity_date)
    props.onHide()
  }

  const getDescription = () => {
    console.log(description)
    return description
  }

  return (
    <>
      <Modal show={props.show} onHide={onHide} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>{modal_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div>
              <label htmlFor="description">Description</label>
              <input
              value={getDescription()}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description..."
              ></input>
            </div>
            <div>
              <label htmlFor="date">Date</label>
              <input
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              placeholder="Jan 1, 2024"
              ></input>
            </div>
            <Button variant="secondary" onClick={() => props.onDelete(props.activity)}>
              Delete
            </Button>
            <Button variant="primary" onClick={onSubmit}>
              Save Changes
            </Button>
          </div>
          {/* <div className="flex w-full items-center justify-between pt-4">
            <ExpensesTable
              expenses={expenses}
              show={true}
            />
          </div> */}
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
      {/* <LinkExpenseModal
        activity={activity}
        expenses={props.expenses}
        linkExpenseToActivity={props.linkExpenseToActivity}
        onHide={() => setShowLinkExpenseModal(false)}
        show={showLinkExpenseModal}
      /> */}
    </>
  );
}