import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ServiceProps } from '@/components/ServiceCard';
import ServiceCard from '@/components/ServiceCard';
import { Loader2 } from 'lucide-react';
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';

const LocationServices = () => {
  const [services, setServices] = useState<ServiceProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { location } = useParams<{ location: string }>();
  const decodedLocation = location ? decodeURIComponent(location) : '';

  useEffect(() => {
    const fetchServicesByLocation = async () => {
      try {
        setLoading(true);
        const apiUrl = 'https://themabinti-main-d4az.onrender.com/api/services';
        console.log('Fetching from:', apiUrl, 'with location:', decodedLocation);
        const response = await axios.get(apiUrl, {
          params: { location: decodedLocation },
        });

        console.log('Raw API response:', response.data);

        // Normalize response to always be an array
        const data = Array.isArray(response.data) ? response.data : [response.data];

        const formattedServices: ServiceProps[] = data.map((service: any) => ({
          id: service._id,
          name: service.name,
          minPrice: service.minPrice,
          maxPrice: service.maxPrice,
          location: service.location,
          image: service.media.find((m: any) => m.type === 'image')?.data || 'https://via.placeholder.com/300',
          whatsapp: service.phoneNumber?.replace(/^\+/, '') || '',
          category: service.category,
          subcategory: service.subcategory,
          description: service.description,
        }));

        setServices(formattedServices);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching services:', err);
        const errorMessage = err.response?.data?.message || 'Failed to load services. Please try again.';
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (decodedLocation) {
      fetchServicesByLocation();
    } else {
      setError('No location provided.');
      setLoading(false);
    }
  }, [decodedLocation]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarTop />
      <NavbarBottom />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          Services in {decodedLocation || 'Unknown Location'}
        </h1>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-red-50 rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No services found in {decodedLocation || 'this location'}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </main>
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
                <li>info@themabinti.com</li>
                <li>+254 700 000 000</li>
                <li>Nairobi, Kenya</li>
              </ul>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} themabinti. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LocationServices;
