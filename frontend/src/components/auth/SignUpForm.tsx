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
import axios from 'axios';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SignUpForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      password: '',
      confirmPassword: '',
    },
  });

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

      // Prepare data for backend
      const userData = {
        userName,
        email: values.email,
        phoneNumber: cleanedPhoneNumber,
        password: values.password,
        accountType,
        ...(accountType === 'seller' && { packageId }),
      };

      console.log('Sending register request:', userData); // Debug log

      // Send POST request to backend
      const response = await axios.post('https://themabinti-main-d4az.onrender.com/api/register', userData);
      
      // Remove automatic login - don't store token and user data
      // localStorage.setItem('token', response.data.token);
      // localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success('Account created successfully! Please log in to continue.');
      navigate('/signin'); // Redirect to login page instead of home
    } catch (error: any) {
      console.error('Signup error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to create account. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              
              <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
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
