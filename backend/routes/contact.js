const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST contact form submission
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  console.log('Received contact form:', { name, email, phone, subject, message });

  try {
    if (!name || !email || !phone || !subject || !message) {
      console.log('Validation failed:', { name: !!name, email: !!email, phone: !!phone, subject: !!subject, message: !!message });
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    await contact.save();
    console.log('Contact saved:', contact._id);

    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (err) {
    console.error('Server error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

module.exports = router;