var mongoose = require('mongoose');
let transaction = mongoose.model("transaction")

export default async function Page() {

  const expense = await transaction.find({
      transaction_date: "2024-05-01"
    });
  return <div>
      <p>Expenses Page</p>
      <p>{JSON.stringify(expense)}</p>
    </div>;
  }