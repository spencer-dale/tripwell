'use client'

import { useState } from 'react';
import ItineraryTable from '../itinerary/itinerary-table';
import { ExpensesTable } from '../expenses/expenses-table';
import SideNav from '../itinerary/sidenav';
import { NewExpenseForm } from '../expenses/new-expense-form';
import { Button } from '../button';
import { NewActivityButton } from '../itinerary/itinerary-table';
import { ActivityFormState, ItineraryModal } from '../itinerary/itinerary-modal';
import { Activity } from '@/app/lib/types';

export function Trip(props: any) {
  const [showActivities, setShowActivities] = useState(true);
  const [showExpenses, setShowExpenses] = useState(false);
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [inEditMode, setInEditMode] = useState(props.inEditMode)
  const [activityFormState, setActivityFormState] = useState<ActivityFormState>()

  const openActivityModal = (activity: Activity | null) => {
    setSelectedActivity(activity)
    setShowActivityModal(true)
    setActivityFormState({
      activityDate: activity ? activity.activity_date : "",
      activityDescription: activity ? activity.description : "",
    })
  }

  return (
    <>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav
            trip={props.trip}
            switchToActivities={
              () => {
                setShowActivities(true)
                setShowExpenses(false)
              }
            }
            switchToExpenses={
              () => {
                setShowExpenses(true)
                setShowActivities(false)
              }
            }
          />
        </div>
        <NewActivityButton
          onClick={() => {
            setInEditMode(true)
            openActivityModal(null)
          }}
          show={showActivities}
        />
        <ItineraryTable
          activities={props.activities}
          closeActivityModal={() => {
            setShowActivityModal(false)
            setSelectedActivity(null)
          }}
          expenses={props.expenses}
          linkExpenseToActivity={props.linkExpenseToActivity}
          openActivityModal={(activity: Activity) => {
            setInEditMode(false)
            openActivityModal(activity)
          }}
          show={showActivities}
          trip={props.trip}
        />
        <ExpensesTable
          activities={props.activities}
          expenses={props.expenses}
          show={showExpenses}
        />
        <ItineraryModal
          activity={selectedActivity}
          activityFormState={activityFormState}
          expenses={props.expenses}
          inEditMode={inEditMode}
          linkExpenseToActivity={props.linkExpenseToActivity}
          onHide={() => setShowActivityModal(false)}
          setActivityFormState={setActivityFormState}
          setInEditMode={setInEditMode}
          show={showActivityModal}
          trip={props.trip}
        />
      </div>
    </>
  );
}