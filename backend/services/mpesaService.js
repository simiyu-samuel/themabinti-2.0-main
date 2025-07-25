const axios = require('axios');
const crypto = require('crypto');

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.passkey = process.env.MPESA_PASSKEY;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.env = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';
    this.baseUrl = this.env === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';
  }

  // Generate access token
  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      const response = await axios.get(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
          Authorization: `Basic ${auth}`
        }
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  // Generate timestamp
  getTimestamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  // Generate password
  generatePassword() {
    const timestamp = this.getTimestamp();
    const str = this.shortcode + this.passkey + timestamp;
    return Buffer.from(str).toString('base64');
  }

  // Initiate STK Push
  async initiateSTKPush(phoneNumber, amount, packageId, packageName) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword();

      // Format phone number (ensure it starts with 254)
      const formattedPhone = phoneNumber.startsWith('254') ? phoneNumber : `254${phoneNumber.replace(/^0/, '')}`;

      const payload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: this.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.BASE_URL}/api/mpesa/callback`,
        AccountReference: `PKG-${packageId}`,
        TransactionDesc: `Payment for ${packageName} package`
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Store the checkout request ID for status checking
      const checkoutRequestId = response.data.CheckoutRequestID;
      await this.storePaymentRequest(checkoutRequestId, {
        packageId,
        amount,
        phoneNumber: formattedPhone,
        timestamp,
        status: 'pending'
      });

      return {
        success: true,
        checkoutRequestId,
        message: 'STK Push initiated successfully'
      };
    } catch (error) {
      console.error('STK Push initiation error:', error.response?.data || error);
      throw new Error(error.response?.data?.errorMessage || 'Failed to initiate payment');
    }
  }

  // Initiate STK Push for seller package payment
  async initiateSellerPackagePayment(phoneNumber, amount, packageId, userData) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword();

      // Format phone number (ensure it starts with 254)
      const formattedPhone = phoneNumber.startsWith('254') ? phoneNumber : `254${phoneNumber.replace(/^0/, '')}`;

      const payload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: this.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.BASE_URL}/api/mpesa/seller-package-callback`,
        AccountReference: `PKG-${packageId}`,
        TransactionDesc: `Payment for ${packageId} seller package`
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Store the checkout request ID for status checking
      const checkoutRequestId = response.data.CheckoutRequestID;
      await this.storeSellerPackagePaymentRequest(checkoutRequestId, {
        packageId,
        amount,
        phoneNumber: formattedPhone,
        userEmail: userData.email,
        userData,
        timestamp,
        status: 'pending'
      });

      return {
        success: true,
        checkoutRequestId,
        message: 'STK Push initiated successfully'
      };
    } catch (error) {
      console.error('Seller package STK Push initiation error:', error.response?.data || error);
      throw new Error(error.response?.data?.errorMessage || 'Failed to initiate seller package payment');
    }
  }

  // Store seller package payment request in database
  async storeSellerPackagePaymentRequest(checkoutRequestId, paymentData) {
    try {
      const SellerPackagePayment = require('../models/SellerPackagePayment');
      
      const payment = new SellerPackagePayment({
        checkoutRequestId,
        packageId: paymentData.packageId,
        amount: paymentData.amount,
        phoneNumber: paymentData.phoneNumber,
        userEmail: paymentData.userEmail,
        userData: paymentData.userData,
        paymentStatus: 'pending'
      });

      await payment.save();
      console.log('Seller package payment request stored:', checkoutRequestId);
    } catch (error) {
      console.error('Error storing seller package payment request:', error);
      throw new Error('Failed to store seller package payment request');
    }
  }

  // Check seller package payment status
  async checkSellerPackagePaymentStatus(checkoutRequestId) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword();

      const payload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const resultCode = response.data.ResultCode;
      let status = 'pending';

      if (resultCode === 0) {
        status = 'success';
      } else if (resultCode === 1032) {
        status = 'failed';
      }

      return { status };
    } catch (error) {
      console.error('Seller package payment status check error:', error.response?.data || error);
      throw new Error('Failed to check seller package payment status');
    }
  }

  // Handle M-Pesa callback for seller package payments
  async handleSellerPackageCallback(callbackData) {
    try {
      const { Body: { stkCallback: { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } } } = callbackData;
      
      let status = 'failed';
      let transactionData = null;

      if (ResultCode === 0 && CallbackMetadata) {
        status = 'success';
        // Extract transaction details
        transactionData = {
          checkoutRequestId: CheckoutRequestID,
          mpesaReceiptNumber: CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber')?.Value,
          transactionDate: CallbackMetadata.Item.find(item => item.Name === 'TransactionDate')?.Value,
          amount: CallbackMetadata.Item.find(item => item.Name === 'Amount')?.Value,
          phoneNumber: CallbackMetadata.Item.find(item => item.Name === 'PhoneNumber')?.Value
        };
      }

      // Update seller package payment status
      await this.updateSellerPackagePaymentStatus(CheckoutRequestID, status, transactionData);
      
      return { success: true };
    } catch (error) {
      console.error('Seller package callback handling error:', error);
      throw new Error('Failed to process seller package callback');
    }
  }

  // Update seller package payment status
  async updateSellerPackagePaymentStatus(checkoutRequestId, status, transactionData = null) {
    try {
      const SellerPackagePayment = require('../models/SellerPackagePayment');
      
      const updateData = {
        paymentStatus: status === 'success' ? 'completed' : 'failed',
        updatedAt: new Date()
      };

      if (transactionData && status === 'success') {
        updateData.mpesaReceiptNumber = transactionData.mpesaReceiptNumber;
        updateData.transactionDate = new Date(transactionData.transactionDate);
      }

      await SellerPackagePayment.findOneAndUpdate(
        { checkoutRequestId },
        updateData
      );

      console.log('Seller package payment status updated:', { checkoutRequestId, status });
    } catch (error) {
      console.error('Error updating seller package payment status:', error);
      throw new Error('Failed to update seller package payment status');
    }
  }

  // Initiate STK Push for service payment
  async initiateServicePayment(phoneNumber, amount, bookingId, serviceName) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword();

      // Format phone number (ensure it starts with 254)
      const formattedPhone = phoneNumber.startsWith('254') ? phoneNumber : `254${phoneNumber.replace(/^0/, '')}`;

      const payload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: this.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.BASE_URL}/api/mpesa/service-callback`,
        AccountReference: `SVC-${bookingId}`,
        TransactionDesc: `Payment for ${serviceName}`
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Store the checkout request ID for status checking
      const checkoutRequestId = response.data.CheckoutRequestID;
      await this.storeServicePaymentRequest(checkoutRequestId, {
        bookingId,
        amount,
        phoneNumber: formattedPhone,
        timestamp,
        status: 'pending'
      });

      return {
        success: true,
        checkoutRequestId,
        message: 'STK Push initiated successfully'
      };
    } catch (error) {
      console.error('Service STK Push initiation error:', error.response?.data || error);
      throw new Error(error.response?.data?.errorMessage || 'Failed to initiate service payment');
    }
  }

  // Store service payment request in database
  async storeServicePaymentRequest(checkoutRequestId, paymentData) {
    try {
      // For now, we'll store in memory or you can create a separate collection
      // This is a simplified implementation
      console.log('Storing service payment request:', {
        checkoutRequestId,
        ...paymentData
      });
    } catch (error) {
      console.error('Error storing service payment request:', error);
      throw new Error('Failed to store service payment request');
    }
  }

  // Check service payment status
  async checkServicePaymentStatus(checkoutRequestId) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword();

      const payload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const resultCode = response.data.ResultCode;
      let status = 'pending';

      if (resultCode === 0) {
        status = 'success';
      } else if (resultCode === 1032) {
        status = 'failed';
      }

      return { status };
    } catch (error) {
      console.error('Service payment status check error:', error.response?.data || error);
      throw new Error('Failed to check service payment status');
    }
  }

  // Handle M-Pesa callback for service payments
  async handleServiceCallback(callbackData) {
    try {
      const { Body: { stkCallback: { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } } } = callbackData;
      
      let status = 'failed';
      let transactionData = null;

      if (ResultCode === 0 && CallbackMetadata) {
        status = 'success';
        // Extract transaction details
        transactionData = {
          checkoutRequestId: CheckoutRequestID,
          mpesaReceiptNumber: CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber')?.Value,
          transactionDate: CallbackMetadata.Item.find(item => item.Name === 'TransactionDate')?.Value,
          amount: CallbackMetadata.Item.find(item => item.Name === 'Amount')?.Value,
          phoneNumber: CallbackMetadata.Item.find(item => item.Name === 'PhoneNumber')?.Value
        };
      }

      // Update service booking status
      await this.updateServiceBookingStatus(CheckoutRequestID, status, transactionData);
      
      return { success: true };
    } catch (error) {
      console.error('Service callback handling error:', error);
      throw new Error('Failed to process service callback');
    }
  }

  // Update service booking status
  async updateServiceBookingStatus(checkoutRequestId, status, transactionData = null) {
    try {
      const ServiceBooking = require('../models/ServiceBooking');
      
      const updateData = {
        paymentStatus: status === 'success' ? 'completed' : 'failed',
        updatedAt: new Date()
      };

      if (transactionData && status === 'success') {
        updateData.mpesaReceiptNumber = transactionData.mpesaReceiptNumber;
        updateData.transactionDate = new Date(transactionData.transactionDate);
      }

      await ServiceBooking.findOneAndUpdate(
        { mpesaCheckoutRequestId: checkoutRequestId },
        updateData
      );

      console.log('Service booking status updated:', { checkoutRequestId, status });
    } catch (error) {
      console.error('Error updating service booking status:', error);
      throw new Error('Failed to update service booking status');
    }
  }

  // Store payment request in database
  async storePaymentRequest(checkoutRequestId, paymentData) {
    try {
      const db = require('../models/db');
      const query = `
        INSERT INTO mpesa_payments 
        (checkout_request_id, package_id, amount, phone_number, timestamp, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await db.query(query, [
        checkoutRequestId,
        paymentData.packageId,
        paymentData.amount,
        paymentData.phoneNumber,
        paymentData.timestamp,
        paymentData.status
      ]);
    } catch (error) {
      console.error('Error storing payment request:', error);
      throw new Error('Failed to store payment request');
    }
  }

  // Check payment status
  async checkPaymentStatus(checkoutRequestId) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword();

      const payload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const resultCode = response.data.ResultCode;
      let status = 'pending';

      if (resultCode === 0) {
        status = 'success';
        await this.updatePaymentStatus(checkoutRequestId, 'success');
      } else if (resultCode === 1032) {
        status = 'failed';
        await this.updatePaymentStatus(checkoutRequestId, 'failed');
      }

      return { status };
    } catch (error) {
      console.error('Payment status check error:', error.response?.data || error);
      throw new Error('Failed to check payment status');
    }
  }

  // Update payment status in database
  async updatePaymentStatus(checkoutRequestId, status) {
    try {
      const db = require('../models/db');
      const query = `
        UPDATE mpesa_payments 
        SET status = ?, updated_at = NOW()
        WHERE checkout_request_id = ?
      `;
      await db.query(query, [status, checkoutRequestId]);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new Error('Failed to update payment status');
    }
  }

  // Handle M-Pesa callback
  async handleCallback(callbackData) {
    try {
      const { Body: { stkCallback: { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } } } = callbackData;
      
      let status = 'failed';
      if (ResultCode === 0 && CallbackMetadata) {
        status = 'success';
        // Store transaction details
        const transactionData = {
          checkoutRequestId: CheckoutRequestID,
          mpesaReceiptNumber: CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber')?.Value,
          transactionDate: CallbackMetadata.Item.find(item => item.Name === 'TransactionDate')?.Value,
          amount: CallbackMetadata.Item.find(item => item.Name === 'Amount')?.Value,
          phoneNumber: CallbackMetadata.Item.find(item => item.Name === 'PhoneNumber')?.Value
        };
        await this.storeTransactionDetails(transactionData);
      }

      await this.updatePaymentStatus(CheckoutRequestID, status);
      return { success: true };
    } catch (error) {
      console.error('Callback handling error:', error);
      throw new Error('Failed to process callback');
    }
  }

  // Store transaction details
  async storeTransactionDetails(transactionData) {
    try {
      const db = require('../models/db');
      const query = `
        UPDATE mpesa_payments 
        SET 
          mpesa_receipt_number = ?,
          transaction_date = ?,
          transaction_amount = ?,
          updated_at = NOW()
        WHERE checkout_request_id = ?
      `;
      await db.query(query, [
        transactionData.mpesaReceiptNumber,
        transactionData.transactionDate,
        transactionData.amount,
        transactionData.checkoutRequestId
      ]);
    } catch (error) {
      console.error('Error storing transaction details:', error);
      throw new Error('Failed to store transaction details');
    }
  }
}

module.exports = new MpesaService(); 