import { Trip } from '../types'

var mongoose = require('mongoose');

let transactionSchema = new mongoose.Schema({
  transaction_id: String,
  trip_id: String,
  activity_id: {
    type: String,
    required: false,
  },
  description: String,
  transaction_date: Date,
  amount: Number,
  currency: String,
  category: String,
});

let activitySchema = new mongoose.Schema({
  activity_id: String,
  trip_id: String,
  description: String,
  activity_date: Date,
  category: String,
});

let tripSchema = new mongoose.Schema({
  trip_id: String,
  name: String,
  start_date: Date,
  end_date: Date,
  primary_user_id: String,
});

let userSchema = new mongoose.Schema({
  user_id: String,
  trips: Array<Trip>,
})

export const transactions = mongoose.models.transaction || mongoose.model('transaction', transactionSchema);
export const activities = mongoose.models.activity || mongoose.model('activity', activitySchema);
export const trips = mongoose.models.trip || mongoose.model('trip', tripSchema);
export const users = mongoose.models.user || mongoose.model('user', userSchema);
