import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { webrtcService } from '../services/webrtcService';
import { CallState, CallUser, CallPermissions, CallSettings } from '../types/calling';
import { useAuth } from './AuthContext';

interface CallingContextType {
  callState: CallState;
  permissions: CallPermissions;
  callSettings: CallSettings;
  startCall: (userId: string, callType: 'audio' | 'video') => Promise<boolean>;
  answerCall: (callId: string, accepted: boolean) => Promise<boolean>;
  endCall: (reason?: 'user_hangup' | 'user_busy' | 'user_declined' | 'connection_failed' | 'timeout') => void;
  toggleMute: () => boolean;
  toggleVideo: () => boolean;
  toggleScreenShare: () => Promise<boolean>;
  requestPermissions: () => Promise<CallPermissions>;
  updateCallSettings: (settings: Partial<CallSettings>) => void;
  getOnlineUsers: () => CallUser[];
}

const CallingContext = createContext<CallingContextType | undefined>(undefined);

interface CallingProviderProps {
  children: ReactNode;
}

export const CallingProvider: React.FC<CallingProviderProps> = ({ children }) => {
  const [callState, setCallState] = useState<CallState>(webrtcService.getCallState());
  const [permissions, setPermissions] = useState<CallPermissions>({
    camera: false,
    microphone: false,
    screenShare: true
  });
  const [callSettings, setCallSettings] = useState<CallSettings>(webrtcService.getCallSettings());
  const [onlineUsers] = useState<CallUser[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Subscribe to call state changes
    const handleCallStateChange = (newState: CallState) => {
      setCallState(newState);
    };

    webrtcService.subscribeToCallState(handleCallStateChange);

    // Check permissions on mount
    checkPermissions();

    // Set current user when auth context is available
    if (user?.id) {
      webrtcService.setCurrentUser(user.id);
    }

    return () => {
      webrtcService.unsubscribeFromCallState(handleCallStateChange);
    };
  }, [user]);

  const checkPermissions = async () => {
    const currentPermissions = await webrtcService.checkPermissions();
    setPermissions(currentPermissions);
  };

  const requestPermissions = async (): Promise<CallPermissions> => {
    const newPermissions = await webrtcService.requestPermissions();
    setPermissions(newPermissions);
    return newPermissions;
  };

  const startCall = async (userId: string, callType: 'audio' | 'video'): Promise<boolean> => {
    // Check permissions first
    if (callType === 'video' && !permissions.camera) {
      const newPermissions = await requestPermissions();
      if (!newPermissions.camera) {
        return false;
      }
    }
    
    if (!permissions.microphone) {
      const newPermissions = await requestPermissions();
      if (!newPermissions.microphone) {
        return false;
      }
    }

    return await webrtcService.startCall(userId, callType);
  };

  const answerCall = async (callId: string, accepted: boolean): Promise<boolean> => {
    if (accepted) {
      // Check permissions for accepted calls
      const callType = callState.callType;
      if (callType === 'video' && !permissions.camera) {
        const newPermissions = await requestPermissions();
        if (!newPermissions.camera) {
          return false;
        }
      }
      
      if (!permissions.microphone) {
        const newPermissions = await requestPermissions();
        if (!newPermissions.microphone) {
          return false;
        }
      }
    }

    return await webrtcService.answerCall(callId, accepted);
  };

  const endCall = (reason: 'user_hangup' | 'user_busy' | 'user_declined' | 'connection_failed' | 'timeout' = 'user_hangup') => {
    webrtcService.endCall(reason);
  };

  const toggleMute = (): boolean => {
    return webrtcService.toggleMute();
  };

  const toggleVideo = (): boolean => {
    return webrtcService.toggleVideo();
  };

  const toggleScreenShare = async (): Promise<boolean> => {
    return await webrtcService.toggleScreenShare();
  };

  const updateCallSettings = (settings: Partial<CallSettings>) => {
    webrtcService.updateCallSettings(settings);
    setCallSettings(webrtcService.getCallSettings());
  };

  const getOnlineUsers = (): CallUser[] => {
    return onlineUsers;
  };

  const contextValue: CallingContextType = {
    callState,
    permissions,
    callSettings,
    startCall,
    answerCall,
    endCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    requestPermissions,
    updateCallSettings,
    getOnlineUsers
  };

  return (
    <CallingContext.Provider value={contextValue}>
      {children}
    </CallingContext.Provider>
  );
};

export const useCalling = (): CallingContextType => {
  const context = useContext(CallingContext);
  if (context === undefined) {
    throw new Error('useCalling must be used within a CallingProvider');
  }
  return context;
};

export default CallingContext;
