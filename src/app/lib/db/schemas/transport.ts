import mongoose from 'mongoose';

const transportSchema = new mongoose.Schema({
  transport_id: {
    type: String,
    required: true,
    unique: true,
  },
  trip_id: {
    type: String,
    required: true,
    ref: 'Trip',
  },
  from_destination_id: {
    type: String,
    required: true,
    ref: 'Destination',
  },
  to_destination_id: {
    type: String,
    required: true,
    ref: 'Destination',
  },
  mode: {
    type: String,
    required: true,
    enum: ['plane', 'train', 'bus', 'ferry', 'car', 'walk'],
  },
  departure_time: {
    type: Date,
    required: true,
  },
  arrival_time: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
  booking_reference: {
    type: String,
  },
  cost: {
    type: Number,
  },
  currency: {
    type: String,
  },
}, {
  timestamps: true,
});

// Create index for faster queries
transportSchema.index({ trip_id: 1 });
transportSchema.index({ from_destination_id: 1 });
transportSchema.index({ to_destination_id: 1 });

// Pre-save middleware to calculate duration
transportSchema.pre('save', function(next) {
  if (this.isModified('departure_time') || this.isModified('arrival_time')) {
    const diffMs = this.arrival_time.getTime() - this.departure_time.getTime();
    this.duration = Math.round(diffMs / (1000 * 60)); // Convert to minutes
  }
  next();
});

export const Transport = mongoose.models.Transport || mongoose.model('Transport', transportSchema); 