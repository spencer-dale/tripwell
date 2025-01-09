'use client'

import Modal from 'react-bootstrap/Modal';
import { commissioner, questrial } from '../fonts';
import { Button } from '../button';
import { ActivityFormState, ExpenseFormState } from './itinerary-modal';
import { useState } from 'react';
import Form from "react-bootstrap/Form";
import { useRouter } from 'next/navigation';

export default function EditActivityModal(props: any) {
  const router = useRouter();
  let [buttonToggle, setButtonToggle] = useState(true)
  let onClose = () => {
    setButtonToggle(true)
    props.onClose()
  }

  const onDelete = () => {
    props.onDelete(props.activity)
    router.refresh()
  }

  const onSave = (formState: ActivityFormState) => {
    props.onSave({
      activity_id: props.activity.activity_id,
      trip_id: props.activity.trip_id,
      description: formState.activityDescription,
      activity_date: formState.activityDate,
      category: formState.activityCategory,
    })
    router.refresh()
  }

  return (
    <>
      <Modal show={props.show} onHide={onClose} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title className={`${commissioner.className} text-2xl font-bold m-0`}>
            Edit activity
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ActivityDetailsEditor
            activityFormState={props.activityFormState}
            setActivityFormState={props.setActivityFormState}
          />
        </Modal.Body>
        <Modal.Footer>
          {buttonToggle
            ? <EditorModalButtons
              formState={props.activityFormState}
              onClose={onClose}
              onUnlink={props.onUnlink}
              onSave={onSave}
              showConfirmDeleteButtons={() => setButtonToggle(false)}
            />
            : <DeleteConfirmationButtons
              onCancel={() => setButtonToggle(true)}
              onClose={onClose}
              onDelete={onDelete}
            />
          }
        </Modal.Footer>
      </Modal>
    </>
  );
}

function EditorModalButtons(props: any) {
  return (
    <div>
      <ul className="flex flex-row p-0">
        <li className="pe-1">
          <Button
            className={`${questrial.className} text-sm h-6`}
            onClick={props.showConfirmDeleteButtons}
          >
            Delete
          </Button>
        </li>
        {props.onUnlink
          ? <li className="pe-1">
            <Button
              className={`${questrial.className} text-sm h-6`}
              onClick={() => {
                props.onUnlink()
                props.onClose()
              }}
            >
              Unlink
            </Button>
          </li>
          : <></>
        }
        <li className="pe-1">
          <Button
            className={`${questrial.className} text-sm h-6`}
            onClick={() => {
              props.onSave(props.formState)
              props.onClose()
            }}
          >
            Save
          </Button>
        </li>
      </ul>
    </div>
  );
}

function DeleteConfirmationButtons(props: any) {
  return (
    <div>
      <ul className="flex flex-row p-0">
        <li>
        <p className={`${commissioner.className} m-0 px-2 text-sm font-bold`}>
          Delete?
        </p>
        </li>
        <li className="pe-1">
          <Button
            className={`${questrial.className} text-sm h-6`}
            onClick={() => {
              props.onDelete()
              props.onClose()
            }}
          >
            Yes
          </Button>
        </li>
        <li className="pe-1">
          <Button
            className={`${questrial.className} text-sm h-6`}
            onClick={props.onCancel}
          >
            Cancel
          </Button>
        </li>
      </ul>
    </div>
  );
}

export function EditExpenseModal(props: any) {
  const router = useRouter();
  let [buttonToggle, setButtonToggle] = useState(true)
  let onClose = () => {
    setButtonToggle(true)
    props.onClose()
  }

  const onDelete = () => {
    props.onDelete(props.expense)
    router.refresh()
  }

  const onSave = (formState: ExpenseFormState) => {
    console.log("saving expense: ", formState)
    props.onSave({
      activity_id: props.expense.activity_id,
      trip_id: props.expense.trip_id,
      transaction_id: props.expense.transaction_id,
      description: formState.expenseDescription,
      transaction_date: formState.expenseDate,
      amount: formState.expenseAmount,
      currency: formState.expenseCurrency,
      category: formState.expenseCategory,
    })
    router.refresh()
  }

  let onUnlink = null
  if (props.expense.activity_id !== "") {
    onUnlink = () => {
      props.unlinkExpense(props.expense)
      router.refresh()
    }
  } 

  return (
    <>
      <Modal show={props.show} onHide={onClose} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title className={`${commissioner.className} text-2xl font-bold m-0`}>
            Edit expense
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ExpenseDetailsEditor
            expenseFormState={props.expenseFormState}
            onClose={props.onClose}
            onSubmit={props.onSubmit}
            setExpenseFormState={props.setExpenseFormState}
          />
        </Modal.Body>
        <Modal.Footer>
          {buttonToggle
            ? <EditorModalButtons
              formState={props.expenseFormState}
              onClose={onClose}
              onUnlink={onUnlink}
              onSave={onSave}
              showConfirmDeleteButtons={() => setButtonToggle(false)}
            />
            : <DeleteConfirmationButtons
              onCancel={() => setButtonToggle(true)}
              onClose={onClose}
              onDelete={onDelete}
            />
          }
        </Modal.Footer>
      </Modal>
    </>
  );
}

