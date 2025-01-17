'use client'

import { Activity } from '@/src/app/lib/types';
import { Button } from '../button';
import { questrial } from '../fonts';
import React, { useState } from 'react';
import EditActivityModal from './edit-activity-modal';
import { ActivityFormState } from './itinerary-modal'

type activityDateGroup = {
  date: Date,
  activities: Activity[]
}

export function ItineraryTableContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg md:pt-0">
          <div className="md:hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ItineraryTable(props: any) {
  if (!props.show) { return <></> }

  let sortedActivities = props.activities.toSorted((a: Activity, b: Activity) => new Date(a.activity_date).getTime() - new Date(b.activity_date).getTime())
  let groupedActivities: activityDateGroup[] = []
  let activeGroup: activityDateGroup = {
    date: sortedActivities[0].activity_date,
    activities: [sortedActivities[0]]
  }
  sortedActivities.map((activity: Activity, idx: number) => {
    if (idx === 0) {
      // already accounted for, above
    } else if (activity.activity_date !== sortedActivities[idx-1].activity_date) {
      groupedActivities.push(activeGroup)
      activeGroup = {
        date: activity.activity_date,
        activities: [activity]
      }
    } else {
      activeGroup.activities.push(activity)
    }
  })
  groupedActivities.push(activeGroup)
  console.log("final activity groups", groupedActivities)

  return (
    <>
      {groupedActivities?.map((group: activityDateGroup, idx: number) => (
        <div
          key={idx}
          className="my-4 w-full"
        >
          <div className="mt-2">
            <ItineraryGroup
              key={idx}
              group={group}
              itineraryItems={props.itineraryItems}
            />
          </div>
        </div>
      ))}
    </>
  );
}

function ItineraryGroup(props: any) {
  const dateToDisplay = (uncastDate: Date) => {
    let date: Date = new Date(uncastDate)
    let localDate: Date = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
    return localDate.toDateString()
  }

  return (
    <div>
      <div className="border-b-2 text-sm">
        <a>
          {dateToDisplay(props.group.date)}
        </a>
      </div>
      {props.group.activities?.map((activity: any, idx: number) => (
        <div
          key={activity.activity_id}
          className="mt-2 w-full"
        >
          {props.itineraryItems[activity.activity_id]}
        </div>
      ))}
    </div>
  )
}

export function ItineraryItem(props: any) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      {expanded ?
        <ExpandedItineraryItem
          activity={props.activity}
          collapse={() => setExpanded(false)}
          linkedExpenseTable={props.linkedExpenseTable}
          showEditActivityModal={props.showEditActivityModal}
          showLinkExpenseModal={props.showLinkExpenseModal}
        /> : 
        <InvisibleButton
          onClick={() => setExpanded(true)}
        >
          <CollapsedItineraryItem
            activity={props.activity}
          />
        </InvisibleButton>
      }
    </div>
  );
}

function ExpandedItineraryItem(props: any) {
  return (
    <ExpandedItineraryItemCard>
      <InvisibleButton
        onClick={props.collapse}
      >
        <ExpandedItineraryItemDetails
          activity={props.activity}
        />
      </InvisibleButton>
      <ItineraryItemButtons
        onEdit={props.showEditActivityModal}
        onLinkExpense={props.showLinkExpenseModal}
      />
      <div className="w-full items-center justify-between ps-2">
        {props.linkedExpenseTable}
      </div>
    </ExpandedItineraryItemCard>
  );
}

export function InvisibleButton({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  return (
    <div onClick={onClick}>
      {children}
    </div>
  );
}

export function ItineraryItemButtons(props: any) {
  return (
    <div>
      <ul className="flex flex-row ps-3 m-0">
        <li className="mt-1 pe-1">
          <Button
            className={`${questrial.className} text-sm h-6`}
            onClick={props.onEdit}
          >
            Edit
          </Button>
        </li>
        <li className="mt-1 pe-1">
          <Button
            className={`${questrial.className} text-sm h-6`}
            onClick={props.onLinkExpense}
          >
            Link
          </Button>
        </li>
      </ul>
    </div>
  );
}

export function CollapsedItineraryItem(props: any) {
  var activity: Activity = props.activity
  return (
    <div className="rounded-lg bg-gray-100 ps-3 py-2">
      <p className={`${questrial.className} text-md mb-0`}>
        {activity.description}
      </p>
      <p className={`${questrial.className} text-md text-gray-400 mb-0`}>
        {activity.category}
      </p>
    </div>
  );
}

function ExpandedItineraryItemCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded-lg bg-gray-100 py-2 drop-shadow-xl">
      {children}
    </div>
  );
}

function ExpandedItineraryItemDetails(props: any) {
  let activity: Activity = props.activity

  return (
    <div className="flex justify-start ps-3 text-left">
      <div>
        <p className={`${questrial.className} text-md mb-0`}>
          {activity.description}
        </p>
        <p className={`${questrial.className} text-md text-gray-400 mb-1`}>
          {activity.category}
        </p>
      </div>
    </div>
  );
}

export function LinkedActivityTable(props: any) {
  const [inEditMode, setInEditMode] = useState(false)
  let linkedActivities = props.activities
  let setActivityFormState = (activity: Activity) => {
    let newState: ActivityFormState = {
      activityDescription: activity ? activity.description : "",
      activityDate: activity ? activity.activity_date : new Date(Date.now()),
      activityCategory: activity ? activity.category : "",
    }
    props.setActivityFormState(newState)
  }

  return (
    <div className="mt-1 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="md:hidden">
          {linkedActivities?.map((activity: Activity) => (
            <div>
              <button
                key={activity.activity_id}
                className="m-0 w-full"
              >
                <LinkedActivityTableItem
                  activity={activity}
                  onEdit={() => {
                    setInEditMode(true)
                    setActivityFormState(activity)
                  }}
                />
              </button>
              <EditActivityModal
                activity={activity}
                activityFormState={props.activityFormState}
                onClose={() => setInEditMode(false)}
                onDelete={() => {}}
                onSave={() => {}}
                setActivityFormState={props.setActivityFormState}
                show={inEditMode}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LinkedActivityTableItem(props: any) {
  let activity: Activity = props.activity
  return (
    <div
      key={activity.activity_id}
      className="flex rounded-md rounded-lg mx-2 mt-2 px-2 pt-2 bg-gray-50 md:pt-0"
      onClick={props.onEdit}
    >
      <div onClick={props.onClick} className="text-left">
        <p className={`${questrial.className} text-md mb-0`}>
          {activity.description}
        </p>
        <p className={`${questrial.className} text-md text-gray-400 mb-1`}>
          {activity.category}
        </p>
      </div>
    </div>
  );
}
