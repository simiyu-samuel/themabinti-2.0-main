import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import api from '@/config/api';
import { useAuth } from '@/hooks/useAuth';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  paymentPhone: z.string().min(10, 'Please enter a valid M-Pesa phone number').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  // If it's a seller (has package in URL), paymentPhone is required
  const searchParams = new URLSearchParams(window.location.search);
  const accountType = searchParams.get('type') || 'buyer';
  if (accountType === 'seller') {
    return data.paymentPhone && data.paymentPhone.length >= 10;
  }
  return true;
}, {
  message: "M-Pesa phone number is required for sellers",
  path: ["paymentPhone"],
});

const SignUpForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  
  // Get account type and package from URL params
  const searchParams = new URLSearchParams(location.search);
  const accountType = searchParams.get('type') || 'buyer';
  const packageId = searchParams.get('package') || '';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      paymentPhone: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Poll payment status for sellers
  const pollPaymentStatus = async (checkoutRequestId: string) => {
    const maxAttempts = 30; // Poll for 5 minutes
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await api.post('/api/check-seller-payment', {
          checkoutRequestId
        });

        if (response.data.success) {
          setPaymentStatus('success');
          // Use auth context to handle login
          login(response.data.token, response.data.user);
          toast.success('Registration completed successfully!');
          navigate('/');
          return;
        } else if (response.data.status === 'pending') {
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 10000); // Poll every 10 seconds
          } else {
            setPaymentStatus('failed');
            toast.error('Payment timeout. Please try again.');
          }
        } else {
          setPaymentStatus('failed');
          toast.error(response.data.message || 'Payment failed');
        }
      } catch (error: any) {
        console.error('Error checking payment status:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000);
        } else {
          setPaymentStatus('failed');
          toast.error('Unable to verify payment status');
        }
      }
    };

    poll();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Combine firstName and lastName into userName
      const userName = `${values.firstName} ${values.lastName}`;
      
      // Clean phoneNumber: add leading '+' if missing and remove non-digits
      let cleanedPhoneNumber = values.phoneNumber.replace(/[^\d+]/g, '');
      if (!cleanedPhoneNumber.startsWith('+')) {
        cleanedPhoneNumber = `+${cleanedPhoneNumber}`; // Assume international format
      }

      // Validate cleaned phoneNumber
      if (!/^\+?\d{10,15}$/.test(cleanedPhoneNumber)) {
        throw new Error('Invalid phone number format after cleaning');
      }

      // Clean payment phone for sellers
      let cleanedPaymentPhone = '';
      if (accountType === 'seller' && values.paymentPhone) {
        cleanedPaymentPhone = values.paymentPhone.replace(/[^\d+]/g, '');
        if (!cleanedPaymentPhone.startsWith('+')) {
          cleanedPaymentPhone = `+${cleanedPaymentPhone}`;
        }
        if (!/^\+?\d{10,15}$/.test(cleanedPaymentPhone)) {
          throw new Error('Invalid M-Pesa phone number format');
        }
      }

      // Prepare data for backend
      const userData = {
        userName,
        email: values.email,
        phoneNumber: cleanedPhoneNumber,
        paymentPhone: cleanedPaymentPhone,
        password: values.password,
        accountType,
        ...(accountType === 'seller' && { packageId }),
      };

      console.log('Sending register request:', userData); // Debug log

      // Send POST request to backend
      const response = await api.post('/api/register', userData);
      
      if (response.data.requiresPayment) {
        // Seller registration requires payment
        setPaymentStatus('processing');
        setCheckoutRequestId(response.data.checkoutRequestId);
        toast.success('Payment initiated! Please check your phone for M-Pesa prompt.');
        
        // Start polling for payment status
        pollPaymentStatus(response.data.checkoutRequestId);
      } else {
        // Buyer registration completed immediately
        if (response.data.token) {
          login(response.data.token, response.data.user);
          toast.success('Account created successfully!');
          navigate('/');
        } else {
          toast.success('Account created successfully! Please log in to continue.');
          navigate('/signin');
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to create account. Please try again.';
      toast.error(message);
      setPaymentStatus('failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset payment status and try again
  const handleRetryPayment = () => {
    setPaymentStatus('idle');
    setCheckoutRequestId(null);
  };

  if (paymentStatus === 'processing') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md">
        <Card className="border shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Payment Processing</CardTitle>
            <CardDescription>
              Complete your M-Pesa payment to finish registration
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Processing Payment</h3>
            <p className="text-gray-600 mb-4">
              Please check your phone for the M-Pesa prompt and enter your PIN to complete the payment.
            </p>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                This may take a few moments. Please don't close this page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md">
        <Card className="border shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-600">Registration Successful!</CardTitle>
            <CardDescription>
              Your payment has been confirmed and your account is now active
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="text-green-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Welcome to Themabinti!</h3>
            <p className="text-gray-600 mb-6">
              You can now start posting your services and connecting with clients.
            </p>
            <Button onClick={() => navigate('/')} className="w-full bg-purple-500 hover:bg-purple-600">
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md">
        <Card className="border shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">Payment Failed</CardTitle>
            <CardDescription>
              There was an issue processing your payment
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Registration Incomplete</h3>
            <p className="text-gray-600 mb-6">
              Your payment could not be processed. Please try again or contact support.
            </p>
            <div className="space-y-3">
              <Button onClick={handleRetryPayment} className="w-full bg-purple-500 hover:bg-purple-600">
                Try Again
              </Button>
              <Button onClick={() => navigate('/contact')} variant="outline" className="w-full">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card className="border shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create your account</CardTitle>
          <CardDescription className="text-center">
            {accountType === 'seller' 
              ? `Register as a seller with the ${packageId} package` 
              : 'Enter your details to create a buyer account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="0712345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {accountType === 'seller' && (
                <FormField
                  control={form.control}
                  name="paymentPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>M-Pesa Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="0712345678" {...field} />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500">
                        This number will be used for package payment via M-Pesa
                      </p>
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="********" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="********" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {accountType === 'seller' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Payment Required</h4>
                  <p className="text-sm text-blue-700">
                    You'll be prompted to pay for your {packageId} package (Ksh {
                      packageId === 'basic' ? '800' : 
                      packageId === 'standard' ? '1,500' : 
                      '2,500'
                    }) via M-Pesa after clicking "Create Account".
                  </p>
                </div>
              )}
              
              <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : accountType === 'seller' ? 'Create Account & Pay' : 'Create Account'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            By signing up, you agree to our{' '}
            <a href="/terms" className="text-purple-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-purple-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpForm;
