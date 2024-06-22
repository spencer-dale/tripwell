'use client'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Activity, Transaction } from '../../lib/types';
import { SelectableExpenseTable } from '../expenses/expenses-table';
import 'bootstrap/dist/css/bootstrap.min.css';

export function LinkExpenseModal(props: any) {
  let activity: Activity = props.activity;

  if (activity == null) { return <></> }

  let unlinkedExpenses: [Transaction] = props.expenses.filter(
    (expense: Transaction) => expense.activity_id !== activity.activity_id
  )

  return (
    <Modal show={props.show} onHide={props.onHide} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>Link an expense for {activity.description}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="flex w-full items-center justify-between pt-4">
          <SelectableExpenseTable
            activity={activity}
            expenses={unlinkedExpenses}
            linkExpenseToActivity={props.linkExpenseToActivity}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="secondary" onClick={props.onHide}>
        Close
      </Button>
      <Button variant="primary" onClick={props.onHide}>
        Save Changes
      </Button>
      </Modal.Footer>
    </Modal>
  );
}