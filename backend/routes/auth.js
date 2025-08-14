const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SellerPackagePayment = require('../models/SellerPackagePayment');
const mpesaService = require('../services/mpesaService');
const router = express.Router();

// Define valid seller packages
const sellerPackages = {
  basic: { photoUploads: 1, videoUploads: 0, price: 800 },
  standard: { photoUploads: 2, videoUploads: 0, price: 1500 },
  premium: { photoUploads: 3, videoUploads: 1, price: 2500 },
};

// Register
router.post('/register', async (req, res) => {
  const { userName, email, password, accountType, packageId, phoneNumber, paymentPhone } = req.body;

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
    if (accountType === 'seller' && !paymentPhone) {
      return res.status(400).json({ 
        message: 'Payment phone number is required for sellers.'
      });
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

    if (accountType === 'buyer') {
      // For buyers, create account immediately
      const userData = {
        userName,
        email,
        password: hashedPassword,
        phoneNumber: phoneNumber || undefined,
        accountType,
      };

      user = new User(userData);
      await user.save();

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
        },
      };

      res.status(201).json(responseData);
    } else {
      // For sellers, initiate payment first
      const packageInfo = sellerPackages[packageId];
      const amount = packageInfo.price;

      // Store user data temporarily for after payment
      const userData = {
        userName,
        email,
        password: hashedPassword,
        phoneNumber: phoneNumber || undefined,
        accountType,
        packageId,
      };

      try {
        const paymentResult = await mpesaService.initiateSellerPackagePayment(
          paymentPhone,
          amount,
          packageId,
          userData
        );

        if (paymentResult.success) {
          res.status(200).json({
            message: 'Payment initiated. Please complete M-Pesa payment to finish registration.',
            requiresPayment: true,
            checkoutRequestId: paymentResult.checkoutRequestId,
            amount: amount,
            packageName: packageId
          });
        } else {
          res.status(400).json({
            message: paymentResult.message || 'Failed to initiate payment'
          });
        }
      } catch (paymentError) {
        console.error('Payment initiation error:', paymentError);
        res.status(500).json({
          message: 'Failed to initiate payment. Please try again.'
        });
      }
    }
  } catch (err) {
    console.error('Error in /register:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

// Check seller payment status and complete registration
router.post('/check-seller-payment', async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;

    if (!checkoutRequestId) {
      return res.status(400).json({ message: 'Checkout request ID is required' });
    }

    // Find the payment record
    const payment = await SellerPackagePayment.findOne({ checkoutRequestId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    if (payment.paymentStatus === 'completed') {
      // Check if user already exists
      let user = await User.findOne({ email: payment.userData.email });
      if (user) {
        // Generate JWT
        const token = jwt.sign(
          { userId: user._id, userName: user.userName, email: user.email, accountType: user.accountType },
          process.env.JWT_SECRET || 'your_jwt_secret',
          { expiresIn: '1h' }
        );

        return res.json({
          success: true,
          message: 'Registration completed successfully',
          token,
          user: {
            userName: user.userName,
            email: user.email,
            accountType: user.accountType,
            sellerPackage: user.sellerPackage
          }
        });
      } else {
        // Create the user account
        const packageInfo = sellerPackages[payment.packageId];
        const userData = {
          ...payment.userData,
          sellerPackage: {
            packageId: payment.packageId,
            photoUploads: packageInfo.photoUploads,
            videoUploads: packageInfo.videoUploads,
          }
        };

        user = new User(userData);
        await user.save();

        // Generate JWT
        const token = jwt.sign(
          { userId: user._id, userName: user.userName, email: user.email, accountType: user.accountType },
          process.env.JWT_SECRET || 'your_jwt_secret',
          { expiresIn: '1h' }
        );

        return res.json({
          success: true,
          message: 'Registration completed successfully',
          token,
          user: {
            userName: user.userName,
            email: user.email,
            accountType: user.accountType,
            sellerPackage: user.sellerPackage
          }
        });
      }
    } else if (payment.paymentStatus === 'failed') {
      return res.status(400).json({
        success: false,
        message: 'Payment failed. Please try registering again.'
      });
    } else {
      // Still pending
      return res.json({
        success: false,
        message: 'Payment is still pending. Please complete the M-Pesa payment.',
        status: 'pending'
      });
    }
  } catch (error) {
    console.error('Error checking seller payment:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

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
        id: user._id,
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

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        accountType: user.accountType,
        sellerPackage: user.accountType === 'seller' ? user.sellerPackage : undefined,
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});
module.exports = router;