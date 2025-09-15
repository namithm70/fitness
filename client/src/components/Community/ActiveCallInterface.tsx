import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorOff,
  Settings,
  Users,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useCalling } from '../../contexts/CallingContext';
import CallSettings from './CallSettings';

interface ActiveCallInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActiveCallInterface: React.FC<ActiveCallInterfaceProps> = ({ isOpen, onClose }) => {
  const { 
    callState, 
    endCall, 
    toggleMute, 
    toggleVideo, 
    toggleScreenShare 
  } = useCalling();
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (callState.localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = callState.localStream;
    }
  }, [callState.localStream]);

  useEffect(() => {
    if (callState.remoteStreams && Object.keys(callState.remoteStreams).length > 0) {
      const firstRemoteStream = Object.values(callState.remoteStreams)[0];
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = firstRemoteStream;
      }
    }
  }, [callState.remoteStreams]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState.isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState.isCallActive]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    endCall('user_hangup');
    onClose();
  };

  if (!isOpen || !callState.isCallActive) {
    return null;
  }

  const participants = callState.participants;
  const isVideoCall = callState.callType === 'video';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black z-50 ${isMinimized ? 'pointer-events-none' : ''}`}
      >
        {/* Main Call Interface */}
        <div className={`h-full flex flex-col ${isMinimized ? 'opacity-0' : 'opacity-100'}`}>
          {/* Video Area */}
          <div className="flex-1 relative bg-gray-900">
            {/* Remote Video */}
            <div className="absolute inset-0">
              {isVideoCall && callState.remoteStreams && Object.keys(callState.remoteStreams).length > 0 ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {participants[0]?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {participants[0]?.name || 'Unknown User'}
                    </h3>
                    <p className="text-white/70">
                      {isVideoCall ? 'Video call' : 'Audio call'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Local Video (Picture-in-Picture) */}
            {isVideoCall && callState.localStream && (
              <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {!callState.isVideoEnabled && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <VideoOff className="w-8 h-8 text-white/50" />
                  </div>
                )}
              </div>
            )}

            {/* Call Info Overlay */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2 text-white">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{formatDuration(callDuration)}</span>
              </div>
            </div>

            {/* Participants Count */}
            {participants.length > 2 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2 text-white">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">{participants.length} participants</span>
                </div>
              </div>
            )}
          </div>

          {/* Control Bar */}
          <div className="bg-black/80 backdrop-blur-lg border-t border-white/10 p-6">
            <div className="flex items-center justify-center space-x-6">
              {/* Mute/Unmute */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  callState.isMuted 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {callState.isMuted ? (
                  <MicOff className="w-6 h-6 text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </motion.button>

              {/* Video On/Off */}
              {isVideoCall && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleVideo}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    !callState.isVideoEnabled 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {callState.isVideoEnabled ? (
                    <Video className="w-6 h-6 text-white" />
                  ) : (
                    <VideoOff className="w-6 h-6 text-white" />
                  )}
                </motion.button>
              )}

              {/* Screen Share */}
              {isVideoCall && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleScreenShare}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    callState.isScreenSharing 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {callState.isScreenSharing ? (
                    <MonitorOff className="w-6 h-6 text-white" />
                  ) : (
                    <Monitor className="w-6 h-6 text-white" />
                  )}
                </motion.button>
              )}

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSettings(!showSettings)}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
              >
                <Settings className="w-6 h-6 text-white" />
              </motion.button>

              {/* Minimize */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
              >
                {isMinimized ? (
                  <Maximize2 className="w-6 h-6 text-white" />
                ) : (
                  <Minimize2 className="w-6 h-6 text-white" />
                )}
              </motion.button>

              {/* End Call */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleEndCall}
                className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors duration-200"
              >
                <PhoneOff className="w-6 h-6 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Call Settings Modal */}
        {showSettings && (
          <CallSettings
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
        )}

        {/* Minimized Call Window */}
        {isMinimized && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-4 right-4 w-80 h-48 bg-black/90 backdrop-blur-lg border border-white/20 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setIsMinimized(false)}
          >
            <div className="h-full flex">
              {/* Video Preview */}
              <div className="flex-1 relative">
                {isVideoCall && callState.remoteStreams && Object.keys(callState.remoteStreams).length > 0 ? (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {participants[0]?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <p className="text-white text-sm font-medium">
                        {participants[0]?.name || 'Unknown User'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Call Info */}
              <div className="w-24 bg-black/50 flex flex-col items-center justify-center p-2">
                <div className="text-white text-xs text-center mb-2">
                  <div className="font-medium">{formatDuration(callDuration)}</div>
                  <div className="text-white/70">
                    {isVideoCall ? 'Video' : 'Audio'}
                  </div>
                </div>
                
                {/* Quick Controls */}
                <div className="space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      callState.isMuted ? 'bg-red-500' : 'bg-white/20'
                    }`}
                  >
                    {callState.isMuted ? (
                      <MicOff className="w-4 h-4 text-white" />
                    ) : (
                      <Mic className="w-4 h-4 text-white" />
                    )}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEndCall();
                    }}
                    className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"
                  >
                    <PhoneOff className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ActiveCallInterface;
