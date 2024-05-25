import ExpensesTable from "@/app/ui/expenses/expenses-table";
import Link from "next/link";

export default async function Page() {
  return <div>
    <Link
      key={"New Expense"}
      href={"/dashboard/expenses/new"}
      className="mt-4 w-half">
        + New Expense
    </Link>
    <ExpensesTable/>
  </div>
  }