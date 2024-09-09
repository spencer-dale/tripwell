'use client'

import { useState } from 'react';
import ItineraryTable from '../itinerary/itinerary-table';
import { ExpensesTable } from '../expenses/expenses-table';
import SideNav from '../itinerary/sidenav';
import { NewExpenseForm } from '../expenses/new-expense-form';
import { NewItemButton } from '../itinerary/itinerary-table';
import { ActivityFormState, ExpenseFormState, ItineraryModal } from '../itinerary/itinerary-modal';
import { Activity, Transaction } from '@/app/lib/types';
import { ActivityManager } from '@/app/lib/crud/activity-manager';

export function Trip(props: any) {
  const [showActivities, setShowActivities] = useState(true);
  const [showExpenses, setShowExpenses] = useState(false);

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Transaction | null>(null)
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [inEditActivityMode, setInEditActivityMode] = useState(props.inEditActivityMode)
  const [activityFormState, setActivityFormState] = useState<ActivityFormState>()
  const [inEditExpenseMode, setInEditExpenseMode] = useState(props.inEditExpenseMode)
  const [expenseFormState, setExpenseFormState] = useState<ExpenseFormState>()

  const openActivityModal = (activity: Activity | null) => {
    setSelectedActivity(activity)
    setShowActivityModal(true)
    setActivityFormState({
      activityDate: activity ? activity.activity_date : "",
      activityDescription: activity ? activity.description : "",
    })
  }

  const openExpenseModal = (expense: Transaction | null) => {
    setSelectedExpense(expense)
    setShowExpenseModal(true)
    setExpenseFormState({})
  }

  let activityManager = new ActivityManager(props.trip.trip_id)

  return (
    <>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav
            plansTabSelected={showActivities}
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
            trip={props.trip}
          />
        </div>
        <div className="mb-4 rounded-lg bg-gray-100 p-3">
          <ItineraryTable
            activities={props.activities}
            activityFormState={activityFormState}
            closeActivityModal={() => {
              setShowActivityModal(false)
              setSelectedActivity(null)
            }}
            expenses={props.expenses}
            linkExpenseToActivity={props.linkExpenseToActivity}
            openActivityModal={(activity: Activity) => {
              setInEditActivityMode(false)
              openActivityModal(activity)
            }}
            setActivityFormState={setActivityFormState}
            setSelectedActivity={setSelectedActivity}
            show={showActivities}
            trip={props.trip}
          />
          <ExpensesTable
            activities={props.activities}
            expenses={props.expenses}
            show={showExpenses}
          />
        </div>
        <NewItemButton
          onClick={() => {
            if (showActivities) {
              setInEditActivityMode(true)
              openActivityModal(null)
            } else if (showExpenses) {
              setInEditExpenseMode(true)
              openExpenseModal(null)
            }
          }}
        />
        <ItineraryModal
          activity={selectedActivity}
          activityFormState={activityFormState}
          activityManager={activityManager}
          expenses={props.expenses}
          inEditMode={inEditActivityMode}
          linkExpenseToActivity={props.linkExpenseToActivity}
          onHide={() => setShowActivityModal(false)}
          setActivityFormState={setActivityFormState}
          setInEditMode={setInEditActivityMode}
          show={showActivityModal}
          trip={props.trip}
        />
      </div>
    </>
  );
}