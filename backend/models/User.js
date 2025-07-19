const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  accountType: {
    type: String,
    required: true,
    enum: ['buyer', 'seller'],
    default: 'buyer',
  },
  phoneNumber: {
    type: String,
    required: false, // CHANGE 1: Make phoneNumber optional to align with frontend
    trim: true,
    match: [/^\+?\d{10,15}$/, 'Please enter a valid phone number'],
  },
  sellerPackage: {
    type: {
      packageId: {
        type: String,
        enum: ['basic', 'standard', 'premium'],
      },
      photoUploads: {
        type: Number,
      },
      videoUploads: {
        type: Number,
      },
    },
    required: false, // CHANGE 2: Make sellerPackage optional, validated in auth.js
  },
});

module.exports = mongoose.model('User', userSchema);