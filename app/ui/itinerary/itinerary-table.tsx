'use client'

import { Activity, Transaction } from '@/app/lib/types';
import { Button } from '../button';
import { commissioner, questrial } from '../fonts';
import { useState } from 'react';
import EditActivityModal from './edit-activity-modal';
import { ExpensesTable } from '../expenses/expenses-table';

export default function ItineraryTable(props: any) {
  if (!props.show) { return <></> }

  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          <div className="md:hidden">
            {props.activities?.map((activity: any, idx: number) => (
              <div
                key={activity.activity_id}
                className="mb-2 w-full"
              >
                <div className="flex">
                  <p>
                    {activity.activity_date}
                  </p>
                </div>
                <div className="flex">
                  <ItineraryItem
                    key={idx}
                    activity={activity}
                    activityFormState={props.activityFormState}
                    expenses={props.expenses}
                    setActivityFormState={props.setActivityFormState}
                    setSelectedActivity={props.setSelectedActivity}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ItineraryItem(props: any) {
  const [expanded, setExpanded] = useState(false)

  let activity: Activity = props.activity

  let setActivityFormState = (activity: Activity) => {
    // props.setSelectedActivity(activity)
    props.setActivityFormState({
      activityDate: activity ? activity.activity_date : "",
      activityDescription: activity ? activity.description : "",
    })
  }

  return (
    <div className="ps-4">
      {expanded ?
        <ExpandedItineraryItem
          activity={props.activity}
          expenses={props.expenses}
          activityFormState={props.activityFormState}
          collapse={() => setExpanded(false)}
          setActivityFormState={setActivityFormState}
        /> : <CollapsedItineraryItem
          activity={activity}
          onClick={() => {
            setExpanded(true)
            props.setSelectedActivity(activity)
            setActivityFormState(activity)
          }}
        />
      }
    </div>
  );
}

function ExpandedItineraryItem(props: any) {
  const [inEditMode, setInEditMode] = useState(false)
  var activity: Activity = props.activity
  return (
    <div>
      <ExpandedItineraryItemDetails
        activity={activity}
        expenses={props.expenses}
        onClick={props.collapse}
        onClose={props.collapse}
        onEdit={() => setInEditMode(true)}
      />
      <EditActivityModal
        activity={activity}
        activityFormState={props.activityFormState}
        onClose={() => {
          setInEditMode(false)
          props.collapse()
        }}
        setActivityFormState={props.setActivityFormState}
        show={inEditMode}
      />
    </div>
  );
}

function CollapsedItineraryItem(props: any) {
  var activity: Activity = props.activity
  return (
    <div onClick={props.onClick} className="">
      <p className={`${questrial.className} text-md mb-0`}>
        {activity.description}
      </p>
      <p className={`${questrial.className} text-md text-gray-400 mb-1`}>
        Activity Type
      </p>
    </div>
  );
}

function ExpandedItineraryItemDetails(props: any) {
  let activity: Activity = props.activity
  let expenses: [Transaction] = props.expenses
  if (props.activity != null) {
    expenses = props.expenses.filter(
      (expense: Transaction) => expense.activity_id === props.activity.activity_id
    )
  }
  return (
    <div>
      <div onClick={props.onClick} className="">
        <p className={`${questrial.className} text-md mb-0`}>
          {activity.description}
        </p>
        <p className={`${questrial.className} text-md text-gray-400 mb-1`}>
          Activity Type
        </p>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <ExpensesTable
          expenses={expenses}
          show={true}
        />
      </div>
      <div>
        <ul className="flex flex-row p-0">
          <li className="pe-1" onClick={props.switchToExpenses}>
            <Button
              className={`${questrial.className} text-sm h-6`}
              onClick={props.onEdit}
            >
              Edit
            </Button>
          </li>
          <li className="pe-1" onClick={props.switchToExpenses}>
            <Button
              className={`${questrial.className} text-sm h-6`}
              onClick={props.onClose}
            >
              Link
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function NewItemButton(props: any) {
  return (
    <div className="flex justify-center">
      <Button
        className={`${commissioner.className} h-8 rounded-2xl text-lg font-bold bg-lightBlue`}
        onClick={props.onClick}
      >
        <p className="m-0">New</p>
      </Button>
    </div>
  );
}
