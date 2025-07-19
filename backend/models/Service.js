const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, // Service name (e.g., "Carol Nails")
  media: [{
    type: { type: String, enum: ['image', 'video'], required: true },
    data: { type: String, required: true }, // Base64 string
  }],
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  location: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      'beautyAndServices',
      'hairServices',
      'health',
      'fitness',
      'fashion',
      'bridal',
      'flowersAndGifts',
      'homeAndLifestyle',
      'photography',
    ],
  },
  subcategory: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', serviceSchema);