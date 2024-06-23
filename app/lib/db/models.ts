var mongoose = require('mongoose');

let transactionSchema = new mongoose.Schema({
  transaction_id: String,
  trip_id: String,
  activity_id: {
    type: String,
    required: false,
  },
  description: String,
  transaction_date: String,
  amount: Number,
  currency: String,
});

let activitySchema = new mongoose.Schema({
  activity_id: String,
  trip_id: String,
  description: String,
  activity_date: String,
});

let tripSchema = new mongoose.Schema({
  trip_id: String,
  name: String,
  start_date: String,
  end_date: String,
});

export const transactions = mongoose.models.transaction || mongoose.model('transaction', transactionSchema);
export const activities = mongoose.models.activity || mongoose.model('activity', activitySchema);
export const trips = mongoose.models.trip || mongoose.model('trip', tripSchema);