function ActivityDetailsEditor(props: any) {
  let formState: ActivityFormState = props.activityFormState
  console.log("current state: ", formState)

  const dateStringFromDate = (date: Date) => {
    console.log("current date: ", date)
    return date.toISOString().substring(0,10)
  }

  const updateActivityFormDescription = (newDescription: string) => {
    console.log("updating description to be: ", newDescription)
    var state: ActivityFormState = {
      activityDescription: newDescription,
      activityDate: new Date(formState.activityDate),
      activityCategory: formState.activityCategory,
    }
    console.log("new state: ", state)
    props.setActivityFormState(state)
  }

  const updateActivityFormDate = (newDate: string) => {
    console.log("updating date to be: ", newDate)
    let date: Date = new Date(newDate)
    console.log("converted date: ", date)
    var state: ActivityFormState = {
      activityDate: date,
      activityDescription: formState.activityDescription,
      activityCategory: formState.activityCategory,
    }
    props.setActivityFormState(state)
  }

  const updateActivityFormCategory = (newCategory: string) => {
    console.log("updating category to be: ", newCategory)
    var state: ActivityFormState = {
      activityDate: new Date(formState.activityDate),
      activityDescription: formState.activityDescription,
      activityCategory: newCategory,
    }
    console.log("new state: ", state)
    props.setActivityFormState(state)
  }

  return (
    <div>
      <Form>
        <Form.Group className={`${questrial.className} text-md mb-0 pt-2`} controlId="activityDetailsEditorForm.ControlInput1">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            value={formState.activityDescription}
            onChange={(e) => {updateActivityFormDescription(e.target.value)}}
          />
        </Form.Group>
        <Form.Group className={`${questrial.className} text-md mb-0 pt-2`} controlId="activityDetailsEditorForm.ControlInput2">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={dateStringFromDate(new Date(formState.activityDate))}
            onChange={(e) => {updateActivityFormDate(e.target.value)}}
          />
        </Form.Group>
        <Form.Group className={`${questrial.className} text-md mb-0 pt-2`} controlId="activityDetailsEditorForm.ControlInput3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            value={formState.activityCategory}
            onChange={(e) => {updateActivityFormCategory(e.target.value)}}
          />
        </Form.Group>
      </Form>
    </div>
  )
}

function ExpenseDetailsEditor(props: any) {
  let formState: ExpenseFormState = props.expenseFormState

  const dateStringFromDate = (date: Date) => {
    return date.toISOString().substring(0,10)
  }

  const updateExpenseFormDescription = (newDescription: string) => {
    var state: ExpenseFormState = {
      expenseDate: formState.expenseDate,
      expenseDescription: newDescription,
      expenseAmount: formState.expenseAmount,
      expenseCurrency: formState.expenseCurrency,
      expenseCategory: formState.expenseCategory,
    }
    props.setExpenseFormState(state)
  }

  const updateExpenseFormDate = (newDate: Date) => {
    var state: ExpenseFormState = {
      expenseDate: newDate,
      expenseDescription: formState.expenseDescription,
      expenseAmount: formState.expenseAmount,
      expenseCurrency: formState.expenseCurrency,
      expenseCategory: formState.expenseCategory,
    }
    props.setExpenseFormState(state)
  }

  const updateExpenseFormAmount = (newAmountString: string) => {
    var state: ExpenseFormState = {
      expenseDate: formState.expenseDate,
      expenseDescription: formState.expenseDescription,
      expenseAmount: newAmountString,
      expenseCurrency: formState.expenseCurrency,
      expenseCategory: formState.expenseCategory,
    }
    props.setExpenseFormState(state)
  }

  const updateExpenseFormCurrency = (newCurrency: string) => {
    var state: ExpenseFormState = {
      expenseDate: formState.expenseDate,
      expenseDescription: formState.expenseDescription,
      expenseAmount: formState.expenseAmount,
      expenseCurrency: newCurrency,
      expenseCategory: formState.expenseCategory,
    }
    props.setExpenseFormState(state)
  }

  const updateExpenseFormCategory = (newCategoryString: string) => {
    var state: ExpenseFormState = {
      expenseDate: formState.expenseDate,
      expenseDescription: formState.expenseDescription,
      expenseAmount: formState.expenseAmount,
      expenseCurrency: formState.expenseCurrency,
      expenseCategory: newCategoryString,
    }
    props.setExpenseFormState(state)
  }

  return (
    <div>
      <Form>
        <Form.Group className={`${questrial.className} text-md mb-0 pt-2`} controlId="activityDetailsEditorForm.ControlInput1">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="text"
            value={formState.expenseAmount}
            onChange={(e) => {updateExpenseFormAmount(e.target.value)}}
          />
        </Form.Group>
        <Form.Group className={`${questrial.className} text-md mb-0 pt-2`} controlId="activityDetailsEditorForm.ControlInput2">
          <Form.Label>Currency</Form.Label>
          <Form.Control
            type="text"
            value={formState.expenseCurrency}
            onChange={(e) => {updateExpenseFormCurrency(e.target.value)}}
          />
        </Form.Group>
        <Form.Group className={`${questrial.className} text-md mb-0 pt-2`} controlId="activityDetailsEditorForm.ControlInput3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            value={formState.expenseDescription}
            onChange={(e) => {updateExpenseFormDescription(e.target.value)}}
          />
        </Form.Group>
        <Form.Group className={`${questrial.className} text-md mb-0 pt-2`} controlId="activityDetailsEditorForm.ControlInput4">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={dateStringFromDate(new Date(formState.expenseDate))}
            onChange={(e) => {updateExpenseFormDate(new Date(e.target.value))}}
          />
        </Form.Group>
        <Form.Group className={`${questrial.className} text-md mb-0 pt-2`} controlId="activityDetailsEditorForm.ControlInput5">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            value={formState.expenseCategory}
            onChange={(e) => {updateExpenseFormCategory(e.target.value)}}
          />
        </Form.Group>
      </Form>
    </div>
  )
}

