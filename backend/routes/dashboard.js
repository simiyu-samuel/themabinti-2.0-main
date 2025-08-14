const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Contact = require('../models/Contact');
const Blog = require('../models/blogs');

// Get seller dashboard data
router.get('/seller/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get seller's services
    const services = await Service.find({ userId }).sort({ createdAt: -1 });
    
    // Get appointments for seller's services
    const serviceIds = services.map(service => service._id);
    const appointments = await Appointment.find({ 
      serviceId: { $in: serviceIds } 
    }).populate('serviceId', 'name').sort({ createdAt: -1 });

    // Calculate stats
    const totalServices = services.length;
    const totalAppointments = appointments.length;
    const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
    const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed').length;

    res.json({
      services: {
        total: totalServices,
        active: totalServices // Assuming all services are active
      },
      appointments: {
        total: totalAppointments,
        pending: pendingAppointments,
        confirmed: confirmedAppointments
      },
      recentServices: services.slice(0, 5),
      recentAppointments: appointments.slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching seller dashboard:', error);
    res.status(500).json({ message: 'Error fetching seller dashboard data' });
  }
});

// Get admin dashboard data
router.get('/admin', async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const sellers = await User.countDocuments({ accountType: 'seller' });
    const buyers = await User.countDocuments({ accountType: 'buyer' });

    // Service statistics
    const totalServices = await Service.countDocuments();
    
    // Appointment statistics
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });

    // Contact submissions
    const totalContacts = await Contact.countDocuments();

    // Blog posts
    const totalBlogs = await Blog.countDocuments();

    // Recent activity
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentServices = await Service.find().populate('userId', 'userName').sort({ createdAt: -1 }).limit(5);
    const recentAppointments = await Appointment.find().populate('serviceId', 'name').sort({ createdAt: -1 }).limit(5);

    res.json({
      users: {
        total: totalUsers,
        sellers: sellers,
        buyers: buyers
      },
      services: {
        total: totalServices
      },
      appointments: {
        total: totalAppointments,
        pending: pendingAppointments
      },
      contacts: {
        total: totalContacts
      },
      blogs: {
        total: totalBlogs
      },
      recentActivity: {
        users: recentUsers,
        services: recentServices,
        appointments: recentAppointments
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ message: 'Error fetching admin dashboard data' });
  }
});

module.exports = router;