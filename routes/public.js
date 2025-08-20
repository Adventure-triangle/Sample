const express = require('express');
const Activity = require('../models/Activity');
const router = express.Router();

// List LIVE activities
router.get('/activities', async (req, res) => {
  const items = await Activity.find({ status: 'LIVE' }).sort({ createdAt: -1 });
  res.json(items);
});

// Activity detail (even if not live, only for preview if needed)
router.get('/activities/:id', async (req, res) => {
  const item = await Activity.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

module.exports = router;
