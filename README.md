# Adventure Triangle (Simple MVP)

A fast, working MVP in **plain HTML/CSS/JS** + **Express.js** + **MongoDB**.

## Features
- Guest: browse LIVE activities & book slots (payment simulated).
- Partner: onboard activities with 5-step wizard, manage banking, see own activities.
- Super Admin: review/approve/reject activities, see bookings & payments.
- Simple auth (session): roles = `admin`, `partner` (seeded), and you can add more.

## Quick Start
1. **Create `.env`** (copy `.env.example` to `.env`) and set values.
2. **Install & seed**:
   ```bash
   npm install
   npm run seed
   ```
3. **Run server**:
   ```bash
   npm start
   ```
4. Open http://localhost:3000

### Logins
- **Admin**: email: `admin@at.com`, password: `admin123`
- **Partner**: email: `partner@at.com`, password: `partner123`

> Uses local Mongo at `mongodb://localhost:27017/adventure_triangle` by default. For Atlas, set `MONGODB_URI` in `.env`.

## File structure
```
server.js
models/...
routes/...
public/
  index.html
  login.html
  partner.html
  admin.html
  certifications.html
  styles.css
  js/
    common.js
    home.js
    partner.js
    admin.js
    certifications.js
```
