'use client'

import { useState } from 'react';
import ItineraryTable from '../itinerary/itinerary-table';
import { ExpensesTable } from '../expenses/expenses-table';
import SideNav from '../itinerary/sidenav';

export function Trip(props: any) {
  const [showActivities, setShowActivities] = useState(true);
  const [showExpenses, setShowExpenses] = useState(false);

  return (
    <>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav
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
        <ItineraryTable
          activities={props.activities}
          expenses={props.expenses}
          linkExpenseToActivity={props.linkExpenseToActivity}
          show={showActivities}
        />
        <ExpensesTable
          activities={props.activities}
          expenses={props.expenses}
          show={showExpenses}
        />
      </div>
    </>
  );
}