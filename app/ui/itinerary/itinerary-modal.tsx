'use client'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Activity } from '@/app/lib/types';
import 'bootstrap/dist/css/bootstrap.min.css';

export function ItineraryModal(props: any) {

  let activity: Activity = props.activity;

  if (activity == null) {
    return <></>
  }

  return (
    <Modal show={props.show} onHide={props.onHide} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>{activity.description}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <div className="mb-2 flex items-center">
              <p>{activity.activity_date}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between pt-4">
          <div>
            <p>Expenses Table</p>
          </div>
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
