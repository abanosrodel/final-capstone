const db = require("../config/db");

const createOrder = (order, items, callback) => {
  db.beginTransaction((err) => {
    if (err) return callback(err);

    const insertOrderSQL = `
      INSERT INTO orders (
        user_id, contact_email, contact_number, shipping_method,
        payment_method, subtotal, shipping_fee, total,
        gcash_reference, proof_of_payment,
        first_name, last_name, city, postal_code, address,
        order_status, payment_status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'Unpaid', NOW())
    `;

    const values = [
      order.user_id,
      order.contact_email,
      order.contact_number,
      order.shipping_method,
      order.payment_method,
      order.subtotal,
      order.shipping_fee,
      order.total,
      order.gcash_reference,
      order.proof_of_payment,
      order.first_name || null,
      order.last_name || null,
      order.city || null,
      order.postal_code || null,
      order.address || null,
    ];

    db.query(insertOrderSQL, values, (err, result) => {
      if (err) return db.rollback(() => callback(err));

      const orderId = result.insertId;

      const checkSizeExists = (size_id, cb) => {
        db.query(
          "SELECT id FROM sizes WHERE id = ?",
          [size_id],
          (err, rows) => {
            if (err) return cb(err);
            cb(null, rows.length > 0);
          }
        );
      };

      const insertItem = (index) => {
        if (index >= items.length) {
          return db.commit((err) => {
            if (err) return db.rollback(() => callback(err));
            callback(null, orderId);
          });
        }

        const item = items[index];

        // If it's a customization, skip product_id and size_id validation
        if (item.is_customization) {
          // Insert with NULL product_id and size_id, or use a separate table/fields if needed
          db.query(
            `INSERT INTO order_items (order_id, product_id, size_id, quantity, unit_price, is_customization, customization_id)
       VALUES (?, NULL, NULL, ?, ?, 1, ?)`,
            [
              orderId,
              item.quantity,
              item.unit_price,
              item.customization_id || null,
            ],
            (err) => {
              if (err) return db.rollback(() => callback(err));
              insertItem(index + 1);
            }
          );
          return;
        }

        // Validation for regular products
        if (
          !item.product_id ||
          !item.size_id ||
          !item.quantity ||
          item.unit_price === undefined ||
          item.unit_price === null
        ) {
          return db.rollback(() =>
            callback(
              new Error(
                `Invalid item at index ${index}: All fields are required (product_id, size_id, quantity, unit_price)`
              )
            )
          );
        }

        // ✅ Validate size_id exists
        checkSizeExists(item.size_id, (err, exists) => {
          if (err) return db.rollback(() => callback(err));
          if (!exists) {
            return db.rollback(() =>
              callback(
                new Error(
                  `Invalid size_id at index ${index}: ${item.size_id} does not exist in sizes table`
                )
              )
            );
          }

          // Proceed to insert
          db.query(
            `INSERT INTO order_items (
     order_id, product_id, size_id, quantity, unit_price, is_customization, customization_id, custom_product_name, custom_size
   ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              orderId,
              item.product_id || null,
              item.size_id || null,
              item.quantity,
              item.unit_price,
              item.is_customization || 0,
              item.customization_id || null,
              item.custom_product_name || null,
              item.custom_size || null,
            ],
            callback
          );
        });
      };
      insertItem(0); // Start loop
    });
  });
};

module.exports = {
  createOrder,
};
