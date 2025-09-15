import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { api } from '../config/api';
import { useAuth } from './AuthContext';

interface Notification {
  _id: string;
  recipient: string;
  sender?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  type: string;
  title: string;
  message: string;
  data?: {
    post?: any;
    comment?: any;
    challenge?: any;
    event?: any;
    group?: any;
    message?: any;
    achievement?: any;
    goal?: any;
    workout?: any;
    url?: string;
    metadata?: any;
  };
  isRead: boolean;
  readAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isActionable: boolean;
  actionUrl?: string;
  actionText?: string;
  icon?: string;
  image?: string;
  badge?: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: (page?: number, unreadOnly?: boolean) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  createDailyWorkoutSuggestion: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchNotifications = useCallback(async (page: number = 1, unreadOnly: boolean = false) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/api/notifications', {
        params: { page, limit: 20, unreadOnly }
      });

      const { notifications: fetchedNotifications, unreadCount: count } = response.data;
      
      if (page === 1) {
        setNotifications(fetchedNotifications);
      } else {
        setNotifications(prev => [...prev, ...fetchedNotifications]);
      }
      
      setUnreadCount(count);
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err);
      setError(err.response?.data?.error || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      await api.put(`/api/notifications/${notificationId}/read`);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true, readAt: new Date().toISOString() }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Failed to mark notification as read:', err);
      setError(err.response?.data?.error || 'Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
      
      setNotifications(prev => 
        prev.map(notif => ({ 
          ...notif, 
          isRead: true, 
          readAt: new Date().toISOString() 
        }))
      );
      
      setUnreadCount(0);
    } catch (err: any) {
      console.error('Failed to mark all notifications as read:', err);
      setError(err.response?.data?.error || 'Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await api.delete(`/api/notifications/${notificationId}`);
      
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      
      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find(notif => notif._id === notificationId);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err: any) {
      console.error('Failed to delete notification:', err);
      setError(err.response?.data?.error || 'Failed to delete notification');
    }
  };

  const createDailyWorkoutSuggestion = useCallback(async () => {
    try {
      await api.post('/api/notifications/create-daily-suggestion');
      // Refresh notifications to show the new suggestion
      await fetchNotifications(1, false);
    } catch (err: any) {
      console.error('Failed to create daily workout suggestion:', err);
      setError(err.response?.data?.error || 'Failed to create daily workout suggestion');
    }
  }, [fetchNotifications]); // Force rebuild to ensure latest changes are deployed

  const refreshNotifications = async () => {
    await fetchNotifications(1, false);
  };

  // Fetch notifications when user logs in
  useEffect(() => {
    if (user) {
      fetchNotifications(1, false);
      
      // Create daily workout suggestion if it doesn't exist
      createDailyWorkoutSuggestion();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications, createDailyWorkoutSuggestion]);

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchNotifications(1, false);
    }, 30000);

    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createDailyWorkoutSuggestion,
    refreshNotifications
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
