const mongoose = require('mongoose');

const sellerPackagePaymentSchema = new mongoose.Schema({
  checkoutRequestId: {
    type: String,
    required: true,
    unique: true
  },
  packageId: {
    type: String,
    required: true,
    enum: ['basic', 'standard', 'premium']
  },
  amount: {
    type: Number,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userData: {
    userName: String,
    email: String,
    password: String,
    phoneNumber: String,
    accountType: String,
    packageId: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  mpesaReceiptNumber: {
    type: String,
    required: false
  },
  transactionDate: {
    type: Date,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
sellerPackagePaymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SellerPackagePayment', sellerPackagePaymentSchema);