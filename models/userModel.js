// models/userModel.js
const db = require('../config/db');

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, lastname, firstname, email, phonenumber, address, city, postal_code, role, created_at, is_restricted, restricted_at, restricted_by
      FROM users
    `;
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, lastname, firstname, email, phonenumber, address, city, postal_code, is_restricted, restricted_at, restricted_by FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

const updateUserById = (userId, newUserData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentUser = await getUserById(userId);
      if (!currentUser) return reject(new Error('User not found'));

      // Only update provided fields, keep existing otherwise
      const updatedUser = {
        lastname: newUserData.lastname ?? currentUser.lastname,
        firstname: newUserData.firstname ?? currentUser.firstname,
        email: newUserData.email ?? currentUser.email,
        phonenumber: newUserData.phonenumber ?? currentUser.phonenumber,
        address: newUserData.address ?? currentUser.address,
        city: newUserData.city ?? currentUser.city,
        postal_code: newUserData.postal_code ?? currentUser.postal_code,
      };

      const query = `
        UPDATE users SET
          lastname = ?, firstname = ?, email = ?, phonenumber = ?,
          address = ?, city = ?, postal_code = ?
        WHERE id = ?
      `;

      const values = [
        updatedUser.lastname,
        updatedUser.firstname,
        updatedUser.email,
        updatedUser.phonenumber,
        updatedUser.address,
        updatedUser.city,
        updatedUser.postal_code,
        userId,
      ];

      db.query(query, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const restrictById = (id, restricted = 1, restrictedBy = null, callback) => {
  const restrictedAt = restricted ? new Date() : null;
  const sql = `
    UPDATE users 
    SET is_restricted = ?, restricted_at = ?, restricted_by = ?
    WHERE id = ?
  `;
  db.query(sql, [restricted, restrictedAt, restrictedBy, id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result.affectedRows === 1);
  });
}

module.exports = {
  getAllUsers,
    getUserById,
  updateUserById,
  restrictById,
};
