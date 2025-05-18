'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ItineraryItem, ItineraryTable, ItineraryTableContainer, LinkedActivitiesTable } from '../itinerary/itinerary-table';
import { ExpenseItem, ExpensesTable, ExpenseTableContainer, LinkedExpenseTable } from '../expenses/expenses-table';
import SideNav from '../itinerary/sidenav';
import { Button } from '../button';
import { ActivityFormState, ExpenseFormState } from './form-states';
import { ActivityManager } from '@/src/app/lib/crud/activity-manager';
import { ExpenseManager } from '@/src/app/lib/crud/expense-manager';
import { EditActivityModal, EditExpenseModal, NewActivityModal, NewExpenseModal } from './edit-item-modals';
import { commissioner } from '../fonts';
import { Activity, Transaction, Trip as TripType, Destination, SerializedActivity, SerializedTransaction, SerializedTrip, SerializedDestination } from '@/src/app/lib/types';
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
import { handleCreateDestination, handleUpdateDestination, handleDeleteDestination } from '@/src/app/lib/actions/destinations';
import { ItineraryPanel } from './itinerary-panel';
import { ExpensesPanel } from './expenses-panel';
import { PlaceDetailsPanel } from './place-details-sheet';

function isActivityFormStateComplete(state: ActivityFormState) : boolean {
  return (state.activityDescription !== "")
}

function isExpenseFormStateComplete(state: ExpenseFormState) : boolean {
  return (state.expenseDescription !== "") && (state.expenseCurrency !== "")
}

