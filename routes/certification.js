const express = require('express');
const Certification = require('../models/Certification');
const router = express.Router();

router.get('/all', async (req, res) => {
  const items = await Certification.find({ status: 'LIVE' }).sort({ createdAt: -1 });
  res.json(items);
});

router.post('/approve/:id', async (req, res) => {
  // simple: allow public to hit? better restrict, but okay for demo via admin UI
  const cert = await Certification.findById(req.params.id);
  if (!cert) return res.status(404).json({ error: 'Not found' });
  cert.status = 'LIVE';
  await cert.save();
  res.json(cert);
});

router.post('/enroll/:id', async (req, res) => {
  // For MVP: just echo a success (no enrollment model to keep it light)
  const cert = await Certification.findById(req.params.id);
  if (!cert || cert.status !== 'LIVE') return res.status(400).json({ error: 'Invalid certification' });
  res.json({ message: 'Enrolled (demo)', certId: cert._id });
});

module.exports = router;
