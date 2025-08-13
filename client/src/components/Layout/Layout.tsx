import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Dumbbell, 
  BookOpen, 
  TrendingUp, 
  Users, 
  User,
  Menu,
  X,
  Bell,
  Search,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Workouts', href: '/workouts', icon: Dumbbell },
    { name: 'Nutrition', href: '/nutrition', icon: BookOpen },
    { name: 'Progress', href: '/progress', icon: TrendingUp },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-8 border-b border-gray-100 bg-gradient-to-r from-fitness-500 to-fitness-600">
          <Link to="/dashboard" className="flex items-center">
            <h1 className="text-2xl font-bold text-white">FitLife</h1>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-8">
          <div className="space-y-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-6 py-4 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden ${
                    isActive(item.href)
                      ? 'bg-fitness-500 text-white shadow-lg shadow-fitness-500/25 transform scale-105'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {/* Active indicator */}
                  {isActive(item.href) && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                  )}
                  
                  {/* Icon with enhanced styling */}
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-4 transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-white bg-opacity-20'
                      : 'bg-gray-100 group-hover:bg-fitness-100'
                  }`}>
                    <Icon className={`w-5 h-5 transition-colors duration-200 ${
                      isActive(item.href) ? 'text-white' : 'text-gray-600 group-hover:text-fitness-600'
                    }`} />
                  </div>
                  
                  {/* Text */}
                  <span className="font-semibold">{item.name}</span>
                  
                  {/* Hover effect */}
                  {!isActive(item.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-fitness-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center mb-4 p-4 bg-white rounded-xl shadow-sm">
            <img
              src={user?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-4 ring-2 ring-fitness-100"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center w-full px-6 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-red-100 mr-4 transition-colors duration-200">
              <LogOut className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors duration-200" />
            </div>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top navigation */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Search bar */}
              <div className="ml-4 flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search workouts, exercises..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fitness-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="w-6 h-6" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <img
                    src={user?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user?.firstName}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
