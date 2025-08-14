import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Calendar, 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/config/api';
import { toast } from 'sonner';

interface DashboardData {
  services: {
    total: number;
    active: number;
  };
  appointments: {
    total: number;
    pending: number;
    confirmed: number;
  };
  recentServices: any[];
  recentAppointments: any[];
}

const SellerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to access your dashboard');
      navigate('/signin');
      return;
    }

    if (user?.accountType !== 'seller') {
      toast.error('Access denied. Seller account required.');
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, [user, isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/dashboard/seller/${user?.id}`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavbarTop />
        <NavbarBottom />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Services',
      value: dashboardData?.services.total || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Appointments',
      value: dashboardData?.appointments.total || 0,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Appointments',
      value: dashboardData?.appointments.pending || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Confirmed Appointments',
      value: dashboardData?.appointments.confirmed || 0,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarTop />
      <NavbarBottom />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.userName}! Here's your business overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">My Services</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your business efficiently</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={() => navigate('/post-service')} className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Service
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    View My Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Services
                  </Button>
                </CardContent>
              </Card>

              {/* Package Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Package</CardTitle>
                  <CardDescription>Current subscription details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Package Type:</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {user?.sellerPackage?.packageId || 'Basic'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Photo Uploads:</span>
                      <span className="font-medium">{user?.sellerPackage?.photoUploads || 1}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Video Uploads:</span>
                      <span className="font-medium">{user?.sellerPackage?.videoUploads || 0}</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Upgrade Package
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Services</CardTitle>
                  <CardDescription>Manage your service listings</CardDescription>
                </div>
                <Button onClick={() => navigate('/post-service')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </CardHeader>
              <CardContent>
                {dashboardData?.recentServices.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentServices.map((service) => (
                      <div key={service._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={service.media?.find((m: any) => m.type === 'image')?.data || 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg'} 
                            alt={service.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="font-medium">{service.name}</h3>
                            <p className="text-sm text-gray-600">{service.location}</p>
                            <p className="text-sm font-medium text-purple-600">
                              Ksh {service.minPrice.toLocaleString()} - {service.maxPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Services Yet</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first service</p>
                    <Button onClick={() => navigate('/post-service')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Service
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>Manage your upcoming and past appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData?.recentAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentAppointments.map((appointment) => (
                      <div key={appointment._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{appointment.name}</h3>
                          <p className="text-sm text-gray-600">{appointment.email}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </p>
                          {appointment.serviceId && (
                            <p className="text-sm text-purple-600">{appointment.serviceId.name}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={
                              appointment.status === 'confirmed' ? 'default' : 
                              appointment.status === 'pending' ? 'secondary' : 'destructive'
                            }
                          >
                            {appointment.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Appointments Yet</h3>
                    <p className="text-gray-600">Appointments will appear here once customers book your services</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Performance</CardTitle>
                  <CardDescription>Track your service popularity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Overview</CardTitle>
                  <CardDescription>Your business metrics this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">New Appointments:</span>
                      <span className="font-bold text-2xl text-green-600">
                        {dashboardData?.appointments.total || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Active Services:</span>
                      <span className="font-bold text-2xl text-blue-600">
                        {dashboardData?.services.active || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Response Rate:</span>
                      <span className="font-bold text-2xl text-purple-600">95%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerDashboard;