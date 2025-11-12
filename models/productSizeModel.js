const db = require('../config/db');

const ProductSizeModel = {
  getAll: (callback) => {
    const sql = `
      SELECT ps.id, ps.product_id, ps.size_id, p.name AS productName, s.label AS size, ps.stock_quantity AS stock
      FROM product_sizes ps
      JOIN products p ON ps.product_id = p.id
      JOIN sizes s ON ps.size_id = s.id
    `;
    db.query(sql, callback);
  },

getByProductId: (product_id, callback) => {
  const sql = `
    SELECT ps.id, ps.product_id, ps.size_id, s.label AS size, ps.stock_quantity AS stock
    FROM product_sizes ps
    JOIN sizes s ON ps.size_id = s.id
    WHERE ps.product_id = ?
  `;
  db.query(sql, [product_id], callback);
},


  getById: (id, callback) => {
    const sql = `
      SELECT ps.id, ps.product_id, ps.size_id, p.name AS productName, s.label AS size, ps.stock_quantity AS stock
      FROM product_sizes ps
      JOIN products p ON ps.product_id = p.id
      JOIN sizes s ON ps.size_id = s.id
      WHERE ps.id = ?
    `;
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  create: (data, callback) => {
    const sql = `INSERT INTO product_sizes (product_id, size_id, stock_quantity) VALUES (?, ?, ?)`;
    const values = [data.product_id, data.size_id, data.stock_quantity];
    db.query(sql, values, callback);
  },

  update: (id, data, callback) => {
    const sql = `UPDATE product_sizes SET product_id = ?, size_id = ?, stock_quantity = ? WHERE id = ?`;
    const values = [data.product_id, data.size_id, data.stock_quantity, id];
    db.query(sql, values, callback);
  },

  delete: (id, callback) => {
    const sql = `DELETE FROM product_sizes WHERE id = ?`;
    db.query(sql, [id], callback);
  },
};

module.exports = ProductSizeModel;
