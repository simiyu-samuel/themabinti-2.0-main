
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import PostServiceForm from '@/components/services/PostServiceForm';

const PostServicePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarTop />
      <NavbarBottom />
      
      <div className="flex-grow bg-gray-50">
        <PostServiceForm />
      </div>
    </div>
  );
};

export default PostServicePage;
