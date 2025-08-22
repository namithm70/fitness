import React, { useState } from 'react';
import { 
  Settings, Edit, Play, Camera, Shield, 
  Trophy, Target, BarChart3, Heart, 
  Activity, Award, Star, Download, Share2,
  Lock, UserCheck, Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'activity' | 'settings' | 'privacy'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Debug logging
  console.log('ProfilePage render:', { user, loading });

  // Check if user is in demo mode
  const isDemoMode = user && localStorage.getItem('token')?.startsWith('demo-token-');

  // Test localStorage functionality
  const testLocalStorage = () => {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      const result = localStorage.getItem(test);
      localStorage.removeItem(test);
      return result === test;
    } catch (e) {
      console.error('localStorage test failed:', e);
      return false;
    }
  };

  // Show loading spinner if still loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-white/80 mt-4">Loading profile...</p>
          <p className="text-white/60 text-sm mt-2">This might take a few seconds</p>
          
          {/* Debug button for development */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={() => {
                if ((window as any).debugAuth) {
                  (window as any).debugAuth.setLoading(false);
                }
              }}
              className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm"
            >
              Force Stop Loading (Debug)
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">User not found</h1>
          <p className="text-white/80 mb-6">Please log in to view your profile.</p>
          
          {/* Debug information */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-200 mb-2">Debug Info:</p>
              <p className="text-xs text-red-300">Loading: {loading ? 'Yes' : 'No'}</p>
              <p className="text-xs text-red-300">User: {user ? 'Present' : 'Null'}</p>
              <p className="text-xs text-red-300">Token: {localStorage.getItem('token') ? 'Present' : 'Not found'}</p>
            </div>
          )}
          
          {/* Demo mode quick access */}
          <button 
            onClick={() => {
              localStorage.setItem('token', 'demo-token-' + Date.now());
              window.location.reload();
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center mx-auto"
          >
            <Play className="w-4 h-4 mr-2" />
            Try Demo Mode
          </button>
          
          {/* Quick test buttons */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  if ((window as any).debugAuth) {
                    (window as any).debugAuth.setLoading(false);
                  }
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm block mx-auto"
              >
                Force Stop Loading
              </button>
              <button
                onClick={() => {
                  if ((window as any).debugAuth) {
                    (window as any).debugAuth.setUser({
                      id: 'test-1',
                      email: 'test@example.com',
                      firstName: 'Test',
                      lastName: 'User',
                      fitnessLevel: 'beginner',
                      fitnessGoals: ['general-fitness'],
                      subscription: { type: 'free' },
                      totalWorkouts: 0,
                      totalWorkoutTime: 0,
                      streakDays: 0
                    });
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm block mx-auto"
              >
                Set Test User
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserCheck },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  const achievements = [
    { id: 1, name: 'First Workout', description: 'Completed your first workout', icon: Star, earned: true, date: '2024-01-15' },
    { id: 2, name: '7-Day Streak', description: 'Worked out for 7 consecutive days', icon: Heart, earned: true, date: '2024-01-22' },
    { id: 3, name: 'Weight Goal', description: 'Reached your target weight', icon: Target, earned: false, date: null },
    { id: 4, name: 'Fitness Master', description: 'Completed 100 workouts', icon: Award, earned: false, date: null }
  ];

  const recentActivity = [
    { id: 1, type: 'workout', title: 'Upper Body Strength', time: '2 hours ago', duration: '45 min', calories: 320 },
    { id: 2, type: 'weight', title: 'Weight Logged', time: '1 day ago', value: '75.2 kg', change: '-0.5 kg' },
    { id: 3, type: 'measurement', title: 'Body Measurements', time: '3 days ago', value: 'Updated', change: '+1 cm' },
    { id: 4, type: 'goal', title: 'New Goal Set', time: '1 week ago', value: 'Run 5K', change: 'In Progress' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Info */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg overflow-hidden">
        <div className="flex items-center space-x-4 mb-6 min-w-0">
          <div className="relative">
            <img
              src={user?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'}
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />
            <button className="absolute -bottom-1 -right-1 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-all duration-200">
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-white truncate">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-white/80 truncate">{user?.email}</p>
            <p className="text-sm text-white/60">
              Member since {new Date().getFullYear()}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full">
                {user?.subscription?.type || 'Free'} Plan
              </span>
              {isDemoMode && (
                <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 text-xs rounded-full">
                  Demo Mode
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-white mb-2">Fitness Level</h3>
            <p className="text-white/80 capitalize">{user?.fitnessLevel || 'Not set'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Goals</h3>
            <div className="flex flex-wrap gap-2">
              {user?.fitnessGoals && user.fitnessGoals.length > 0 ? (
                user.fitnessGoals.map((goal, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/20 text-white text-xs rounded-full"
                  >
                    {goal.replace('-', ' ')}
                  </span>
                ))
              ) : (
                <span className="text-white/60 text-sm">No goals set</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{user?.totalWorkouts || 0}</p>
          <p className="text-white/60 text-sm">Total Workouts</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{user?.streakDays || 0}</p>
          <p className="text-white/60 text-sm">Current Streak</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{Math.floor((user?.totalWorkoutTime || 0) / 60)}</p>
          <p className="text-white/60 text-sm">Total Hours</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{achievements.filter(a => a.earned).length}</p>
          <p className="text-white/60 text-sm">Achievements</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4 min-w-0">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <button className="text-white/80 hover:text-white text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentActivity.slice(0, 3).map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg min-w-0">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  {activity.type === 'workout' && <Activity className="w-5 h-5 text-blue-400" />}
                  {activity.type === 'weight' && <BarChart3 className="w-5 h-5 text-green-400" />}
                  {activity.type === 'measurement' && <Target className="w-5 h-5 text-purple-400" />}
                  {activity.type === 'goal' && <Star className="w-5 h-5 text-yellow-400" />}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">{activity.title}</p>
                  <p className="text-sm text-white/70 truncate">{activity.time}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-medium text-white">{activity.value || activity.duration}</p>
                {activity.change && (
                  <p className={`text-sm ${activity.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {activity.change}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Your Achievements</h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-yellow-400">{achievements.filter(a => a.earned).length}</p>
            <p className="text-white/60 text-sm">of {achievements.length} earned</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                achievement.earned
                  ? 'bg-yellow-600/20 border-yellow-500/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  achievement.earned ? 'bg-yellow-600/30' : 'bg-white/10'
                }`}>
                  <achievement.icon className={`w-6 h-6 ${
                    achievement.earned ? 'text-yellow-400' : 'text-white/40'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    achievement.earned ? 'text-yellow-300' : 'text-white/60'
                  }`}>
                    {achievement.name}
                  </h4>
                  <p className="text-sm text-white/70">{achievement.description}</p>
                  {achievement.earned && achievement.date && (
                    <p className="text-xs text-yellow-400/70 mt-1">
                      Earned {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Activity Timeline</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-white/20 text-white rounded-lg text-sm">All</button>
            <button className="px-3 py-1 bg-white/10 text-white/60 rounded-lg text-sm">Workouts</button>
            <button className="px-3 py-1 bg-white/10 text-white/60 rounded-lg text-sm">Progress</button>
          </div>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className="w-3 h-3 bg-purple-400 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white">{activity.title}</h4>
                  <span className="text-sm text-white/60">{activity.time}</span>
                </div>
                <p className="text-sm text-white/70 mt-1">
                  {activity.value || activity.duration}
                  {activity.change && (
                    <span className={`ml-2 ${
                      activity.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {activity.change}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-6">Profile Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
            <div>
              <h4 className="font-medium text-white">Email Notifications</h4>
              <p className="text-sm text-white/70">Receive updates about your progress</p>
            </div>
            <button className="w-12 h-6 bg-purple-600 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-all duration-200"></div>
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
            <div>
              <h4 className="font-medium text-white">Push Notifications</h4>
              <p className="text-sm text-white/70">Get reminded about workouts</p>
            </div>
            <button className="w-12 h-6 bg-purple-600 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-all duration-200"></div>
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
            <div>
              <h4 className="font-medium text-white">Dark Mode</h4>
              <p className="text-sm text-white/70">Use dark theme</p>
            </div>
            <button className="w-12 h-6 bg-purple-600 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-all duration-200"></div>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-6">Account Actions</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200">
            <span className="text-white">Export Data</span>
            <Download className="w-4 h-4 text-white/60" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200">
            <span className="text-white">Share Profile</span>
            <Share2 className="w-4 h-4 text-white/60" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all duration-200">
            <span className="text-red-300">Delete Account</span>
            <Lock className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-6">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
            <div>
              <h4 className="font-medium text-white">Profile Visibility</h4>
              <p className="text-sm text-white/70">Who can see your profile</p>
            </div>
            <select className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2">
              <option>Public</option>
              <option>Friends Only</option>
              <option>Private</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
            <div>
              <h4 className="font-medium text-white">Progress Sharing</h4>
              <p className="text-sm text-white/70">Share your fitness progress</p>
            </div>
            <button className="w-12 h-6 bg-purple-600 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-all duration-200"></div>
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
            <div>
              <h4 className="font-medium text-white">Activity Feed</h4>
              <p className="text-sm text-white/70">Show in community feed</p>
            </div>
            <button className="w-12 h-6 bg-purple-600 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-all duration-200"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
      {/* Demo mode indicator */}
      {isDemoMode && (
        <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-4 text-center">
          <p className="text-purple-300 text-sm">
            🎭 You're currently in Demo Mode. This is sample data for demonstration purposes.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-white/80">Manage your account and preferences</p>
        </div>
        <div className="flex space-x-3 min-w-0">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white/20 text-white hover:bg-white/30 flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-200"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          <button className="bg-white text-purple-600 hover:bg-white/90 flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-200">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-2 shadow-lg">
        <div className="flex flex-wrap md:flex-nowrap gap-1 md:space-x-1 px-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'activity' && renderActivity()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'privacy' && renderPrivacy()}
      </div>

      {/* Debug Section - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-red-300 mb-4">🔧 Debug Information</h3>
          <div className="text-sm text-red-200 space-y-2">
            <p>User ID: {user?.id || 'Not set'}</p>
            <p>Token: {localStorage.getItem('token') ? 'Present' : 'Not found'}</p>
            <p>Demo Mode: {isDemoMode ? 'Yes' : 'No'}</p>
            <p>Loading State: {loading ? 'Yes' : 'No'}</p>
            <p>User Object: {user ? 'Present' : 'Null'}</p>
            <p>User Email: {user?.email || 'Not set'}</p>
            <p>User Name: {user?.firstName} {user?.lastName}</p>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.reload();
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              >
                Clear Token
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('token', 'demo-token-' + Date.now());
                  window.location.reload();
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
              >
                Set Demo Token
              </button>
              <button
                onClick={() => {
                  if ((window as any).debugAuth) {
                    (window as any).debugAuth.setLoading(false);
                  }
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm"
              >
                Force Stop Loading
              </button>
            </div>
            <div className="mt-4 p-3 bg-black/20 rounded">
              <p className="text-xs text-red-300 mb-2">Console Commands:</p>
              <p className="text-xs text-red-200">debugAuth.getUser() - Get current user</p>
              <p className="text-xs text-red-200">debugAuth.getLoading() - Get loading state</p>
              <p className="text-xs text-red-200">debugAuth.setDemoToken() - Set demo token</p>
              <p className="text-xs text-red-200">debugAuth.clearToken() - Clear token</p>
              <p className="text-xs text-red-200">debugAuth.testLocalStorage() - Test localStorage</p>
            </div>
            <div className="mt-4 p-3 bg-black/20 rounded">
              <p className="text-xs text-red-300 mb-2">LocalStorage Test:</p>
              <p className="text-xs text-red-200">Status: {testLocalStorage() ? '✅ Working' : '❌ Failed'}</p>
              <button
                onClick={() => {
                  const result = testLocalStorage();
                  alert(`localStorage test: ${result ? 'PASSED' : 'FAILED'}`);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs mt-2"
              >
                Test localStorage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
