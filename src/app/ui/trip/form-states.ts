export type ActivityFormState = {
  activityDescription: string,
  activityDate: Date,
  activityCategory: string,
  destination_id: string,
}

export type ExpenseFormState = {
  expenseDescription: string,
  expenseDate: Date,
  expenseAmount: string,  // must be a string so that users can enter '.'
  expenseCurrency: string
  expenseCategory: string,
}
