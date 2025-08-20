const User = require('../models/User');

function setUserOnLocals(req, res, next) {
  res.locals.user = req.session.user || null;
  next();
}

async function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

function requireRole(roles = []) {
  return (req, res, next) => {
    const user = req.session.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole, setUserOnLocals };
