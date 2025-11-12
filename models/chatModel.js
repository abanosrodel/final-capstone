const db = require('../config/db');

const ChatModel = {
  // Helper function to get a single message by its ID
  getMessageById: function (messageId, callback) {
    const sql = `
      SELECT 
        messages.*, 
        CONCAT(users.firstname, ' ', users.lastname) AS fullname 
      FROM messages 
      JOIN users ON messages.user_id = users.id 
      WHERE messages.id = ?
    `;
    db.query(sql, [messageId], (err, results) => {
      callback(err, results[0]); // Return the single message object
    });
  },

  // Get messages for one user with fullname
  getMessagesByUserId: function (userId, callback) {
    const sql = `
      SELECT messages.*, CONCAT(users.firstname, ' ', users.lastname) AS fullname 
      FROM messages 
      JOIN users ON messages.user_id = users.id 
      WHERE messages.user_id = ? 
      ORDER BY messages.created_at ASC
    `;
    db.query(sql, [userId], function (err, results) {
      callback(err, results);
    });
  },

  // Admin: Get all messages from all users with last_read_message_id
  getAllMessages: function (callback) {
    const sql = `
      SELECT 
        messages.*, 
        CONCAT(users.firstname, ' ', users.lastname) AS fullname,
        users.last_seen_message_id AS last_read_message_id
      FROM messages 
      JOIN users ON messages.user_id = users.id 
      ORDER BY messages.created_at ASC
    `;
    db.query(sql, function (err, results) {
      callback(err, results);
    });
  },

  // Admin: Update the last seen message ID for a user
  markAsRead: function (userId, lastMessageId, callback) {
    const sql = `
      UPDATE users
      SET last_seen_message_id = ?
      WHERE id = ?
    `;
    db.query(sql, [lastMessageId, userId], function (err, result) {
      callback(err, result);
    });
  },
  
  // REVISED: Insert a new message and return the full message object
  sendMessage: function (data, callback) {
    const sql = 'INSERT INTO messages (user_id, sender, text, image_url) VALUES (?, ?, ?, ?)';
    db.query(sql, [data.user_id, data.sender, data.text, data.image_url || null], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      // After inserting, fetch the complete message to broadcast it
      this.getMessageById(result.insertId, callback);
    });
  }
};

module.exports = ChatModel;