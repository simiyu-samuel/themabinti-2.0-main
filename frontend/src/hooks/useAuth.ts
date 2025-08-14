import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id?: string;
  userName: string;
  email: string;
  accountType: 'buyer' | 'seller' | 'admin';
  sellerPackage?: {
    packageId: string;
    photoUploads: number;
    videoUploads: number;
    expiresAt: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Loaded user from localStorage:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('User logged in:', userData);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('User logged out');
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
};

export { AuthContext };