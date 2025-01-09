'use client'

import { useState } from 'react';
import { ItineraryItem, ItineraryTable, ItineraryTableContainer } from '../itinerary/itinerary-table';
import { ExpensesTable, LinkedExpenseTable } from '../expenses/expenses-table';
import SideNav from '../itinerary/sidenav';
import { Button } from '../button';
import { ActivityFormState, ExpenseFormState } from '../itinerary/itinerary-modal';
import { ActivityManager } from '@/src/app/lib/crud/activity-manager';
import { ExpenseManager } from '@/src/app/lib/crud/expense-manager';
import { NewActivityModal, NewExpenseModal } from '../itinerary/edit-activity-modal';
import { commissioner } from '../fonts';
import { Activity, Transaction } from '@/src/app/lib/types';
import { Tab } from '../itinerary/sidenav';
import { TripOverview } from './trip-overview';
import EditActivityModal from '../itinerary/edit-activity-modal'
import { LinkExpenseModal } from '../itinerary/link-expense-modal'

function isActivityFormStateComplete(state: ActivityFormState) : boolean {
  return (state.activityDescription !== "")
}

function isExpenseFormStateComplete(state: ExpenseFormState) : boolean {
  return (state.expenseDescription !== "") && (state.expenseAmount !== "") && (state.expenseCurrency !== "")
}

export function Trip(props: any) {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Overview)

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  const [activityFormState, setActivityFormState] = useState<ActivityFormState>({activityCategory: "", activityDate: new Date(), activityDescription: ""})
  const [expenseFormState, setExpenseFormState] = useState<ExpenseFormState>()

  const [showNewActivityModal, setShowNewActivityModal] = useState(false)
  const [showEditActivityModal, setShowEditActivityModal] = useState(false)
  const [showLinkExpenseModal, setShowLinkExpenseModal] = useState(false)
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false)

  let activityManager = new ActivityManager(props.trip.trip_id)
  let expenseManager = new ExpenseManager(props.trip.trip_id)

  let setActivityFormStateWithDefaults = (activity: Activity) => {
    setActivityFormState({
      activityDate: activity ? activity.activity_date : new Date(),
      activityDescription: activity ? activity.description : "",
      activityCategory: activity ? activity.category : "",
    })
  }

  interface ItineraryItems {
    [key: string]: JSX.Element;
  }
  let itineraryItems: ItineraryItems = {}
  props.activities.map((activity: Activity) => {
    const linkedExpenses: [Transaction] = props.expenses.filter(
      (expense: Transaction) => expense.activity_id === activity.activity_id
    )
    console.log("expenses:", linkedExpenses)
    var linkedExpenseTable: JSX.Element
    if (linkedExpenses.length > 0) {
      linkedExpenseTable = <LinkedExpenseTable
        activity={props.activity}
        expenses={linkedExpenses}
        expenseFormState={expenseFormState}
        onEdit={() => {}}
        onSave={(expense: Transaction) => expenseManager.update(expense)}
        setExpenseFormState={setExpenseFormState}
        unlinkExpense={(expense: Transaction) => {
          props.unlinkExpense(expense)
        }}
      />
    } else {
      linkedExpenseTable = <></>
    }
    itineraryItems[activity.activity_id] = (
      <ItineraryItem
        key={activity.activity_id}
        activity={activity}
        linkedExpenseTable={linkedExpenseTable}
        showEditActivityModal={() => {
          setSelectedActivity(activity)
          setActivityFormStateWithDefaults(activity)
          setShowEditActivityModal(true)
        }}
        showLinkExpenseModal={() => setShowLinkExpenseModal(true)}
      />
  )})

  return (
    <>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav
            activeTab={activeTab}
            switchToOverview={() => setActiveTab(Tab.Overview)}
            switchToPlans={() => setActiveTab(Tab.Plans)}
            switchToSpend={() => setActiveTab(Tab.Spend)}
            trip={props.trip}
          />
        </div>
        <div>
          {activeTab === Tab.Overview ? <TripOverview
            activities={props.activities}
            expenses={props.expenses}
            trip={props.trip}
          /> : <></>}
          <ItineraryTableContainer>
            <ItineraryTable
              activities={props.activities}  // for sorting purposes only
              itineraryItems={itineraryItems}
              show={activeTab === Tab.Plans ? true : false}
            />
          </ItineraryTableContainer>
          
          <ExpensesTable
            activities={props.activities}
            activityFormState={activityFormState}
            expenseFormState={expenseFormState}
            expenses={props.expenses}
            onDelete={(expense: Transaction) => expenseManager.delete(expense)}
            onSave={(expense: Transaction) => expenseManager.update(expense)}
            setActivityFormState={setActivityFormState}
            setExpenseFormState={setExpenseFormState}
            show={activeTab === Tab.Spend ? true : false}
            unlinkExpense={props.unlinkExpense}
          />
        </div>
        {activeTab !== Tab.Overview ? <NewItemButton
          onClick={() => {
            if (activeTab === Tab.Plans) {
              setShowNewActivityModal(true)
            } else if (activeTab === Tab.Spend) {
              setShowNewExpenseModal(true)
            }
          }}
        /> : <></>}
        <NewActivityModal
          onClose={() => setShowNewActivityModal(false)}
          onCreate={(state: ActivityFormState) => {
            if (isActivityFormStateComplete(state)) {
              console.log("saving activity... ", state)
              activityManager.create({
                date: new Date(state.activityDate),
                description: state.activityDescription,
                category: state.activityCategory,
              })
            } else {
              console.log("activity form incomplete: ", state)
            }
          }}
          show={showNewActivityModal}
        />
        <EditActivityModal
          activity={selectedActivity}
          activityFormState={activityFormState}
          onClose={() => setShowEditActivityModal(false)}
          onDelete={(activity: Activity) => activityManager.delete(activity)}
          onSave={(activity: Activity) => activityManager.update(activity)}
          setActivityFormState={setActivityFormStateWithDefaults}
          show={showEditActivityModal}
        />
        <LinkExpenseModal
          activity={selectedActivity}
          expenses={props.expenses}
          linkExpensesToActivity={props.linkExpensesToActivity}
          onClose={() => setShowLinkExpenseModal(false)}
          show={showLinkExpenseModal}
        />
        <NewExpenseModal
          onClose={() => setShowNewExpenseModal(false)}
          onCreate={(state: ExpenseFormState) => {
            if (isExpenseFormStateComplete(state)) {
              console.log("saving expense... ", state)
              expenseManager.create({
                activity_id: "",
                date: new Date(state.expenseDate),
                description: state.expenseDescription,
                amount: Number(state.expenseAmount),
                currency: state.expenseCurrency,
                category: state.expenseCategory,
              })
            } else {
              console.log("expense form incomplete: ", state)
            }            
          }}
          show={showNewExpenseModal}
        />
      </div>
    </>
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