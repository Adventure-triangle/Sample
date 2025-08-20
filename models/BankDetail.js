const mongoose = require('mongoose');

const BankDetailSchema = new mongoose.Schema({
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  accountHolder: String,
  accountNumber: String,
  ifsc: String,
  bankName: String,
  branch: String,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BankDetail', BankDetailSchema);
