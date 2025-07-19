
import { Link } from 'react-router-dom';
import ServiceCard from './ServiceCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { ServiceProps } from '@/components/ServiceCard';

interface ServiceCategorySectionProps {
  title: string;
  categoryId: string;
  services: ServiceProps[];
}

const ServiceCategorySection = ({ title, categoryId, services }: ServiceCategorySectionProps) => {
  // Show only 4 services per category on the homepage
  const displayServices = services.slice(0, 4);

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <Link to="/all-services" className="flex items-center text-purple-600 hover:text-purple-700">
          <span>View All</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      {displayServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No services available in this category yet.</p>
          <Button variant="outline" asChild>
            <Link to="/post-service">Add a Service</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceCategorySection;
