'use client'

import InvoiceStatus from '@/src/app/ui/expenses/status';
import { formatCurrency } from '@/src/app/lib/utils';
import { Activity, Transaction } from '../../lib/types';
import { commissioner, questrial } from '../fonts';
import { EditExpenseModal } from '../itinerary/edit-activity-modal';
import { useState } from 'react';
import { ExpenseFormState } from '../itinerary/itinerary-modal';
import { LinkedActivityTable } from '../itinerary/itinerary-table'
import { Button } from '../button';

type expenseDateGroup = {
  date: Date,
  expenses: Transaction[]
}

function newExpenseFormStateWithPlaceholders(expense: Transaction) : ExpenseFormState {
  return {
    expenseDescription: expense ? expense.description : "",
    expenseDate: expense ? expense.transaction_date : new Date(Date.now()),
    expenseAmount: expense ? String(expense.amount) : "0.00",
    expenseCurrency: expense ? expense.currency : "",
    expenseCategory: expense ? expense.category : "",
  }
}

export function ExpensesTable(props: any) {
  if (!props.show) { return <></> }

  let groupedExpenses: expenseDateGroup[] = []
  if (props.expenses.length > 0) {
    let sortedExpenses = props.expenses.toSorted((a: Transaction, b: Transaction) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime())
    let activeGroup: expenseDateGroup = {
      date: sortedExpenses[0].transaction_date,
      expenses: [sortedExpenses[0]]
    }
    sortedExpenses.map((expense: Transaction, idx: number) => {
      if (idx === 0) {
        //
      } else if (expense.transaction_date !== sortedExpenses[idx-1].transaction_date) {
        groupedExpenses.push(activeGroup)
        activeGroup = {
          date: expense.transaction_date,
          expenses: [expense]
        }
      } else {
        activeGroup.expenses.push(expense)
      }
    })
    groupedExpenses.push(activeGroup)
    console.log("final expense groups", groupedExpenses)
  }

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
            {groupedExpenses?.map((group: expenseDateGroup, idx: number) => (
              <div
                key={idx}
                className="my-4 w-full"
              >
                <div className="border-b-2 text-sm">
                  <a>
                    {dateToDisplay(group.date)}
                  </a>
                </div>
                <div className="mt-2">
                  <ExpenseGroup
                    key={idx}
                    activities={props.activities}
                    activityFormState={props.activityFormState}
                    expenseFormState={props.expenseFormState}
                    expenses={group.expenses}
                    onDelete={props.onDelete}
                    onSave={props.onSave}
                    setActivityFormState={props.setActivityFormState}
                    setExpenseFormState={props.setExpenseFormState}
                    unlinkExpense={props.unlinkExpense}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpenseGroup(props: any) {
  return (
    <div>
      {props.expenses?.map((expense: Transaction, idx: number) => (
        <div
          key={expense.transaction_id}
          className="mt-2 w-full"
        >
          <ExpenseItem
            key={idx}
            activities={props.activities}
            activityFormState={props.activityFormState}
            expenseFormState={props.expenseFormState}
            expense={expense}
            onDelete={props.onDelete}
            onSave={props.onSave}
            setActivityFormState={props.setActivityFormState}
            setExpenseFormState={props.setExpenseFormState}
            unlinkExpense={props.unlinkExpense}
          />
        </div>
      ))}
    </div>
  )
}

function ExpenseItem(props: any) {
  const [expanded, setExpanded] = useState(false)

  let expense: Transaction = props.expense

  return (
    <div>
      {expanded ?
        <ExpandedExpenseTableItem
          activities={props.activities}
          activityFormState={props.activityFormState}
          collapse={() => setExpanded(false)}
          expense={expense}
          expenseFormState={props.expenseFormState}
          onDelete={props.onDelete}
          onEditActivity={() => {}}
          onSave={props.onSave}
          setActivityFormState={props.setActivityFormState}
          setExpenseFormState={props.setExpenseFormState}
          unlinkExpense={props.unlinkExpense}
        /> : <CollapsedExpenseTableItem
          expense={expense}
          onClick={() => {
            setExpanded(true)
            props.setExpenseFormState(newExpenseFormStateWithPlaceholders(expense))
          }}
        />
      }
    </div>
  );
}

function ExpandedExpenseTableItem(props: any) {
  const [inEditMode, setInEditMode] = useState(false)
  var expense: Transaction = props.expense
  return (
    <div className="rounded-lg bg-gray-100 py-2 w-full drop-shadow-xl">
      <ExpandedExpenseItemDetails
        activities={props.activities}
        activityFormState={props.activityFormState}
        expense={expense}
        onClick={props.collapse}
        onClose={props.collapse}
        onEdit={() => setInEditMode(true)}
        setActivityFormState={props.setActivityFormState}
      />
      <EditExpenseModal
        expense={expense}
        expenseFormState={props.expenseFormState}
        onClose={() => setInEditMode(false)}
        onDelete={() => props.onDelete(expense)}
        onSave={props.onSave}
        setExpenseFormState={props.setExpenseFormState}
        show={inEditMode}
        unlinkExpense={props.unlinkExpense}
      />
    </div>
  );
}

export function CollapsedExpenseTableItem(props: any) {
  let expense: Transaction = props.expense
  return (
    <div
      key={expense.transaction_id}
      className="rounded-lg bg-gray-100 ps-3 py-2 w-full grid grid-cols-4"
      onClick={props.onClick}
    >
      <div className="flex justify-start col-span-3">
        <div>
          <p className={`${questrial.className} text-md mb-0`}>
            {expense.description}
          </p>
          <p className={`${questrial.className} text-md text-gray-400 mb-0`}>
            {expense.category}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end pe-3">
        <div>
          <p className={`${questrial.className} text-md mb-0`}>
            {formatCurrency(expense.amount)}
          </p>
          <p className="text-sm text-gray-400 text-right mt-1 mb-0">
            {expense.currency}
          </p>
        </div>
      </div>
    </div>
  );
}

export function LinkedExpenseTable(props: any) {
  // const [inEditMode, setInEditMode] = useState(false)
  let linkedExpenses = props.expenses

  return (
    <div className="mt-1 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="md:hidden">
          {linkedExpenses?.map((expense: Transaction) => (
            <div>
              <button
                key={expense.transaction_id}
                className="m-0 w-full"
              >
                <LinkedExpenseTableItem
                  expense={expense}
                  expenseFormState={props.expenseFormState}
                  setExpenseFormState={props.setExpenseFormState}
                  unlinkExpense={props.unlinkExpense}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SelectableExpenseTable(props: any) {
  
  return (
    <div className="mt-2 flow-root w-full">
      <div className="inline-block w-full">
        {props.expenses?.map((expense: Transaction) => (
          <SelectableExpenseTableItem
            deselectExpense={() => props.deselectExpense(expense)}
            expense={expense}
            selectExpense={() => props.selectExpense(expense)}
          />
        ))}
      </div>
    </div>
  );
}

function SelectableExpenseTableItem(props: any) {
  const [selected, setSelected] = useState(false)
  var backgroundFormat: string
  var selectionFunc: any
  if (selected) {
    backgroundFormat = "rounded-lg p-2 bg-gray-200 md:pt-0"
    selectionFunc = () => {
      setSelected(false)
      props.deselectExpense(props.expense)
    }
  } else {
    backgroundFormat = "rounded-lg p-2 bg-gray-50 md:pt-0"
    selectionFunc = () => {
      setSelected(true)
      props.selectExpense(props.expense)
    }
  }
  return (
    <div className={`${backgroundFormat}`}>
      <button
        key={props.expense.transaction_id}
        className="w-full rounded-md grid grid-cols-4"
        onClick={selectionFunc}
      >
        <div className="flex justify-start col-span-3 text-left">
          <div>
            <p className={`${questrial.className} text-md mb-0`}>
              {props.expense.description}
            </p>
            <p className={`${questrial.className} text-md text-gray-400 mb-0`}>
              {props.expense.category}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end pe-3">
          <div>
            <p className={`${questrial.className} text-md mb-0`}>
              {formatCurrency(props.expense.amount)}
            </p>
            <p className="text-sm text-gray-400 text-right mt-1 mb-0">
              {props.expense.currency}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

function ExpandedExpenseItemDetails(props: any) {
  let expense: Transaction = props.expense
  let activities: Activity[] = props.activities
  if (props.expense != null) {
    activities = activities.filter(
      (activity: Activity) => activity.activity_id === props.expense.activity_id
    )
  }
  const unlinkActivity = () => {
    props.updateExpense({
      transaction_id: expense.transaction_id,
      trip_id: expense.trip_id,
      activity_id: "",
      description: expense.description,
      transaction_date: expense.transaction_date,
      amount: expense.amount,
      currency: expense.currency,
      category: expense.category,
    })
  }
  return (
    <div key={expense.transaction_id}>
      <div
        className="grid grid-cols-4"
        onClick={props.onClick}
      >
        <div className="flex justify-start ps-3 col-span-3 text-left">
          <div>
            <p className={`${questrial.className} text-md mb-0`}>
              {props.expense.description}
            </p>
            <p className={`${questrial.className} text-md text-gray-400 mb-0`}>
              {props.expense.category}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end px-3">
          <div>
            <p className={`${questrial.className} text-md mb-0`}>
              {formatCurrency(props.expense.amount)}
            </p>
            <p className="text-sm text-gray-400 text-right mt-1 mb-0">
              {props.expense.currency}
            </p>
          </div>
        </div>
      </div>
      <div>
        <ul className="flex flex-row ps-3 m-0">
          <li className="mt-1 pe-1" onClick={props.switchToExpenses}>
            <Button
              className={`${questrial.className} text-sm h-6`}
              onClick={props.onEdit}
            >
              Edit
            </Button>
          </li>
        </ul>
      </div>
      <div className="w-full items-center justify-between ps-2">
        {activities.length > 0 ? <LinkedActivityTable
          activities={activities}
          expense={expense}
          activityFormState={props.activityFormState}
          onEdit={() => {}}
          unlinkActivity={unlinkActivity}
          setActivityFormState={props.setActivityFormState}
        /> : <></>}
      </div>
    </div>
  );
}

export function LinkedExpenseTableItem(props: any) {
  const [inEditMode, setInEditMode] = useState(false)
  let expense: Transaction = props.expense

  const onEdit = () => {
    setInEditMode(true)
    props.setExpenseFormState(newExpenseFormStateWithPlaceholders(props.expense))
  }

  return (
    <div>
      <div
        key={expense.transaction_id}
        className="rounded-md grid grid-cols-4 rounded-lg mx-2 mt-2 px-2 pt-2 bg-gray-50 md:pt-0"
        onClick={onEdit}
      >
        <div className="flex justify-start col-span-3 text-left">
          <div>
            <p className={`${questrial.className} text-md mb-0`}>
              {props.expense.description}
            </p>
            <p className={`${questrial.className} text-md text-gray-400 mb-0`}>
              {props.expense.category}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end pe-3">
          <div>
            <p className={`${questrial.className} text-md mb-0`}>
              {formatCurrency(props.expense.amount)}
            </p>
            <p className="text-sm text-gray-400 text-right mt-1 mb-0">
              {props.expense.currency}
            </p>
          </div>
        </div>
      </div>
      <EditExpenseModal
        expense={expense}
        expenseFormState={props.expenseFormState}
        onClose={() => {
          setInEditMode(false)
        }}
        onSave={props.onSave}
        setExpenseFormState={props.setExpenseFormState}
        show={inEditMode}
        unlinkExpense={props.unlinkExpense}
      />
    </div>
  );
}
