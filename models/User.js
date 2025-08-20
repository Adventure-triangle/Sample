const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // plain for demo only; use hash in prod
  role: { type: String, enum: ['admin', 'partner', 'guest'], default: 'guest' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', UserSchema);
