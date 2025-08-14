import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';
import { serviceCategories } from '@/data/serviceCategories';
import { useNavigate } from 'react-router-dom';
import api from '@/config/api';
import { useAuth } from '@/hooks/useAuth';


const formSchema = z.object({
  serviceName: z.string().min(5, 'Service name must be at least 5 characters'),
  minPrice: z.coerce.number().min(100, 'Minimum price must be at least 100 KSh'),
  maxPrice: z.coerce.number().min(100, 'Maximum price must be at least 100 KSh'),
  location: z.string().min(3, 'Location is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  description: z.string().min(30, 'Description must be at least 30 characters'),
});

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image';
}

const PostServiceForm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [packageLimits, setPackageLimits] = useState({ packageId: '', photoUploads: 0 });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceName: '',
      minPrice: undefined,
      maxPrice: undefined,
      location: '',
      phoneNumber: '',
      category: '',
      subcategory: '',
      description: '',
    },
  });

  // Check user authentication and package limits
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to post a service');
      navigate('/signin');
      return;
    }

    if (user) {
      console.log('User data:', user); // Debug
      if (user.accountType === 'seller' && user.sellerPackage) {
        setPackageLimits({
          packageId: user.sellerPackage.packageId || '',
          photoUploads: user.sellerPackage.photoUploads || 0,
        });
      } else {
        console.log(`The user account type is: ${user.accountType}`)
        console.log(`The user data package is: ${user.sellerPackage}`)
        toast.error('Only sellers can post services');
        navigate('/signin');
      }
    }
  }, [navigate, user, isAuthenticated]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Check current counts
    const currentImages = uploadedFiles.filter(f => f.type === 'image').length;
    const newImages = Array.from(files).filter(f => f.type.startsWith('image/')).length;

    // Validate against package limits
    if (currentImages + newImages > packageLimits.photoUploads) {
      toast.error(`Your ${packageLimits.packageId} package allows only ${packageLimits.photoUploads} photo(s)`);
      return;
    }

    // Process valid files
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} is not a supported image format`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedFiles(prev => [
            ...prev, 
            {
              id: Math.random().toString(36).substring(2, 9),
              file,
              preview: e.target!.result as string,
              type: 'image'
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset the input
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  // Get subcategories based on selected category
  const subcategories = selectedCategory 
    ? serviceCategories.find(cat => cat.id === selectedCategory)?.links || []
    : [];

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    form.setValue('category', value);
    form.setValue('subcategory', '');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    if (values.minPrice > values.maxPrice) {
      form.setError('maxPrice', { 
        type: 'manual', 
        message: 'Maximum price cannot be less than minimum price' 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const images = uploadedFiles.map(file => file.preview);

      const payload = {
        name: values.serviceName,
        images,
        minPrice: values.minPrice,
        maxPrice: values.maxPrice,
        location: values.location,
        phoneNumber: values.phoneNumber,
        category: values.category,
        subcategory: values.subcategory,
        description: values.description,
      };

      console.log('Submitting payload:', {
        name: payload.name,
        images: payload.images.length,
        minPrice: payload.minPrice,
        maxPrice: payload.maxPrice,
        location: payload.location,
        phoneNumber: payload.phoneNumber,
        category: payload.category,
        subcategory: payload.subcategory,
        description: payload.description,
      });

      const response = await api.post('/api/services', payload);

      toast.success('Service posted successfully!');
      navigate('/all-services');
    } catch (error: any) {
      console.error('Error posting service:', error);
      const message = error.response?.data?.message || 'Failed to post service';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Post a Service</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold border-b pb-2">Service Details</h2>
            
            <FormField
              control={form.control}
              name="serviceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Professional Makeup Service" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Price (Ksh) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maxPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Price (Ksh) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Nairobi CBD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 0712345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={handleCategoryChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={subcategories.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subcategories.map((subcat) => (
                          <SelectItem key={subcat.path} value={subcat.path}>
                            {subcat.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your service in detail..." 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-3">
              <div>
                <h3 className="font-medium mb-1">Photo Upload</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Your {packageLimits.packageId || 'unknown'} package allows you to upload up to {packageLimits.photoUploads} photo(s).
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {uploadedFiles.map((file) => (
                  <Card key={file.id} className="relative group overflow-hidden">
                    <img 
                      src={file.preview} 
                      alt="preview" 
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Card>
                ))}
                
                {/* Show upload button if photo limit not reached */}
                {uploadedFiles.length < packageLimits.photoUploads && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-32 relative">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      multiple
                    />
                    <div className="text-center">
                      <Upload className="h-6 w-6 mx-auto text-gray-400" />
                      <span className="text-sm text-gray-500 mt-1 block">Upload Photos</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Service'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PostServiceForm;
