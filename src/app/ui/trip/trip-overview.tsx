'use client'

import { Trip, Activity, Transaction, Destination } from '@/src/app/lib/types';
import { CollapsedItineraryItem } from '../itinerary/itinerary-table'
import { commissioner, questrial } from '../fonts';
import { formatCurrency } from '../../lib/utils';
import { TripHighlights } from './trip-highlights';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { convertToCAD } from '@/src/app/lib/currency';
import { Button } from '../button';
import { TripTimeline } from './trip-timeline';

interface TripOverviewProps {
  trip: Trip;
  activities: Activity[];
  expenses: Transaction[];
  onSwitchToPlans: () => void;
  onSwitchToSpend: () => void;
  onAddDestination: (destination: Destination | null) => void;
  setSelectedDestination: (destination: Destination) => void;
  setShowNewExpenseModal: (show: boolean) => void;
}

interface DestinationCardProps {
  destination: Destination;
  activities: Activity[];
  index: number;
  onSelect: (destination: Destination) => void;
}

function DestinationCard({ destination, activities, index, onSelect }: DestinationCardProps) {
  const destinationActivities = activities.filter(activity => 
    activity.destination_id === destination.destination_id
  );

  return (
    <div 
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => onSelect(destination)}
    >
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
        </div>
        <div>
          <div className="font-medium">{destination.city || destination.country}</div>
          <div className="text-sm text-gray-500">
            {formatDateRange(destination.start_date, destination.end_date)}
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        {destinationActivities.length} activities
      </div>
    </div>
  );
}

export function TripOverview({
  trip,
  activities,
  expenses,
  onSwitchToPlans,
  onSwitchToSpend,
  onAddDestination,
  setSelectedDestination,
  setShowNewExpenseModal
}: TripOverviewProps) {
  const router = useRouter();
  
  // Calculate total accommodation costs in CAD
  const totalAccommodationCost = trip.destinations.reduce((sum, destination) => {
    return sum + convertToCAD(
      destination.accommodation.total_cost,
      destination.accommodation.currency
    );
  }, 0);

  // Calculate transportation costs
  const totalTransportationCost = expenses
    .filter(expense => expense.category.toLowerCase().includes('transport'))
    .reduce((sum, expense) => sum + convertToCAD(expense.amount, expense.currency), 0);

  // Calculate other costs (excluding accommodation and transportation)
  const totalOtherCost = expenses
    .filter(expense => {
      const category = expense.category.toLowerCase();
      return !category.includes('transport') && !category.includes('accommodation');
    })
    .reduce((sum, expense) => sum + convertToCAD(expense.amount, expense.currency), 0);

  // Calculate total expenses in CAD (including accommodation)
  const totalExpenses = totalOtherCost + totalTransportationCost + totalAccommodationCost;

  const highlights = activities.filter(activity => activity.is_highlight);

  return (
    <div className="space-y-6">
      {/* Trip Highlights Section */}
      <div className="flex-none">
        <TripHighlights
          highlights={highlights}
        />
      </div>

      {/* Quick Actions Section */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 mt-4">
        {/* View Itinerary Button */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Itinerary</h2>
            <button
              onClick={() => onAddDestination(null)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Add place
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3">
            {trip.destinations.map((destination, index) => (
              <DestinationCard
                key={destination.destination_id}
                destination={destination}
                activities={activities}
                index={index}
                onSelect={setSelectedDestination}
              />
            ))}
          </div>

          {/* View Itinerary Button */}
          <div className="mt-4">
            <Button
              onClick={onSwitchToPlans}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 text-lg"
            >
              View Full Itinerary
              <ArrowRightIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Expenses Summary Card */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Spend</h2>
            <button
              onClick={() => setShowNewExpenseModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Add expense
            </button>
          </div>
          
          {/* Total Expenses */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{formatCurrency(totalExpenses)}</span>
              <span className="text-gray-500">CAD</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Total trip expenses</p>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-4 mb-6">
            {/* Accommodation */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">{formatCurrency(totalAccommodationCost)}</span>
                <span className="text-gray-500">CAD</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Accommodation</p>
            </div>

            {/* Transportation */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">{formatCurrency(totalTransportationCost)}</span>
                <span className="text-gray-500">CAD</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Transportation</p>
            </div>

            {/* Other */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">{formatCurrency(totalOtherCost)}</span>
                <span className="text-gray-500">CAD</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Everything else</p>
            </div>
          </div>

          {/* View All Expenses Button */}
          <Button
            onClick={onSwitchToSpend}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 text-lg"
          >
            View All Expenses
            <ArrowRightIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Current Day Activities (if trip is ongoing) */}
      {isTripOngoing(trip.start_date, trip.end_date) && (
        <div className="flex-none">
          <CurrentDayItineraryTable
            activities={getCurrentDayActivities(activities)}
            currentDate={new Date()}
          />
        </div>
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

interface CurrentDayItineraryTableProps {
  activities: Activity[];
  currentDate: Date;
}

function CurrentDayItineraryTable({ activities, currentDate }: CurrentDayItineraryTableProps) {
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
                  {dateToDisplay(currentDate)}
                </a>
              </div>
              {activities?.length > 0 ?
                <div>
                  {activities?.map((activity: Activity) => (
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

interface ExpensesByCategoryTableProps {
  expenses: Transaction[];
}

function ExpensesByCategoryTable({ expenses }: ExpensesByCategoryTableProps) {
  let expensesByCategoryMap = new Map<string, Transaction[]>();
  expenses.forEach((expense: Transaction) => {
    let categoryExpenses = expensesByCategoryMap.get(expense.category) || [];
    categoryExpenses.push(expense);
    expensesByCategoryMap.set(expense.category, categoryExpenses);
  });
  
  return (
    <div>
      <div className="flex flex-col py-2 items-left border-bottom">
        <p className={`${commissioner.className} text-2xl font-bold m-0`}>
          Total spend
        </p>
      </div>
      {Array.from(expensesByCategoryMap.entries()).map(([category, categoryExpenses], idx) => (
        <div key={idx} className="border-bottom grid grid-cols-2 py-2">
          <p className={`${questrial.className} text-md mb-0`}>
            {category}
          </p>
          <ExpenseCurrenciesByCategory
            expenses={categoryExpenses}
          />
        </div>
      ))}
    </div>
  );
}

interface ExpenseCurrenciesByCategoryProps {
  expenses: Transaction[];
}

function ExpenseCurrenciesByCategory({ expenses }: ExpenseCurrenciesByCategoryProps) {
  let currencyToTotalAmountMap = new Map<string, number>();
  expenses.forEach((expense: Transaction) => {
    const currentTotal = currencyToTotalAmountMap.get(expense.currency) || 0;
    currencyToTotalAmountMap.set(expense.currency, currentTotal + (expense.amount || 0));
  });

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

export function formatDateRange(startDate: Date, endDate: Date): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startMonth = start.toLocaleString('default', { month: 'short' });
  const endMonth = end.toLocaleString('default', { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startYear === endYear) {
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}, ${startYear}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
    }
  } else {
    return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
  }
}