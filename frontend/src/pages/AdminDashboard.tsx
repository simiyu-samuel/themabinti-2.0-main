import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Package, 
  Calendar, 
  MessageSquare, 
  FileText,
  TrendingUp,
  UserCheck,
  UserPlus,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/config/api';
import { toast } from 'sonner';

interface AdminDashboardData {
  users: {
    total: number;
    sellers: number;
    buyers: number;
  };
  services: {
    total: number;
  };
  appointments: {
    total: number;
    pending: number;
  };
  contacts: {
    total: number;
  };
  blogs: {
    total: number;
  };
  recentActivity: {
    users: any[];
    services: any[];
    appointments: any[];
  };
}

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to access the admin dashboard');
      navigate('/signin');
      return;
    }

    if (user?.accountType !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, [user, isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/dashboard/admin');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
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
      title: 'Total Users',
      value: dashboardData?.users.total || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Sellers',
      value: dashboardData?.users.sellers || 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Services',
      value: dashboardData?.services.total || 0,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Appointments',
      value: dashboardData?.appointments.total || 0,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarTop />
      <NavbarBottom />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and management tools</p>
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
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                  <CardDescription>Key metrics and performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>User Growth:</span>
                    <Badge className="bg-green-100 text-green-800">+12% this month</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Service Quality:</span>
                    <Badge className="bg-blue-100 text-blue-800">4.5/5 avg rating</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Platform Status:</span>
                    <Badge className="bg-green-100 text-green-800">All systems operational</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <UserPlus className="h-4 w-4 text-green-500" />
                      <span className="text-sm">New seller registered</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Package className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Service posted in Beauty</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Appointment booked</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Overview of platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{dashboardData?.users.total || 0}</div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{dashboardData?.users.sellers || 0}</div>
                    <div className="text-sm text-gray-600">Sellers</div>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <UserPlus className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">{dashboardData?.users.buyers || 0}</div>
                    <div className="text-sm text-gray-600">Buyers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Management</CardTitle>
                <CardDescription>Monitor and manage platform services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Services:</span>
                    <span className="font-bold text-2xl">{dashboardData?.services.total || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pending Approval:</span>
                    <Badge variant="secondary">0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Services:</span>
                    <Badge className="bg-green-100 text-green-800">{dashboardData?.services.total || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activity and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Recent Users */}
                  <div>
                    <h3 className="font-medium mb-3">Recent Users</h3>
                    <div className="space-y-2">
                      {dashboardData?.recentActivity.users.map((user) => (
                        <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium">{user.userName}</span>
                            <span className="text-sm text-gray-600 ml-2">({user.accountType})</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Services */}
                  <div>
                    <h3 className="font-medium mb-3">Recent Services</h3>
                    <div className="space-y-2">
                      {dashboardData?.recentActivity.services.map((service) => (
                        <div key={service._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium">{service.name}</span>
                            <span className="text-sm text-gray-600 ml-2">by {service.userId?.userName}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(service.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;