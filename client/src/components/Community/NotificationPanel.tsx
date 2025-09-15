import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  Dumbbell, 
  Users, 
  MessageCircle, 
  Trophy, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    createDailyWorkoutSuggestion
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'workout_reminder':
        return <Dumbbell className="w-5 h-5 text-blue-400" />;
      case 'post_like':
      case 'post_comment':
      case 'post_share':
        return <MessageCircle className="w-5 h-5 text-green-400" />;
      case 'follow':
      case 'follow_request':
        return <Users className="w-5 h-5 text-purple-400" />;
      case 'achievement_unlocked':
      case 'goal_complete':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'event_invite':
      case 'event_reminder':
        return <Calendar className="w-5 h-5 text-orange-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
    }
  };

  const handleCreateDailySuggestion = async () => {
    await createDailyWorkoutSuggestion();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/20">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-white border-b-2 border-blue-400'
                : 'text-white/70 hover:text-white'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'unread'
                ? 'text-white border-b-2 border-blue-400'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Actions */}
        <div className="p-4 border-b border-white/20 flex justify-between items-center">
          <button
            onClick={handleCreateDailySuggestion}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Get Daily Workout</span>
          </button>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-white/70 hover:text-white text-sm"
              >
                Try again
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/70 mb-4">
                {activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </p>
              {activeTab === 'all' && (
                <button
                  onClick={handleCreateDailySuggestion}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Get your first workout suggestion
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                    !notification.isRead ? 'bg-blue-500/10' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium text-sm">
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-white/50 text-xs">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-white/70 text-sm mt-1">
                        {notification.message}
                      </p>
                      
                      {notification.actionText && (
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="text-blue-400 text-xs font-medium">
                            {notification.actionText}
                          </span>
                          <ExternalLink className="w-3 h-3 text-blue-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification._id);
                        }}
                        className="text-white/30 hover:text-red-400 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
