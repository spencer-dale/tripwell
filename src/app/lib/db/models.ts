import { Trip } from '../types'

var mongoose = require('mongoose');

// Define sub-schemas first
let accommodationSchema = new mongoose.Schema({
    name: String,
    type: {
        type: String,
        enum: ['hotel', 'apartment', 'hostel', 'airbnb', 'other'],
        default: 'hotel'
    },
    address: String,
    total_cost: Number,
    currency: String,
});

let destinationSchema = new mongoose.Schema({
    destination_id: String,
    start_date: Date,
    end_date: Date,
    country: String,
    city: String,
    region: String,
    accommodation: accommodationSchema,
});

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
    destinations: {
      type: [destinationSchema],
      default: [],
    },
    primary_user_id: String,
});

let userSchema = new mongoose.Schema({
    user_id: String,
    trips: Array<Trip>,
});

export const transactions = mongoose.models.transaction || mongoose.model('transaction', transactionSchema);
export const trips = mongoose.models.trip || mongoose.model('trip', tripSchema);
export const destinations = mongoose.models.destination || mongoose.model('destination', destinationSchema);
export const activities = mongoose.models.activity || mongoose.model('activity', activitySchema);
export const users = mongoose.models.user || mongoose.model('user', userSchema);