export function NewActivityModal(props: any) {
  const router = useRouter()
  const dateStringFromDate = (date: Date) => {
    return date.toISOString().substring(0,10)
  }
  const emptyActivityFormState: ActivityFormState = {
    activityDescription: "",
    activityDate: new Date(dateStringFromDate(new Date(Date.now()))),
    activityCategory: "",
  }
  const [activityFormState, setActivityFormState] = useState<ActivityFormState>(emptyActivityFormState)
  let resetActivityFormState = () => {
    setActivityFormState(emptyActivityFormState)
  }
  let onClose = () => {
    resetActivityFormState()
    props.onClose()
  }
  return (
    <>
      <Modal show={props.show} onHide={onClose} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title className={`${commissioner.className} text-2xl font-bold m-0`}>
            New activity
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ActivityDetailsEditor
            activityFormState={activityFormState}
            setActivityFormState={setActivityFormState}
          />
        </Modal.Body>
        <Modal.Footer>
          <div>
            <ul className="flex flex-row p-0">
              <li className="pe-1">
                <Button
                  className={`${questrial.className} text-sm h-6`}
                  onClick={props.onClose}
                >
                  Cancel
                </Button>
              </li>
              {props.onUnlink
                ? <li className="pe-1">
                  <Button
                    className={`${questrial.className} text-sm h-6`}
                    onClick={() => {
                      props.onUnlink()
                      onClose()
                    }}
                  >
                    Unlink
                  </Button>
                </li>
                : <></>
              }
              <li className="pe-1">
                <Button
                  className={`${questrial.className} text-sm h-6`}
                  onClick={() => {
                    if (activityFormState) {
                      props.onCreate(activityFormState)
                      onClose()
                      router.refresh()
                     } else {
                      console.log("unable to create activity, empty form")
                     }
                  }}
                >
                  Create
                </Button>
              </li>
            </ul>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function NewExpenseModal(props: any) {
  const router = useRouter()
  const dateStringFromDate = (date: Date) => {
    return date.toISOString().substring(0,10)
  }
  const emptyExpenseFormState: ExpenseFormState = {
    expenseDescription: "",
    expenseDate: new Date(dateStringFromDate(new Date(Date.now()))),
    expenseAmount: "0.00",
    expenseCurrency: "",
    expenseCategory: "",
  }
  console.log("new expense form state: ", emptyExpenseFormState)
  const [expenseFormState, setExpenseFormState] = useState<ExpenseFormState>(emptyExpenseFormState)
  let resetExpenseFormState = () => {
    setExpenseFormState(emptyExpenseFormState)
  }
  let onClose = () => {
    resetExpenseFormState()
    props.onClose()
  }
  return (
    <>
      <Modal show={props.show} onHide={onClose} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title className={`${commissioner.className} text-2xl font-bold m-0`}>
            New expense
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ExpenseDetailsEditor
            expenseFormState={expenseFormState}
            onClose={props.onClose}
            onSave={props.onSave}
            setExpenseFormState={setExpenseFormState}
          />
        </Modal.Body>
        <Modal.Footer>
          <div>
            <ul className="flex flex-row p-0">
              <li className="pe-1">
                <Button
                  className={`${questrial.className} text-sm h-6`}
                  onClick={props.onClose}
                >
                  Cancel
                </Button>
              </li>
              {props.onUnlink
                ? <li className="pe-1">
                  <Button
                    className={`${questrial.className} text-sm h-6`}
                    onClick={() => {
                      props.onUnlink()
                      onClose()
                    }}
                  >
                    Unlink
                  </Button>
                </li>
                : <></>
              }
              <li className="pe-1">
                <Button
                  className={`${questrial.className} text-sm h-6`}
                  onClick={() => {
                    props.onCreate(expenseFormState)
                    onClose()
                    router.refresh()
                  }}
                >
                  Create
                </Button>
              </li>
            </ul>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
