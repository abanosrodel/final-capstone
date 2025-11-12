// controllers/userController.js
const User = require('../models/userModel');

const getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

const fetchUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await  User.getUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateResult = await  User.updateUserById(userId, req.body);
    res.json({ message: 'User updated successfully', updateResult });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const restrictUser = async (req, res) => {
  try {
    const idParam = req.params.id;

    if (!idParam) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const userId = parseInt(idParam, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    // Optional flag to unrestrict if needed
    const restrictedFlag = typeof req.body.restricted !== 'undefined' ? req.body.restricted : 1;
    const performedBy = req.user?.id || null;

    // First check if user exists
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if user is already in the desired state
    if (user.is_restricted === restrictedFlag) {
      return res.status(200).json({
        message: restrictedFlag ? 'User already restricted.' : 'User already active.'
      });
    }

    // Update the user restriction status
    await new Promise((resolve, reject) => {
      User.restrictById(userId, restrictedFlag, performedBy, (err, success) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        if (!success) {
          return reject(new Error('No user updated.'));
        }
        resolve(success);
      });
    });

    res.status(200).json({
      message: restrictedFlag ? 'User restricted successfully.' : 'User unrestricted successfully.'
    });

  } catch (error) {
    console.error('Error in restrictUser:', error);
    res.status(500).json({ message: 'Failed to update user.' });
  }
}


module.exports = {
  getUsers,
   fetchUserProfile,
  updateUserProfile,
  restrictUser,
};
