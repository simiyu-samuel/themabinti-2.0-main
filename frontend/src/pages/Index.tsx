import { useState, useEffect } from 'react';
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import ServiceCategorySection from '@/components/ServiceCategorySection';
import BookAppointmentDialog from '@/components/BookAppointmentDialog';
import { Button } from '@/components/ui/button';
import { Book } from 'lucide-react';
import { mockServices } from '@/data/mockServices';
import { serviceCategories } from '@/data/serviceCategories';
import api from '@/config/api';

const Index = () => {
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [servicesByCategory, setServicesByCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
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
                image: service.media.find((m: any) => m.type === 'image')?.data || 'https://via.placeholder.com/300',
                whatsapp: service.phoneNumber.replace(/^\+/, ''), // Remove leading '+' if present
                category: category.id,
                subcategory: service.subcategory,
                description: service.description,
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
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarTop />
      <NavbarBottom />
      
      {/* Hero section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-400 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">themabinti</h1>
          <p className="text-sm md:text-base mb-2 max-w-2xl mx-auto">
            Find the perfect services near you
          </p>
          <Button 
            onClick={() => setBookDialogOpen(true)}
            size="sm" 
            className="bg-white text-purple-700 hover:bg-gray-100"
          >
            <Book className="mr-1 h-4 w-4" />
            Book an Appointment
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Service Categories */}
        {servicesByCategory.map((category) => (
          <ServiceCategorySection
            key={category.id}
            title={category.title}
            categoryId={category.id}
            services={category.services}
          />
        ))}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">themabinti</h2>
              <p className="text-gray-400">
                Your one-stop platform for beauty, fashion, health, and lifestyle services across Kenya.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="/blogs" className="text-gray-400 hover:text-white">Blogs</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Popular Categories</h3>
              <ul className="space-y-2">
                <li><a href="/services/beauty/makeup" className="text-gray-400 hover:text-white">Makeup</a></li>
                <li><a href="/services/hair/braiding" className="text-gray-400 hover:text-white">Hair Braiding</a></li>
                <li><a href="/services/fashion/african" className="text-gray-400 hover:text-white">African Fashion</a></li>
                <li><a href="/services/health/skin-consultation" className="text-gray-400 hover:text-white">Skin Consultation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>themabintionline@gmail.com</li>
              </ul>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  Instagram
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  Twitter
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} themabinti. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Book Appointment Dialog */}
      <BookAppointmentDialog 
        open={bookDialogOpen} 
        onOpenChange={setBookDialogOpen}
        // No serviceId for general booking from homepage
      />
    </div>
  );
};

export default Index;
