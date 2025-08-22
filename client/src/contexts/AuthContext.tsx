import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
  const isProduction = process.env.NODE_ENV === 'production';

  // Debug function to manually set loading state
  const setLoadingManually = (value: boolean) => {
    console.log('🔧 Manually setting loading to:', value);
    setLoading(value);
  };

  // Check localStorage availability
  const isLocalStorageAvailable = () => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.error('❌ localStorage is not available:', e);
      return false;
    }
  };

  // Safe localStorage operations
  const safeGetItem = useCallback(() => {
    if (!isLocalStorageAvailable()) return null;
    try {
      return localStorage.getItem('token');
    } catch (e) {
      console.error('❌ Error reading from localStorage:', e);
      return null;
    }
  }, []);

  const safeSetItem = useCallback((key: string, value: string): boolean => {
    if (!isLocalStorageAvailable()) return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.error('❌ Error writing to localStorage:', e);
      return false;
    }
  }, []);

  const safeRemoveItem = useCallback(() => {
    if (!isLocalStorageAvailable()) return false;
    try {
      localStorage.removeItem('token');
      return true;
    } catch (e) {
      console.error('❌ Error removing from localStorage:', e);
      return false;
    }
  }, []);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔐 Starting auth check...');
      
      if (!isLocalStorageAvailable()) {
        console.warn('⚠️ localStorage not available, skipping auth check');
        setLoading(false);
        return;
      }
      
      const token = safeGetItem();
      console.log('🔑 Token found:', token ? 'Yes' : 'No', token ? `(${token.substring(0, 20)}...)` : '');
      
      // Add timeout protection
      const timeoutId = setTimeout(() => {
        console.warn('⏰ Auth check timeout, setting loading to false');
        setLoading(false);
      }, 5000); // 5 second timeout
      
      try {
        if (token && token !== 'demo-token-' && !token.startsWith('demo-token-')) {
          console.log('🌐 Attempting to validate token with backend...');
          try {
            const response = await api.get('/api/auth/user');
            console.log('✅ Backend validation successful:', response.data);
            setUser(response.data);
          } catch (error) {
            console.error('❌ Auth check failed:', error);
            safeRemoveItem();
            // Don't set user, let them go to login
            setUser(null);
          }
        } else if (token && token.startsWith('demo-token-')) {
          if (isProduction) {
            console.warn('🚫 Demo token detected in production. Clearing token.');
            safeRemoveItem();
            setUser(null);
          } else {
            console.log('🎭 Using demo mode with mock user');
            // Use mock user for demo tokens
            setUser(mockUser);
          }
        } else {
          console.log('🚫 No valid token found, user needs to login');
          // No token, user needs to login
          setUser(null);
        }
      } catch (error) {
        console.error('💥 Unexpected error in checkAuth:', error);
        setUser(null);
      } finally {
        clearTimeout(timeoutId);
        console.log('🏁 Auth check completed, setting loading to false');
        setLoading(false);
      }
    };

    checkAuth();
  }, [safeGetItem, safeRemoveItem, isProduction]);

  // Add debug functions to window for testing
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).debugAuth = {
      setLoading: setLoadingManually,
      setUser,
      getUser: () => user,
      getLoading: () => loading,
      clearToken: () => safeRemoveItem(),
      setDemoToken: () => safeSetItem('token', 'demo-token-' + Date.now()),
      testLocalStorage: isLocalStorageAvailable,
    };
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      safeSetItem('token', token);
      setUser(user);
      
      toast.success('Welcome back!');
    } catch (error: any) {
      console.error('Backend login failed:', error);
      if (isProduction) {
        toast.error('Login failed. Please try again.');
        return;
      }
      // Development/demo fallback
      const demoUser: User = {
        ...mockUser,
        email: email,
        firstName: email.split('@')[0] || 'Demo',
        lastName: 'User',
      };
      setUser(demoUser);
      safeSetItem('token', 'demo-token-' + Date.now());
      toast.success('Welcome! (Demo mode)');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      const { token, user } = response.data;
      
      safeSetItem('token', token);
      setUser(user);
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Backend registration failed:', error);
      if (isProduction) {
        toast.error('Registration failed. Please try again.');
        return;
      }
      // Development/demo fallback
      const demoUser: User = {
        ...mockUser,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        fitnessLevel: userData.fitnessLevel || 'beginner',
        fitnessGoals: userData.fitnessGoals || ['general-fitness'],
      };
      setUser(demoUser);
      safeSetItem('token', 'demo-token-' + Date.now());
      toast.success('Account created successfully! (Demo mode)');
    }
  };

  const logout = () => {
    safeRemoveItem();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
      if (token && token.startsWith('demo-token-')) {
        if (isProduction) {
          toast.error('Demo mode is disabled in production. Please log in.');
          setUser(null);
          return;
        }
        // Demo mode (development): update locally without hitting backend
        setUser((prev) => prev ? { ...prev, ...userData } as User : prev);
        toast.success('Profile updated (demo mode)');
        return;
      }

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
      
      safeSetItem('token', token);
      setUser(user);
      
      toast.success(`Welcome! You've signed in with ${provider}`);
    } catch (error: any) {
      console.error('Backend social login failed:', error);
      if (isProduction) {
        toast.error('Social login failed. Please try another method.');
        return;
      }
      // Development/demo fallback
      const demoUser: User = {
        ...mockUser,
        id: socialData.id,
        email: socialData.email,
        firstName: socialData.firstName,
        lastName: socialData.lastName,
        profilePicture: socialData.profilePicture,
      };
      setUser(demoUser);
      safeSetItem('token', 'demo-token-' + Date.now());
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
