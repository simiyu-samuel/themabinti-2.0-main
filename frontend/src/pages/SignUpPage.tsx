
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import SignUpForm from '@/components/auth/SignUpForm';

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarTop />
      <NavbarBottom />
      
      <div className="flex-grow py-12 bg-gray-50">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
