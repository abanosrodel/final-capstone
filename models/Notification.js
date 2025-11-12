const db = require('../config/db');

const createNotification = (user_id, message, callback) => {
  const sql = `
    INSERT INTO notifications (user_id, message, is_read, created_at)
    VALUES (?, ?, 0, NOW())
  `;
  db.query(sql, [user_id, message], callback);
};

module.exports = { createNotification };
