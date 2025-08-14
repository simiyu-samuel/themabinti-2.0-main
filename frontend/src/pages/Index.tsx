import { useState, useEffect } from 'react';
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import ServiceCategorySection from '@/components/ServiceCategorySection';
import BookAppointmentDialog from '@/components/BookAppointmentDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Book, TrendingUp, Users, Star, ArrowRight } from 'lucide-react';
import { serviceCategories } from '@/data/serviceCategories';
import api from '@/config/api';

const Index = () => {
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [servicesByCategory, setServicesByCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalServices: 0,
    totalProviders: 0,
    totalBookings: 0,
    avgRating: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch platform stats
        try {
          const statsResponse = await api.get('/api/analytics/platform-stats');
          setStats(statsResponse.data);
        } catch (statsError) {
          console.error('Error fetching stats:', statsError);
          // Use default stats if API fails
          setStats({
            totalServices: 150,
            totalProviders: 75,
            totalBookings: 300,
            avgRating: 4.5
          });
        }

        // Fetch services by category
        const categoriesWithServices = await Promise.all(
          serviceCategories.map(async (category) => {
            try {
              const response = await api.get(`/api/services/${category.id}`);
              const services = response.data.map((service: any) => ({
                id: service._id,
                name: service.name,
                minPrice: service.minPrice,
                maxPrice: service.maxPrice,
                location: service.location,
                image: service.media?.find((m: any) => m.type === 'image')?.data || 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg',
                whatsapp: service.phoneNumber?.replace(/^\+/, ''),
                category: category.id,
                subcategory: service.subcategory,
                description: service.description,
                rating: 4.5,
                reviewCount: Math.floor(Math.random() * 50) + 5
              }));
              return { ...category, services };
            } catch (err) {
              console.error(`Error fetching services for ${category.id}:`, err);
              return { ...category, services: [] };
            }
          })
        );
        
        setServicesByCategory(categoriesWithServices.filter(category => category.services.length > 0));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavbarTop />
        <NavbarBottom />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <NavbarTop />
      <NavbarBottom />
      
      {/* Hero Section - Redesigned */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Amazing
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Connect with Kenya's finest beauty, health, fashion, and lifestyle professionals
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{stats.totalServices}+</div>
                  <div className="text-sm opacity-80">Services</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{stats.totalProviders}+</div>
                  <div className="text-sm opacity-80">Providers</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{stats.totalBookings}+</div>
                  <div className="text-sm opacity-80">Bookings</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{stats.avgRating}</div>
                  <div className="text-sm opacity-80">Avg Rating</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => setBookDialogOpen(true)}
                size="lg" 
                className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Book className="mr-2 h-5 w-5" />
                Book an Appointment
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-700 px-8 py-4 text-lg font-semibold rounded-full"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>
      
      {/* Main Content */}
      <main id="services" className="flex-grow container mx-auto px-4 py-16">
        {error ? (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
              <div className="text-red-500 text-lg font-semibold mb-2">Oops! Something went wrong</div>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600">
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Service Categories */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Services</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Discover top-rated services from verified professionals across Kenya
                </p>
              </div>
              
              {servicesByCategory.map((category) => (
                <ServiceCategorySection
                  key={category.id}
                  title={category.title}
                  categoryId={category.id}
                  services={category.services}
                />
              ))}
            </div>

            {/* Why Choose Us Section */}
            <section className="py-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Themabinti?</h2>
                <p className="text-xl text-gray-600">Experience the difference with our platform</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
                <div className="text-center group">
                  <div className="bg-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
                  <p className="text-gray-600">All service providers are verified and rated by our community</p>
                </div>
                
                <div className="text-center group">
                  <div className="bg-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
                  <p className="text-gray-600">Top-rated services with customer satisfaction guarantee</p>
                </div>
                
                <div className="text-center group">
                  <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                  <p className="text-gray-600">Book and pay online with our seamless M-Pesa integration</p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      
      {/* Footer - Redesigned */}
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                themabinti
              </h2>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Kenya's premier platform connecting women with quality beauty, fashion, health, and lifestyle services. 
                Empowering both service seekers and providers.
              </p>
              <div className="flex space-x-4">
                {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map((social) => (
                  <a 
                    key={social}
                    href="#" 
                    className="bg-purple-600 hover:bg-purple-500 p-3 rounded-full transition-colors duration-300"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-white rounded-full"></div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-6 text-purple-300">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { href: "/about", text: "About Us" },
                  { href: "/blogs", text: "Blog" },
                  { href: "/contact", text: "Contact" },
                  { href: "/terms", text: "Terms" }
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-gray-300 hover:text-purple-300 transition-colors duration-300 flex items-center group">
                      <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-6 text-purple-300">Contact Info</h3>
              <div className="space-y-3 text-gray-300">
                <p>themabintionline@gmail.com</p>
                <p>+254 712 345 678</p>
                <p>Nairobi, Kenya</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Themabinti. All rights reserved. Made with ❤️ in Kenya.
            </p>
          </div>
        </div>
      </footer>
      
      <BookAppointmentDialog 
        open={bookDialogOpen} 
        onOpenChange={setBookDialogOpen}
      />
    </div>
  );
};

export default Index;