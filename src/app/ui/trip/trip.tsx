'use client'

import { useState } from 'react';
import { ItineraryItem, ItineraryTable, ItineraryTableContainer, LinkedActivitiesTable } from '../itinerary/itinerary-table';
import { ExpenseItem, ExpensesTable, ExpenseTableContainer, LinkedExpenseTable } from '../expenses/expenses-table';
import SideNav from '../itinerary/sidenav';
import { Button } from '../button';
import { ActivityFormState, ExpenseFormState } from './form-states';
import { ActivityManager } from '@/src/app/lib/crud/activity-manager';
import { ExpenseManager } from '@/src/app/lib/crud/expense-manager';
import { EditActivityModal, EditExpenseModal, NewActivityModal, NewExpenseModal } from './edit-item-modals';
import { commissioner } from '../fonts';
import { Activity, Transaction, Trip as TripType, Destination } from '@/src/app/lib/types';
import { Tab } from '../itinerary/types';
import { TripOverview } from './trip-overview';
import { LinkExpenseModal } from '../itinerary/link-expense-modal'
import { TripExpenses } from './trip-expenses';
import { PlansCalendar } from './plans-calendar';
import Timeline from './timeline/timeline';
import { Transport } from '@/src/app/lib/types/transport';
import { DestinationForm } from './destination-form/destination-form';
import { DestinationFormState } from './destination-form/types';
import { TimelineItem } from './timeline/types';
import { handleCreateDestination, handleUpdateDestination } from '@/src/app/lib/actions/destinations';

function isActivityFormStateComplete(state: ActivityFormState) : boolean {
  return (state.activityDescription !== "")
}

function isExpenseFormStateComplete(state: ExpenseFormState) : boolean {
  return (state.expenseDescription !== "") && (state.expenseCurrency !== "")
}

function formStateFromActivity(activity: Activity | null) : ActivityFormState {
  return {
    activityDate: activity ? activity.activity_date : new Date(Date.now()),
    activityDescription: activity ? activity.description : "",
    activityCategory: activity ? activity.category : "",
  }
}

function formStateFromExpense(expense: Transaction | null) : ExpenseFormState {
  return {
    expenseDate: expense ? expense.transaction_date : new Date(Date.now()),
    expenseDescription: expense ? expense.description : "",
    expenseAmount: expense ? String(expense.amount) : "0.00",
    expenseCurrency: expense ? expense.currency : "",
    expenseCategory: expense ? expense.category : "",
  }
}

