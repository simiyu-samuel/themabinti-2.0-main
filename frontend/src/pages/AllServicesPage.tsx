import { useState, useEffect } from 'react';
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import ServiceCard from '@/components/ServiceCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ServiceProps } from '@/components/ServiceCard';
import api from '@/config/api';

const AllServicesPage = () => {
  const [services, setServices] = useState<ServiceProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await api.get('api/services');
        
        // Format the response data to match ServiceProps interface
        const formattedServices: ServiceProps[] = response.data.map((service: any) => ({
          id: service._id,
          name: service.name,
          minPrice: service.minPrice,
          maxPrice: service.maxPrice,
          location: service.location,
          image: service.media?.find((m: any) => m.type === 'image')?.data || 'https://via.placeholder.com/300',
          whatsapp: service.phoneNumber?.replace(/^\+/, '') || '',
          category: service.category,
          subcategory: service.subcategory,
          description: service.description,
        }));
        
        setServices(formattedServices);
        setError(null);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarTop />
      <NavbarBottom />
      
      <div className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">All Services</h1>
            <p className="text-gray-600 max-w-4xl">
              Browse our comprehensive list of beauty, fashion, health, and lifestyle services available across Kenya.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">No services found</h3>
              <p className="text-gray-500 mb-6">There are no services available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllServicesPage;
