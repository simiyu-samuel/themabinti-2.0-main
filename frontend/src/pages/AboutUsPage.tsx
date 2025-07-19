
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarTop />
      <NavbarBottom />
      
      <div className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">About Themabinti</h1>
            
            <div className="bg-white rounded-xl shadow-md p-8 mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-purple-700">Our Story</h2>
              <p className="text-gray-700 mb-6">
                Themabinti was founded in 2023 with a simple mission: to connect Kenyan women with quality beauty, 
                health, and lifestyle services. What started as a small directory of local businesses has grown 
                into Kenya's premier platform for female-focused services.
              </p>
              <p className="text-gray-700 mb-6">
                Our platform emerged from recognizing the challenges women face when trying to find reliable 
                and skilled service providers. We believe every woman deserves access to services that help 
                her look and feel her best, delivered by professionals who understand her needs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-3 text-purple-700">Our Mission</h2>
                  <p className="text-gray-700">
                    To empower women across Kenya by connecting them with quality beauty, health, and 
                    lifestyle services, while providing female entrepreneurs a platform to showcase their skills and grow their businesses.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-3 text-purple-700">Our Vision</h2>
                  <p className="text-gray-700">
                    To become the leading platform for women's services across East Africa, known for 
                    quality, trust, and community, where every woman can find services tailored to her needs.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-purple-700">Our Values</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Empowerment</h3>
                  <p className="text-gray-700">Supporting women to achieve their personal and professional goals</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Quality</h3>
                  <p className="text-gray-700">Ensuring high standards in all services listed on our platform</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Community</h3>
                  <p className="text-gray-700">Building connections between service providers and clients</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-purple-700">The Team Behind Themabinti</h2>
              <p className="text-gray-700 mb-8">
                Our diverse team of passionate professionals is dedicated to making Themabinti a 
                platform that truly serves the needs of Kenyan women. From tech experts to beauty 
                industry veterans, we bring together a wealth of experience to deliver the best 
                service possible.
              </p>
              
              <Button className="bg-purple-600 hover:bg-purple-700">
                Join Our Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
