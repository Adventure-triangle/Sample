const express = require('express');
const Activity = require('../models/Activity');
const Bank = require('../models/BankDetail');
const Certification = require('../models/Certification');
const router = express.Router();

// Create or update activity via 5-step wizard payload
router.post('/activities', async (req, res) => {
  const partnerId = req.session.user._id;
  const data = req.body;
  const activity = new Activity({ ...data, partnerId, status: 'PENDING' });
  await activity.save();
  res.json(activity);
});

router.put('/activities/:id', async (req, res) => {
  const partnerId = req.session.user._id;
  const act = await Activity.findOne({ _id: req.params.id, partnerId });
  if (!act) return res.status(404).json({ error: 'Not found' });
  Object.assign(act, req.body);
  await act.save();
  res.json(act);
});

router.get('/activities', async (req, res) => {
  const partnerId = req.session.user._id;
  const items = await Activity.find({ partnerId }).sort({ createdAt: -1 });
  res.json(items);
});

// Request review -> set status REVIEW
router.post('/activities/:id/request-review', async (req, res) => {
  const partnerId = req.session.user._id;
  const act = await Activity.findOne({ _id: req.params.id, partnerId });
  if (!act) return res.status(404).json({ error: 'Not found' });
  act.status = 'REVIEW';
  await act.save();
  res.json({ message: 'Sent to Super Admin for review', activity: act });
});

// Bank details
router.get('/bank', async (req, res) => {
  const partnerId = req.session.user._id;
  const b = await Bank.findOne({ partnerId });
  res.json(b || {});
});

router.post('/bank', async (req, res) => {
  const partnerId = req.session.user._id;
  const existing = await Bank.findOne({ partnerId });
  if (existing) {
    Object.assign(existing, req.body, { updatedAt: new Date() });
    await existing.save();
    return res.json(existing);
  }
  const bank = new Bank({ partnerId, ...req.body });
  await bank.save();
  res.json(bank);
});

// Certifications
router.post('/certifications', async (req, res) => {
  const partnerId = req.session.user._id;
  const cert = new Certification({ partnerId, ...req.body, status: 'PENDING' });
  await cert.save();
  res.json(cert);
});

router.get('/certifications', async (req, res) => {
  const partnerId = req.session.user._id;
  const items = await Certification.find({ partnerId }).sort({ createdAt: -1 });
  res.json(items);
});

module.exports = router;
