const db = require('../config/db');

const createUser = (user) => {
  const sql = 'INSERT INTO users (firstname, lastname, email, password, email_verified) VALUES (?, ?, ?, ?, ?)';
  return new Promise((resolve, reject) => {
    db.query(sql, [user.firstname, user.lastname, user.email, user.password, user.email_verified || false], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const findUserByEmail = (email) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  return new Promise((resolve, reject) => {
    db.query(sql, [email], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const findUserByEmailAndOTP = (email, otp) => {
  const sql = 'SELECT * FROM users WHERE email = ? AND otp_code = ? AND otp_expires > NOW()';
  return new Promise((resolve, reject) => {
    db.query(sql, [email, otp], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const updateUserVerification = (userId, password, emailVerified = true) => {
  const sql = 'UPDATE users SET password = ?, email_verified = ?, otp_code = NULL, otp_expires = NULL WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(sql, [password, emailVerified, userId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByEmailAndOTP,
  updateUserVerification
};
