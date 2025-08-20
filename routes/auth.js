const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Simple demo login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  req.session.user = { _id: user._id, email: user.email, name: user.name, role: user.role };
  res.json({ message: 'Logged in', user: req.session.user });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ message: 'Logged out' }));
});

router.get('/me', (req, res) => {
  res.json({ user: req.session.user || null });
});

module.exports = router;
