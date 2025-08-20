const path = require('path');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { requireAuth, requireRole, setUserOnLocals } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const partnerRoutes = require('./routes/partner');
const adminRoutes = require('./routes/admin');
const bookingRoutes = require('./routes/booking');
const certificationRoutes = require('./routes/certification');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adventure_triangle')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false
}));

// Attach user to response locals for templates (not using templates here, but handy for API)
app.use(setUserOnLocals);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/partner', requireAuth, requireRole(['partner', 'admin']), partnerRoutes);
app.use('/api/admin', requireAuth, requireRole(['admin']), adminRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/cert', certificationRoutes);

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
