const express = require('express');
const Activity = require('../models/Activity');
const Booking = require('../models/Booking');
const Certification = require('../models/Certification');
const User = require('../models/User');
const router = express.Router();

// Review queue
router.get('/review-activities', async (req, res) => {
  const items = await Activity.find({ status: { $in: ['PENDING', 'REVIEW'] } }).populate('partnerId', 'email name');
  res.json(items);
});

router.post('/activities/:id/approve', async (req, res) => {
  const act = await Activity.findById(req.params.id);
  if (!act) return res.status(404).json({ error: 'Not found' });
  act.status = 'LIVE';
  await act.save();
  res.json({ message: 'Approved & LIVE', activity: act });
});

router.post('/activities/:id/reject', async (req, res) => {
  const act = await Activity.findById(req.params.id);
  if (!act) return res.status(404).json({ error: 'Not found' });
  act.status = 'REJECTED';
  await act.save();
  res.json({ message: 'Rejected', activity: act });
});

router.get('/bookings', async (req, res) => {
  const items = await Booking.find({}).sort({ createdAt: -1 });
  res.json(items);
});

router.get('/stats', async (req, res) => {
  const totalActivities = await Activity.countDocuments({});
  const liveActivities = await Activity.countDocuments({ status: 'LIVE' });
  const totalBookings = await (await Booking.find({})).length;
  const totalRevenue = (await Booking.aggregate([
    { $match: { paid: true } },
    { $group: { _id: null, sum: { $sum: "$amount" } } }
  ]));
  res.json({
    totalActivities,
    liveActivities,
    totalBookings,
    totalRevenue: (totalRevenue[0] && totalRevenue[0].sum) || 0
  });
});

router.get('/users', async (req, res) => {
  const users = await User.find({}, 'name email role createdAt');
  res.json(users);
});

module.exports = router;
