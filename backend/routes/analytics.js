const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get platform statistics
router.get('/platform-stats', async (req, res) => {
  try {
    const [services] = await db.query('SELECT COUNT(*) as count FROM services WHERE status = ?', ['active']);
    const [providers] = await db.query('SELECT COUNT(*) as count FROM users WHERE account_type = ?', ['seller']);
    const [bookings] = await db.query('SELECT COUNT(*) as count FROM service_bookings WHERE payment_status = ?', ['completed']);
    const [avgRating] = await db.query('SELECT AVG(rating) as avg FROM services WHERE rating IS NOT NULL');

    res.json({
      totalServices: services[0].count,
      totalProviders: providers[0].count,
      totalBookings: bookings[0].count,
      avgRating: parseFloat(avgRating[0].avg || 4.5).toFixed(1)
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({ message: 'Error fetching platform statistics' });
  }
});

// Get admin dashboard analytics
router.get('/admin/overview', async (req, res) => {
  try {
    // User statistics
    const [totalUsers] = await db.query('SELECT COUNT(*) as count FROM users');
    const [newUsersToday] = await db.query('SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = CURDATE()');
    const [sellers] = await db.query('SELECT COUNT(*) as count FROM users WHERE account_type = ?', ['seller']);
    const [buyers] = await db.query('SELECT COUNT(*) as count FROM users WHERE account_type = ?', ['buyer']);

    // Service statistics
    const [totalServices] = await db.query('SELECT COUNT(*) as count FROM services');
    const [activeServices] = await db.query('SELECT COUNT(*) as count FROM services WHERE status = ?', ['active']);
    const [pendingServices] = await db.query('SELECT COUNT(*) as count FROM services WHERE status = ?', ['pending']);

    // Revenue statistics
    const [totalRevenue] = await db.query(`
      SELECT SUM(amount) as total FROM service_bookings 
      WHERE payment_status = 'completed'
    `);
    const [monthlyRevenue] = await db.query(`
      SELECT SUM(amount) as total FROM service_bookings 
      WHERE payment_status = 'completed' AND MONTH(created_at) = MONTH(CURDATE())
    `);

    // Recent activity
    const [recentBookings] = await db.query(`
      SELECT sb.*, s.name as service_name, u.user_name 
      FROM service_bookings sb
      LEFT JOIN services s ON sb.service_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY sb.created_at DESC
      LIMIT 10
    `);

    res.json({
      users: {
        total: totalUsers[0].count,
        newToday: newUsersToday[0].count,
        sellers: sellers[0].count,
        buyers: buyers[0].count
      },
      services: {
        total: totalServices[0].count,
        active: activeServices[0].count,
        pending: pendingServices[0].count
      },
      revenue: {
        total: totalRevenue[0].total || 0,
        monthly: monthlyRevenue[0].total || 0
      },
      recentActivity: recentBookings
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    res.status(500).json({ message: 'Error fetching admin analytics' });
  }
});

// Get seller dashboard analytics
router.get('/seller/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Service statistics
    const [services] = await db.query('SELECT COUNT(*) as count FROM services WHERE user_id = ?', [userId]);
    const [activeServices] = await db.query('SELECT COUNT(*) as count FROM services WHERE user_id = ? AND status = ?', [userId, 'active']);

    // Booking statistics
    const [totalBookings] = await db.query(`
      SELECT COUNT(*) as count FROM service_bookings sb
      JOIN services s ON sb.service_id = s.id
      WHERE s.user_id = ?
    `, [userId]);

    const [completedBookings] = await db.query(`
      SELECT COUNT(*) as count FROM service_bookings sb
      JOIN services s ON sb.service_id = s.id
      WHERE s.user_id = ? AND sb.payment_status = 'completed'
    `, [userId]);

    // Revenue statistics
    const [totalEarnings] = await db.query(`
      SELECT SUM(sb.amount) as total FROM service_bookings sb
      JOIN services s ON sb.service_id = s.id
      WHERE s.user_id = ? AND sb.payment_status = 'completed'
    `, [userId]);

    const [monthlyEarnings] = await db.query(`
      SELECT SUM(sb.amount) as total FROM service_bookings sb
      JOIN services s ON sb.service_id = s.id
      WHERE s.user_id = ? AND sb.payment_status = 'completed' 
      AND MONTH(sb.created_at) = MONTH(CURDATE())
    `, [userId]);

    // Recent bookings
    const [recentBookings] = await db.query(`
      SELECT sb.*, s.name as service_name, a.date, a.time
      FROM service_bookings sb
      JOIN services s ON sb.service_id = s.id
      JOIN appointments a ON sb.appointment_id = a.id
      WHERE s.user_id = ?
      ORDER BY sb.created_at DESC
      LIMIT 10
    `, [userId]);

    res.json({
      services: {
        total: services[0].count,
        active: activeServices[0].count
      },
      bookings: {
        total: totalBookings[0].count,
        completed: completedBookings[0].count
      },
      earnings: {
        total: totalEarnings[0].total || 0,
        monthly: monthlyEarnings[0].total || 0
      },
      recentBookings
    });
  } catch (error) {
    console.error('Error fetching seller analytics:', error);
    res.status(500).json({ message: 'Error fetching seller analytics' });
  }
});

module.exports = router;