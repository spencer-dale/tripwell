var mongoose = require('mongoose');

let transactionSchema = new mongoose.Schema({
  transaction_id: String,
  trip_id: String,
  linked_activity_id: {
    type: String,
    required: false,
  },
  description: String,
  transaction_date: String,
  amount: Number,
  currency: String,
});

module.exports = mongoose.model('transaction', transactionSchema);