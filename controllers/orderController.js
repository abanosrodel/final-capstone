const { createOrder } = require('../models/orderModel');
const db = require('../config/db');
const path = require('path');
const { createNotification } = require('../models/Notification');

const createNewOrder = (req, res) => {
  try {
    const {
      contact_email,
      contact_number,
      shipping_method,
      payment_method,
      subtotal,
      shipping_fee,
      total_amount,
      first_name,
      last_name,
      city,
      postal_code,
      address,
      gcash_reference,
    } = req.body;

    const items = JSON.parse(req.body.items);
    const user_id = req.user.id;
    const proof_of_payment = req.file ? `/uploads/${req.file.filename}` : null;

    const order = {
      user_id,
      contact_email,
      contact_number,
      shipping_method,
      payment_method,
      subtotal,
      shipping_fee,
      total: total_amount,
      gcash_reference: payment_method === 'GCash' ? gcash_reference : null,
      proof_of_payment,
      first_name: shipping_method === 'Delivery' ? first_name : null,
      last_name: shipping_method === 'Delivery' ? last_name : null,
      city: shipping_method === 'Delivery' ? city : null,
      postal_code: shipping_method === 'Delivery' ? postal_code : null,
      address: shipping_method === 'Delivery' ? address : null,
    };

    createOrder(order, items, (err, newOrderId) => {
      if (err) {
        console.error('Error creating order:', err);
        return res.status(500).json({ message: 'Error placing order', error: err.message });
      }
      res.status(201).json({ message: 'Order placed successfully', order_id: newOrderId });
    });
  } catch (err) {
    console.error('Error parsing order:', err);
    res.status(400).json({ message: 'Invalid order data', error: err.message });
  }
};

const getOrders = (req, res) => {
  const sql = `
    SELECT 
      o.id AS order_id,
      o.user_id,
      CONCAT(u.firstname, ' ', u.lastname) AS full_name,
      o.contact_email,
      o.contact_number,
      o.shipping_method,
      o.subtotal,
      o.shipping_fee,
      o.payment_method,
      o.order_status,
      o.payment_status,
      o.total,
      o.gcash_reference,
      o.proof_of_payment,
      o.first_name,
      o.last_name,
      o.city,
      o.postal_code,
      o.address,
      o.created_at,
      p.id AS product_id,
      -- Use COALESCE to prefer custom_product_name, then customization_requests.product_type, then p.name
      COALESCE(oi.custom_product_name, cr.product_type, p.name) AS product_name,
      p.image AS product_image,
      p.description AS product_description,
      c.name AS category_name,
      -- Use COALESCE to prefer custom_size, then customization_requests.size, then s.label
      COALESCE(oi.custom_size, cr.size, s.label) AS size_label,
      oi.quantity,
      oi.unit_price,
      oi.is_customization,
      oi.custom_product_name,
      oi.custom_size,
      oi.customization_id
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN sizes s ON oi.size_id = s.id
    LEFT JOIN customization_requests cr ON oi.customization_id = cr.id
    ORDER BY o.created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const grouped = {};
    rows.forEach(row => {
      if (!grouped[row.order_id]) {
        grouped[row.order_id] = {
          order_id: row.order_id,
          user_id: row.user_id,
          full_name: row.full_name,
          contact_email: row.contact_email,
          contact_number: row.contact_number,
          shipping_method: row.shipping_method,
          subtotal: row.subtotal,
          shipping_fee: row.shipping_fee,
          payment_method: row.payment_method,
          order_status: row.order_status,
          payment_status: row.payment_status,
          total: row.total,
          gcash_reference: row.gcash_reference,
          proof_of_payment: row.proof_of_payment,
          shipping_info: {
            first_name: row.first_name,
            last_name: row.last_name,
            city: row.city,
            postal_code: row.postal_code,
            address: row.address
          },
          created_at: row.created_at,
          items: []
        };
      }

      grouped[row.order_id].items.push({
        product_id: row.product_id,
        product_name: row.product_name,
        product_image: row.product_image,
        product_description: row.product_description,
        category: row.category_name,
        size: row.size_label,
        quantity: row.quantity,
        unit_price: row.unit_price,
        is_customization: row.is_customization,
        customization_id: row.customization_id,
        custom_product_name: row.custom_product_name,
        custom_size: row.custom_size
      });
    });

    res.json(Object.values(grouped));
  });
};

const getUserOrders = (req, res) => {
  const userId = req.user.id;
  const sql = `
    SELECT 
      o.id AS order_id,
      o.user_id,
      CONCAT(u.firstname, ' ', u.lastname) AS full_name,
      o.contact_email,
      o.contact_number,
      o.shipping_method,
      o.subtotal,
      o.shipping_fee,
      o.payment_method,
      o.order_status,
      o.payment_status,
      o.total,
      o.gcash_reference,
      o.proof_of_payment,
      o.first_name,
      o.last_name,
      o.city,
      o.postal_code,
      o.address,
      o.created_at,
      p.id AS product_id,
      COALESCE(oi.custom_product_name, cr.product_type, p.name) AS product_name,
      p.image AS product_image,
      p.description AS product_description,
      c.name AS category_name,
      COALESCE(oi.custom_size, cr.size, s.label) AS size_label,
      oi.quantity,
      oi.unit_price,
      oi.is_customization,
      oi.customization_id,
      oi.custom_product_name,
      oi.custom_size
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN sizes s ON oi.size_id = s.id
    LEFT JOIN customization_requests cr ON oi.customization_id = cr.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const grouped = {};
    rows.forEach(row => {
      if (!grouped[row.order_id]) {
        grouped[row.order_id] = {
          order_id: row.order_id,
          user_id: row.user_id,
          full_name: row.full_name,
          contact_email: row.contact_email,
          contact_number: row.contact_number,
          shipping_method: row.shipping_method,
          subtotal: row.subtotal,
          shipping_fee: row.shipping_fee,
          payment_method: row.payment_method,
          order_status: row.order_status,
          payment_status: row.payment_status,
          total: row.total,
          gcash_reference: row.gcash_reference,
          proof_of_payment: row.proof_of_payment,
          shipping_info: {
            first_name: row.first_name,
            last_name: row.last_name,
            city: row.city,
            postal_code: row.postal_code,
            address: row.address
          },
          created_at: row.created_at,
          items: []
        };
      }

      grouped[row.order_id].items.push({
        product_id: row.product_id,
        product_name: row.product_name,
        product_image: row.product_image,
        product_description: row.product_description,
        category: row.category_name,
        size: row.size_label,
        quantity: row.quantity,
        unit_price: row.unit_price,
        is_customization: row.is_customization,
        customization_id: row.customization_id,
        custom_product_name: row.custom_product_name,
        custom_size: row.custom_size
      });
    });

    res.json(Object.values(grouped));
  });
};

