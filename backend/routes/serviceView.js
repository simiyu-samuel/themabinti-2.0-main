const express = require('express');
const Service = require('../models/Service');
const router = express.Router();

// Get a single service by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Fetching service by ID:', id);

  try {
    const service = await Service.findById(id).populate('userId', 'userName');
    if (!service) {
      console.log('Service not found:', id);
      return res.status(404).json({ message: 'Service not found' });
    }
    console.log('Found service:', service._id);
    res.json(service);
  } catch (err) {
    console.error('Server error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

module.exports = router; 