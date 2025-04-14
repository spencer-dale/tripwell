'use client'

import { Trip, Activity, Transaction } from '@/src/app/lib/types';
import { CollapsedItineraryItem } from '../itinerary/itinerary-table'
import { commissioner, questrial } from '../fonts';
import { formatCurrency } from '../../lib/utils';
import { TripHighlights } from './trip-highlights';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { convertToCAD } from '@/src/app/lib/currency';
import { Button } from '../button';
import { TripTimeline } from './trip-timeline';

interface TripOverviewProps {
  trip: Trip;
  activities: Activity[];
  expenses: Transaction[];
  highlights: any[]; // Replace with proper type
  onAddHighlight: () => void;
  onSwitchToPlans: () => void;
  onSwitchToSpend: () => void;
}

export function TripOverview({
  trip,
  activities,
  expenses,
  highlights,
  onAddHighlight,
  onSwitchToPlans,
  onSwitchToSpend
}: TripOverviewProps) {
  const router = useRouter();
  
  // Calculate total expenses in CAD
  const totalExpenses = expenses.reduce((sum, expense) => {
    return sum + convertToCAD(expense.amount, expense.currency);
  }, 0);

  // Calculate total accommodation costs in CAD
  const totalAccommodationCost = trip.destinations.reduce((sum, destination) => {
    return sum + convertToCAD(
      destination.accommodation.total_cost,
      destination.accommodation.currency
    );
  }, 0);

  return (
    <div className="space-y-6">
      {/* Trip Highlights Section */}
      <TripHighlights
        highlights={highlights}
        onAddHighlight={onAddHighlight}
      />

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trip Timeline */}
        <TripTimeline
          trip={trip}
          onViewItinerary={onSwitchToPlans}
        />

        {/* Expenses Summary Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold mb-4">Expenses</h2>
            <Button
              onClick={onSwitchToSpend}
              className="flex items-center gap-2"
            >
              All Expenses
              <ArrowRightIcon className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Total Expenses */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{formatCurrency(totalExpenses)}</span>
              <span className="text-gray-500">CAD</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Total trip expenses</p>
          </div>

          {/* Accommodation Costs */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{formatCurrency(totalAccommodationCost)}</span>
              <span className="text-gray-500">CAD</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Total accommodation costs</p>
          </div>

        </div>
      </div>

      {/* Current Day Activities (if trip is ongoing) */}
      {isTripOngoing(trip.start_date, trip.end_date) && (
        <CurrentDayItineraryTable
          activities={getCurrentDayActivities(activities)}
          currentDate={new Date()}
        />
      )}
    </div>
  );
}

function isTripOngoing(startDate: Date, endDate: Date): boolean {
  const today = new Date();
  return today >= new Date(startDate) && today <= new Date(endDate);
}

function getCurrentDayActivities(activities: Activity[]): Activity[] {
  const today = new Date();
  return activities.filter(activity => {
    const activityDate = new Date(activity.activity_date);
    return activityDate.toISOString().slice(0, 10) === today.toISOString().slice(0, 10);
  });
}

function CurrentDayItineraryTable(props: any) {
  const dateToDisplay = (uncastDate: Date) => {
    let date: Date = new Date(uncastDate)
    let localDate: Date = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
    return localDate.toDateString()
  }
 
  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg md:pt-0">
          <div className="md:hidden">
            <div className="my-4 w-full">
              <div className="flex flex-col py-2 items-left">
                <p className={`${commissioner.className} text-2xl font-bold m-0`}>
                  Today
                </p>
              </div>
              <div className="border-b-2 text-sm">
                <a>
                  {dateToDisplay(props.currentDate)}
                </a>
              </div>
              {props.activities?.length > 0 ?
                <div>
                  {props.activities?.map((activity: Activity, idx: number) => (
                    <div
                      key={activity.activity_id}
                      className="mt-2 w-full"
                    >
                      <div className="mt-2">
                      <CollapsedItineraryItem
                        activity={activity}
                      />
                      </div>
                    </div>
                  ))}
                </div> :
                <div>
                  <p className={`${questrial.className} text-center text-md text-gray-400 mb-0 pt-4`}>
                    No activities
                  </p>
                </div>
              }
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpensesByCategoryTable(props: any) {
  let expensesByCategoryMap = new Map()
  props.expenses.map((expense: Transaction) => {
    let expenses = [expense]
    if (expensesByCategoryMap.has(expense.category)) {
      expenses = expensesByCategoryMap.get(expense.category)
      expenses.push(expense)
    }
    expensesByCategoryMap.set(expense.category, expenses)
  })
  
  return (
    <div>
      <div className="flex flex-col py-2 items-left border-bottom">
        <p className={`${commissioner.className} text-2xl font-bold m-0`}>
          Total spend
        </p>
      </div>
      {Array.from(expensesByCategoryMap.entries()).map(([category, expenses], idx) => (
        <div key={idx} className="border-bottom grid grid-cols-2 py-2">
          <p className={`${questrial.className} text-md mb-0`}>
            {category}
          </p>
          <ExpenseCurrenciesByCategory
            expenses={expenses}
          />
        </div>
      ))}
    </div>
  );
}

function ExpenseCurrenciesByCategory(props: any) {
  let currencyToTotalAmountMap = new Map()
  props.expenses.map((expense: Transaction) => {
    let updatedTotal = expense.amount
    if (currencyToTotalAmountMap.has(expense.currency)) {
      updatedTotal += currencyToTotalAmountMap.get(expense.currency)
    }
    currencyToTotalAmountMap.set(expense.currency, updatedTotal)
  })
  console.log("totals by currency", currencyToTotalAmountMap)
  return (
    <div>
      {Array.from(currencyToTotalAmountMap.entries()).map(([currency, amount], idx) => (
        <div key={idx}>
          <p className={`${questrial.className} text-md mb-0`}>
            {currency} {formatCurrency(amount)}
          </p>
        </div>
      ))}
    </div>
  );
}