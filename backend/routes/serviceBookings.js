const express = require('express');
const router = express.Router();
const ServiceBooking = require('../models/ServiceBooking');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const mpesaService = require('../services/mpesaService');

// Create a service booking with payment
router.post('/', async (req, res) => {
  try {
    const { 
      appointmentId, 
      serviceId, 
      userId, 
      customerName, 
      customerEmail, 
      customerPhone, 
      amount 
    } = req.body;

    // Validate required fields
    if (!appointmentId || !serviceId || !customerName || !customerEmail || !customerPhone || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be provided' 
      });
    }

    // Validate that appointment and service exist
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found' 
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ 
        success: false, 
        message: 'Service not found' 
      });
    }

    // Validate amount is within service price range
    if (amount < service.minPrice || amount > service.maxPrice) {
      return res.status(400).json({ 
        success: false, 
        message: `Amount must be between ${service.minPrice} and ${service.maxPrice}` 
      });
    }

    // Create service booking
    const serviceBooking = new ServiceBooking({
      appointmentId,
      serviceId,
      userId,
      customerName,
      customerEmail,
      customerPhone,
      amount,
      paymentStatus: 'pending'
    });

    await serviceBooking.save();

    // Initiate M-Pesa STK Push
    try {
      const mpesaResult = await mpesaService.initiateServicePayment(
        customerPhone,
        amount,
        serviceBooking._id.toString(),
        service.name
      );

      if (mpesaResult.success) {
        // Update booking with checkout request ID
        serviceBooking.mpesaCheckoutRequestId = mpesaResult.checkoutRequestId;
        await serviceBooking.save();

        res.status(201).json({
          success: true,
          message: 'Service booking created and payment initiated',
          bookingId: serviceBooking._id,
          checkoutRequestId: mpesaResult.checkoutRequestId
        });
      } else {
        // Update booking status to failed
        serviceBooking.paymentStatus = 'failed';
        await serviceBooking.save();

        res.status(400).json({
          success: false,
          message: mpesaResult.message || 'Failed to initiate payment'
        });
      }
    } catch (mpesaError) {
      console.error('M-Pesa initiation error:', mpesaError);
      
      // Update booking status to failed
      serviceBooking.paymentStatus = 'failed';
      await serviceBooking.save();

      res.status(500).json({
        success: false,
        message: 'Failed to initiate payment'
      });
    }

  } catch (error) {
    console.error('Service booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating service booking', 
      error: error.message 
    });
  }
});

// Get booking status
router.get('/:bookingId/status', async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await ServiceBooking.findById(bookingId)
      .populate('serviceId', 'name')
      .populate('appointmentId', 'date time');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // If payment is still pending and we have a checkout request ID, check M-Pesa status
    if (booking.paymentStatus === 'pending' && booking.mpesaCheckoutRequestId) {
      try {
        const mpesaStatus = await mpesaService.checkServicePaymentStatus(booking.mpesaCheckoutRequestId);
        
        if (mpesaStatus.status === 'success') {
          booking.paymentStatus = 'completed';
          booking.transactionDate = new Date();
          await booking.save();
        } else if (mpesaStatus.status === 'failed') {
          booking.paymentStatus = 'failed';
          await booking.save();
        }
      } catch (statusError) {
        console.error('Error checking M-Pesa status:', statusError);
      }
    }

    res.json({
      success: true,
      booking: {
        id: booking._id,
        paymentStatus: booking.paymentStatus,
        amount: booking.amount,
        serviceName: booking.serviceId.name,
        appointmentDate: booking.appointmentId.date,
        appointmentTime: booking.appointmentId.time,
        mpesaReceiptNumber: booking.mpesaReceiptNumber,
        transactionDate: booking.transactionDate
      }
    });

  } catch (error) {
    console.error('Error fetching booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking status'
    });
  }
});

// Get user's bookings
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await ServiceBooking.find({ userId })
      .populate('serviceId', 'name')
      .populate('appointmentId', 'date time')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings: bookings.map(booking => ({
        id: booking._id,
        paymentStatus: booking.paymentStatus,
        amount: booking.amount,
        serviceName: booking.serviceId.name,
        appointmentDate: booking.appointmentId.date,
        appointmentTime: booking.appointmentId.time,
        mpesaReceiptNumber: booking.mpesaReceiptNumber,
        transactionDate: booking.transactionDate,
        createdAt: booking.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
});

module.exports = router;