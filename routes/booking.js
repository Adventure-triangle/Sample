const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Activity = require('../models/Activity');
const Booking = require('../models/Booking');
const router = express.Router();

// Create a booking (simulate payment in a second step)
router.post('/create', async (req, res) => {
  const { activityId, customerName, customerEmail, date, slots } = req.body;
  const act = await Activity.findById(activityId);
  if (!act || act.status !== 'LIVE') return res.status(400).json({ error: 'Invalid activity' });
  const amount = (act.price || 0) * (slots || 1);
  const booking = new Booking({
    activityId,
    partnerId: act.partnerId,
    customerName,
    customerEmail,
    date,
    slots,
    amount,
    paid: false
  });
  await booking.save();
  res.json({ message: 'Booking created. Proceed to payment.', booking });
});

// Simulate payment success
router.post('/pay/:id', async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Not found' });
  booking.paid = true;
  booking.paymentRef = 'PAY-' + uuidv4().slice(0, 8).toUpperCase();
  await booking.save();
  res.json({ message: 'Payment successful', booking });
});

module.exports = router;
