const jwt = require('jsonwebtoken');
const db = require('../config/db');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // If role is not in token (for existing tokens), fetch it from database
    if (!decoded.role) {
      db.query('SELECT role FROM users WHERE id = ?', [decoded.id], (err, result) => {
        if (err || !result.length) {
          return res.status(401).json({ message: 'Invalid token' });
        }
        
        req.user = {
          id: decoded.id,
          role: result[0].role
        };
        next();
      });
    } else {
      req.user = decoded;
      next();
    }
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
