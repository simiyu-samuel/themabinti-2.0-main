
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, MapPin, Phone } from 'lucide-react';
import axios from 'axios';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const ContactUsPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const apiUrl = 'https://themabinti-main-d4az.onrender.com/api/contact';
      console.log('Submitting form to:', apiUrl, 'with values:', values);
      await axios.post(apiUrl, values);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      form.reset();
    } catch (err: any) {
      console.error('Error submitting form:', err);
      const errorMessage = err.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarTop />
      <NavbarBottom />
      
      <div className="flex-grow bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl opacity-90 mb-2 max-w-3xl mx-auto">
              We'd love to hear from you! Get in touch with our team for any questions, feedback, or support.
            </p>
          </div>
        </div>
        
        <div className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-lg shadow-sm h-full">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-3 rounded-full mr-4">
                        <Mail className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-700">Email Us</h3>
                        <p className="text-gray-600 mt-1">info@themabinti.com</p>
                        <p className="text-gray-600">support@themabinti.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-3 rounded-full mr-4">
                        <Phone className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-700">Call Us</h3>
                        <p className="text-gray-600 mt-1">+254 712 345 678</p>
                        <p className="text-gray-600">+254 798 765 432</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-3 rounded-full mr-4">
                        <MapPin className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-700">Visit Us</h3>
                        <p className="text-gray-600 mt-1">
                          Themabinti Hub,<br />
                          Kimathi Street, 4th Floor,<br />
                          Nairobi, Kenya
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-10">
                    <h3 className="font-semibold text-gray-700 mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                      <a href="#" className="bg-purple-100 p-2 rounded-full text-purple-600 hover:bg-purple-200 transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                      <a href="#" className="bg-purple-100 p-2 rounded-full text-purple-600 hover:bg-purple-200 transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                      <a href="#" className="bg-purple-100 p-2 rounded-full text-purple-600 hover:bg-purple-200 transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john.doe@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+254 712 345 678" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="How can we help you?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please provide details about your inquiry..." 
                                className="min-h-[150px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full md:w-auto bg-purple-500 hover:bg-purple-600"
                      >
                        Send Message
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map Section */}
        <div className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Us</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Visit our office in Nairobi CBD for in-person support and consultations.
              </p>
            </div>
            
            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-md">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8180069578384!2d36.81974706475784!3d-1.2841924359759463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d44d1ce64d%3A0xaad206f45333c725!2sKimathi%20St%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1620392823618!5m2!1sen!2ske" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                title="Themabinti Office Location"
              ></iframe>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find quick answers to common questions about Themabinti services.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I register as a service provider?</h3>
                <p className="text-gray-600">
                  You can register as a service provider by clicking on the "Sign Up" button in the navigation bar, 
                  selecting "Seller" account type, choosing your preferred package, and completing the registration process.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I book an appointment with a service provider?</h3>
                <p className="text-gray-600">
                  You can book an appointment by clicking on the "Book Appointment" button on the service provider's profile, 
                  selecting your preferred date and time, and filling out the booking form.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">What are the benefits of the premium package?</h3>
                <p className="text-gray-600">
                  The premium package offers enhanced visibility on the platform, the ability to upload more photos and videos, 
                  featured listings, and access to the Themabinti community for networking and growth opportunities.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">How can I update my service listing?</h3>
                <p className="text-gray-600">
                  After logging in, navigate to your account dashboard, select the service you want to update, 
                  and use the edit options to modify your service details, pricing, or media.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
