const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Define valid seller packages
const sellerPackages = {
  basic: { photoUploads: 1, videoUploads: 0 },
  standard: { photoUploads: 2, videoUploads: 0 },
  premium: { photoUploads: 3, videoUploads: 1 },
};

// Register
router.post('/register', async (req, res) => {
  const { userName, email, password, accountType, packageId, phoneNumber } = req.body;

  try {
    // Validate input
    if (!userName || !email || !password || !accountType) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    if (!['buyer', 'seller'].includes(accountType)) {
      return res.status(400).json({ message: 'Invalid account type' });
    }
    if (accountType === 'seller' && !packageId) {
      return res.status(400).json({ 
        message: 'Package ID is required for sellers. Please select a package (basic, standard, or premium).'
      }); // CHANGE: More specific error message
    }
    if (accountType === 'seller' && !sellerPackages[packageId]) {
      return res.status(400).json({ 
        message: `Invalid package ID: ${packageId}. Must be one of: basic, standard, premium.`
      }); // CHANGE: More specific error message
    }

    // Check for existing user
    let user = await User.findOne({ $or: [{ userName }, { email }] });
    if (user) {
      if (user.userName === userName) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      if (user.email === email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare user data
    const userData = {
      userName,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber || undefined,
      accountType,
      sellerPackage: accountType === 'seller' ? {
        packageId,
        photoUploads: sellerPackages[packageId].photoUploads,
        videoUploads: sellerPackages[packageId].videoUploads,
      } : undefined,
    };

    console.log('User data before save:', userData);

    // Create and save user
    user = new User(userData);
    await user.save();
    console.log('Saved user data:', user.toObject());

    // Fetch the complete user data including sellerPackage
    user = await User.findById(user._id).lean();
    console.log('Fetched user data:', user);

    // Validate sellerPackage for sellers
    if (accountType === 'seller' && (!user.sellerPackage || !user.sellerPackage.packageId)) {
      console.error('sellerPackage missing or incomplete after fetch:', user.sellerPackage);
      return res.status(500).json({ message: 'Server error: Failed to retrieve seller package' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, userName: user.userName, email: user.email, accountType: user.accountType },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    const responseData = {
      message: 'User registered successfully',
      token,
      user: { 
        userName: user.userName, 
        email: user.email, 
        accountType: user.accountType,
        sellerPackage: user.accountType === 'seller' ? user.sellerPackage : undefined,
      },
    };
    console.log('Sending response:', responseData);

    res.status(201).json(responseData);
  } catch (err) {
    console.error('Error in /register:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, userName: user.userName, email: user.email, accountType: user.accountType },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    const responseData = {
      token,
      user: {
        userName: user.userName,
        email: user.email,
        accountType: user.accountType,
        sellerPackage: user.accountType === 'seller' ? user.sellerPackage : undefined,
      },
    };
    console.log('Login response:', responseData);

    res.json(responseData);
  } catch (err) {
    console.error('Error in /login:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

module.exports = router;