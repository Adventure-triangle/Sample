const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Step 1: Address
  address: {
    line1: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
    lat: Number,
    lng: Number
  },
  // Step 2: Basic details
  title: { type: String, required: true },
  description: String,
  // Step 3: Type & misc
  category: String, // e.g., Trekking, Scuba, Paragliding
  difficulty: String, // Easy/Moderate/Hard
  minAge: Number,
  maxGroupSize: Number,
  // Step 4: Pricing
  price: Number,
  currency: { type: String, default: 'USD' },
  // Step 5: Images
  images: [String],
  status: { type: String, enum: ['DRAFT', 'PENDING', 'REVIEW', 'LIVE', 'REJECTED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);
