import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar, Clock, User, Mail, Phone, CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import api from '@/config/api';

interface PaymentState {
  appointmentId: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  appointmentDate: Date;
  appointmentTime: string;
}

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PaymentState;

  const [service, setService] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!state) {
      toast.error('Invalid payment session');
      navigate('/');
      return;
    }

    fetchServiceDetails();
  }, [state, navigate]);

  const fetchServiceDetails = async () => {
    try {
      const response = await api.get(`/api/service/${state.serviceId}`);
      setService(response.data);
      // Set default amount to minimum price
      setAmount(response.data.minPrice);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching service details:', error);
      toast.error('Failed to load service details');
      navigate('/');
    }
  };

  const handlePayment = async () => {
    if (!amount || amount < service.minPrice || amount > service.maxPrice) {
      toast.error(`Amount must be between ${service.minPrice} and ${service.maxPrice} KSh`);
      return;
    }

    setPaymentLoading(true);
    setPaymentStatus('processing');

    try {
      const response = await api.post('/api/service-bookings', {
        appointmentId: state.appointmentId,
        serviceId: state.serviceId,
        customerName: state.customerName,
        customerEmail: state.customerEmail,
        customerPhone: state.customerPhone,
        amount: amount
      });

      if (response.data.success) {
        setBookingId(response.data.bookingId);
        toast.success('Payment initiated! Please check your phone for M-Pesa prompt.');
        
        // Start polling for payment status
        pollPaymentStatus(response.data.bookingId);
      } else {
        throw new Error(response.data.message || 'Failed to initiate payment');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  const pollPaymentStatus = async (bookingId: string) => {
    const maxAttempts = 30; // Poll for 5 minutes (30 * 10 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await api.get(`/api/service-bookings/${bookingId}/status`);
        const { paymentStatus: status } = response.data.booking;

        if (status === 'completed') {
          setPaymentStatus('success');
          toast.success('Payment completed successfully!');
          return;
        } else if (status === 'failed') {
          setPaymentStatus('failed');
          toast.error('Payment failed. Please try again.');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          setPaymentStatus('failed');
          toast.error('Payment timeout. Please check your M-Pesa messages.');
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000);
        } else {
          setPaymentStatus('failed');
          toast.error('Unable to verify payment status.');
        }
      }
    };

    poll();
  };

  const handleBackToServices = () => {
    navigate('/all-services');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavbarTop />
        <NavbarBottom />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarTop />
      <NavbarBottom />
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Booking</h1>
            <p className="text-gray-600">Review your appointment details and proceed with payment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Appointment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Appointment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Customer:</span>
                    <span className="ml-2 font-medium">{state.customerName}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="ml-2">{state.customerEmail}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="ml-2">{state.customerPhone}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Date:</span>
                    <span className="ml-2 font-medium">
                      {format(new Date(state.appointmentDate), 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Time:</span>
                    <span className="ml-2 font-medium">{state.appointmentTime}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Service Details</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium">{service?.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">{service?.location}</p>
                    <div className="mt-2">
                      <Badge variant="outline">
                        {service?.category} - {service?.subcategory?.split('/').pop()?.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Details
                </CardTitle>
                <CardDescription>
                  Pay securely using M-Pesa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {paymentStatus === 'idle' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (KSh)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        min={service?.minPrice}
                        max={service?.maxPrice}
                        placeholder="Enter amount"
                      />
                      <p className="text-xs text-gray-500">
                        Price range: {service?.minPrice?.toLocaleString()} - {service?.maxPrice?.toLocaleString()} KSh
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Payment Instructions</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Click "Pay with M-Pesa" to initiate payment</li>
                        <li>• You'll receive an STK push on your phone</li>
                        <li>• Enter your M-Pesa PIN to complete payment</li>
                        <li>• You'll receive a confirmation SMS</li>
                      </ul>
                    </div>

                    <Button 
                      onClick={handlePayment}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={paymentLoading}
                    >
                      {paymentLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Initiating Payment...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay {amount?.toLocaleString()} KSh with M-Pesa
                        </>
                      )}
                    </Button>
                  </>
                )}

                {paymentStatus === 'processing' && (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
                    <h3 className="text-lg font-medium mb-2">Processing Payment</h3>
                    <p className="text-gray-600 mb-4">
                      Please check your phone for the M-Pesa prompt and enter your PIN to complete the payment.
                    </p>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        This may take a few moments. Please don't close this page.
                      </p>
                    </div>
                  </div>
                )}

                {paymentStatus === 'success' && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-medium mb-2 text-green-800">Payment Successful!</h3>
                    <p className="text-gray-600 mb-6">
                      Your appointment has been booked and payment confirmed. You'll receive a confirmation email shortly.
                    </p>
                    <Button onClick={handleBackToServices} className="w-full">
                      Back to Services
                    </Button>
                  </div>
                )}

                {paymentStatus === 'failed' && (
                  <div className="text-center py-8">
                    <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                    <h3 className="text-lg font-medium mb-2 text-red-800">Payment Failed</h3>
                    <p className="text-gray-600 mb-6">
                      There was an issue processing your payment. Please try again or contact support.
                    </p>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => {
                          setPaymentStatus('idle');
                          setBookingId(null);
                        }}
                        className="w-full"
                      >
                        Try Again
                      </Button>
                      <Button 
                        onClick={handleBackToServices}
                        variant="outline"
                        className="w-full"
                      >
                        Back to Services
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;