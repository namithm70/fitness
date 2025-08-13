import React, { useState } from 'react';
import { 
  Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, 
  Clock, MapPin, Eye, ThumbsUp, Award, Target, Calendar,
  Utensils, TrendingUp, Image, Video, FileText
} from 'lucide-react';
import { Post } from '../../types/community';
import { api } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';

interface PostCardProps {
  post: Post;
  onInteraction?: (postId: string, action: 'like' | 'comment' | 'share' | 'bookmark') => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onInteraction }) => {
  const { user: currentUser } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser?.id || ''));
  const [isBookmarked, setIsBookmarked] = useState(post.bookmarks.includes(currentUser?.id || ''));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentCount, setCommentCount] = useState(post.comments.length);
  const [shareCount, setShareCount] = useState(post.shares.length);

  const handleLike = async () => {
    try {
      const response = await api.post(`/community/posts/${post._id}/like`);
      setIsLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
      onInteraction?.(post._id, 'like');
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      await api.post(`/community/posts/${post._id}/comment`, {
        content: newComment
      });
      setNewComment('');
      setCommentCount(prev => prev + 1);
      onInteraction?.(post._id, 'comment');
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const handleShare = async () => {
    try {
      // In a real app, this would open a share dialog
      if (navigator.share) {
        await navigator.share({
          title: post.title || 'Check out this post',
          text: post.content,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
      }
      setShareCount(prev => prev + 1);
      onInteraction?.(post._id, 'share');
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      // This would be a separate API endpoint in a real app
      setIsBookmarked(!isBookmarked);
      onInteraction?.(post._id, 'bookmark');
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  };

  const getPostTypeIcon = () => {
    switch (post.type) {
      case 'photo': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'workout': return <Target className="w-4 h-4" />;
      case 'progress': return <TrendingUp className="w-4 h-4" />;
      case 'meal': return <Utensils className="w-4 h-4" />;
      case 'achievement': return <Award className="w-4 h-4" />;
      case 'challenge': return <Target className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPostTypeColor = () => {
    switch (post.type) {
      case 'photo': return 'text-purple-600 bg-purple-100';
      case 'video': return 'text-red-600 bg-red-100';
      case 'workout': return 'text-blue-600 bg-blue-100';
      case 'progress': return 'text-green-600 bg-green-100';
      case 'meal': return 'text-orange-600 bg-orange-100';
      case 'achievement': return 'text-yellow-600 bg-yellow-100';
      case 'challenge': return 'text-indigo-600 bg-indigo-100';
      case 'event': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-lg transition-shadow"
    >
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={post.user.profilePicture || '/default-avatar.png'}
              alt={post.user.firstName}
              className="w-10 h-10 rounded-full object-cover"
            />
            {post.user.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
                <Award className="w-3 h-3" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">
                {post.user.firstName} {post.user.lastName}
              </h3>
              {post.user.username && (
                <span className="text-gray-500 text-sm">@{post.user.username}</span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(post.createdAt)}</span>
              {post.locationName && (
                <>
                  <MapPin className="w-3 h-3" />
                  <span>{post.locationName}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor()}`}>
            {getPostTypeIcon()}
            <span className="capitalize">{post.type}</span>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        {post.title && (
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
        )}
        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className="mb-4">
          {post.media.map((media, index) => (
            <div key={index} className="mb-2">
              {media.type === 'image' && (
                <img
                  src={media.url}
                  alt={media.caption || 'Post image'}
                  className="w-full rounded-lg object-cover max-h-96"
                />
              )}
              {media.type === 'video' && (
                <video
                  src={media.url}
                  controls
                  className="w-full rounded-lg max-h-96"
                />
              )}
              {media.caption && (
                <p className="text-sm text-gray-600 mt-1">{media.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Post Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Post Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{post.viewCount} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{likeCount} likes</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-4 h-4" />
            <span>{commentCount} comments</span>
          </div>
          <div className="flex items-center space-x-1">
            <Share2 className="w-4 h-4" />
            <span>{shareCount} shares</span>
          </div>
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">Like</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-medium">Comment</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
        
        <button
          onClick={handleBookmark}
          className={`transition-colors ${
            isBookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t pt-4 mt-4">
          {/* Add Comment */}
          <div className="flex items-center space-x-3 mb-4">
            <img
              src="/default-avatar.png"
              alt="Your avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
            </div>
            <button
              onClick={handleComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <div key={comment._id} className="flex items-start space-x-3">
                <img
                  src={comment.user.profilePicture || '/default-avatar.png'}
                  alt={comment.user.firstName}
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">
                        {comment.user.firstName} {comment.user.lastName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <button className="hover:text-red-500">Like</button>
                    <button className="hover:text-blue-500">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PostCard;
