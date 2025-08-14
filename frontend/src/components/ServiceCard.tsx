import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MapPin, Star, Phone } from 'lucide-react';

export interface ServiceProps {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  location: string;
  image: string;
  images?: string[];
  whatsapp?: string;
  category: string;
  subcategory: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
}

interface ServiceCardProps {
  service: ServiceProps;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const { 
    id, 
    name, 
    minPrice, 
    maxPrice, 
    location, 
    image,
    whatsapp,
    rating = 4.5,
    reviewCount = 0
  } = service;

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!whatsapp) {
      alert('Phone number not available for this service.');
      return;
    }

    const formattedNumber = whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hello! I'm interested in your service "${name}" (${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} Ksh). Could you please provide more information?`
    );

    window.open(`https://wa.me/${formattedNumber}?text=${message}`, '_blank');
  };

  return (
    <Card className="group overflow-hidden bg-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg">
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            onError={(e) => { 
              e.currentTarget.src = 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg'; 
            }}
          />
        </div>
        
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            {rating} ({reviewCount})
          </Badge>
        </div>
        
        {/* Quick Action Buttons - Show on Hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <div className="flex gap-2">
            <Button 
              onClick={handleBookClick} 
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={!whatsapp}
            >
              <Phone className="h-4 w-4 mr-1" />
              WhatsApp
            </Button>
            <Link to={`/service/${id}`} className="flex-1">
              <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                Book Online
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="font-bold text-xl mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center text-gray-500 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{location}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
              Ksh {minPrice?.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              - {maxPrice?.toLocaleString()}
            </div>
          </div>
          
          <Link to={`/service/${id}`}>
            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
              View Details
              <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;