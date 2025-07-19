
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignInPage";
import SignUpOptionsPage from "./pages/SignUpOptionsPage";
import SignUpPage from "./pages/SignUpPage";
import SellerPackagesPage from "./pages/SellerPackagesPage";
import PostServicePage from "./pages/PostServicePage";
import ServiceDetail from "./pages/ServiceDetail";
import BlogsPage from "./pages/BlogsPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";
import AllServicesPage from "./pages/AllServicesPage";
import SearchResults from "./pages/SearchResults";
import LocationServices from "./pages/LocationServices";
import SubcategoryServices from "./pages/SubcategoryServices";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup-options" element={<SignUpOptionsPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/seller-packages" element={<SellerPackagesPage />} />
          <Route path="/post-service" element={<PostServicePage />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/all-services" element={<AllServicesPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/services/location/:location" element={<LocationServices />} />
          <Route path="/services/:category/:subcategory" element={<SubcategoryServices />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
