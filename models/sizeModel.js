const db = require('../config/db');

const getAllSizes = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM sizes ORDER BY id DESC', (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getSizeById = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM sizes WHERE id = ?', [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

const createSize = (label, description) => {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO sizes (label, description) VALUES (?, ?)',
      [label, description],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
};

const updateSize = (id, label, description) => {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE sizes SET label = ?, description = ? WHERE id = ?',
      [label, description, id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const deleteSize = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM sizes WHERE id = ?', [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getAllSizes,
  getSizeById,
  createSize,
  updateSize,
  deleteSize,
};
