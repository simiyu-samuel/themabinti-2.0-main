
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavbarTop from "@/components/NavbarTop";
import NavbarBottom from "@/components/NavbarBottom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarTop />
      <NavbarBottom />
      
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="max-w-md text-center px-4">
          <h1 className="text-6xl font-bold text-purple-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. The page might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-purple-500 hover:bg-purple-600 w-full sm:w-auto">
                Go to Homepage
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="w-full sm:w-auto">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
