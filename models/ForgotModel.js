// models/ForgotModel.js
const db = require('../config/db');

const ForgotModel = {
  findUserByEmail: (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], callback);
  },

  saveResetToken: (email, token, expiry, callback) => {
    const sql = 'UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?';
    db.query(sql, [token, expiry, email], callback);
  },

  findUserByToken: (token, callback) => {
    const sql = 'SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW()';
    db.query(sql, [token], callback);
  },

  updatePassword: (userId, hashedPassword, callback) => {
    const sql = 'UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?';
    db.query(sql, [hashedPassword, userId], callback);
  }
};

module.exports = ForgotModel;
