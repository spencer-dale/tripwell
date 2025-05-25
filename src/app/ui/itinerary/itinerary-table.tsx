'use client'

import { Activity } from '@/src/app/lib/types';
import { Button } from '../button';
import { questrial } from '../fonts';
import React, { useState } from 'react';
import { EditActivityModal } from '../trip/edit-item-modals';
import { InvisibleButton } from '../button';
import { dateToDisplay } from '../../lib/utils';
import { ActivityFormState } from '../trip/form-states';

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
  if (props.activities.length == 0) { return <></> }

  let sortedActivities = props.activities.toSorted((a: Activity, b: Activity) => {
    const dateA = new Date(a.activity_date);
    const dateB = new Date(b.activity_date);
    return dateA.getTime() - dateB.getTime();
  });
  
  let groupedActivities: activityDateGroup[] = []
  let activeGroup: activityDateGroup = {
    date: new Date(sortedActivities[0].activity_date),
    activities: [sortedActivities[0]]
  }
  
  sortedActivities.map((activity: Activity, idx: number) => {
    if (idx === 0) {
      // already accounted for, above
    } else {
      const currentDate = new Date(activity.activity_date);
      const prevDate = new Date(sortedActivities[idx-1].activity_date);
      
      if (currentDate.toDateString() !== prevDate.toDateString()) {
        groupedActivities.push(activeGroup)
        activeGroup = {
          date: currentDate,
          activities: [activity]
        }
      } else {
        activeGroup.activities.push(activity)
      }
    }
  })
  groupedActivities.push(activeGroup)
  // console.log("final activity groups", groupedActivities)

  return (
    <>
      {groupedActivities?.map((group: activityDateGroup, idx: number) => (
        <div
          key={`group-${group.date.toISOString()}`}
          className="my-4 w-full"
        >
          <div className="mt-2">
            <ItineraryGroup
              key={`group-${group.date.toISOString()}`}
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

interface ItineraryItemProps {
  activity: Activity;
  linkedExpenseTable: JSX.Element;
  showEditActivityModal: () => void;
  showLinkExpenseModal: () => void;
  onSelect: (activity: Activity) => void;
}

export function ItineraryItem({
  activity,
  linkedExpenseTable,
  showEditActivityModal,
  showLinkExpenseModal,
  onSelect,
}: ItineraryItemProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="flex flex-col p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50"
      onClick={() => onSelect(activity)}
    >
      {expanded ?
        <ExpandedItineraryItem
          activity={activity}
          collapse={() => setExpanded(false)}
          linkedExpenseTable={linkedExpenseTable}
          showEditActivityModal={showEditActivityModal}
          showLinkExpenseModal={showLinkExpenseModal}
        /> : 
        <InvisibleButton
          onClick={() => setExpanded(true)}
        >
          <CollapsedItineraryItem
            activity={activity}
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

interface LinkedActivitiesTableProps {
  activities: Activity[];
  activityFormState: ActivityFormState;
  setActivityFormState: (activity: Activity) => void;
  unlinkActivity: (activity: Activity) => void;
}

export function LinkedActivitiesTable(props: LinkedActivitiesTableProps) {
  let linkedActivities = props.activities

  return (
    <div className="mt-1 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="md:hidden">
          {linkedActivities?.map((activity: Activity) => (
            <div
              key={activity.activity_id}
              className="m-0 w-full"
            >
              <LinkedActivitiesTableItem
                activity={activity}
                activityFormState={props.activityFormState}
                setActivityFormState={props.setActivityFormState}
                unlinkActivity={props.unlinkActivity}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LinkedActivitiesTableItem(props: any) {
  const [inEditMode, setInEditMode] = useState(false)
  let activity: Activity = props.activity

  const onEdit = () => {
    setInEditMode(true)
    props.setActivityFormState(activity)
  }

  return (
    <div>
      <div
        key={activity.activity_id}
        className="rounded-md rounded-lg mx-2 mt-2 px-2 pt-2 bg-gray-50 md:pt-0"
        onClick={onEdit}
      >
        <div className="flex justify-start col-span-3 text-left">
          <div>
            <p className={`${questrial.className} text-md mb-0`}>
              {activity.description}
            </p>
            <p className={`${questrial.className} text-md text-gray-400 mb-0`}>
              {activity.category}
            </p>
          </div>
        </div>
      </div>
      <EditActivityModal
        activity={activity}
        activityFormState={props.activityFormState}
        onClose={() => {
          setInEditMode(false)
        }}
        onSave={props.onSave}
        setActivityFormState={props.setActivityFormState}
        show={inEditMode}
        unlinkActivity={props.unlinkActivity}
      />
    </div>
  );
}
