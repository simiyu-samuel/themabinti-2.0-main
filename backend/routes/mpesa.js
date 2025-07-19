const express = require('express');
const router = express.Router();
const mpesaService = require('../services/mpesaService');

// Initiate M-Pesa payment
router.post('/initiate', async (req, res) => {
  try {
    const { amount, phoneNumber, packageId, packageName } = req.body;

    // Validate required fields
    if (!amount || !phoneNumber || !packageId || !packageName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate amount
    if (amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Validate phone number
    const phoneRegex = /^(?:254|\+254|0)?([7-9]{1}[0-9]{8})$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    const result = await mpesaService.initiateSTKPush(phoneNumber, amount, packageId, packageName);
    res.json(result);
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate payment'
    });
  }
});

// Check payment status
router.get('/status/:packageId', async (req, res) => {
  try {
    const { packageId } = req.params;
    const { timestamp } = req.query;

    if (!timestamp) {
      return res.status(400).json({
        success: false,
        message: 'Timestamp is required'
      });
    }

    // Get the checkout request ID from the database
    const db = require('../models/db');
    const [payment] = await db.query(
      'SELECT checkout_request_id FROM mpesa_payments WHERE package_id = ? AND timestamp = ? AND status = ?',
      [packageId, timestamp, 'pending']
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment request not found'
      });
    }

    const result = await mpesaService.checkPaymentStatus(payment.checkout_request_id);
    res.json(result);
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check payment status'
    });
  }
});

// M-Pesa callback URL
router.post('/callback', async (req, res) => {
  try {
    const result = await mpesaService.handleCallback(req.body);
    res.json(result);
  } catch (error) {
    console.error('Callback error:', error);
    // Still return 200 to acknowledge receipt of callback
    res.json({ success: false, message: error.message });
  }
});

// M-Pesa callback URL for service payments
router.post('/service-callback', async (req, res) => {
  try {
    const result = await mpesaService.handleServiceCallback(req.body);
    res.json(result);
  } catch (error) {
    console.error('Service callback error:', error);
    // Still return 200 to acknowledge receipt of callback
    res.json({ success: false, message: error.message });
  }
});

module.exports = router;