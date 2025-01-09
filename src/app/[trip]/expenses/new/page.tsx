import { NewExpenseForm } from "@/src/app/ui/expenses/new-expense-form"; 

 export default function createNewExpense() {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <NewExpenseForm/>
      </div>
    </div>
  );
}