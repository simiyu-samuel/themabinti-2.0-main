import { useState, useEffect } from 'react';
import { Search, User, ChevronDown, Menu, X, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import LocationSelector from './LocationSelector';
import BookAppointmentButton from './BookAppointmentButton';
import { serviceCategories } from '@/data/serviceCategories';

const NavbarTop = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsSeller(false);
    setFirstName('');
  };

  // Check localStorage for token and user data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setIsLoggedIn(true);
        setIsSeller(userData.accountType === 'seller');
        // Extract first name from userName (e.g., "John Doe" -> "John")
        setFirstName(userData.userName.split(' ')[0] || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
        handleLogout(); // Clear invalid data
      }
    }
  }, []);

  // Handle scroll event to add shadow to navbar when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // For demo purposes, toggle login state
  //const toggleLogin = () => {
  //  setIsLoggedIn(!isLoggedIn);
  //};

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); // Clear search input
      setIsDrawerOpen(false); // Close drawer on mobile
    }
  };

  return (
    <div className={`sticky top-0 z-50 bg-white ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          {isMobile && (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[90vh]">
                <div className="px-4 py-6 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Menu</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                      <Input 
                        type="text" 
                        placeholder="Find services..." 
                        className="w-full pl-10 pr-4 py-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </form>
                  
                  {/* Mobile Location Selector */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Select Location</p>
                    <LocationSelector />
                  </div>
                  
                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col space-y-4 mb-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center justify-between w-full text-gray-800 font-medium hover:text-purple-500">
                        Find Services
                        <ChevronRight className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="start" sideOffset={5}>
                        {serviceCategories.map((category) => (
                          <DropdownMenuSub key={category.id}>
                            <DropdownMenuSubTrigger className="text-gray-800">
                              {category.title}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="w-56">
                                {category.links.map((link) => (
                                  <DropdownMenuItem key={link.path} asChild>
                                    <Link
                                      to={link.path}
                                      className="cursor-pointer"
                                      onClick={() => setIsDrawerOpen(false)}
                                    >
                                      {link.title}
                                    </Link>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Link 
                      to="/blogs" 
                      className="text-gray-800 font-medium hover:text-purple-500"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      Blogs
                    </Link>
                    <Link 
                      to="/about" 
                      className="text-gray-800 font-medium hover:text-purple-500"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link 
                      to="/contact" 
                      className="text-gray-800 font-medium hover:text-purple-500"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      Contact Us
                    </Link>
                  </nav>
                  
                  {/* Mobile Book Appointment Button */}
                  <div className="mt-auto pb-6">
                    <BookAppointmentButton className="w-full" />
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          )}

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-purple-500">themabinti</span>
          </Link>

          {/* Location Selector - Hidden on Mobile */}
          <div className="hidden md:block ml-4">
            <LocationSelector />
          </div>

          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input 
                type="text" 
                placeholder="Find services..." 
                className="w-full pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Account Dropdown */}
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center px-2 py-1 rounded-full hover:bg-gray-100">
                  <User className="h-5 w-5" />
                  {isLoggedIn && firstName && (
                    <span className="mx-1 text-sm font-medium">{firstName}</span>
                  )}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem>
                      <Link to="/account" className="w-full">My Account</Link>
                    </DropdownMenuItem>
                    {isSeller && (
                      <DropdownMenuItem>
                        <Link to="/post-service" className="w-full">Post a Service</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <Link to="/signin" className="w-full">Sign in</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/signup-options" className="w-full">Sign up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Book Appointment Button - Hide text on small mobile */}
            

            {/* For demo purposes - toggle login state - Hide on mobile */}
            {/*<button 
              className="ml-2 hidden md:flex px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
              onClick={toggleLogin} 
            >
              {isLoggedIn ? 'Demo: Logout' : 'Demo: Login'}
            </button>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarTop;
