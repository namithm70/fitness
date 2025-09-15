import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  Home, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  Users, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  Bell, 
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SkipToContentLink } from '../UI/Accessibility';
import NotificationPanel from '../Community/NotificationPanel';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Workouts', href: '/workouts', icon: Dumbbell },
    { name: 'Nutrition', href: '/nutrition', icon: Utensils },
    { name: 'Progress', href: '/progress', icon: TrendingUp },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex transition-colors duration-300 overflow-x-hidden">
      <SkipToContentLink />
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/20 backdrop-blur-lg border-r border-white/20 shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header with glass effect */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/20 bg-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">FitLife</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-white/80 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1">
          <div className="space-y-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 ${
                    isActive(item.href)
                      ? 'bg-white text-purple-600 shadow-lg shadow-white/25'
                      : 'text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`mr-3 p-1.5 rounded-lg transition-all duration-200 ${
                    isActive(item.href) 
                      ? 'bg-purple-600/20' 
                      : 'bg-white/10 group-hover:bg-white/20 group-hover:shadow-sm'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isActive(item.href) ? 'text-purple-600' : 'text-white/70 group-hover:text-white'
                    }`} />
                  </div>
                  <span className="font-semibold">{item.name}</span>
                  {isActive(item.href) && (
                    <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User section with glass styling */}
        <div className="p-4 border-t border-white/20 bg-white/10">
          <div className="flex items-center space-x-3 mb-4 p-3 bg-white/10 rounded-xl">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">
                {user?.firstName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-white/70 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 flex items-center justify-center px-3 py-2.5 text-sm font-medium text-white bg-white/20 rounded-lg hover:bg-white/30 hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center px-3 py-2.5 text-sm font-medium text-red-300 bg-red-500/20 rounded-lg hover:bg-red-500/30 hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 max-w-lg lg:max-w-xs">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search workouts, nutrition, progress..."
                  className="w-full pl-10 pr-4 py-2.5 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 shadow-sm hover:shadow-md transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowNotifications(true)}
                className="text-white/80 hover:text-white relative p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                aria-label="View notifications"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
};

export default Layout;