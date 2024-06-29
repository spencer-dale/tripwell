'use client'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Activity, Transaction } from '../../lib/types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ExpensesTable } from '../expenses/expenses-table';
import { LinkExpenseModal } from './link-expense-modal';
import { useState } from 'react';
import { v4 } from 'uuid';

export type ActivityFormState = {
  activityDescription: string,
  activityDate: string
}

export function ItineraryModal(props: any) {
  const [showLinkExpenseModal, setShowLinkExpenseModal] = useState(false);

  let activity: Activity = props.activity ? props.activity : {}
  let expenses: [Transaction] = props.expenses

  if (props.activity != null) {
    expenses = props.expenses.filter(
      (expense: Transaction) => expense.activity_id === props.activity.activity_id
    )
  }

  const onHide = () => {
    props.setInEditMode(false)
    props.onHide()
  }

  const onClose = () => {
    props.setInEditMode(false)
  }

  const onSubmit = (activityFormState: ActivityFormState) => {
    updateActivity(activityFormState)
    props.setInEditMode(false)
  }

  const onDelete = () => {
    console.log("deleting: ", props.activity)
    // deleteActivity(activity)
  }

  const updateActivity = async (activityFormState: ActivityFormState) => {
    var updatedActivity: Activity = {
      activity_id: activity ? activity.activity_id : v4(),
      trip_id: props.trip.trip_id,
      description: activityFormState.activityDescription,
      activity_date: activityFormState.activityDate,
    }
    if (activity) {
      console.log("updating activity, ", updatedActivity)
      // updateActivity(updatedActivity)
    } else {
      console.log("creating activity, ", updatedActivity)
      // createActivity(updatedActivity)
    }
  }

  return (
    <>
      <Modal show={props.show} onHide={onHide} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>Activity details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button
            onClick={() => setShowLinkExpenseModal(true)}
          >
            <p>Link an expense</p>
          </Button>
          <Button
            disabled={props.inEditMode}
            onClick={() => {
              var state: ActivityFormState = {
                activityDate: activity.activity_date,
                activityDescription: activity.description,
              }
              props.setActivityFormState(state)
              props.setInEditMode(true)
            }}
          >
            <p>Edit</p>
          </Button>
          <Button
            onClick={onDelete}
          >
            <p>Delete</p>
          </Button>
          {props.inEditMode ? <ActivityDetailsEditor
            activityFormState={props.activityFormState}
            onClose={onClose}
            onSubmit={onSubmit}
            setActivityFormState={props.setActivityFormState}
          /> : <ActivityDetailsViewer
            activity={props.activity}
          />}
          <div className="flex w-full items-center justify-between pt-4">
            <ExpensesTable
              expenses={expenses}
              show={true}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
      <LinkExpenseModal
        activity={activity}
        expenses={props.expenses}
        linkExpenseToActivity={props.linkExpenseToActivity}
        onHide={() => setShowLinkExpenseModal(false)}
        show={showLinkExpenseModal}
      />
    </>
  );
}

function ActivityDetailsViewer(props: any) {
  if (props.activity == null){ return <></> }

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div>
        <div className="mb-2 flex items-center">
          <p>{props.activity.description}</p>
        </div>
        <div className="mb-2 flex items-center">
          <p>{props.activity.activity_date}</p>
        </div>
      </div>
    </div>
  );
}

function ActivityDetailsEditor(props: any) {
  return (
    <div>
      <div>
        <label htmlFor="description">Description</label>
        <input
        value={props.activityFormState.activityDescription}
        onChange={(e) => {
          var state: ActivityFormState = {
            activityDate: props.activityFormState.activityDate,
            activityDescription: e.target.value,
          }
          props.setActivityFormState(state)
        }}
        placeholder="Description..."
        ></input>
      </div>
      <div>
        <label htmlFor="date">Date</label>
        <input
        value={props.activityFormState.activityDate}
        onChange={(e) => {
          var state: ActivityFormState = {
            activityDate: e.target.value,
            activityDescription: props.activityFormState.activityDescription,
          }
          props.setActivityFormState(state)
        }}
        placeholder="Jan 1, 2024"
        ></input>
      </div>
      <Button variant="secondary" onClick={props.onClose}>
        Close
      </Button>
      <Button variant="primary" onClick={() => props.onSubmit(props.activityFormState)}>
        Save Changes
      </Button>
    </div>
  )
}
