import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Video, Mic } from 'lucide-react';
import { useCalling } from '../../contexts/CallingContext';

interface IncomingCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({ isOpen, onClose }) => {
  const { callState, answerCall, endCall } = useCalling();

  const handleAccept = async () => {
    if (callState.currentCallId) {
      await answerCall(callState.currentCallId, true);
      onClose();
    }
  };

  const handleDecline = async () => {
    if (callState.currentCallId) {
      await answerCall(callState.currentCallId, false);
      endCall('user_declined');
      onClose();
    }
  };

  if (!isOpen || !callState.isCallIncoming) {
    return null;
  }

  const caller = callState.participants[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md w-full text-center"
        >
          {/* Caller Avatar */}
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              {caller?.avatar ? (
                <img
                  src={caller.avatar}
                  alt={caller.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {caller?.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {caller?.name || 'Unknown User'}
            </h2>
            <p className="text-white/70">
              {callState.callType === 'video' ? 'Video Call' : 'Audio Call'}
            </p>
          </div>

          {/* Call Type Icon */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center">
              {callState.callType === 'video' ? (
                <Video className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-6">
            {/* Decline Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDecline}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </motion.button>

            {/* Accept Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAccept}
              className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <Phone className="w-8 h-8 text-white" />
            </motion.button>
          </div>

          {/* Call Duration (if applicable) */}
          <div className="mt-6">
            <p className="text-white/50 text-sm">
              Tap to answer
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IncomingCallModal;