function formStateFromActivity(activity: Activity | null) : ActivityFormState {
  console.log("looking at activity: ", activity)
  if (!activity) {
    return {
      activityDate: new Date(Date.now()),
      activityDescription: "",
      activityCategory: "",
    }
  }

  // Create a new date object from the activity date
  const activityDate = new Date(activity.activity_date);
  
  // Ensure the date is treated as UTC by creating a new UTC date
  const utcDate = new Date(Date.UTC(
    activityDate.getUTCFullYear(),
    activityDate.getUTCMonth(),
    activityDate.getUTCDate(),
    activityDate.getUTCHours(),
    activityDate.getUTCMinutes()
  ));

  console.log('Creating form state with UTC date:', {
    original: activityDate.toISOString(),
    utc: utcDate.toISOString(),
    hours: utcDate.getUTCHours(),
    minutes: utcDate.getUTCMinutes()
  });

  return {
    activityDate: utcDate,
    activityDescription: activity.description,
    activityCategory: activity.category,
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

// Helper functions to convert serialized objects back to their original types
function deserializeActivity(activity: SerializedActivity): Activity {
  // Create a new date object from the ISO string
  const activityDate = new Date(activity.activity_date);
  
  // Create a new UTC date using the components
  const utcDate = new Date(Date.UTC(
    activityDate.getUTCFullYear(),
    activityDate.getUTCMonth(),
    activityDate.getUTCDate(),
    activityDate.getUTCHours(),
    activityDate.getUTCMinutes()
  ));

  return {
    ...activity,
    activity_date: utcDate
  };
}

function deserializeTransaction(transaction: SerializedTransaction): Transaction {
  return {
    ...transaction,
    transaction_date: new Date(transaction.transaction_date)
  };
}

function deserializeDestination(destination: SerializedDestination): Destination {
  return {
    ...destination,
    start_date: new Date(destination.start_date),
    end_date: new Date(destination.end_date)
  };
}

function deserializeTrip(trip: SerializedTrip): TripType {
  return {
    ...trip,
    start_date: new Date(trip.start_date),
    end_date: new Date(trip.end_date),
    destinations: trip.destinations.map(deserializeDestination)
  };
}

export function Trip(props: {
  trip: SerializedTrip;
  activities: SerializedActivity[];
  expenses: SerializedTransaction[];
  transports: Transport[];
  linkExpensesToActivity: (activityId: string, expenseId: string) => Promise<void>;
  unlinkExpense: (expenseId: string) => Promise<void>;
}) {
  const router = useRouter();
  const [highlights, setHighlights] = useState<any[]>([])
  const [showFullItinerary, setShowFullItinerary] = useState(false)
  const [showExpenses, setShowExpenses] = useState(false)

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [selectedExpense, setSelectedExpense] = useState<Transaction | null>(null)

  const [activityFormState, setActivityFormState] = useState<ActivityFormState>(formStateFromActivity(null))
  const [expenseFormState, setExpenseFormState] = useState<ExpenseFormState>(formStateFromExpense(null))

  const [showNewActivityModal, setShowNewActivityModal] = useState(false)
  const [showEditActivityModal, setShowEditActivityModal] = useState(false)
  const [showLinkExpenseModal, setShowLinkExpenseModal] = useState(false)
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false)
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false)

  const [selectedDestination, setSelectedDestination] = useState<DestinationFormState | null>(null);
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState<Destination | null>(null);
  const [showDestinationForm, setShowDestinationForm] = useState(false);

  // Convert serialized data to regular types
  const trip = deserializeTrip(props.trip);
  const activities = props.activities.map(deserializeActivity);
  const expenses = props.expenses.map(deserializeTransaction);

  let activityManager = new ActivityManager(trip.trip_id)
  let expenseManager = new ExpenseManager(trip.trip_id)

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
    // console.log("linked expenses:", linkedExpenses)
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
    // console.log("linked activities:", linkedActivities)
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

  activities.map((activity: Activity) => {
    const linkedExpenses = expenses.filter(
      (expense: Transaction) => expense.activity_id === activity.activity_id
    );
    itineraryItems[activity.activity_id] = buildItineraryItem(activity, linkedExpenses);
  });
  
  expenses.map((expense: Transaction) => {
    const linkedActivities = activities.filter(
      (activity: Activity) => activity.activity_id === expense.activity_id
    );
    expenseItems[expense.transaction_id] = buildExpenseItem(expense, linkedActivities);
  });

  const handleAddHighlight = () => {
    // Implement highlight creation logic
  };

  const handleSaveDestination = async (data: DestinationFormState) => {
    try {
      // Log the form data
      console.log('Form data received:', {
        id: data.id,
        country: data.country,
        city: data.city,
        region: data.region,
        start_date: data.start_date,
        end_date: data.end_date,
        accommodation: {
          name: data.accommodation.name,
          type: data.accommodation.type,
          address: data.accommodation.address,
          cost: data.accommodation.cost,
          currency: data.accommodation.currency
        }
      });

      // Create a clean copy of the data for saving
      const cleanData = {
        id: data.id,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        country: data.country,
        city: data.city || '',
        region: data.region || '',
        accommodation: {
          name: data.accommodation.name,
          type: data.accommodation.type,
          address: data.accommodation.address,
          cost: Number(data.accommodation.cost),
          currency: data.accommodation.currency
        }
      };

      let response;
      if (cleanData.id) {
        console.log('Updating existing destination with ID:', cleanData.id);
        response = await fetch(`/api/destinations/${cleanData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanData),
        });
      } else {
        console.log('Creating new destination for trip:', trip.trip_id);
        response = await fetch(`/api/destinations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...cleanData, trip_id: trip.trip_id }),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save destination');
      }

      console.log('Successfully saved destination:', {
        id: result.data.destination_id,
        country: result.data.country,
        city: result.data.city
      });

      // Close the form
      setShowDestinationForm(false);
      setSelectedDestination(null);

      // Refresh the page data
      router.refresh();
    } catch (error: any) {
      console.error('Error saving destination:', {
        errorMessage: error?.message || 'Unknown error',
        errorName: error?.name || 'Unknown error type'
      });
    }
  };

  const onDeleteDestination = async () => {
    if (!selectedDestination?.id) return;

    try {
      console.log('Deleting destination:', {
        id: selectedDestination.id,
        country: selectedDestination.country,
        city: selectedDestination.city,
        dates: `${selectedDestination.start_date.toISOString()} - ${selectedDestination.end_date.toISOString()}`
      });

      const result = await handleDeleteDestination(selectedDestination.id);
      if (!result.success) {
        console.error('Failed to delete destination:', result.error);
        throw new Error(result.error || 'Failed to delete destination');
      }

      console.log('Successfully deleted destination:', {
        id: selectedDestination.id,
        country: selectedDestination.country,
        city: selectedDestination.city
      });

      // Close the form
      setShowDestinationForm(false);
      setSelectedDestination(null);

      // Refresh the page data
      router.refresh();
    } catch (error) {
      console.error('Error deleting destination:', error);
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
            trip={trip}
          />
        </div>
        {/* Scrollable main content area */}
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{
            height: 'calc(100vh - 11rem - 4rem - 8.5rem)', // 11rem = banner, 4rem = bottom nav, 8.5rem = custom adjustment
            maxHeight: 'calc(100vh - 11rem - 4rem - 8.5rem)',
          }}
        >
          <TripOverview
            trip={trip}
            activities={activities}
            expenses={expenses}
            highlights={highlights}
            onAddHighlight={handleAddHighlight}
            onSwitchToPlans={() => setShowFullItinerary(true)}
            onSwitchToSpend={() => setShowExpenses(true)}
            onAddDestination={(afterItemId) => {
              setSelectedDestination(null);
              setShowDestinationForm(true);
            }}
            setSelectedDestination={setSelectedPlaceDetails}
            setShowNewExpenseModal={setShowNewExpenseModal}
          />
        </div>
        <NewActivityModal
          onClose={() => setShowNewActivityModal(false)}
          onCreate={createActivityFromForm}
          show={showNewActivityModal}
        />
        <EditActivityModal
          activity={selectedActivity}
          activityFormState={activityFormState}
          onClose={() => {
            setShowEditActivityModal(false);
            setSelectedActivity(null);
          }}
          onDelete={(activity: Activity) => {
            activityManager.delete(activity);
            setShowEditActivityModal(false);
            setSelectedActivity(null);
          }}
          onSave={(activity: Activity) => {
            activityManager.update(activity);
            setShowEditActivityModal(false);
            setSelectedActivity(null);
          }}
          setActivityFormState={(state: ActivityFormState) => setActivityFormState(state)}
          show={showEditActivityModal}
        />
        <LinkExpenseModal
          activity={selectedActivity}
          expenses={expenses}
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
        <ItineraryPanel
          isOpen={showFullItinerary}
          onClose={() => setShowFullItinerary(false)}
          trip={trip}
          destinations={trip.destinations}
          activities={activities}
          transports={props.transports}
          itineraryItems={itineraryItems}
          onEditDestination={(item) => {
            const formState = convertTimelineItemToFormState(item);
            if (formState) {
              setSelectedDestination(formState);
              setShowDestinationForm(true);
            }
          }}
          onAddDestination={(afterItemId) => {
            setSelectedDestination(null);
            setShowDestinationForm(true);
          }}
          onReorderDestinations={(items) => {
            // TODO: Implement reorder functionality
            console.log('Reorder items:', items);
          }}
          onEditActivity={(activity) => {
            setSelectedActivity(activity);
            setActivityFormState(formStateFromActivity(activity));
            setShowEditActivityModal(true);
          }}
        />
        <ExpensesPanel
          isOpen={showExpenses}
          onClose={() => setShowExpenses(false)}
          trip={trip}
          expenses={expenses}
          expenseItems={expenseItems}
        />
        {/* Place Details Panel */}
        {selectedPlaceDetails && (
          <PlaceDetailsPanel
            isOpen={!!selectedPlaceDetails}
            onClose={() => setSelectedPlaceDetails(null)}
            onEdit={() => {
              const formState = convertTimelineItemToFormState({
                id: selectedPlaceDetails.destination_id,
                type: 'destination',
                data: selectedPlaceDetails,
                order: 0
              });
              if (formState) {
                setSelectedDestination(formState);
                setShowDestinationForm(true);
              }
              setSelectedPlaceDetails(null);
            }}
            onAddActivity={() => {
              setShowNewActivityModal(true);
              setSelectedPlaceDetails(null);
            }}
            onEditActivity={(activity) => {
              setSelectedActivity(activity);
              setActivityFormState(formStateFromActivity(activity));
              setShowEditActivityModal(true);
            }}
            destination={selectedPlaceDetails}
            activities={activities.filter(activity => {
              const activityDate = new Date(activity.activity_date);
              return activityDate >= new Date(selectedPlaceDetails.start_date) && 
                     activityDate <= new Date(selectedPlaceDetails.end_date);
            })}
          />
        )}
      </div>
      {showDestinationForm && (
        <DestinationForm
          isOpen={showDestinationForm}
          onClose={() => {
            setShowDestinationForm(false);
            setSelectedDestination(null);
          }}
          onSave={handleSaveDestination}
          onDelete={onDeleteDestination}
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