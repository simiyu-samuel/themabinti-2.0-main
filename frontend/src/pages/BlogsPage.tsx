
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, MessageCircle } from 'lucide-react';

const BlogsPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "2025 Beauty Trends Every Woman Should Know",
      excerpt: "Discover the hottest beauty trends this year and how to incorporate them into your daily routine.",
      author: "Sarah Kimani",
      date: "April 2, 2025",
      readTime: "5 min read",
      comments: 12,
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80"
    },
    {
      id: 2,
      title: "Natural Hair Care Tips for Kenyan Women",
      excerpt: "Learn how to maintain healthy, beautiful natural hair with locally available products and methods.",
      author: "Jane Muthoni",
      date: "March 28, 2025",
      readTime: "7 min read",
      comments: 23,
      image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
      authorImage: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=386&q=80"
    },
    {
      id: 3,
      title: "Self-Care Routines for Busy Professionals",
      excerpt: "Simple but effective self-care practices you can incorporate into your hectic schedule.",
      author: "Wanjiku Ndegwa",
      date: "March 15, 2025",
      readTime: "4 min read",
      comments: 8,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      authorImage: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
    },
    {
      id: 4,
      title: "How to Choose the Right Makeup Artist for Your Wedding",
      excerpt: "A comprehensive guide to finding and booking the perfect makeup artist for your special day.",
      author: "Amina Hassan",
      date: "March 10, 2025",
      readTime: "8 min read",
      comments: 15,
      image: "https://images.unsplash.com/photo-1560800452-f2d475982b96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      authorImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
    },
    {
      id: 5,
      title: "Fitness Journey: From Beginner to Consistent",
      excerpt: "My personal fitness journey and tips to help you stay consistent with your workouts.",
      author: "Faith Wambui",
      date: "March 5, 2025",
      readTime: "6 min read",
      comments: 19,
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      authorImage: "https://images.unsplash.com/photo-1551581786-2649394faeb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80"
    },
    {
      id: 6,
      title: "Starting Your Career as a Makeup Artist in Kenya",
      excerpt: "Essential tips, tools, and training needed to establish yourself as a professional makeup artist.",
      author: "Mercy Akinyi",
      date: "February 25, 2025",
      readTime: "10 min read",
      comments: 27,
      image: "https://images.unsplash.com/photo-1571646750134-31785f249a34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      authorImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarTop />
      <NavbarBottom />
      
      <div className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Themabinti Blog</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the latest tips, trends, and stories in beauty, fashion, health, and lifestyle from our community of experts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-xl font-bold line-clamp-2 hover:text-purple-600 transition-colors">
                    <a href={`/blog/${post.id}`}>{post.title}</a>
                  </CardTitle>
                  <CardDescription className="mt-2 line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{post.date}</span>
                    <span className="mx-1">•</span>
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                    <span className="mx-1">•</span>
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.authorImage} alt={post.author} />
                      <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{post.author}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                    <a href={`/blog/${post.id}`}>Read More</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button className="bg-purple-500 hover:bg-purple-600">Load More Articles</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
