import { useState, useEffect } from 'react';
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import ServiceCard from '@/components/ServiceCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Loader2, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { ServiceProps } from '@/components/ServiceCard';
import { serviceCategories } from '@/data/serviceCategories';
import api from '@/config/api';

const AllServicesPage = () => {
  const [services, setServices] = useState<ServiceProps[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  const locations = ['all', 'Nairobi', 'Nakuru', 'Kiambu', 'Kisumu', 'Thika', 'Mombasa'];
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await api.get('/services');
        
        const formattedServices: ServiceProps[] = response.data.map((service: any) => ({
          id: service.id,
          name: service.name,
          minPrice: service.min_price,
          maxPrice: service.max_price,
          location: service.location,
          image: service.images?.[0] || 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg',
          whatsapp: service.phone_number?.replace(/^\+/, '') || '',
          category: service.category,
          subcategory: service.subcategory,
          description: service.description,
          rating: service.rating || 4.5,
          reviewCount: service.review_count || 0
        }));
        
        setServices(formattedServices);
        setFilteredServices(formattedServices);
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

  // Filter and sort services
  useEffect(() => {
    let filtered = [...services];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(service => 
        service.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(service => 
      service.minPrice >= priceRange[0] && service.maxPrice <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.minPrice - a.minPrice);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        // Keep original order (newest first from API)
        break;
    }

    setFilteredServices(filtered);
  }, [services, searchQuery, selectedCategory, selectedLocation, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setPriceRange([0, 50000]);
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <NavbarTop />
      <NavbarBottom />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">All Services</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover {services.length}+ amazing services from verified professionals
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters Section - Redesigned */}
          <Card className="mb-8 shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search services, locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-lg border-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                {/* Filter Toggle for Mobile */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden border-purple-300 text-purple-600"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Filters Row */}
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 ${showFilters || 'hidden lg:grid'}`}>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="border-purple-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="border-purple-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location === 'all' ? 'All Locations' : location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Price Range: Ksh {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50000}
                    min={0}
                    step={500}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-purple-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters & Clear */}
              {(searchQuery || selectedCategory !== 'all' || selectedLocation !== 'all' || priceRange[0] > 0 || priceRange[1] < 50000) && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-purple-100">
                  <div className="text-sm text-gray-600">
                    Showing {filteredServices.length} of {services.length} services
                  </div>
                  <Button variant="ghost" onClick={clearFilters} className="text-purple-600 hover:text-purple-700">
                    Clear All Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading amazing services...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <Card className="max-w-md mx-auto shadow-lg">
                <CardContent className="p-8">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Card className="max-w-md mx-auto shadow-lg">
                <CardContent className="p-8">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Services Found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <Button onClick={clearFilters} variant="outline" className="mr-3">
                    Clear Filters
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700" asChild>
                    <Link to="/post-service">Add a Service</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllServicesPage;