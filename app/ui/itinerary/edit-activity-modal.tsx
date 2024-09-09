'use client'

import Modal from 'react-bootstrap/Modal';
import { commissioner, questrial } from '../fonts';
import { Button } from '../button';
import { ActivityFormState } from './itinerary-modal';

export default function EditActivityModal(props: any) {
  let activity: Activity = props.activity ? props.activity : {}
  return (
    <>
      <Modal show={props.show} onHide={props.onClose} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title className={`${commissioner.className} text-2xl font-bold m-0`}>
            Edit activity
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ActivityDetailsEditor
            activityFormState={props.activityFormState}
            onClose={props.onClose}
            onSubmit={props.onSubmit}
            setActivityFormState={props.setActivityFormState}
          />
        </Modal.Body>
        <Modal.Footer>
          <div>
            <ul className="flex flex-row p-0">
              <li className="pe-1" onClick={props.switchToExpenses}>
                <Button
                  className={`${questrial.className} text-sm h-6`}
                  // onClick={() => props.activityManager.delete(activity)}
                >
                  Del
                </Button>
              </li>
              <li className="pe-1" onClick={props.switchToExpenses}>
                <Button
                  className={`${questrial.className} text-sm h-6`}
                  onClick={props.onClose}
                >
                  Save
                </Button>
              </li>
            </ul>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function ActivityDetailsEditor(props: any) {
  return (
    <div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          value={props.activityFormState.activityDescription}
          onChange={(e) => {
            var state: ActivityFormState = {
              activityDate: props.activityFormState.activityDate,
              activityDescription: e.target.value,
            }
            props.setActivityFormState(state)
          }}
          placeholder="Description..."
        ></input>
      </div>
      <div>
        <label htmlFor="date">Date</label>
        <input
          value={props.activityFormState.activityDate}
          onChange={(e) => {
            var state: ActivityFormState = {
              activityDate: e.target.value,
              activityDescription: props.activityFormState.activityDescription,
            }
            props.setActivityFormState(state)
          }}
          placeholder="Jan 1, 2024"
        ></input>
      </div>
    </div>
  )
}