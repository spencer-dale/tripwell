'use client'

import { useState } from 'react';
import ItineraryTable from '../itinerary/itinerary-table';
import { ExpensesTable } from '../expenses/expenses-table';
import SideNav from '../itinerary/sidenav';
import { NewExpenseForm } from '../expenses/new-expense-form';
import { Button } from '../button';
import { ActivityEditor, NewActivityButton } from '../itinerary/activity-editor';

export function Trip(props: any) {
  const [showActivities, setShowActivities] = useState(true);
  const [showActivityEditorModal, setShowActivityEditorModal] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);

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
          onClick={() => setShowActivityEditorModal(true)}
          show={showActivities}
        />
        <ItineraryTable
          activities={props.activities}
          expenses={props.expenses}
          linkExpenseToActivity={props.linkExpenseToActivity}
          show={showActivities}
          trip={props.trip}
        />
        <ExpensesTable
          activities={props.activities}
          expenses={props.expenses}
          show={showExpenses}
        />
        <ActivityEditor
          activity={null}
          onHide={() => setShowActivityEditorModal(false)}
          show={showActivityEditorModal}
          trip={props.trip}
        />
      </div>
    </>
  );
}