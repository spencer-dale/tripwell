'use client'

import { dateToDisplay, formatCurrency } from '@/src/app/lib/utils';
import { Transaction } from '../../lib/types';
import { questrial } from '../fonts';
import { EditExpenseModal } from '../trip/edit-item-modals';
import { useState } from 'react';
import { Button } from '../button';
import { InvisibleButton } from '../button';

type expenseDateGroup = {
  date: Date,
  expenses: Transaction[]
}

export function ExpenseTableContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg md:pt-0">
          <div className="md:hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExpensesTable(props: any) {
  if (props.expenses.length == 0) { return <></> }

  let sortedExpenses = props.expenses.toSorted((a: Transaction, b: Transaction) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime())
  let groupedExpenses: expenseDateGroup[] = []
  let activeGroup: expenseDateGroup = {
    date: sortedExpenses[0].transaction_date,
    expenses: [sortedExpenses[0]]
  }
  sortedExpenses.map((expense: Transaction, idx: number) => {
    if (idx === 0) {
      // already accounted for, above
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
  // console.log("final expense groups", groupedExpenses)

  return (
    <>
      {groupedExpenses?.map((group: expenseDateGroup, idx: number) => (
        <div
          key={idx}
          className="my-4 w-full"
        >
          <div className="mt-2">
            <ExpenseGroup
              key={idx}
              expenseItems={props.expenseItems}
              group={group}
            />
          </div>
        </div>
      ))}
    </>
  );
}

function ExpenseGroup(props: any) {
  return (
    <div>
      <div className="border-b-2 text-sm">
        <a>
          {dateToDisplay(props.group.date)}
        </a>
      </div>
      {props.group.expenses?.map((expense: Transaction, idx: number) => (
        <div
          key={expense.transaction_id}
          className="mt-2 w-full"
        >
          {props.expenseItems[expense.transaction_id]}
        </div>
      ))}
    </div>
  )
}

export function ExpenseItem(props: any) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      {expanded ?
        <ExpandedExpenseItem
          collapse={() => setExpanded(false)}
          expense={props.expense}
          linkedActivitiesTable={props.linkedActivitiesTable}
          showEditExpenseModal={props.showEditExpenseModal}
        /> : 
        <InvisibleButton
          onClick={() => setExpanded(true)}
        >
          <CollapsedExpenseTableItem
            expense={props.expense}
          />
        </InvisibleButton>
      }
    </div>
  );
}

function ExpandedExpenseItem(props: any) {
  return (
    <ExpandedExpenseItemCard>
      <InvisibleButton
        onClick={props.collapse}
      >
        <ExpandedExpenseItemDetails
          expense={props.expense}
        />
      </InvisibleButton>
      <ExpenseItemButtons
        onEdit={props.showEditExpenseModal}
      />
      <div className="w-full items-center justify-between ps-2">
        {props.linkedActivitiesTable}
      </div>
    </ExpandedExpenseItemCard>
  );
}

export function ExpenseItemButtons(props: any) {
  return (
    <div>
      <ul className="flex flex-row ps-3 m-0">
        <li className="mt-1 pe-1">
          <Button
            className={`${questrial.className} text-sm h-6`}
            onClick={props.onEdit}
          >
            Edit
          </Button>
        </li>
      </ul>
    </div>
  );
}

export function CollapsedExpenseTableItem(props: any) {
  let expense: Transaction = props.expense
  return (
    <div
      className="rounded-lg bg-gray-100 ps-3 py-2 w-full grid grid-cols-4"
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

function ExpandedExpenseItemCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-gray-100 py-2 w-full drop-shadow-xl">
      {children}
    </div>
  );
}

export function LinkedExpenseTable(props: any) {
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

  return (
    <div
      className="grid grid-cols-4"
    >
      <div className="flex justify-start ps-3 col-span-3 text-left">
        <div>
          <p className={`${questrial.className} text-md mb-0`}>
            {expense.description}
          </p>
          <p className={`${questrial.className} text-md text-gray-400 mb-0`}>
            {expense.category}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end px-3">
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

export function LinkedExpenseTableItem(props: any) {
  const [inEditMode, setInEditMode] = useState(false)
  let expense: Transaction = props.expense

  const onEdit = () => {
    setInEditMode(true)
    props.setExpenseFormState(expense)
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
