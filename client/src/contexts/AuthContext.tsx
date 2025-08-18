import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../config/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  fitnessLevel: string;
  fitnessGoals: string[];
  subscription: {
    type: string;
    startDate?: Date;
    endDate?: Date;
  };
  totalWorkouts: number;
  totalWorkoutTime: number;
  streakDays: number;
  lastWorkoutDate?: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  socialLogin: (provider: string, socialData: any) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fitnessLevel?: string;
  fitnessGoals?: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user for development/demo
const mockUser: User = {
  id: '1',
  email: 'demo@fitness.com',
  firstName: 'Demo',
  lastName: 'User',
  profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
  fitnessLevel: 'intermediate',
  fitnessGoals: ['weight-loss', 'muscle-gain', 'endurance'],
  subscription: { type: 'premium' },
  totalWorkouts: 45,
  totalWorkoutTime: 2700,
  streakDays: 7,
  lastWorkoutDate: new Date()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token && token !== 'demo-token-' && !token.startsWith('demo-token-')) {
        try {
          const response = await api.get('/api/auth/user');
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          // Don't set user, let them go to login
          setUser(null);
        }
      } else if (token && token.startsWith('demo-token-')) {
        // Use mock user for demo tokens
        setUser(mockUser);
      } else {
        // No token, user needs to login
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      toast.success('Welcome back!');
    } catch (error: any) {
      console.error('Backend login failed, using demo mode:', error);
      
      // For demo purposes, create a demo user
      const demoUser: User = {
        ...mockUser,
        email: email,
        firstName: email.split('@')[0] || 'Demo',
        lastName: 'User',
      };
      
      setUser(demoUser);
      localStorage.setItem('token', 'demo-token-' + Date.now());
      
      toast.success('Welcome! (Demo mode)');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Backend registration failed, using demo mode:', error);
      
      // For demo purposes, create a demo user
      const demoUser: User = {
        ...mockUser,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        fitnessLevel: userData.fitnessLevel || 'beginner',
        fitnessGoals: userData.fitnessGoals || ['general-fitness'],
      };
      
      setUser(demoUser);
      localStorage.setItem('token', 'demo-token-' + Date.now());
      
      toast.success('Account created successfully! (Demo mode)');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await api.put('/api/users/profile', userData);
      setUser(response.data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Update failed';
      toast.error(message);
      throw error;
    }
  };

  const socialLogin = async (provider: string, socialData: any) => {
    try {
      console.log('Attempting social login with backend:', { provider, socialData });
      const response = await api.post('/api/auth/social-login', {
        provider,
        ...socialData
      });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      toast.success(`Welcome! You've signed in with ${provider}`);
    } catch (error: any) {
      console.error('Backend social login failed, using mock user:', error);
      
      // For demo purposes, create a user based on Google data
      const demoUser: User = {
        ...mockUser,
        id: socialData.id,
        email: socialData.email,
        firstName: socialData.firstName,
        lastName: socialData.lastName,
        profilePicture: socialData.profilePicture,
      };
      
      setUser(demoUser);
      localStorage.setItem('token', 'demo-token-' + Date.now());
      
      toast.success(`Welcome ${socialData.firstName}! (Demo mode)`);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    socialLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
