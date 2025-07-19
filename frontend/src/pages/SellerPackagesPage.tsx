
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import SellerPackages from '@/components/auth/SellerPackages';

const SellerPackagesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarTop />
      <NavbarBottom />
      
      <div className="flex-grow py-12 bg-gray-50">
        <SellerPackages />
      </div>
    </div>
  );
};

export default SellerPackagesPage;
