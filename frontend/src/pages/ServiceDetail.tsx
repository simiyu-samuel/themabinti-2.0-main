import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import BookAppointmentDialog from '@/components/BookAppointmentDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ExternalLink, 
  MapPin, 
  Star, 
  Phone, 
  Calendar, 
  Clock,
  Heart,
  Share2,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ServiceProps } from '@/components/ServiceCard';
import { serviceCategories } from '@/data/serviceCategories';
import api from '@/config/api';

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<ServiceProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [relatedServices, setRelatedServices] = useState<ServiceProps[]>([]);
  
  const getCategoryTitle = (categoryId: string) => {
    const category = serviceCategories.find(cat => cat.id === categoryId);
    return category ? category.title : categoryId;
  };

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        
        // Fetch service details
        const serviceResponse = await api.get(`/service/${id}`);
        const serviceData = serviceResponse.data;
        
        const formattedService: ServiceProps = {
          id: serviceData.id,
          name: serviceData.name,
          minPrice: serviceData.min_price,
          maxPrice: serviceData.max_price,
          location: serviceData.location,
          image: serviceData.images?.[0] || 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg',
          images: serviceData.images || [serviceData.images?.[0] || 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg'],
          whatsapp: serviceData.phone_number?.replace(/^\+/, '') || '',
          category: serviceData.category,
          subcategory: serviceData.subcategory,
          description: serviceData.description,
          rating: serviceData.rating || 4.5,
          reviewCount: serviceData.review_count || 0
        };
        
        setService(formattedService);
        
        // Fetch related services
        const relatedResponse = await api.get(`/services/category/${serviceData.category}?limit=4&exclude=${id}`);
        const relatedFormatted = relatedResponse.data.map((s: any) => ({
          id: s.id,
          name: s.name,
          minPrice: s.min_price,
          maxPrice: s.max_price,
          location: s.location,
          image: s.images?.[0] || 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg',
          whatsapp: s.phone_number?.replace(/^\+/, '') || '',
          category: s.category,
          subcategory: s.subcategory,
          rating: s.rating || 4.5,
          reviewCount: s.review_count || 0
        }));
        
        setRelatedServices(relatedFormatted);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service details. Please try again.');
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceData();
    }
  }, [id]);

  const handleBookViaWhatsApp = () => {
    if (!service?.whatsapp) {
      alert('Phone number not available for this service.');
      return;
    }

    const formattedNumber = service.whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hello! I'm interested in your service "${service.name}" (${service.minPrice.toLocaleString()} - ${service.maxPrice.toLocaleString()} Ksh). Could you please provide more information?`
    );

    window.open(`https://wa.me/${formattedNumber}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavbarTop />
        <NavbarBottom />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-purple-200 rounded-full mx-auto mb-4"></div>
            <div className="text-gray-600">Loading service details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavbarTop />
        <NavbarBottom />
        <div className="flex-grow flex items-center justify-center">
          <Card className="max-w-md mx-auto shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h2>
              <p className="text-gray-600 mb-6">{error || "The service you're looking for doesn't exist."}</p>
              <Link to="/">
                <Button className="bg-purple-500 hover:bg-purple-600">
                  Back to Homepage
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <NavbarTop />
      <NavbarBottom />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumb - Redesigned */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 bg-white rounded-full px-6 py-3 shadow-sm">
          <Link to="/" className="hover:text-purple-500 transition-colors">Home</Link>
          <ChevronRight className="mx-2 h-4 w-4" />
          <Link to={`/category/${service.category}`} className="hover:text-purple-500 transition-colors">
            {getCategoryTitle(service.category)}
          </Link>
          <ChevronRight className="mx-2 h-4 w-4" />
          <span className="text-gray-700 font-medium">{service.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-800 mb-3">{service.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-purple-500" />
                      <span className="text-gray-600">{service.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 mr-1 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{service.rating}</span>
                      <span className="text-gray-500 ml-1">({service.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    Ksh {service.minPrice.toLocaleString()} - {service.maxPrice.toLocaleString()}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 md:mt-0">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <Card className="overflow-hidden shadow-lg border-0">
              <CardContent className="p-0">
                <Tabs defaultValue="gallery" className="w-full">
                  <div className="p-6 pb-0">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="gallery">Gallery</TabsTrigger>
                      <TabsTrigger value="description">About</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="gallery" className="p-6">
                    <div className="space-y-4">
                      <div className="relative rounded-2xl overflow-hidden">
                        <img 
                          src={service.images[selectedImageIndex]} 
                          alt={`${service.name} - Image ${selectedImageIndex + 1}`} 
                          className="w-full h-96 object-cover"
                        />
                        
                        {/* Navigation Arrows */}
                        {service.images.length > 1 && (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full"
                              onClick={() => setSelectedImageIndex(prev => 
                                prev === 0 ? service.images.length - 1 : prev - 1
                              )}
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full"
                              onClick={() => setSelectedImageIndex(prev => 
                                prev === service.images.length - 1 ? 0 : prev + 1
                              )}
                            >
                              <ChevronRight className="h-5 w-5" />
                            </Button>
                          </>
                        )}
                      </div>
                      
                      {/* Thumbnail Grid */}
                      {service.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-3">
                          {service.images.map((img, idx) => (
                            <div 
                              key={idx} 
                              className={`relative rounded-lg overflow-hidden h-24 cursor-pointer transition-all duration-300 ${
                                selectedImageIndex === idx 
                                  ? 'ring-4 ring-purple-500 ring-offset-2' 
                                  : 'hover:opacity-80 hover:scale-105'
                              }`}
                              onClick={() => setSelectedImageIndex(idx)}
                            >
                              <img 
                                src={img} 
                                alt={`Thumbnail ${idx + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="description" className="p-6">
                    <div className="prose max-w-none">
                      <h3 className="text-2xl font-bold mb-4 text-gray-800">About This Service</h3>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {service.description || `${service.name} provides exceptional service in ${service.location}. Our team of experienced professionals ensures top-quality results tailored to your specific needs.`}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="bg-purple-50 p-6 rounded-xl">
                          <h4 className="font-semibold text-purple-800 mb-3">Service Highlights</h4>
                          <ul className="space-y-2 text-gray-700">
                            <li>• Professional and experienced staff</li>
                            <li>• High-quality products and equipment</li>
                            <li>• Flexible scheduling options</li>
                            <li>• Competitive pricing</li>
                          </ul>
                        </div>
                        
                        <div className="bg-pink-50 p-6 rounded-xl">
                          <h4 className="font-semibold text-pink-800 mb-3">What to Expect</h4>
                          <ul className="space-y-2 text-gray-700">
                            <li>• Consultation and assessment</li>
                            <li>• Personalized service approach</li>
                            <li>• Professional execution</li>
                            <li>• Follow-up and aftercare</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Booking & Info */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-24 shadow-xl border-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <CardHeader className="relative">
                <CardTitle className="text-2xl font-bold">Book This Service</CardTitle>
                <p className="opacity-90">Get started with your appointment</p>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold mb-1">
                    Ksh {service.minPrice.toLocaleString()} - {service.maxPrice.toLocaleString()}
                  </div>
                  <div className="text-sm opacity-80">Price range for this service</div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => setBookDialogOpen(true)}
                    className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold py-3 rounded-xl"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book & Pay Online
                  </Button>
                  
                  <Button 
                    onClick={handleBookViaWhatsApp}
                    variant="outline" 
                    className="w-full border-white text-white hover:bg-white hover:text-purple-600 font-semibold py-3 rounded-xl"
                    disabled={!service.whatsapp}
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Contact via WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Service Provider Info */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Avatar className="h-12 w-12 mr-3 ring-2 ring-purple-100">
                    <AvatarImage src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" />
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      {service.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold">Service Provider</div>
                    <div className="text-sm text-gray-500">Verified Professional</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category:</span>
                  <Badge variant="outline" className="border-purple-200 text-purple-600">
                    {getCategoryTitle(service.category)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{service.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <a href={`tel:${service.whatsapp}`} className="text-purple-600 hover:underline font-medium">
                    +254{service.whatsapp}
                  </a>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="text-green-600 font-medium">Usually within 1 hour</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Service Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">{service.reviewCount}</div>
                    <div className="text-xs text-gray-600">Reviews</div>
                  </div>
                  <div className="text-center p-3 bg-pink-50 rounded-xl">
                    <div className="text-2xl font-bold text-pink-600">98%</div>
                    <div className="text-xs text-gray-600">Satisfaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedServices.map((relatedService) => (
                <Card key={relatedService.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={relatedService.image}
                      alt={relatedService.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-1">{relatedService.name}</h3>
                    <div className="text-purple-600 font-bold">
                      Ksh {relatedService.minPrice.toLocaleString()}+
                    </div>
                    <div className="text-sm text-gray-500">{relatedService.location}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
      
      <BookAppointmentDialog 
        open={bookDialogOpen} 
        onOpenChange={setBookDialogOpen}
        serviceId={service.id}
      />
    </div>
  );
};

export default ServiceDetail;