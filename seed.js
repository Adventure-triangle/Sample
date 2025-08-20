const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adventure_triangle');
  console.log('Mongo connected');

  const existing = await User.findOne({ email: 'admin@at.com' });
  if (!existing) {
    await User.create({ name: 'Super Admin', email: 'admin@at.com', password: 'admin123', role: 'admin' });
    console.log('Created admin user');
  } else {
    console.log('Admin already exists');
  }

  const partner = await User.findOne({ email: 'partner@at.com' });
  if (!partner) {
    await User.create({ name: 'Demo Partner', email: 'partner@at.com', password: 'partner123', role: 'partner' });
    console.log('Created partner user');
  } else {
    console.log('Partner already exists');
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch(err => { console.error(err); process.exit(1); });
