const ChatModel = require('../models/chatModel');
const path = require('path');

const ChatController = {
  // Get messages for the logged-in user (No change needed)
  getMessages: function (req, res) {
    const userId = req.user.id;
    ChatModel.getMessagesByUserId(userId, function (err, messages) {
      if (err) return res.status(500).json({ error: 'Failed to get messages' });
      res.json(messages);
    });
  },

  // REVISED: Send a message from the logged-in user with optional image
sendMessage: function (req, res) {
  const userId = req.body.user_id;
  const text = req.body.text || '';
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  // FIX: Allow if either text OR image is present
  if (!text.trim() && !imageUrl) {
    return res.status(400).json({ error: 'Message text or image is required' });
  }

  const messageData = {
    user_id: userId,
    sender: req.body.sender || 'user',
    text: text,
    image_url: imageUrl
  };

  ChatModel.sendMessage(messageData, function (err, newMessage) {
    if (err) return res.status(500).json({ error: 'Failed to send message' });

    req.io.to(userId).emit('newMessage', newMessage);
    req.io.to('admin').emit('newMessage', newMessage);

    res.status(201).json(newMessage);
  });
},
  // Admin: Get all messages from all users (No change needed)
  getAllMessages: function (req, res) {
    ChatModel.getAllMessages(function (err, messages) {
      if (err) return res.status(500).json({ error: 'Failed to get messages' });
      res.json(messages);
    });
  },

  // REVISED: Admin: Reply to a specific user with optional image
 replyToUser: function (req, res) {
  const userId = req.params.userId;
  const { text, temp_id } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!text && !imageUrl) {
    return res.status(400).json({ error: 'Reply text or image is required' });
  }

  const messageData = { user_id: userId, sender: 'admin', text, image_url: imageUrl };

  ChatModel.sendMessage(messageData, function (err, newReply) {
    if (err) return res.status(500).json({ error: 'Failed to send reply' });

    const responseMessage = { ...newReply };
    if (temp_id) responseMessage.temp_id = temp_id;

    req.io.to(userId).emit('newMessage', responseMessage);
    req.io.to('admin').emit('newMessage', responseMessage);

    res.status(201).json(responseMessage);
  });
},
  // REVISED: Admin: Mark all messages from a user as read
  markMessagesAsRead: function (req, res) {
    const { userId } = req.params;
    const { lastMessageId } = req.body;

    if (!userId || !lastMessageId) {
      return res.status(400).json({ error: 'Invalid user ID or message ID' });
    }

    ChatModel.markAsRead(userId, lastMessageId, function (err, result) {
      if (err) return res.status(500).json({ error: 'Failed to mark messages as read' });

      // --- Socket.IO Integration ---
      // Notify admin clients that a conversation has been read to update UI (e.g., remove 'unread' badge)
      req.io.to('admin').emit('messagesRead', { userId: userId, lastMessageId: lastMessageId });
      // --- End Socket.IO Integration ---

      res.json({ message: 'Messages marked as read' });
    });
  }
};

module.exports = ChatController;