import { useState, useEffect } from 'react';
import NavbarTop from '@/components/NavbarTop';
import NavbarBottom from '@/components/NavbarBottom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, MessageCircle, Eye, Heart, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/config/api';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  created_at: string;
  views: number;
  likes: number;
  comments: number;
  category: string;
  image: string;
}

const BlogsPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/blogs');
        
        const formattedBlogs = response.data.map((blog: any) => ({
          id: blog._id,
          title: blog.title,
          content: blog.content,
          excerpt: blog.content.substring(0, 150) + '...',
          author: blog.author,
          created_at: blog.createdAt,
          views: blog.views || Math.floor(Math.random() * 500) + 50,
          likes: blog.likes || Math.floor(Math.random() * 100) + 10,
          comments: blog.comments || Math.floor(Math.random() * 50) + 5,
          category: blog.category || 'Lifestyle',
          image: `https://images.pexels.com/photos/${3993449 + Math.floor(Math.random() * 1000)}/pexels-photo-${3993449 + Math.floor(Math.random() * 1000)}.jpeg?auto=compress&cs=tinysrgb&w=800`
        }));
        
        setBlogPosts(formattedBlogs);
        setError(null);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavbarTop />
        <NavbarBottom />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading amazing stories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <NavbarTop />
      <NavbarBottom />
      
      {/* Hero Section - Redesigned */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Themabinti
            <span className="block text-3xl md:text-4xl font-normal opacity-90">Blog</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Discover inspiring stories, expert tips, and the latest trends in beauty, fashion, health, and lifestyle
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>
      </section>
      
      <div className="flex-grow container mx-auto px-4 py-16">
        {error ? (
          <div className="text-center py-16">
            <Card className="max-w-md mx-auto shadow-lg">
              <CardContent className="p-8">
                <div className="text-red-500 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Blogs</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : blogPosts.length > 0 ? (
          <>
            {/* Featured Post */}
            {blogPosts.length > 0 && (
              <Card className="mb-12 overflow-hidden shadow-2xl border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="aspect-video lg:aspect-auto">
                    <img 
                      src={blogPosts[0].image} 
                      alt={blogPosts[0].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <Badge className="bg-yellow-400 text-gray-800 w-fit mb-4">Featured Post</Badge>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                      {blogPosts[0].title}
                    </h2>
                    <p className="text-lg opacity-90 mb-6 leading-relaxed">
                      {blogPosts[0].excerpt}
                    </p>
                    <div className="flex items-center gap-6 text-sm opacity-80 mb-6">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {blogPosts[0].views}
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {blogPosts[0].likes}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {blogPosts[0].comments}
                      </div>
                    </div>
                    <Button className="bg-white text-purple-600 hover:bg-gray-100 w-fit">
                      Read Full Article
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1).map((post) => (
                <Card key={post.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg bg-white">
                  <div className="relative overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-purple-600 text-white">
                        {post.category}
                      </Badge>
                    </div>
                    
                    {/* Engagement Stats Overlay */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-2">
                        <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {post.views}
                        </div>
                        <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {post.likes}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="p-6 pb-3">
                    <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-purple-600 transition-colors leading-tight">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="mt-3 line-clamp-3 text-gray-600 leading-relaxed">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="px-6 py-0">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {format(new Date(post.created_at), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t border-gray-100 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-purple-100">
                        <AvatarImage src={`https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg`} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {post.author.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-800">{post.author}</div>
                        <div className="text-xs text-gray-500">Author</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                      Read More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {/* Load More */}
            <div className="text-center mt-16">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-4 text-lg rounded-full">
                Load More Stories
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Card className="max-w-md mx-auto shadow-lg">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Blog Posts Yet</h3>
                <p className="text-gray-600 mb-6">Be the first to share your story with our community!</p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Write a Post
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;