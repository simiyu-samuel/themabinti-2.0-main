
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { ChevronDown } from 'lucide-react';
import { serviceCategories } from '../data/serviceCategories';
import { useIsMobile } from '@/hooks/use-mobile';

const NavbarBottom = () => {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Don't render on mobile as the links are now in the hamburger menu
  if (isMobile) {
    return null;
  }

  return (
    <div className="border-t border-b border-gray-200 bg-white">
      <div className="container mx-auto">
        <div className="flex items-center justify-center space-x-8 py-3 overflow-x-auto scrollbar-hide">
          {/* Find Services Dropdown */}
          <Popover open={openPopoverId === 'findServices'} onOpenChange={(open) => {
            setOpenPopoverId(open ? 'findServices' : null);
          }}>
            <PopoverTrigger className="flex items-center text-sm font-medium hover:text-purple-500 transition-colors">
              Find Services
              <ChevronDown className="h-4 w-4 ml-1" />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 min-w-[600px] max-h-[80vh] overflow-y-auto">
              {serviceCategories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <h3 className="font-semibold text-sm text-purple-800">{category.title}</h3>
                    <ul className="space-y-1">
                      {category.links.map((link) => (
                        <li key={link.path}>
                          <Link
                            to={link.path}
                            className="text-sm hover:text-purple-500 transition-colors"
                          >
                            {link.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Other links */}
          <Link to="/about" className="text-sm font-medium hover:text-purple-500 transition-colors">
            About Us
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-purple-500 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavbarBottom;
