// backend/models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false, // Changed to optional
    ref: 'User', // Still reference User for authenticated users, if any
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Blog', blogSchema);