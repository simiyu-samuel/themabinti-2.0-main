import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, MapPin } from 'lucide-react';
import { ServiceProps } from '@/components/ServiceCard';
import { serviceCategories } from '@/data/serviceCategories';
import api from '@/config/api';

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<ServiceProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Helper function to get category title from ID
  const getCategoryTitle = (categoryId: string) => {
    const category = serviceCategories.find(cat => cat.id === categoryId);
    return category ? category.title : categoryId;
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        console.log('Fetching service with ID:', id);
        const response = await api.get('api/services');
        console.log('API Response:', response.data);
        
        // Find the specific service by ID
        const serviceData = response.data.find((service: any) => service._id === id);
        
        if (!serviceData) {
          throw new Error('Service not found');
        }
        
        const images = serviceData.media
          .filter((m: any) => m.type === 'image')
          .map((m: any) => m.data);
        
        const formattedService: ServiceProps = {
          id: serviceData._id,
          name: serviceData.name,
          minPrice: serviceData.minPrice,
          maxPrice: serviceData.maxPrice,
          location: serviceData.location,
          image: images[0] || 'https://via.placeholder.com/300',
          images: images,
          whatsapp: serviceData.phoneNumber?.replace(/^\+/, '') || '',
          category: serviceData.category,
          subcategory: serviceData.subcategory,
          description: serviceData.description,
        };
        
        setService(formattedService);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service details. Please try again.');
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  const handleBookViaWhatsApp = () => {
    if (!service?.whatsapp) {
      alert('Phone number not available for this service.');
      return;
    }

    // Format phone number: remove any spaces, dashes, or other non-digit characters
    const formattedNumber = service.whatsapp.replace(/\D/g, '');
    
    // Create a default message
    const message = encodeURIComponent(
      `Hello! I'm interested in your service "${service.name}" (${service.minPrice.toLocaleString()} - ${service.maxPrice.toLocaleString()} Ksh). ` +
      `Could you please provide more information?`
    );

    // Open WhatsApp with the formatted number and message
    window.open(`https://wa.me/${formattedNumber}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavbarTop />
        <NavbarBottom />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavbarTop />
        <NavbarBottom />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Service</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link to="/">
              <Button className="bg-purple-500 hover:bg-purple-600">
                Back to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavbarTop />
        <NavbarBottom />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h2>
            <p className="text-gray-600 mb-6">
              The service you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/">
              <Button className="bg-purple-500 hover:bg-purple-600">
                Back to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarTop />
      <NavbarBottom />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column - Images & Media */}
          <div className="w-full md:w-7/12">
            <div className="mb-6">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Link to="/" className="hover:text-purple-500">Home</Link>
                <span className="mx-2">/</span>
                <Link to={`/category/${service.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-purple-500">
                  {getCategoryTitle(service.category)}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-700">{service.name}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{service.name}</h1>
              
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{service.location}</span>
              </div>
            </div>

            <Tabs defaultValue="gallery" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
              </TabsList>
              
              <TabsContent value="gallery">
                <div className="grid grid-cols-1 gap-4">
                  <div className="rounded-lg overflow-hidden h-80">
                    <img 
                      src={service.images[selectedImageIndex]} 
                      alt={`${service.name} - Image ${selectedImageIndex + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {service.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                      {service.images.map((img, idx) => (
                        <div 
                          key={idx} 
                          className={`rounded-lg overflow-hidden h-32 cursor-pointer transition-all ${
                            selectedImageIndex === idx 
                              ? 'ring-2 ring-purple-500 ring-offset-2' 
                              : 'hover:opacity-80'
                          }`}
                          onClick={() => setSelectedImageIndex(idx)}
                        >
                          <img 
                            src={img} 
                            alt={`${service.name} - Thumbnail ${idx + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="description">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Service Description</h3>
                    <p className="text-gray-700 mb-4">
                      {service.name} provides exceptional service in {service.location}. Our team of experienced professionals ensures top-quality results tailored to your specific needs.
                    </p>
                    <p className="text-gray-700 mb-4">
                      We specialize in {service.subcategory} services with years of expertise in the field. Our clients trust us for our attention to detail, professionalism, and commitment to excellence.
                    </p>
                    <p className="text-gray-700">
                      Whether you're looking for a one-time service or regular appointments, we offer flexible scheduling options to accommodate your needs. Contact us today to book your appointment!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right column - Service info & booking */}
          <div className="w-full md:w-5/12">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Service Details</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price Range:</span>
                    <span className="font-semibold text-purple-700">
                      Ksh {service.minPrice.toLocaleString()} - {service.maxPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Category:</span>
                    <Link 
                      to={`/category/${service.category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-purple-600 hover:underline"
                    >
                      {getCategoryTitle(service.category)}
                    </Link>
                  </div>
                  
                  
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Location:</span>
                    <span>{service.location}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Phone:</span>
                    <a href={`tel:${service.whatsapp}`} className="text-purple-600 hover:underline">
                      {service.whatsapp}
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={handleBookViaWhatsApp}
                    className="border-purple-500 text-purple-500 hover:bg-purple-50"
                    disabled={!service.whatsapp}
                  >
                    {service.whatsapp ? (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Contact via WhatsApp
                      </>
                    ) : (
                      'Contact Unavailable'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceDetail;
