const express = require('express');
const jwt = require('jsonwebtoken');
const Service = require('../models/Service');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Received token:', token);
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log('Decoded token:', decoded);
    req.user = decoded; // { userId, userName, email }
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Define valid subcategories for each category
const validSubcategories = {
  beautyAndServices: [
    '/services/beauty/makeup',
    '/services/beauty/nails',
    '/services/beauty/eyebrows-lashes',
    '/services/beauty/microblading',
    '/services/beauty/tattoo-piercings',
    '/services/beauty/waxing',
    '/services/beauty/asmr-massage',
    '/services/beauty/hub',
  ],
  hairServices: [
    '/services/hair/braiding',
    '/services/hair/weaving',
    '/services/hair/locs',
    '/services/hair/wig-makeovers',
    '/services/hair/ladies-haircut',
    '/services/hair/complete-care',
  ],
  health: [
    '/services/health/skin-consultation',
    '/services/health/mental-health',
    '/services/health/maternal-care',
    '/services/health/reproductive-care',
  ],
  fitness: [
    '/services/fitness/gym',
    '/services/fitness/personal-trainers',
    '/services/fitness/nutritionist',
  ],
  fashion: [
    '/services/fashion/african',
    '/services/fashion/maasai-wear',
    '/services/fashion/crotchet',
    '/services/fashion/personal-stylist',
  ],
  bridal: [
    '/services/bridal/makeup',
    '/services/bridal/hair',
    '/services/bridal/maids-for-hire',
    '/services/bridal/gowns-for-hire',
  ],
  flowersAndGifts: [
    '/services/flowers-gifts/personalized',
    '/services/flowers-gifts/customized',
  ],
  homeAndLifestyle: [
    '/services/home/cleaning',
    '/services/home/laundry',
  ],
  photography: [
    '/services/photography/event',
    '/services/photography/lifestyle',
    '/services/photography/portrait',
  ],
};

// Post a service
router.post('/', authMiddleware, async (req, res) => {
  const { name, images, video, minPrice, maxPrice, location, phoneNumber, category, subcategory, description } = req.body;
  console.log('Received payload:', {
    name,
    images: images?.length,
    video: !!video,
    minPrice,
    maxPrice,
    location,
    phoneNumber,
    category,
    subcategory,
    description,
  });

  try {
    // Fetch full user to access sellerPackage
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('User not found:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.accountType !== 'seller') {
      console.log('Non-seller attempted to post:', req.user);
      return res.status(403).json({ message: 'Only sellers can post services' });
    }

    // Validate inputs
    if (!name || !minPrice || !maxPrice || !location || !phoneNumber || !category || !subcategory || !description) {
      console.log('Validation failed:', {
        name: !!name,
        minPrice: !!minPrice,
        maxPrice: !!maxPrice,
        location: !!location,
        phoneNumber: !!phoneNumber,
        category: !!category,
        subcategory: !!subcategory,
        description: !!description,
      });
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate media
    const imageCount = Array.isArray(images) ? images.length : 0;
    const videoCount = video ? 1 : 0;
    const packageLimits = user.sellerPackage || { photoUploads: 0, videoUploads: 0, packageId: 'unknown' };

    if (imageCount > packageLimits.photoUploads) {
      console.log('Too many images:', { imageCount, allowed: packageLimits.photoUploads });
      return res.status(400).json({ 
        message: `Your ${packageLimits.packageId} package allows only ${packageLimits.photoUploads} photo(s)` 
      });
    }
    if (videoCount > packageLimits.videoUploads) {
      console.log('Too many videos:', { videoCount, allowed: packageLimits.videoUploads });
      return res.status(400).json({ 
        message: `Your ${packageLimits.packageId} package allows only ${packageLimits.videoUploads} video(s)` 
      });
    }
    if (imageCount === 0 && videoCount === 0) {
      console.log('No media provided');
      return res.status(400).json({ message: 'At least one media file is required' });
    }

    // Validate Base64 format
    const validateBase64 = (str) => typeof str === 'string' && str.startsWith('data:');
    if (images && !images.every(validateBase64)) {
      console.log('Invalid image Base64');
      return res.status(400).json({ message: 'Invalid image format' });
    }
    if (video && !validateBase64(video)) {
      console.log('Invalid video Base64');
      return res.status(400).json({ message: 'Invalid video format' });
    }

    // Convert to numbers and validate
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (isNaN(min) || isNaN(max)) {
      console.log('Invalid number format:', { minPrice, maxPrice });
      return res.status(400).json({ message: 'Prices must be valid numbers' });
    }
    if (min < 0 || max < 0) {
      console.log('Negative price detected:', { min, max });
      return res.status(400).json({ message: 'Prices cannot be negative' });
    }
    if (min > max) {
      console.log('Invalid price range:', { min, max });
      return res.status(400).json({ message: 'Minimum price cannot exceed maximum price' });
    }

    // Validate subcategory
    if (!validSubcategories[category] || !validSubcategories[category].includes(subcategory)) {
      console.log('Invalid subcategory:', { category, subcategory });
      return res.status(400).json({ message: 'Invalid subcategory for the selected category' });
    }

    // Prepare media array
    const media = [];
    if (images) {
      media.push(...images.map(data => ({ type: 'image', data })));
    }
    if (video) {
      media.push({ type: 'video', data: video });
    }

    const service = new Service({
      userId: req.user.userId,
      name,
      media,
      minPrice: min,
      maxPrice: max,
      location,
      phoneNumber,
      category,
      subcategory,
    });

    console.log('Saving service:', {
      userId: req.user.userId,
      name,
      media: media.length,
      minPrice: min,
      maxPrice: max,
      location,
      phoneNumber,
      category,
      subcategory,
    });

    await service.save();
    console.log('Service saved:', service._id);

    res.status(201).json({ message: 'Service posted successfully', service });
  } catch (err) {
    console.error('Server error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

// Search services by name or location
router.get('/search', async (req, res) => {
  const { query } = req.query;
  console.log('Search query:', query);

  try {
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const services = await Service.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    console.log('Found services:', services.length);
    res.json(services);
  } catch (err) {
    console.error('Search error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

// Get all services
router.get('/', async (req, res) => {
  try {
    const { location } = req.query;
    const query = location ? { location: { $regex: location, $options: 'i' } } : {};
    const services = await Service.find(query).populate('userId', 'userName');
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single service by ID
router.get('/id/:id', async (req, res) => {
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

// Get latest 6 services by category
router.get('/:category', async (req, res) => {
  const { category } = req.params;
  console.log('Fetching services for category:', category);

  try {
    if (!Object.keys(validSubcategories).includes(category)) {
      console.log('Invalid category:', category);
      return res.status(400).json({ message: 'Invalid category' });
    }

    const services = await Service.find({ category })
      .sort({ createdAt: -1 }) // Latest first
      .limit(4); // Max 4 services
    console.log('Found services:', services.length);

    res.json(services);
  } catch (err) {
    console.error('Server error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

module.exports = router;