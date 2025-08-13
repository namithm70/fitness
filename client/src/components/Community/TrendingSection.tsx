import React from 'react';
import { TrendingUp, Calendar, Users, Target, Award } from 'lucide-react';
import { Post } from '../../types/community';

interface TrendingSectionProps {
  posts: Post[];
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ posts }) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  if (posts.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Trending</h3>
        </div>
        <div className="text-center py-6">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No trending posts yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">Trending</h3>
      </div>
      <div className="space-y-3">
        {posts.slice(0, 5).map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <img
                    src={post.user.profilePicture || '/default-avatar.png'}
                    alt={post.user.firstName}
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="text-xs font-medium text-gray-900 truncate">
                    {post.user.firstName} {post.user.lastName}
                  </span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                  {post.content}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatTimeAgo(post.createdAt)}</span>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{post.viewCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{post.likes.length}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{post.comments.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {posts.length > 5 && (
        <div className="mt-4 pt-3 border-t">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Trending
          </button>
        </div>
      )}
    </div>
  );
};

export default TrendingSection;