const updateOrderStatus = (req, res) => {
  const { orderId } = req.params;
  const { order_status, payment_status } = req.body;

  if (!order_status || !payment_status) {
    return res.status(400).json({ message: 'Both order_status and payment_status are required.' });
  }

  const sqlUpdate = `
    UPDATE orders 
    SET order_status = ?, payment_status = ? 
    WHERE id = ?
  `;

  db.query(sqlUpdate, [order_status, payment_status, orderId], (err, result) => {
    if (err) {
      console.error('Error updating order status:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ✅ Fetch user_id and product name(s), including custom product name
    const sqlGetDetails = `
      SELECT o.user_id, GROUP_CONCAT(COALESCE(oi.custom_product_name, p.name) SEPARATOR ', ') AS product_names
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = ?
      GROUP BY o.user_id
    `;

    db.query(sqlGetDetails, [orderId], (err, rows) => {
      if (err) {
        console.error('Error fetching order details:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!rows.length) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const userId = rows[0].user_id;
      const productNames = rows[0].product_names;
      const message = `Your order #${orderId} (${productNames}) status is now ${order_status}`;

      // ✅ Insert notification
      createNotification(userId, message, (err) => {
        if (err) {
          console.error('Error creating notification:', err);
        }

        // ✅ Emit to specific user via Socket.IO
        req.io.to(userId.toString()).emit('orderStatusUpdated', {
          orderId,
          status: order_status,
          payment_status,
          message
        });
        
        // Also emit as newNotification for consistency
        req.io.to(userId.toString()).emit('newNotification', {
          id: Date.now(),
          message: message,
          is_read: 0,
          created_at: new Date().toISOString()
        });

        return res.json({ message: 'Order status updated and notification sent' });
      });
    });
  });
};

module.exports = {
  createNewOrder,
  getOrders,
  getUserOrders,
  updateOrderStatus,
};