export function Trip(props: {
  trip: TripType;
  activities: Activity[];
  expenses: Transaction[];
  transports: Transport[];
  linkExpensesToActivity: (activityId: string, expenseId: string) => Promise<void>;
  unlinkExpense: (expenseId: string) => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Overview)
  const [highlights, setHighlights] = useState<any[]>([])

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [selectedExpense, setSelectedExpense] = useState<Transaction | null>(null)

  const [activityFormState, setActivityFormState] = useState<ActivityFormState>(formStateFromActivity(null))
  const [expenseFormState, setExpenseFormState] = useState<ExpenseFormState>(formStateFromExpense(null))

  const [showNewActivityModal, setShowNewActivityModal] = useState(false)
  const [showEditActivityModal, setShowEditActivityModal] = useState(false)
  const [showLinkExpenseModal, setShowLinkExpenseModal] = useState(false)
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false)
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false)

  const [showDestinationForm, setShowDestinationForm] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<DestinationFormState | null>(null);

  let activityManager = new ActivityManager(props.trip.trip_id)
  let expenseManager = new ExpenseManager(props.trip.trip_id)

  let createActivityFromForm = (state: ActivityFormState) => {
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
  }

  const unlinkActivity = (expense: Transaction) => {
    props.unlinkExpense(expense.transaction_id);
  }

  let createExpenseFromForm = (state: ExpenseFormState) => {
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
  }

  let buildItineraryItem = (activity: Activity, linkedExpenses: Transaction[]) => {
    console.log("linked expenses:", linkedExpenses)
    var linkedExpenseTable: JSX.Element
    if (linkedExpenses.length > 0) {
      linkedExpenseTable = <LinkedExpenseTable
        // activity={props.activity}
        expenses={linkedExpenses}
        expenseFormState={expenseFormState}
        onEdit={() => {}}
        onSave={(expense: Transaction) => expenseManager.update(expense)}
        setExpenseFormState={(expense: Transaction) => setExpenseFormState(formStateFromExpense(expense))}
        unlinkExpense={props.unlinkExpense}
      />
    } else {
      linkedExpenseTable = <></>
    }
    return (
      <ItineraryItem
        key={activity.activity_id}
        activity={activity}
        linkedExpenseTable={linkedExpenseTable}
        showEditActivityModal={() => {
          setSelectedActivity(activity)
          setActivityFormState(formStateFromActivity(activity))
          setShowEditActivityModal(true)
        }}
        showLinkExpenseModal={() => setShowLinkExpenseModal(true)}
      />
    )
  }

  let buildExpenseItem = (expense: Transaction, linkedActivities: Activity[]) => {
    console.log("linked activities:", linkedActivities)
    var linkedActivitiesTable: JSX.Element
    if (linkedActivities.length > 0) {
      linkedActivitiesTable = <LinkedActivitiesTable
        activities={linkedActivities}
        // expense={expense}
        activityFormState={activityFormState}
        onEdit={() => {}}
        onSave={activityManager.update}
        unlinkActivity={unlinkActivity}
        setActivityFormState={(activity: Activity) => setActivityFormState(formStateFromActivity(activity))}
      />
    } else {
      linkedActivitiesTable = <></>
    }
    return (
      <ExpenseItem
        key={expense.transaction_id}
        expense={expense}
        linkedActivitiesTable={linkedActivitiesTable}
        showEditExpenseModal={() => {
          setSelectedExpense(expense)
          setExpenseFormState(formStateFromExpense(expense))
          setShowEditExpenseModal(true)
        }}
      />
    )
  }

  interface LinkedItems {
    [key: string]: JSX.Element;
  }

  let itineraryItems: LinkedItems = {}
  let expenseItems: LinkedItems = {}

  props.activities.map((activity: Activity) => {
    const linkedExpenses = props.expenses.filter(
      (expense: Transaction) => expense.activity_id === activity.activity_id
    );
    itineraryItems[activity.activity_id] = buildItineraryItem(activity, linkedExpenses);
  });
  
  props.expenses.map((expense: Transaction) => {
    const linkedActivities = props.activities.filter(
      (activity: Activity) => activity.activity_id === expense.activity_id
    );
    expenseItems[expense.transaction_id] = buildExpenseItem(expense, linkedActivities);
  });

  const handleAddHighlight = () => {
    // Implement highlight creation logic
  };

  const handleSaveDestination = async (data: DestinationFormState) => {
    try {
      let result;
      if (data.id) {
        result = await handleUpdateDestination(data.id, data);
      } else {
        result = await handleCreateDestination(props.trip.trip_id, data);
      }

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to save destination');
      }

      // Update the destinations list
      const updatedDestinations = props.trip.destinations.map(dest => 
        dest.destination_id === result.data.destination_id ? result.data : dest
      );
      if (!data.id) {
        updatedDestinations.push(result.data);
      }
      props.trip.destinations = updatedDestinations;

      // Close the form
      setShowDestinationForm(false);
      setSelectedDestination(null);
    } catch (error) {
      console.error('Error saving destination:', error);
      // TODO: Show error toast
    }
  };

  const convertTimelineItemToFormState = (item: TimelineItem): DestinationFormState | null => {
    if (item.type !== 'destination') return null;
    const destination = item.data as Destination;
    return {
      id: destination.destination_id,
      city: destination.city || '',
      region: destination.region || '',
      country: destination.country || '',
      start_date: new Date(destination.start_date),
      end_date: new Date(destination.end_date),
      accommodation: {
        name: destination.accommodation.name || '',
        type: destination.accommodation.type || 'hotel',
        address: destination.accommodation.address || '',
        cost: destination.accommodation.total_cost || 0,
        currency: destination.accommodation.currency || 'USD',
      },
    };
  };

  return (
    <>
      <div className="flex h-full flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav
            activeTab={activeTab}
            switchToOverview={() => setActiveTab(Tab.Overview)}
            switchToTrip={() => setActiveTab(Tab.Trip)}
            switchToPlans={() => setActiveTab(Tab.Plans)}
            switchToSpend={() => setActiveTab(Tab.Spend)}
            trip={props.trip}
          />
        </div>
        {/* Scrollable main content area */}
        <div
          className="flex-1 overflow-y-auto p-6 pb-16"
          style={{
            height: 'calc(100vh - 12rem - 4rem)', // 12rem = banner, 4rem = bottom nav
            maxHeight: 'calc(100vh - 12rem - 4rem)',
          }}
        >
          {activeTab === Tab.Overview && (
            <TripOverview
              trip={props.trip}
              activities={props.activities}
              expenses={props.expenses}
              highlights={highlights}
              onAddHighlight={handleAddHighlight}
              onSwitchToPlans={() => setActiveTab(Tab.Plans)}
              onSwitchToSpend={() => setActiveTab(Tab.Spend)}
            />
          )}
          {activeTab === Tab.Trip && (
            <div className="space-y-6">
              <Timeline
                destinations={props.trip.destinations}
                transports={props.transports}
                onEdit={(item) => {
                  const formState = convertTimelineItemToFormState(item);
                  if (formState) {
                    setSelectedDestination(formState);
                    setShowDestinationForm(true);
                  }
                }}
                onAdd={(afterItemId) => {
                  setSelectedDestination(null);
                  setShowDestinationForm(true);
                }}
                onReorder={(items) => {
                  // TODO: Implement reorder functionality
                  console.log('Reorder items:', items);
                }}
              />
            </div>
          )}
          {activeTab === Tab.Plans && (
            <div className="space-y-6">
              <PlansCalendar
                trip={props.trip}
                destinations={props.trip.destinations}
                activities={props.activities}
              />
              <ItineraryTableContainer>
                <ItineraryTable
                  activities={props.activities}
                  itineraryItems={itineraryItems}
                />
              </ItineraryTableContainer>
            </div>
          )}
          {activeTab === Tab.Spend && <TripExpenses
            expenseItems={expenseItems}
            expenses={props.expenses}
          />}
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
          onCreate={createActivityFromForm}
          show={showNewActivityModal}
        />
        <EditActivityModal
          activity={selectedActivity}
          activityFormState={activityFormState}
          onClose={() => setShowEditActivityModal(false)}
          onDelete={(activity: Activity) => activityManager.delete(activity)}
          onSave={(activity: Activity) => activityManager.update(activity)}
          setActivityFormState={(activity: Activity) => setActivityFormState(formStateFromActivity(activity))}
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
          onCreate={createExpenseFromForm}
          show={showNewExpenseModal}
        />
        <EditExpenseModal
          expense={selectedExpense}
          expenseFormState={expenseFormState}
          onClose={() => setShowEditExpenseModal(false)}
          onDelete={expenseManager.delete}
          onSave={expenseManager.update}
          setExpenseFormState={setExpenseFormState}
          show={showEditExpenseModal}
        />
      </div>
      {showDestinationForm && (
        <DestinationForm
          isOpen={showDestinationForm}
          onClose={() => {
            setShowDestinationForm(false);
            setSelectedDestination(null);
          }}
          onSave={handleSaveDestination}
          initialData={selectedDestination || undefined}
        />
      )}
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