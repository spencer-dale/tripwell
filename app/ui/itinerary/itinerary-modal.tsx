'use client'

import Modal from 'react-bootstrap/Modal';
import { Activity, Transaction } from '../../lib/types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ExpensesTable } from '../expenses/expenses-table';
import { LinkExpenseModal } from './link-expense-modal';
import { useState } from 'react';
import { v4 } from 'uuid';
import { ActivityDetails } from '../../lib/crud/types'
import { Button } from '../button';

export type ActivityFormState = {
  activityDescription: string,
  activityDate: string
}

export type ExpenseFormState = {}

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
    let details: ActivityDetails = {
      date: activityFormState.activityDate,
      description: activityFormState.activityDescription,
    }

    if (props.activity) {
      let updatedActivity: Activity = {
        activity_id: activity.activity_id,
        trip_id: activity.trip_id,
        description: details.description,
        activity_date: details.date,
      }
      props.activityManager.update(updatedActivity)
    } else {
      props.activityManager.create(details)
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
            disabled={props.inEditMode}
            onClick={() => props.activityManager.delete(activity)}
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
      <div className="flow">
        <ul>
          <li>
            <Button onClick={props.onClose} className="bg-gray-200 border-darkBlue border-2">
              <p className="text-darkBlue items-center m-0">Close</p>
            </Button>
          </li>
          <li>
            <Button onClick={() => props.onSubmit(props.activityFormState)} className="bg-lightBlue">
              Save
            </Button>
          </li>
        </ul>
      </div>
    </div>
  )
}
