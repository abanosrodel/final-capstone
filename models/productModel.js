const db = require('../config/db')

const Product = {
  getAll: (callback) => {
    const query = `
      SELECT 
        products.*, 
        categories.name AS category_name
      FROM products
      LEFT JOIN categories ON products.category_id = categories.id
    `
    db.query(query, callback)
  },

  getById: (id, callback) => {
    const query = `
      SELECT 
        products.*, 
        categories.name AS category_name
      FROM products
      LEFT JOIN categories ON products.category_id = categories.id
      WHERE products.id = ?
    `
    db.query(query, [id], callback)
  },
  
  create: (data, callback) => {
  const query = `
    INSERT INTO products (name, description, category_id, unit_price, image)
    VALUES (?, ?, ?, ?, ?)
  `
  db.query(
    query,
    [
      data.name,
      data.description || null,
      data.category_id || null,
      data.unit_price,
      data.image 
    ],
    callback
  )
},

update: (id, data, callback) => {
  const query = `
    UPDATE products 
    SET name = ?, description = ?, category_id = ?, unit_price = ?, image = ?
    WHERE id = ?
  `
  db.query(
    query,
    [
      data.name,
      data.description || null,
      data.category_id || null,
      data.unit_price,
      data.image, // ← FIXED
      id
    ],
    callback
  )
},

  delete: (id, callback) => {
    const query = 'DELETE FROM products WHERE id = ?'
    db.query(query, [id], callback)
  }
}

module.exports = Product
