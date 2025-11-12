const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/customizations');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'custom-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Create customization request
const createCustomizationRequest = async (req, res) => {
  const {
    product_type,
    size,
    color,
    quantity,
    design_description
  } = req.body;

  const userId = req.user.id;

  try {
    // Insert customization request
    const result = await new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO customization_requests 
        (user_id, product_type, title, description, size, color_preference, quantity, design_description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      // Create title and description from product_type and design_description
      const title = `${product_type.charAt(0).toUpperCase() + product_type.slice(1)} Custom Design`;
      const description = design_description;
      
      db.query(sql, [
        userId, product_type, title, description, size, color, quantity, design_description
      ], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const requestId = result.insertId;

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await new Promise((resolve, reject) => {
          const sql = `
            INSERT INTO customization_images (request_id, image_path)
            VALUES (?, ?)
          `;
          
          db.query(sql, [
            requestId,
            file.filename
          ], (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });
      }
    }

    res.json({
      message: 'Customization request submitted successfully',
      requestId: requestId
    });

  } catch (error) {
    console.error('Error creating customization request:', error);
    res.status(500).json({ error: 'Failed to create customization request' });
  }
};

// Get user's customization requests
const getUserCustomizationRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const requests = await new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          cr.*,
          CONCAT(u.firstname, ' ', u.lastname) as user_name,
          u.email as user_email,
          u.phonenumber as user_phone,
          COUNT(DISTINCT ci.id) as image_count,
          COUNT(DISTINCT cm.id) as message_count
        FROM customization_requests cr
        JOIN users u ON cr.user_id = u.id
        LEFT JOIN customization_images ci ON cr.id = ci.request_id
        LEFT JOIN customization_messages cm ON cr.id = cm.request_id
        WHERE cr.user_id = ?
        GROUP BY cr.id
        ORDER BY cr.created_at DESC
      `;
      
      db.query(sql, [userId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    // Get images for each request
    for (let request of requests) {
      const images = await new Promise((resolve, reject) => {
        const sql = `SELECT * FROM customization_images WHERE request_id = ? ORDER BY uploaded_at ASC`;
        db.query(sql, [request.id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      request.images = images;
    }

    res.json(requests);

  } catch (error) {
    console.error('Error fetching user customization requests:', error);
    res.status(500).json({ error: 'Failed to fetch customization requests' });
  }
};

// Get all customization requests (admin)
const getAllCustomizationRequests = async (req, res) => {
  try {
    const requests = await new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          cr.*,
          CONCAT(u.firstname, ' ', u.lastname) as user_name,
          u.email as user_email,
          u.phonenumber as user_phone
        FROM customization_requests cr
        JOIN users u ON cr.user_id = u.id
        ORDER BY cr.created_at DESC
      `;
      
      db.query(sql, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    // Get images for each request
    for (let request of requests) {
      const images = await new Promise((resolve, reject) => {
        const sql = `SELECT * FROM customization_images WHERE request_id = ? ORDER BY uploaded_at ASC`;
        db.query(sql, [request.id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      request.images = images;
    }

    res.json(requests);

  } catch (error) {
    console.error('Error fetching all customization requests:', error);
    res.status(500).json({ error: 'Failed to fetch customization requests' });
  }
};

// Get single customization request with details
const getCustomizationRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Get request details
    const request = await new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          cr.*,
          u.firstname,
          u.lastname,
          u.email,
          u.contact_number
        FROM customization_requests cr
        JOIN users u ON cr.user_id = u.id
        WHERE cr.id = ? AND (cr.user_id = ? OR ? = 'admin')
      `;
      
      db.query(sql, [id, userId, userRole], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (request.length === 0) {
      return res.status(404).json({ error: 'Customization request not found' });
    }

    // Get images
    const images = await new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM customization_images 
        WHERE request_id = ? 
        ORDER BY uploaded_at ASC
      `;
      
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    // Get messages
    const messages = await new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          cm.*,
          u.firstname,
          u.lastname
        FROM customization_messages cm
        JOIN users u ON cm.user_id = u.id
        WHERE cm.request_id = ?
        ORDER BY cm.created_at ASC
      `;
      
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    res.json({
      request: request[0],
      images: images,
      messages: messages
    });

  } catch (error) {
    console.error('Error fetching customization request:', error);
    res.status(500).json({ error: 'Failed to fetch customization request' });
  }
};

// Update customization request status (admin)
const updateCustomizationRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status, admin_notes, estimated_price } = req.body;

  try {
    await new Promise((resolve, reject) => {
      const sql = `
        UPDATE customization_requests 
        SET status = ?, admin_notes = ?, quoted_price = ?, updated_at = NOW()
        WHERE id = ?
      `;
      
      db.query(sql, [status, admin_notes, estimated_price, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    res.json({ message: 'Customization request updated successfully' });

  } catch (error) {
    console.error('Error updating customization request:', error);
    res.status(500).json({ error: 'Failed to update customization request' });
  }
};

// Update customization request price (real-time)
const updateCustomizationPrice = async (req, res) => {
  const { id } = req.params;
  const { quoted_price, price_note } = req.body;
  const userId = req.user.id;

  try {
    // Get request details
    const request = await new Promise((resolve, reject) => {
      const sql = `
        SELECT user_id FROM customization_requests 
        WHERE id = ?
      `;
      
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });

    if (!request) {
      return res.status(404).json({ error: 'Customization request not found' });
    }

    // Update the price
    await new Promise((resolve, reject) => {
      const sql = `
        UPDATE customization_requests 
        SET quoted_price = ?, updated_at = NOW()
        WHERE id = ?
      `;
      
      db.query(sql, [quoted_price, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    // Add a system message about price update
    const systemMessage = price_note || `Price updated to ₱${parseFloat(quoted_price).toFixed(2)}`;
    
    await new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO customization_messages (request_id, user_id, message, is_admin)
        VALUES (?, ?, ?, ?)
      `;
      
      db.query(sql, [id, userId, systemMessage, req.user.role === 'admin'], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    // Emit real-time price update
    const priceUpdateData = {
      request_id: id,
      quoted_price: parseFloat(quoted_price),
      updated_by: req.user.role === 'admin' ? 'admin' : 'customer',
      message: systemMessage,
      timestamp: new Date().toISOString()
    };

    req.io.to(request.user_id.toString()).emit('priceUpdated', priceUpdateData);
    req.io.to('admin').emit('priceUpdated', priceUpdateData);

    res.json({ 
      message: 'Price updated successfully',
      price_update: priceUpdateData
    });

  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({ error: 'Failed to update price' });
  }
};

// Get messages for customization request
const getCustomizationMessages = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Verify user has access to this request
    const request = await new Promise((resolve, reject) => {
      const sql = `
        SELECT user_id FROM customization_requests 
        WHERE id = ?
      `;
      
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });

    if (!request) {
      return res.status(404).json({ error: 'Customization request not found' });
    }

    // Check if user has access (owner or admin)
    if (request.user_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get messages
    const messages = await new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          cm.*,
          u.firstname,
          u.lastname
        FROM customization_messages cm
        JOIN users u ON cm.user_id = u.id
        WHERE cm.request_id = ?
        ORDER BY cm.created_at ASC
      `;
      
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    res.json(messages);

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Add message to customization request
const addCustomizationMessage = async (req, res) => {
  const { id } = req.params;
  const { message, is_admin } = req.body;
  const userId = req.user.id;

  try {
    // Verify user has access to this request
    const request = await new Promise((resolve, reject) => {
      const sql = `
        SELECT user_id FROM customization_requests 
        WHERE id = ?
      `;
      
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });

    if (!request) {
      return res.status(404).json({ error: 'Customization request not found' });
    }

    // Check if user has access (owner or admin)
    if (request.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const isAdminMessage = is_admin === true || req.user.role === 'admin';
    
    // Insert message
    const messageResult = await new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO customization_messages (request_id, user_id, message, is_admin)
        VALUES (?, ?, ?, ?)
      `;
      
      db.query(sql, [id, userId, message, isAdminMessage], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    // Get the inserted message with user details
    const insertedMessage = await new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          cm.*,
          u.firstname,
          u.lastname
        FROM customization_messages cm
        JOIN users u ON cm.user_id = u.id
        WHERE cm.id = ?
      `;
      
      db.query(sql, [messageResult.insertId], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });

    // Check if message contains price information and extract it
    const priceMatch = message.match(/₱?(\d+(?:\.\d{2})?)/i);
    let updatedPrice = null;
    
    if (priceMatch) {
      updatedPrice = parseFloat(priceMatch[1]);
      
      // Update the customization request with the new price
      await new Promise((resolve, reject) => {
        const sql = `
          UPDATE customization_requests 
          SET quoted_price = ?, updated_at = NOW()
          WHERE id = ?
        `;
        
        db.query(sql, [updatedPrice, id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    }

    // Emit real-time message to both user and admin
    const messageData = {
      id: insertedMessage.id,
      message: insertedMessage.message,
      is_admin: insertedMessage.is_admin,
      created_at: insertedMessage.created_at,
      user_name: `${insertedMessage.firstname} ${insertedMessage.lastname}`,
      request_id: id,
      updated_price: updatedPrice
    };

    // Emit to the request owner
    req.io.to(request.user_id.toString()).emit('customizationMessage', messageData);
    
    // Emit to admin room
    req.io.to('admin').emit('customizationMessage', messageData);

    // If price was updated, emit price update event
    if (updatedPrice !== null) {
      const priceUpdateData = {
        request_id: id,
        quoted_price: updatedPrice,
        updated_by: isAdminMessage ? 'admin' : 'customer',
        message: `Price updated to ₱${updatedPrice.toFixed(2)}`
      };

      req.io.to(request.user_id.toString()).emit('priceUpdated', priceUpdateData);
      req.io.to('admin').emit('priceUpdated', priceUpdateData);
    }

    res.json({ 
      message: 'Message added successfully',
      message_data: messageData,
      price_updated: updatedPrice !== null,
      new_price: updatedPrice
    });

  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ error: 'Failed to add message' });
  }
};

// Create order from approved customization request
const createCustomizationOrder = async (req, res) => {
  const { customizationId } = req.params;
  const userId = req.user.id;

  try {
    // Get the customization request
    const customization = await new Promise((resolve, reject) => {
      const sql = `
        SELECT cr.*, u.firstname, u.lastname, u.email, u.phonenumber, u.address, u.city, u.postal_code
        FROM customization_requests cr
        JOIN users u ON cr.user_id = u.id
        WHERE cr.id = ? AND cr.user_id = ? AND cr.status = 'approved'
      `;
      
      db.query(sql, [customizationId, userId], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });

    if (!customization) {
      return res.status(404).json({ error: 'Customization request not found or not approved' });
    }

    // Create a special product for customizations
    const customProduct = {
      id: `custom_${customizationId}`,
      name: `Custom ${customization.product_type.charAt(0).toUpperCase() + customization.product_type.slice(1)} - ${customization.title}`,
      unit_price: customization.quoted_price || 0,
      image: customization.images && customization.images.length > 0 ? customization.images[0].image_path : null,
      description: customization.design_description,
      is_customization: true,
      customization_id: customizationId
    };

    res.json({
      message: 'Customization order data retrieved successfully',
      product: customProduct,
      customization: customization
    });

  } catch (error) {
    console.error('Error creating customization order:', error);
    res.status(500).json({ error: 'Failed to create customization order' });
  }
};

module.exports = {
  createCustomizationRequest,
  getUserCustomizationRequests,
  getAllCustomizationRequests,
  getCustomizationRequest,
  updateCustomizationRequestStatus,
  updateCustomizationPrice,
  getCustomizationMessages,
  addCustomizationMessage,
  createCustomizationOrder,
  upload
};
