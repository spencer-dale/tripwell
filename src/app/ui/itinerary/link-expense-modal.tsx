'use client'

import { Button } from '../button';
import Modal from 'react-bootstrap/Modal';
import { Activity, Transaction } from '../../lib/types';
import { SelectableExpenseTable } from '../expenses/expenses-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { commissioner, questrial } from '../fonts';
import { formatCurrency } from '@/src/app/lib/utils';

export function LinkExpenseModal(props: any) {
  const router = useRouter()
  const [selectedExpenses, setSelectedExpenses] = useState<{[key: string]: Transaction}>({})
  const [numSelected, setNumSelected] = useState<number>(0)
 
  let activity: Activity = props.activity;

  if (activity == null) { return <></> }

  let unlinkedExpenses: [Transaction] = props.expenses.filter(
    (expense: Transaction) => expense.activity_id === ""
  )

  // let selectedExpenses: {[key: string]: Transaction} = {}
  // let numSelected = 0
  let selectExpense = (expense: Transaction) => {
    setSelectedExpenses((selectExpenses) => ({...selectExpenses, [expense.transaction_id]: expense}))
    // selectedExpenses[expense.transaction_id] = expense
    // numSelected = numSelected + 1
    setNumSelected(numSelected + 1)
    console.log("selected: ", expense)
  }
  let deselectExpense = (expense: Transaction) => {
    const {[expense.transaction_id]: deselectedExpense, ...remainingSelectedExpenses} = selectedExpenses
    setSelectedExpenses(remainingSelectedExpenses)
    // delete selectedExpenses[expense.transaction_id]
    // numSelected = numSelected - 1
    setNumSelected(numSelected - 1)
    console.log("DE-selected: ", expense)
  }

  let onLink = (expensesMap: {[key: string]: Transaction}) => {
    let expenses: Transaction[] = []
    for (let key in expensesMap) {
      expenses.push(expensesMap[key])
    }
    if (expenses.length === 0) {
      console.log("no expenses selected to link")
    } else {
      props.linkExpensesToActivity(expenses, activity)
      props.onClose()
      router.refresh()
    }
  }

  let disableLinkButton = true
  let linkButtonFormat = `${questrial.className} text-sm h-6 bg-blue-400`
  if (numSelected > 0) {
    disableLinkButton = false
    linkButtonFormat = `${questrial.className} text-sm h-6`
  }

  return (
    <Modal show={props.show} onHide={props.onClose} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>Select expenses to link</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="flex w-full items-center justify-between">
          <SelectableExpenseTable
            activity={activity}
            deselectExpense={deselectExpense}
            expenses={unlinkedExpenses}
            selectExpense={selectExpense}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
      <Button
        className={`${questrial.className} text-sm h-6`}
        onClick={props.onClose}
      >
        Close
      </Button>
      <Button
        className={linkButtonFormat}
        disabled={disableLinkButton}
        onClick={() => onLink(selectedExpenses)}
      >
        Link
      </Button>
      </Modal.Footer>
    </Modal>
  );
}

interface LinkedExpenseTableProps {
  expenses: Transaction[];
  unlinkExpense: (expenseId: string) => void;
}

export function LinkedExpenseTable({ expenses, unlinkExpense }: LinkedExpenseTableProps) {
  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <div
          key={expense.transaction_id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div>
            <div className={`${questrial.className} font-medium`}>{expense.description}</div>
            <div className={`${questrial.className} text-sm text-gray-500`}>
              {formatCurrency(expense.amount)} {expense.currency}
            </div>
          </div>
          <button
            onClick={() => unlinkExpense(expense.transaction_id)}
            className="text-red-500 hover:text-red-600"
          >
            Unlink
          </button>
        </div>
      ))}
    </div>
  );
}