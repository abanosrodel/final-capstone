const db = require('../config/db');

const Category = {
  getAll: (callback) => {
    const sql = 'SELECT * FROM categories ORDER BY created_at DESC';
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = 'SELECT * FROM categories WHERE id = ?';
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = 'INSERT INTO categories (name, description, created_at) VALUES (?, ?, NOW())';
    db.query(sql, [data.name, data.description], callback);
  },

  update: (id, data, callback) => {
    const sql = 'UPDATE categories SET name = ?, description = ? WHERE id = ?';
    db.query(sql, [data.name, data.description, id], callback);
  },

  delete: (id, callback) => {
    const sql = 'DELETE FROM categories WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

module.exports = Category;
