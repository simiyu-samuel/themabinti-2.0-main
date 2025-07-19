// backend/routes/blogs.js
const express = require('express');
const router = express.Router();
const Blog = require('../models/blogs');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    console.log('Fetched blogs:', blogs.length);
    res.json(blogs);
  } catch (err) {
    console.error('Server error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

// Get a single blog by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Fetching blog:', id);

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      console.log('Blog not found:', id);
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error('Server error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

// Post a new blog (no authentication required)
router.post('/', async (req, res) => {
  const { title, content, author } = req.body;
  console.log('Received blog post:', { title, content, author });

  try {
    if (!title || !content || !author) {
      console.log('Validation failed:', { title: !!title, content: !!content, author: !!author });
      return res.status(400).json({ message: 'Title, content, and author are required' });
    }

    const blog = new Blog({
      title,
      content,
      author,
      // userId omitted for unauthenticated users
    });

    await blog.save();
    console.log('Blog saved:', blog._id);

    res.status(201).json({ message: 'Blog posted successfully', blog });
  } catch (err) {
    console.error('Server error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

module.exports = router;