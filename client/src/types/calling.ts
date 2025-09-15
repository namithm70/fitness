export interface CallUser {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
}

export interface CallState {
  isInCall: boolean;
  isCallActive: boolean;
  isCallIncoming: boolean;
  isCallOutgoing: boolean;
  callType: 'audio' | 'video' | null;
  participants: CallUser[];
  currentCallId: string | null;
  localStream: MediaStream | null;
  remoteStreams: { [userId: string]: MediaStream };
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
}

export interface CallOffer {
  from: CallUser;
  to: CallUser;
  callType: 'audio' | 'video';
  callId: string;
  timestamp: number;
}

export interface CallAnswer {
  callId: string;
  accepted: boolean;
  timestamp: number;
}

export interface CallEnd {
  callId: string;
  reason: 'user_hangup' | 'user_busy' | 'user_declined' | 'connection_failed' | 'timeout';
  timestamp: number;
}

export interface CallSignal {
  callId: string;
  from: string;
  to: string;
  signal: any;
  type: 'offer' | 'answer' | 'ice-candidate';
}

export interface CallPermissions {
  camera: boolean;
  microphone: boolean;
  screenShare: boolean;
}

export interface CallSettings {
  audioInput: string;
  audioOutput: string;
  videoInput: string;
  audioQuality: 'low' | 'medium' | 'high';
  videoQuality: 'low' | 'medium' | 'high';
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
}
