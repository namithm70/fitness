import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Video, Users, Search, Filter } from 'lucide-react';
import { useCalling } from '../../contexts/CallingContext';
import { CallUser } from '../../types/calling';
import { api } from '../../config/api';

interface UserCallListProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserCallList: React.FC<UserCallListProps> = ({ isOpen, onClose }) => {
  const { startCall, permissions } = useCalling();
  const [users, setUsers] = useState<CallUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOnline, setFilterOnline] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  // Debounced search effect
  useEffect(() => {
    if (!isOpen) return;

    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchUsers(searchTerm);
      } else {
        fetchUsers();
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, isOpen]);

  const fetchUsers = async (searchQuery: string = '') => {
    setLoading(true);
    try {
      let response;
      if (searchQuery.trim()) {
        // Use search endpoint for specific queries
        response = await api.get(`/api/users/search?q=${encodeURIComponent(searchQuery)}&limit=50`);
        const searchResults = response.data.users || response.data;
        
        // Transform search results to CallUser format
        const callUsers: CallUser[] = searchResults.map((user: any) => ({
          id: user._id || user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
          avatar: user.profilePicture,
          isOnline: user.isOnline || false
        }));
        
        setUsers(callUsers);
      } else {
        // Fetch all users for general display
        response = await api.get('/api/users');
        const apiUsers = response.data;
        
        // Transform API users to CallUser format
        const callUsers: CallUser[] = apiUsers.map((user: any) => ({
          id: user._id || user.id,
          name: user.name || 'Unknown User',
          avatar: user.avatar || user.profilePicture,
          isOnline: user.isOnline || false
        }));
        
        setUsers(callUsers);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // If API fails, show empty list instead of mock data
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    // Only apply online filter since search is handled by database
    const matchesFilter = !filterOnline || user.isOnline;
    return matchesFilter;
  });

  const handleStartCall = async (userId: string, callType: 'audio' | 'video') => {
    try {
      const success = await startCall(userId, callType);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Start a Call</h2>
              <p className="text-white/70 text-sm">Choose someone to call</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            {loading && searchTerm && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <button
            onClick={() => setFilterOnline(!filterOnline)}
            className={`px-4 py-3 rounded-xl flex items-center space-x-2 transition-colors ${
              filterOnline 
                ? 'bg-white text-purple-600' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Online</span>
          </button>
        </div>

        {/* User List */}
        <div className="max-h-96 overflow-y-auto space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">
                {users.length === 0 
                  ? (searchTerm.trim() 
                      ? `No users found matching "${searchTerm}"` 
                      : "No users available for calling"
                    )
                  : "No users match your search criteria"
                }
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white font-bold">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white/10 ${
                      user.isOnline ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{user.name}</h3>
                    <p className="text-white/60 text-sm">
                      {user.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Audio Call */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleStartCall(user.id, 'audio')}
                    disabled={!user.isOnline || !permissions.microphone}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      user.isOnline && permissions.microphone
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                    title="Audio Call"
                  >
                    <Phone className="w-5 h-5" />
                  </motion.button>

                  {/* Video Call */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleStartCall(user.id, 'video')}
                    disabled={!user.isOnline || !permissions.camera || !permissions.microphone}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      user.isOnline && permissions.camera && permissions.microphone
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                    title="Video Call"
                  >
                    <Video className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm text-white/60">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{users.filter(u => u.isOnline).length} online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span>{users.filter(u => !u.isOnline).length} offline</span>
              </div>
            </div>
            <div className="text-xs">
              {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserCallList;
