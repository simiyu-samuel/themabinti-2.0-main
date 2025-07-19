
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import AccountTypeSelection from '@/components/auth/AccountTypeSelection';

const SignUpOptionsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarTop />
      <NavbarBottom />
      
      <div className="flex-grow py-12 bg-gray-50">
        <AccountTypeSelection />
      </div>
    </div>
  );
};

export default SignUpOptionsPage;
