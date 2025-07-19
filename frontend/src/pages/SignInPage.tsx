
import { Link } from 'react-router-dom';
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import SignInForm from '@/components/auth/SignInForm';

const SignInPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarTop />
      <NavbarBottom />
      
      <div className="flex-grow py-12 bg-gray-50">
        <SignInForm />
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account yet?{' '}
            <Link to="/signup-options" className="text-purple-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
