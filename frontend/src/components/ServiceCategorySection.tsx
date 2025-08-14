import { Link } from 'react-router-dom';
import ServiceCard from './ServiceCard';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus } from 'lucide-react';
import { ServiceProps } from '@/components/ServiceCard';

interface ServiceCategorySectionProps {
  title: string;
  categoryId: string;
  services: ServiceProps[];
}

const ServiceCategorySection = ({ title, categoryId, services }: ServiceCategorySectionProps) => {
  const displayServices = services.slice(0, 4);

  return (
    <section className="mb-20">
      {/* Section Header - Redesigned */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600">Discover amazing {title.toLowerCase()} near you</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Link to={`/category/${categoryId}`}>
            <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
          <Link to="/post-service">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-1" />
              Add Service
            </Button>
          </Link>
        </div>
      </div>
      
      {displayServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto border border-gray-100">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="h-10 w-10 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">No Services Yet</h3>
            <p className="text-gray-600 mb-6">Be the first to add a service in this category!</p>
            <Button className="bg-purple-600 hover:bg-purple-700" asChild>
              <Link to="/post-service">Add Your Service</Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiceCategorySection;