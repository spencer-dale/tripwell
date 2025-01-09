import { Activity, Transaction } from '@/src/app/lib/types';
import { CollapsedItineraryItem } from '../itinerary/itinerary-table'
import { commissioner, questrial } from '../fonts';
import { formatCurrency } from '../../lib/utils';

export function TripOverview(props: any) {

  let today = new Date()
  let tripStart = new Date(props.trip.start_date)
  let tripEnd = new Date(props.trip.end_date)
  console.log("today: ", today)
  console.log("start: ", tripStart)
  console.log("end: ", tripEnd)
  console.log("trip: ", props.trip)

  var currentDayActivities: Activity[] = []
  for (let i = 0; i < props.activities.length; i++) {
      let date = new Date(props.activities[i].activity_date)
      if (date.toISOString().slice(0, 10) === today.toISOString().slice(0, 10)) {
          currentDayActivities.push(props.activities[i])
      }
  }
  console.log("today's activities:", currentDayActivities)
  return (
    <div>
      {today.getTime() < tripStart.getTime() ? 
        <></> : 
        today.getTime() > tripEnd.getTime() ?
        <></> :
        <CurrentDayItineraryTable
          activities={currentDayActivities}
          currentDate={today}
        />
      }
      <ExpensesByCategoryTable
        expenses={props.expenses}
      />
    </div>
  );
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
        <div className="border-bottom grid grid-cols-2 py-2">
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
        <div>
          <p className={`${questrial.className} text-md mb-0`}>
            {currency} {formatCurrency(amount)}
          </p>
        </div>
      ))}
    </div>
  );
}