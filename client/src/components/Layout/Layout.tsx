import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  Home, 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  Users, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Overview & Stats' },
    { name: 'Workouts', href: '/workouts', icon: Dumbbell, description: 'Training & Routines' },
    { name: 'Nutrition', href: '/nutrition', icon: Apple, description: 'Meal Planning & Tracking' },
    { name: 'Progress', href: '/progress', icon: TrendingUp, description: 'Goals & Achievements' },
    { name: 'Community', href: '/community', icon: Users, description: 'Connect & Share' },
    { name: 'Profile', href: '/profile', icon: User, description: 'Personal Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-20' : 'w-80'}
      `}>
        <div className="flex flex-col h-full bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white/20 animate-pulse"></div>
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    FitLife
                  </h1>
                  <p className="text-xs text-white/60 font-medium">Premium Fitness</p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 hidden lg:block"
              >
                <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group relative flex items-center px-4 py-3 rounded-xl transition-all duration-200
                    ${active 
                      ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 shadow-lg shadow-purple-500/20' 
                      : 'hover:bg-white/10 hover:border-white/20 border border-transparent'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-r-full"></div>
                  )}
                  
                  {/* Icon */}
                  <div className={`
                    relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
                    ${active 
                      ? 'bg-white/20 text-purple-300' 
                      : 'text-white/70 group-hover:text-white group-hover:bg-white/10'
                    }
                  `}>
                    <Icon className="w-5 h-5" />
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* Text content */}
                  {!isCollapsed && (
                    <div className="ml-3 flex-1">
                      <span className={`
                        block font-medium transition-colors duration-200
                        ${active ? 'text-white' : 'text-white/90 group-hover:text-white'}
                      `}>
                        {item.name}
                      </span>
                      <span className={`
                        block text-xs transition-colors duration-200
                        ${active ? 'text-purple-200' : 'text-white/60 group-hover:text-white/80'}
                      `}>
                        {item.description}
                      </span>
                    </div>
                  )}
                  
                  {/* Hover effect */}
                  {!isCollapsed && (
                    <div className={`
                      absolute right-3 opacity-0 group-hover:opacity-100 transition-all duration-200
                      ${active ? 'text-purple-300' : 'text-white/60'}
                    `}>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-white/20 bg-white/5">
            <div className={`
              flex items-center space-x-3 p-3 rounded-xl transition-all duration-200
              ${isCollapsed ? 'justify-center' : ''}
            `}>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {user?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/20 flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.firstName || 'User'}
                  </p>
                  <p className="text-xs text-white/70 truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            {!isCollapsed && (
              <div className="mt-3 space-y-2">
                <button className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-lg transition-all duration-200 border border-white/20 hover:border-white/30">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-300 hover:text-red-200 rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-400/50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`lg:ml-80 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:ml-20' : 'lg:ml-80'}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-white/70">
                <span>Welcome back,</span>
                <span className="font-medium text-white">
                  {user?.firstName || 'User'}
                </span>
              </div>
              
              {/* Quick actions */}
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200">
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;