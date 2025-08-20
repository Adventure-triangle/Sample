const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  description: String,
  duration: String,
  price: Number,
  image: String,
  status: { type: String, enum: ['PENDING', 'LIVE'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certification', CertificationSchema);
