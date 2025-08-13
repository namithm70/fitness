import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, TrendingUp, Target, Calendar, Users as GroupIcon, 
  Plus, Search, Bell
} from 'lucide-react';
import { CommunityDashboard as CommunityDashboardType, User } from '../../types/community';
import { api } from '../../config/api';
import PostCard from './PostCard';
import ChallengeCard from './ChallengeCard';
import EventCard from './EventCard';
import GroupCard from './GroupCard';
import CreatePostModal from './CreatePostModal';
import SearchModal from './SearchModal';
import NotificationPanel from './NotificationPanel';
import UserStats from './UserStats';
import TrendingSection from './TrendingSection';

const CommunityDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<CommunityDashboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'trending' | 'challenges' | 'events' | 'groups'>('feed');
  const [feedFilters, setFeedFilters] = useState({
    category: '',
    sort: 'recent' as 'recent' | 'trending' | 'popular'
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/community/dashboard');
      setDashboard(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      // Set default data for development/demo purposes
      setDashboard({
        posts: [],
        trendingPosts: [],
        activeChallenges: [],
        upcomingEvents: [],
        recommendedGroups: [],
        userStats: {
          totalPosts: 0,
          totalLikes: 0,
          totalComments: 0,
          followers: 0,
          following: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    setShowCreatePost(false);
    fetchDashboard();
  };

  const handlePostInteraction = (postId: string, action: 'like' | 'comment' | 'share' | 'bookmark') => {
    // Update local state optimistically
    if (dashboard) {
      const updatedPosts = dashboard.posts.map(post => {
        if (post._id === postId) {
          switch (action) {
            case 'like':
              const isLiked = post.likes.includes(localStorage.getItem('userId') || '');
              return {
                ...post,
                likes: isLiked 
                  ? post.likes.filter(id => id !== localStorage.getItem('userId'))
                  : [...post.likes, localStorage.getItem('userId') || '']
              };
            case 'comment':
              return { ...post, comments: [...post.comments, { _id: Date.now().toString(), user: {} as User, content: '', likes: [], replies: [], createdAt: new Date().toISOString() }] };
            case 'share':
              return { ...post, shares: [...post.shares, localStorage.getItem('userId') || ''] };
            case 'bookmark':
              const isBookmarked = post.bookmarks.includes(localStorage.getItem('userId') || '');
              return {
                ...post,
                bookmarks: isBookmarked 
                  ? post.bookmarks.filter(id => id !== localStorage.getItem('userId'))
                  : [...post.bookmarks, localStorage.getItem('userId') || '']
              };
            default:
              return post;
          }
        }
        return post;
      });

      setDashboard({ ...dashboard, posts: updatedPosts });
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'feed': return <MessageCircle className="w-4 h-4" />;
      case 'trending': return <TrendingUp className="w-4 h-4" />;
      case 'challenges': return <Target className="w-4 h-4" />;
      case 'events': return <Calendar className="w-4 h-4" />;
      case 'groups': return <GroupIcon className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'feed': return 'Feed';
      case 'trending': return 'Trending';
      case 'challenges': return 'Challenges';
      case 'events': return 'Events';
      case 'groups': return 'Groups';
      default: return 'Feed';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load community dashboard</p>
      </div>
    );
  }

  const { posts, trendingPosts, activeChallenges, upcomingEvents, recommendedGroups, userStats } = dashboard;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
          <p className="text-gray-600">Connect with fellow fitness enthusiasts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSearch(true)}
            className="btn-secondary flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </button>
          <button
            onClick={() => setShowNotifications(true)}
            className="btn-secondary flex items-center relative"
          >
            <Bell className="w-4 h-4 mr-2" />
            {userStats.reputation > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {Math.min(userStats.reputation, 99)}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowCreatePost(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </button>
        </div>
      </div>

      {/* User Stats */}
      <UserStats stats={userStats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Trending & Recommendations */}
        <div className="lg:col-span-1 space-y-6">
          {/* Trending Section */}
          <TrendingSection posts={trendingPosts} />
          
          {/* Active Challenges */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Challenges</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {activeChallenges.slice(0, 3).map((challenge) => (
                <ChallengeCard key={challenge._id} challenge={challenge} compact />
              ))}
            </div>
          </div>

          {/* Recommended Groups */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recommended Groups</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recommendedGroups.slice(0, 3).map((group) => (
                <GroupCard key={group._id} group={group} compact />
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-2">
          {/* Feed Tabs */}
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-1">
                {(['feed', 'trending', 'challenges', 'events', 'groups'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {getTabIcon(tab)}
                    <span className="ml-2">{getTabLabel(tab)}</span>
                  </button>
                ))}
              </div>
              
              {/* Feed Filters */}
              <div className="flex items-center space-x-2">
                <select
                  value={feedFilters.category}
                  onChange={(e) => setFeedFilters({ ...feedFilters, category: e.target.value })}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="workout">Workout</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="progress">Progress</option>
                  <option value="motivation">Motivation</option>
                  <option value="tips">Tips</option>
                  <option value="general">General</option>
                </select>
                
                <select
                  value={feedFilters.sort}
                  onChange={(e) => setFeedFilters({ ...feedFilters, sort: e.target.value as any })}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">Recent</option>
                  <option value="trending">Trending</option>
                  <option value="popular">Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Feed Content */}
          <div className="space-y-6">
            {activeTab === 'feed' && (
              <>
                {posts.length === 0 ? (
                  <div className="card text-center py-12">
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-4">Be the first to share your fitness journey!</p>
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="btn-primary"
                    >
                      Create Your First Post
                    </button>
                  </div>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onInteraction={handlePostInteraction}
                    />
                  ))
                )}
              </>
            )}

            {activeTab === 'trending' && (
              <>
                {trendingPosts.length === 0 ? (
                  <div className="card text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No trending posts</h3>
                    <p className="text-gray-600">Check back later for trending content!</p>
                  </div>
                ) : (
                  trendingPosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onInteraction={handlePostInteraction}
                    />
                  ))
                )}
              </>
            )}

            {activeTab === 'challenges' && (
              <>
                {activeChallenges.length === 0 ? (
                  <div className="card text-center py-12">
                    <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No active challenges</h3>
                    <p className="text-gray-600 mb-4">Join challenges to compete with others!</p>
                    <button className="btn-primary">
                      Create Challenge
                    </button>
                  </div>
                ) : (
                  activeChallenges.map((challenge) => (
                    <ChallengeCard key={challenge._id} challenge={challenge} />
                  ))
                )}
              </>
            )}

            {activeTab === 'events' && (
              <>
                {upcomingEvents.length === 0 ? (
                  <div className="card text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming events</h3>
                    <p className="text-gray-600 mb-4">Join events to meet fellow fitness enthusiasts!</p>
                    <button className="btn-primary">
                      Create Event
                    </button>
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))
                )}
              </>
            )}

            {activeTab === 'groups' && (
              <>
                {recommendedGroups.length === 0 ? (
                  <div className="card text-center py-12">
                    <GroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No recommended groups</h3>
                    <p className="text-gray-600 mb-4">Join groups to connect with like-minded people!</p>
                    <button className="btn-primary">
                      Create Group
                    </button>
                  </div>
                ) : (
                  recommendedGroups.map((group) => (
                    <GroupCard key={group._id} group={group} />
                  ))
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar - Upcoming Events */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {upcomingEvents.slice(0, 3).map((event) => (
                <EventCard key={event._id} event={event} compact />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreatePost && (
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {showSearch && (
        <SearchModal
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
        />
      )}

      {showNotifications && (
        <NotificationPanel
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default CommunityDashboard;
