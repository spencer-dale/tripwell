'use client'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Activity, Transaction } from '../../lib/types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ExpensesTable } from '../expenses/expenses-table';
import { LinkExpenseModal } from './link-expense-modal';
import { useState } from 'react';

export function ItineraryModal(props: any) {
  const [showLinkExpenseModal, setShowLinkExpenseModal] = useState(false);

  let activity: Activity = props.activity;

  if (activity == null) { return <></> }

  let expenses: [Transaction] = props.expenses.filter(
    (expense: Transaction) => expense.activity_id === activity.activity_id
  )

  return (
    <>
      <Modal show={props.show} onHide={props.onHide} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>Activity details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Button
            onClick={props.toEditingMode}
          >
            <p>Edit activity</p>
          </Button>
          <Button
            onClick={() => setShowLinkExpenseModal(true)}
          >
            <p>Link an expense</p>
          </Button>
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <div className="mb-2 flex items-center">
                <p>{activity.description}</p>
              </div>
              <div className="mb-2 flex items-center">
                <p>{activity.activity_date}</p>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-between pt-4">
            <ExpensesTable
              expenses={expenses}
              show={true}
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
      <LinkExpenseModal
        activity={activity}
        expenses={props.expenses}
        linkExpenseToActivity={props.linkExpenseToActivity}
        onHide={() => setShowLinkExpenseModal(false)}
        show={showLinkExpenseModal}
      />
    </>
  );
}
