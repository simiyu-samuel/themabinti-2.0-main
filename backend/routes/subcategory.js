const express = require('express');
const Service = require('../models/Service');
const router = express.Router();

// Define valid subcategories for validation
const validSubcategories = {
  'Beauty and Services': [
    '/services/beauty/makeup',
    '/services/beauty/nails',
    '/services/beauty/eyebrows-lashes',
    '/services/beauty/microblading',
    '/services/beauty/tattoo-piercings',
    '/services/beauty/waxing',
    '/services/beauty/asmr-massage',
    '/services/beauty/hub',
  ],
  'Hair Services': [
    '/services/hair/braiding',
    '/services/hair/weaving',
    '/services/hair/locs',
    '/services/hair/wig-makeovers',
    '/services/hair/ladies-haircut',
    '/services/hair/complete-care',
  ],
  'Health': [
    '/services/health/skin-consultation',
    '/services/health/mental-health',
    '/services/health/maternal-care',
    '/services/health/reproductive-care',
  ],
  'Fitness': [
    '/services/fitness/gym',
    '/services/fitness/personal-trainers',
    '/services/fitness/nutritionist',
  ],
  'Fashion': [
    '/services/fashion/african',
    '/services/fashion/maasai-wear',
    '/services/fashion/crotchet',
    '/services/fashion/personal-stylist',
  ],
  'Bridal': [
    '/services/bridal/makeup',
    '/services/bridal/hair',
    '/services/bridal/maids-for-hire',
    '/services/bridal/gowns-for-hire',
  ],
  'Flowers & Gifts': [
    '/services/flowers-gifts/personalized',
    '/services/flowers-gifts/customized',
  ],
  'Home & Lifestyle': [
    '/services/home/cleaning',
    '/services/home/laundry',
  ],
  'Photography': [
    '/services/photography/event',
    '/services/photography/lifestyle',
    '/services/photography/portrait',
  ],
};

// Get services by subcategory
router.get('/', async (req, res) => {
  try {
    const { subcategory } = req.query;
    console.log('Fetching services for subcategory:', subcategory);

    // Validate subcategory
    if (!subcategory) {
      console.log('No subcategory provided');
      return res.status(400).json({ message: 'Subcategory is required' });
    }

    // Check if subcategory is valid
    const isValidSubcategory = Object.values(validSubcategories)
      .flat()
      .includes(subcategory);
    if (!isValidSubcategory) {
      console.log('Invalid subcategory:', subcategory);
      return res.status(400).json({ message: 'Invalid subcategory' });
    }

    const services = await Service.find({
      subcategory: { $regex: subcategory, $options: 'i' },
    }).populate('userId', 'userName');

    console.log('Found services:', services.length);
    res.json(services);
  } catch (err) {
    console.error('Error fetching services by subcategory:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

module.exports = router;