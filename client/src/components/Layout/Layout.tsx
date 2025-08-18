import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Dumbbell, Utensils, TrendingUp, Users, User, 
  Menu, X, LogOut, Settings, Bell, Search, MoreVert
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SkipToContentLink } from '../UI/Accessibility';
import DarkModeToggle from '../UI/DarkModeToggle';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
    <div className="min-h-screen surface flex motion-standard">
      <SkipToContentLink />
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-32 lg:hidden motion-standard"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Material 3 Navigation Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 surface-container elevation-1 transform motion-emphasized lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between h-16 px-6 surface-container-high">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center elevation-2">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <h1 className="headline-small text-surface-on-surface font-medium">FitLife</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl hover:bg-state-layers-hover motion-standard"
          >
            <X className="w-6 h-6 text-surface-on-surface" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 py-4 flex-1">
          <div className="space-y-1">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-6 py-4 rounded-2xl motion-standard relative ${
                    active
                      ? 'bg-primary text-white elevation-1'
                      : 'text-surface-on-surface hover:bg-state-layers-hover'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-full" />
                  )}
                  
                  <div className={`mr-4 p-2 rounded-xl ${
                    active 
                      ? 'bg-white bg-opacity-20' 
                      : 'bg-surface-container'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      active ? 'text-white' : 'text-surface-on-surface'
                    }`} />
                  </div>
                  <span className="title-medium">{item.name}</span>
                  
                  {/* Material 3 Active State Indicator */}
                  {active && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-outline-variant surface-container-high">
          <div className="flex items-center space-x-4 mb-4 p-4 surface-container-highest rounded-2xl">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center elevation-2">
              <span className="text-white title-medium font-medium">
                {user?.firstName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="title-medium text-surface-on-surface truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="body-small text-surface-on-surface-variant truncate">
                {user?.email}
              </p>
            </div>
            <button className="p-2 rounded-xl hover:bg-state-layers-hover motion-standard">
              <MoreVert className="w-5 h-5 text-surface-on-surface-variant" />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/profile')}
              className="btn-outlined flex-1 flex items-center justify-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span className="label-large">Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="btn-text flex items-center justify-center p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        
        {/* Material 3 Top App Bar */}
        <div className="sticky top-0 z-30 surface elevation-2">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            
            {/* Navigation Icon */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 rounded-xl hover:bg-state-layers-hover motion-standard"
            >
              <Menu className="w-6 h-6 text-surface-on-surface" />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <div className="surface-container-high rounded-2xl flex items-center px-4 py-3 hover:elevation-1 motion-standard">
                  <Search className="w-5 h-5 text-surface-on-surface-variant mr-3" />
                  <input
                    type="text"
                    placeholder="Search workouts, nutrition, progress..."
                    className="flex-1 bg-transparent text-surface-on-surface body-large placeholder-surface-on-surface-variant focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-2">
              <DarkModeToggle />
              
              {/* Notification Icon */}
              <button className="relative p-3 rounded-xl hover:bg-state-layers-hover motion-standard">
                <Bell className="w-6 h-6 text-surface-on-surface" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full"></span>
              </button>
              
              {/* Profile Avatar */}
              <button 
                onClick={() => navigate('/profile')}
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center elevation-1 hover:elevation-2 motion-standard"
              >
                <span className="text-white label-large font-medium">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main id="main-content" className="flex-1 surface-variant">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;