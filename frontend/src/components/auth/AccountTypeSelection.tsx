
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Store } from 'lucide-react';

const AccountTypeSelection = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Join Themabinti</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the type of account that best suits your needs. You can use Themabinti to find services or to offer your own services.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <Card className="border-2 hover:border-purple-300 transition-all hover:shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-purple-500" />
            </div>
            <CardTitle className="text-xl font-bold">Buyer</CardTitle>
            <CardDescription>
              For those looking to discover and book services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start">
              <div className="mr-2 text-green-500">✓</div>
              <p>Browse all service categories</p>
            </div>
            <div className="flex items-start">
              <div className="mr-2 text-green-500">✓</div>
              <p>Book appointments with service providers</p>
            </div>
            <div className="flex items-start">
              <div className="mr-2 text-green-500">✓</div>
              <p>Save your favorite services</p>
            </div>
            <div className="flex items-start">
              <div className="mr-2 text-green-500">✓</div>
              <p>Rate and review services</p>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/signup?type=buyer" className="w-full">
              <Button className="w-full" variant="outline">
                Sign up as Buyer
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="border-2 border-purple-500 hover:shadow-lg transition-all">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Store className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold">Seller</CardTitle>
            <CardDescription>
              For professionals offering services to clients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start">
              <div className="mr-2 text-green-500">✓</div>
              <p>Create your service listing</p>
            </div>
            <div className="flex items-start">
              <div className="mr-2 text-green-500">✓</div>
              <p>Manage appointments and bookings</p>
            </div>
            <div className="flex items-start">
              <div className="mr-2 text-green-500">✓</div>
              <p>Connect directly with clients</p>
            </div>
            <div className="flex items-start">
              <div className="mr-2 text-green-500">✓</div>
              <p>Gain visibility in the Themabinti marketplace</p>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/seller-packages" className="w-full">
              <Button className="w-full bg-purple-500 hover:bg-purple-600">
                Sign up as Seller
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="text-purple-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AccountTypeSelection;
