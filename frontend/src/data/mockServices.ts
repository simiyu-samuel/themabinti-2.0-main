
import { ServiceProps } from '@/components/ServiceCard';

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate a random price pair [min, max]
const generatePricePair = (minRange: number, maxRange: number) => {
  const min = getRandomInt(minRange, maxRange - 2000);
  const max = getRandomInt(min + 1000, min + 5000);
  return [min, max];
};

// Locations
const locations = ['Nairobi CBD', 'Westlands', 'Kiambu', 'Thika', 'Nakuru', 'Kisumu', 'Karen'];

// Generate mock services for each category
export const mockServices: ServiceProps[] = [
  // Beauty Services
  ...Array(8).fill(null).map((_, index) => {
    const [minPrice, maxPrice] = generatePricePair(1000, 10000);
    return {
      id: `beauty-${index + 1}`,
      name: [
        'Professional Makeup Service',
        'Luxury Nail Art Studio',
        'Premium Lash Extensions',
        'Expert Microblading',
        'Custom Tattoo Design',
        'Full Body Waxing',
        'Relaxing Massage Therapy',
        'Complete Beauty Package'
      ][index],
      minPrice,
      maxPrice,
      location: locations[getRandomInt(0, locations.length - 1)],
      image: `https://source.unsplash.com/featured/?beauty,makeup,${index}`,
      whatsapp: '254712345678',
      category: 'Beauty Services',
      subcategory: ['Makeup', 'Nails', 'Eyebrows & Lashes', 'Microblading', 'Tattoo & Piercings', 'Waxing', 'ASMR & Massage', 'Beauty hub'][getRandomInt(0, 7)]
    };
  }),
  
  // Hair Services
  ...Array(6).fill(null).map((_, index) => {
    const [minPrice, maxPrice] = generatePricePair(1500, 8000);
    return {
      id: `hair-${index + 1}`,
      name: [
        'Expert Braiding Salon',
        'Weaving & Extensions',
        'Locs Installation & Maintenance',
        'Custom Wig Creation & Styling',
        'Precision Ladies Haircuts',
        'Full Hair Care Treatment'
      ][index],
      minPrice,
      maxPrice,
      location: locations[getRandomInt(0, locations.length - 1)],
      image: `https://source.unsplash.com/featured/?hair,style,${index}`,
      whatsapp: '254712345678',
      category: 'Hair Services',
      subcategory: ['Braiding', 'Weaving', 'Locs', 'Wig Makeovers', 'Ladies Haircut', 'Complete Hair Care'][index]
    };
  }),
  
  // Health Services
  ...Array(4).fill(null).map((_, index) => {
    const [minPrice, maxPrice] = generatePricePair(2000, 15000);
    return {
      id: `health-${index + 1}`,
      name: [
        'Professional Skin Consultation',
        'Mental Health Counseling',
        'Maternal Care Services',
        'Reproductive Health Consultation'
      ][index],
      minPrice,
      maxPrice,
      location: locations[getRandomInt(0, locations.length - 1)],
      image: `https://source.unsplash.com/featured/?health,wellness,${index}`,
      whatsapp: '254712345678',
      category: 'Health',
      subcategory: ['Skin Consultation', 'Mental Health', 'Maternal Care', 'Reproductive Care'][index]
    };
  }),
  
  // Fitness Services
  ...Array(3).fill(null).map((_, index) => {
    const [minPrice, maxPrice] = generatePricePair(2000, 12000);
    return {
      id: `fitness-${index + 1}`,
      name: [
        'Premium Gym Membership',
        'Personal Fitness Training',
        'Nutrition Consultation & Planning'
      ][index],
      minPrice,
      maxPrice,
      location: locations[getRandomInt(0, locations.length - 1)],
      image: `https://source.unsplash.com/featured/?fitness,gym,${index}`,
      whatsapp: '254712345678',
      category: 'Fitness',
      subcategory: ['Gym', 'Personal Trainers', 'Nutritionist'][index]
    };
  })
];

// Helper function to get services by category
export const getServicesByCategory = (category: string) => {
  return mockServices.filter(service => service.category === category);
};

// Helper function to get services by subcategory
export const getServicesBySubcategory = (subcategory: string) => {
  return mockServices.filter(service => service.subcategory === subcategory);
};

// Helper function to get service by ID
export const getServiceById = (id: string) => {
  return mockServices.find(service => service.id === id);
};

// Helper function to get services by location
export const getServicesByLocation = (location: string) => {
  if (location === 'all') return mockServices;
  return mockServices.filter(service => service.location.includes(location));
};

// Helper function to search services
export const searchServices = (query: string) => {
  const lowerCaseQuery = query.toLowerCase();
  return mockServices.filter(
    service => 
      service.name.toLowerCase().includes(lowerCaseQuery) || 
      service.category.toLowerCase().includes(lowerCaseQuery) ||
      service.subcategory.toLowerCase().includes(lowerCaseQuery)
  );
};
