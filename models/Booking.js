const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: String,
  customerEmail: String,
  date: String, // YYYY-MM-DD
  slots: Number,
  amount: Number,
  paid: { type: Boolean, default: false },
  paymentRef: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
