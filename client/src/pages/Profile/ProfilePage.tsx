import React from 'react';
import { Settings, Edit, Play } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();

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

  return (
    <div className="space-y-6">
      {/* Demo mode indicator */}
      {isDemoMode && (
        <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-4 text-center">
          <p className="text-purple-300 text-sm">
            🎭 You're currently in Demo Mode. This is sample data for demonstration purposes.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-white/80">Manage your account and preferences</p>
        </div>
        <button className="bg-white text-purple-600 hover:bg-white/90 flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-200">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={user?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'}
                alt="Profile"
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-white/80">{user?.email}</p>
                <p className="text-sm text-white/60">
                  Member since {new Date().getFullYear()}
                </p>
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
        </div>

        {/* Stats */}
        <div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg">
            <h3 className="font-semibold text-white mb-4">Your Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-white/80">Total Workouts</span>
                <span className="font-semibold text-white">{user?.totalWorkouts || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Current Streak</span>
                <span className="font-semibold text-white">{user?.streakDays || 0} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Total Time</span>
                <span className="font-semibold text-white">{Math.floor((user?.totalWorkoutTime || 0) / 60)}h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Coming Soon */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg text-center py-12">
        <Settings className="w-16 h-16 text-white/40 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Profile Settings Coming Soon</h2>
        <p className="text-white/70">
          Advanced profile customization and settings will be available soon!
        </p>
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
