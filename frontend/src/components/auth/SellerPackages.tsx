import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    price: 800,
    recommended: false,
    features: [
      '1 Photo Upload',
      'Book Appointment Feature',
      'Basic Visibility',
      'Mabinti Community Access'
    ],
    photoUploads: 1,
    videoUploads: 0
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 1500,
    recommended: true,
    features: [
      '2 Photo Uploads',
      'Book Appointment Feature',
      'Enhanced Visibility',
      'Mabinti Community Access'
    ],
    photoUploads: 2,
    videoUploads: 0
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 2500,
    recommended: false,
    features: [
      '3 Photo Uploads',
      'Book Appointment Feature',
      'Premium Visibility',
      'Featured Listing',
      'Mabinti Community Access'
    ],
    photoUploads: 3,
    videoUploads: 0
  }
];

const SellerPackages = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  const handleContinue = () => {
    if (!selectedPackage) {
      return;
    }
    navigate(`/signup?type=seller&package=${selectedPackage}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose Your Seller Package</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select a package that best suits your needs. You can upgrade or change your package anytime after registration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <Card 
            key={pkg.id}
            className={`relative ${
              pkg.recommended ? 'border-2 border-purple-500' : ''
            }`}
          >
            {pkg.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Recommended
                </div>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-xl">{pkg.name}</CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold">Ksh {pkg.price}</span>
                <span className="text-gray-500">/month</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-3">
              <Button 
                variant={selectedPackage === pkg.id ? "default" : "outline"}
                className={`w-full ${
                  selectedPackage === pkg.id 
                    ? 'bg-purple-500 hover:bg-purple-600' 
                    : 'border-purple-500 text-purple-500 hover:bg-purple-50'
                }`}
                onClick={() => handleSelectPackage(pkg.id)}
              >
                {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button 
          onClick={handleContinue}
          className="bg-purple-500 hover:bg-purple-600 px-8 py-2"
          disabled={!selectedPackage}
        >
          Continue to Registration
        </Button>
        
        <p className="mt-4 text-sm text-gray-500">
          You can upgrade or change your package anytime after registration.
        </p>
      </div>
    </div>
  );
};

export default SellerPackages;
