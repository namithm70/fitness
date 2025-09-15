import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, TrendingUp, Target, Calendar, Users as GroupIcon, 
  Plus, Search, Bell, Phone
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
import UserCallList from './UserCallList';
import IncomingCallModal from './IncomingCallModal';
import ActiveCallInterface from './ActiveCallInterface';
import { useCalling } from '../../contexts/CallingContext';

const CommunityDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<CommunityDashboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCallList, setShowCallList] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'trending' | 'challenges' | 'events' | 'groups'>('feed');
  const [feedFilters, setFeedFilters] = useState({
    category: '',
    sort: 'recent' as 'recent' | 'trending' | 'popular'
  });
  
  const { callState } = useCalling();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/community/dashboard');
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
          followers: 0,
          following: 0,
          posts: 0,
          reputation: 0,
          level: 1,
          experience: 0
        },
        hasMore: false
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">Failed to load community dashboard</p>
      </div>
    );
  }

  const { posts, trendingPosts, activeChallenges, upcomingEvents, recommendedGroups, userStats } = dashboard;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-6 sm:space-y-0 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-3">Community</h1>
          <p className="text-white/80 text-lg">Connect with fellow fitness enthusiasts</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowSearch(true)}
            className="bg-white/20 text-white hover:bg-white/30 flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            <Search className="w-5 h-5 mr-3" />
            Search
          </button>
          <button
            onClick={() => setShowCallList(true)}
            className="bg-white/20 text-white hover:bg-white/30 flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            <Phone className="w-5 h-5 mr-3" />
            Call
          </button>
          <button
            onClick={() => setShowNotifications(true)}
            className="bg-white/20 text-white hover:bg-white/30 flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 relative"
          >
            <Bell className="w-5 h-5 mr-3" />
            {userStats.reputation > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                {Math.min(userStats.reputation, 99)}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowCreatePost(true)}
            className="bg-white text-purple-600 hover:bg-white/90 flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-3" />
            New Post
          </button>
        </div>
      </div>

      {/* User Stats */}
      <UserStats stats={userStats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Left Sidebar - Trending & Recommendations */}
        <div className="lg:col-span-1 space-y-10">
          {/* Trending Section */}
          <TrendingSection posts={trendingPosts} />
          
          {/* Active Challenges */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-white">Active Challenges</h3>
              <button className="text-white/80 hover:text-white text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200">
                View All
              </button>
            </div>
            <div className="space-y-6">
              {activeChallenges.slice(0, 3).map((challenge) => (
                <ChallengeCard key={challenge._id} challenge={challenge} compact />
              ))}
            </div>
          </div>

          {/* Recommended Groups */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-white">Recommended Groups</h3>
              <button className="text-white/80 hover:text-white text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200">
                View All
              </button>
            </div>
            <div className="space-y-6">
              {recommendedGroups.slice(0, 3).map((group) => (
                <GroupCard key={group._id} group={group} compact />
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-2">
          {/* Feed Tabs */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              {/* Feed Tabs */}
              <div className="flex flex-wrap gap-3">
                {(['feed', 'trending', 'challenges', 'events', 'groups'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-white text-purple-600 shadow-xl shadow-white/30 transform scale-105'
                        : 'text-white/90 hover:text-white hover:bg-white/20 hover:shadow-lg hover:shadow-white/10 hover:scale-105'
                    }`}
                  >
                    {getTabIcon(tab)}
                    <span className="ml-3 font-bold">{getTabLabel(tab)}</span>
                  </button>
                ))}
              </div>
              
              {/* Feed Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={feedFilters.category}
                  onChange={(e) => setFeedFilters({ ...feedFilters, category: e.target.value })}
                  className="text-sm border border-white/30 bg-white/15 backdrop-blur-sm text-white rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 hover:bg-white/25 hover:border-white/40 transition-all duration-300 min-w-[160px] shadow-lg shadow-black/20"
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
                  className="text-sm border border-white/30 bg-white/15 backdrop-blur-sm text-white rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 hover:bg-white/25 hover:border-white/40 transition-all duration-300 min-w-[140px] shadow-lg shadow-black/20"
                >
                  <option value="recent">Recent</option>
                  <option value="trending">Trending</option>
                  <option value="popular">Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Feed Content */}
          <div className="space-y-8">
            {activeTab === 'feed' && (
              <>
                {posts.length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-12 shadow-lg text-center">
                    <MessageCircle className="w-20 h-20 text-white/40 mx-auto mb-8" />
                    <h3 className="text-2xl font-bold text-white mb-4">No posts yet</h3>
                    <p className="text-white/70 mb-8 text-lg">Be the first to share your fitness journey!</p>
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="bg-white text-purple-600 hover:bg-white/90 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-12 shadow-lg text-center">
                    <TrendingUp className="w-20 h-20 text-white/40 mx-auto mb-8" />
                    <h3 className="text-2xl font-bold text-white mb-4">No trending posts</h3>
                    <p className="text-white/70 mb-8 text-lg">Check back later for trending content!</p>
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
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-12 shadow-lg text-center">
                    <Target className="w-20 h-20 text-white/40 mx-auto mb-8" />
                    <h3 className="text-2xl font-bold text-white mb-4">No active challenges</h3>
                    <p className="text-white/70 mb-8 text-lg">Join challenges to compete with others!</p>
                    <button className="bg-white text-purple-600 hover:bg-white/90 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl">
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
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-12 shadow-lg text-center">
                    <Calendar className="w-20 h-20 text-white/40 mx-auto mb-8" />
                    <h3 className="text-2xl font-bold text-white mb-4">No upcoming events</h3>
                    <p className="text-white/70 mb-8 text-lg">Join events to meet fellow fitness enthusiasts!</p>
                    <button className="bg-white text-purple-600 hover:bg-white/90 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl">
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
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-12 shadow-lg text-center">
                    <GroupIcon className="w-20 h-20 text-white/40 mx-auto mb-8" />
                    <h3 className="text-2xl font-bold text-white mb-4">No recommended groups</h3>
                    <p className="text-white/70 mb-8 text-lg">Join groups to connect with like-minded people!</p>
                    <button className="bg-white text-purple-600 hover:bg-white/90 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl">
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
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-white">Upcoming Events</h3>
              <button className="text-white/80 hover:text-white text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200">
                View All
              </button>
            </div>
            <div className="space-y-6">
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

      {showCallList && (
        <UserCallList
          isOpen={showCallList}
          onClose={() => setShowCallList(false)}
        />
      )}

      {/* Call Modals */}
      {callState.isCallIncoming && (
        <IncomingCallModal
          isOpen={callState.isCallIncoming}
          onClose={() => {}}
        />
      )}

      {callState.isCallActive && (
        <ActiveCallInterface
          isOpen={callState.isCallActive}
          onClose={() => {}}
        />
      )}
    </div>
  );
};

export default CommunityDashboard;
