import SimplePeer from 'simple-peer';
import { io, Socket } from 'socket.io-client';
import { 
  CallState, 
  CallOffer, 
  CallAnswer, 
  CallEnd, 
  CallSignal,
  CallPermissions,
  CallSettings 
} from '../types/calling';

// Browser polyfill: some dependencies (readable-stream used by simple-peer)
// expect a global `process`. Modern bundlers don't provide it by default.
// Provide a minimal stub to prevent "process is not defined" at runtime.
// This does NOT expose any sensitive vars; it's just an empty shell.
if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = { env: {} } as any;
}

class WebRTCService {
  private socket: Socket | null = null;
  private peers: { [userId: string]: SimplePeer.Instance } = {};
  private localStream: MediaStream | null = null;
  private remoteAudioElements: { [userId: string]: HTMLAudioElement } = {};
  private callState: CallState = {
    isInCall: false,
    isCallActive: false,
    isCallIncoming: false,
    isCallOutgoing: false,
    callType: null,
    participants: [],
    currentCallId: null,
    localStream: null,
    remoteStreams: {},
    isMuted: false,
    isVideoEnabled: true,
    isScreenSharing: false
  };
  private callStateListeners: ((state: CallState) => void)[] = [];
  private currentUserId: string | null = null;
  private onlineUsers: Set<string> = new Set();
  private callSettings: CallSettings = {
    audioInput: 'default',
    audioOutput: 'default',
    videoInput: 'default',
    audioQuality: 'high',
    videoQuality: 'high',
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  };


  private initializeSocket() {
    // Use the same URL logic as the API configuration
    // Force rebuild to ensure latest changes are deployed
    const socketUrl = process.env.NODE_ENV === 'production'
      ? 'https://fitness-fkct.onrender.com'
      : (process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
    
    console.log('WebRTC Socket URL:', socketUrl);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('REACT_APP_SOCKET_URL:', process.env.REACT_APP_SOCKET_URL);
    
    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('WebRTC Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebRTC Socket disconnected');
      this.endCall('connection_failed');
    });

    // Call signaling events
    this.socket.on('call-offer', this.handleCallOffer.bind(this));
    this.socket.on('call-answer', this.handleCallAnswer.bind(this));
    this.socket.on('call-end', this.handleCallEnd.bind(this));
    this.socket.on('call-signal', this.handleCallSignal.bind(this));
    this.socket.on('user-online', this.handleUserOnline.bind(this));
    this.socket.on('user-offline', this.handleUserOffline.bind(this));
  }

  public async ensureConnected(userId: string): Promise<void> {
    // Initialize socket and join room if needed
    if (!this.socket) {
      this.initializeSocket();
    }
    if (this.currentUserId !== userId) {
      this.setCurrentUser(userId);
    }
    if (!this.socket) return;
    if (this.socket.connected) return;
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('socket-timeout')), 5000);
      this.socket?.once('connect', () => { clearTimeout(timer); resolve(); });
    });
  }

  public setCurrentUser(userId: string) {
    this.currentUserId = userId;
    
    // Initialize socket if not already done
    if (!this.socket) {
      this.initializeSocket();
    }
    
    if (this.socket) {
      this.socket.emit('join-calling', { userId });
    }
  }

  public subscribeToCallState(callback: (state: CallState) => void) {
    this.callStateListeners.push(callback);
    // Immediately call with current state
    callback(this.callState);
  }

  public unsubscribeFromCallState(callback: (state: CallState) => void) {
    this.callStateListeners = this.callStateListeners.filter(cb => cb !== callback);
  }

  private notifyCallStateListeners() {
    this.callStateListeners.forEach(callback => callback(this.callState));
  }

  private updateCallState(updates: Partial<CallState>) {
    this.callState = { ...this.callState, ...updates };
    this.notifyCallStateListeners();
  }

  public async checkPermissions(): Promise<CallPermissions> {
    try {
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      const micPermissions = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      return {
        camera: permissions.state === 'granted',
        microphone: micPermissions.state === 'granted',
        screenShare: true // Screen share permission is requested at runtime
      };
    } catch (error) {
      console.warn('Permission check failed:', error);
      return {
        camera: false,
        microphone: false,
        screenShare: true
      };
    }
  }

  public async requestPermissions(options?: { audio?: boolean; video?: boolean }): Promise<CallPermissions> {
    const wantAudio = options?.audio !== false; // default true
    const wantVideo = options?.video === true;  // default false unless explicitly true
    try {
      // Probe available devices to provide helpful errors
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMic = devices.some(d => d.kind === 'audioinput');
      const hasCam = devices.some(d => d.kind === 'videoinput');

      const constraints: MediaStreamConstraints = {
        audio: wantAudio ? true : false,
        video: wantVideo ? true : false
      };

      if (wantAudio && !hasMic) {
        throw new Error('no-microphone');
      }
      if (wantVideo && !hasCam) {
        throw new Error('no-camera');
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Stop the stream immediately as we just needed to request permissions
      stream.getTracks().forEach(track => track.stop());
      
      return {
        camera: wantVideo ? true : this.callState.isVideoEnabled,
        microphone: wantAudio ? true : this.callState.isMuted === false,
        screenShare: true
      };
    } catch (error: any) {
      console.error('Permission request failed:', error);
      // Bubble specific markers so UI can guide user to site settings
      if (error?.name === 'NotAllowedError') {
        throw new Error('permission-denied');
      }
      if (error?.name === 'NotFoundError' || error?.message === 'no-microphone') {
        throw new Error('no-microphone');
      }
      if (error?.message === 'no-camera') {
        throw new Error('no-camera');
      }
      throw error;
    }
  }

  public async startCall(
    userId: string,
    callType: 'audio' | 'video',
    callerName?: string,
    calleeName?: string
  ): Promise<boolean> {
    if (!this.socket || !this.currentUserId) {
      throw new Error('Socket not connected or user not set');
    }

    try {
      // Get local media stream
      const constraints = {
        video: callType === 'video' ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } : false,
        audio: {
          echoCancellation: this.callSettings.echoCancellation,
          noiseSuppression: this.callSettings.noiseSuppression,
          autoGainControl: this.callSettings.autoGainControl
        }
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      // Ensure local audio is not muted by default
      this.localStream.getAudioTracks().forEach(t => (t.enabled = true));
      
      const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      this.updateCallState({
        isInCall: true,
        isCallOutgoing: true,
        callType,
        currentCallId: callId,
        localStream: this.localStream,
        participants: [{ id: this.currentUserId, name: 'You', isOnline: true }]
      });

      // Create peer connection for the call
      this.createPeerConnection(userId, true);

      // Send call offer
      const offer: CallOffer = {
        from: { id: this.currentUserId as string, name: callerName || 'Unknown', isOnline: true },
        to: { id: userId, name: calleeName || 'Unknown', isOnline: true },
        callType,
        callId,
        timestamp: Date.now()
      };

      this.socket.emit('call-offer', offer);
      
      // Set timeout for call
      setTimeout(() => {
        if (this.callState.isCallOutgoing && !this.callState.isCallActive) {
          this.endCall('timeout');
        }
      }, 30000); // 30 second timeout

      return true;
    } catch (error) {
      console.error('Failed to start call:', error);
      this.endCall('connection_failed');
      return false;
    }
  }

  public async answerCall(callId: string, accepted: boolean): Promise<boolean> {
    if (!this.socket || !this.currentUserId) {
      throw new Error('Socket not connected or user not set');
    }

    // Route answer back to caller using current participants[0] (the caller)
    const callerId = this.callState.participants[0]?.id as string;
    const answer: CallAnswer = {
      callId,
      accepted,
      timestamp: Date.now(),
      to: callerId
    };

    this.socket.emit('call-answer', answer);

    if (accepted) {
      try {
        // Get local media stream
        const callType = this.callState.callType || 'video';
        const constraints = {
          video: callType === 'video' ? {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          } : false,
          audio: {
            echoCancellation: this.callSettings.echoCancellation,
            noiseSuppression: this.callSettings.noiseSuppression,
            autoGainControl: this.callSettings.autoGainControl
          }
        };

        this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Create peer connection for answering the call
        const callerId = this.callState.participants[0]?.id;
        if (callerId) {
          this.createPeerConnection(callerId, false);
        }
        
        this.updateCallState({
          isCallIncoming: false,
          isCallActive: true,
          localStream: this.localStream
        });

        return true;
      } catch (error) {
        console.error('Failed to answer call:', error);
        this.endCall('connection_failed');
        return false;
      }
    } else {
      this.endCall('user_declined');
      return false;
    }
  }

  public endCall(reason: 'user_hangup' | 'user_busy' | 'user_declined' | 'connection_failed' | 'timeout' = 'user_hangup') {
    if (!this.socket || !this.callState.currentCallId) {
      return;
    }

    const callEnd: CallEnd = {
      callId: this.callState.currentCallId,
      reason,
      timestamp: Date.now()
    };

    this.socket.emit('call-end', callEnd);

    // Clean up
    this.cleanupCall();
  }

  private cleanupCall() {
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Close all peer connections
    Object.values(this.peers).forEach(peer => {
      peer.destroy();
    });
    this.peers = {};

    // Remove remote audio elements
    Object.values(this.remoteAudioElements).forEach(a => {
      try {
        a.srcObject = null;
        a.remove();
      } catch {}
    });
    this.remoteAudioElements = {};

    // Reset call state
    this.updateCallState({
      isInCall: false,
      isCallActive: false,
      isCallIncoming: false,
      isCallOutgoing: false,
      callType: null,
      participants: [],
      currentCallId: null,
      localStream: null,
      remoteStreams: {},
      isMuted: false,
      isVideoEnabled: true,
      isScreenSharing: false
    });
  }

  public toggleMute(): boolean {
    if (!this.localStream) return false;

    const audioTracks = this.localStream.getAudioTracks();
    audioTracks.forEach(track => {
      track.enabled = !track.enabled;
    });

    const isMuted = !audioTracks[0]?.enabled;
    this.updateCallState({ isMuted });
    return isMuted;
  }

  public toggleVideo(): boolean {
    if (!this.localStream) return false;

    const videoTracks = this.localStream.getVideoTracks();
    videoTracks.forEach(track => {
      track.enabled = !track.enabled;
    });

    const isVideoEnabled = videoTracks[0]?.enabled || false;
    this.updateCallState({ isVideoEnabled });
    return isVideoEnabled;
  }

  public async toggleScreenShare(): Promise<boolean> {
    if (!this.localStream) return false;

    try {
      if (this.callState.isScreenSharing) {
        // Stop screen sharing and return to camera
        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          },
          audio: false
        };
        
        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        this.replaceStream(newStream);
        this.updateCallState({ isScreenSharing: false });
        return false;
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        this.replaceStream(screenStream);
        this.updateCallState({ isScreenSharing: true });
        return true;
      }
    } catch (error) {
      console.error('Screen share toggle failed:', error);
      return this.callState.isScreenSharing;
    }
  }

  private replaceStream(newStream: MediaStream) {
    if (!this.localStream) return;

    // Replace tracks in existing stream
    const newVideoTrack = newStream.getVideoTracks()[0];
    const newAudioTrack = newStream.getAudioTracks()[0];
    
    if (newVideoTrack) {
      const oldVideoTrack = this.localStream.getVideoTracks()[0];
      if (oldVideoTrack) {
        this.localStream.removeTrack(oldVideoTrack);
        oldVideoTrack.stop();
      }
      this.localStream.addTrack(newVideoTrack);
    }
    
    if (newAudioTrack) {
      const oldAudioTrack = this.localStream.getAudioTracks()[0];
      if (oldAudioTrack) {
        this.localStream.removeTrack(oldAudioTrack);
        oldAudioTrack.stop();
      }
      this.localStream.addTrack(newAudioTrack);
    }

    // Update peer connections
    Object.values(this.peers).forEach(peer => {
      if (newVideoTrack) {
        const oldVideoTrack = this.localStream!.getVideoTracks()[0];
        if (oldVideoTrack) {
          peer.replaceTrack(oldVideoTrack, newVideoTrack, this.localStream!);
        }
      }
      if (newAudioTrack) {
        const oldAudioTrack = this.localStream!.getAudioTracks()[0];
        if (oldAudioTrack) {
          peer.replaceTrack(oldAudioTrack, newAudioTrack, this.localStream!);
        }
      }
    });

    this.localStream = newStream;
    this.updateCallState({ localStream: this.localStream });
  }

  // Socket event handlers
  private handleCallOffer(offer: CallOffer) {
    this.updateCallState({
      isCallIncoming: true,
      callType: offer.callType,
      currentCallId: offer.callId,
      participants: [offer.from]
    });
  }

  private handleCallAnswer(answer: CallAnswer) {
    if (answer.accepted) {
      this.updateCallState({
        isCallOutgoing: false,
        isCallActive: true
      });
    } else {
      this.endCall('user_declined');
    }
  }

  private handleCallEnd(callEnd: CallEnd) {
    this.cleanupCall();
  }

  private createPeerConnection(userId: string, isInitiator: boolean) {
    const peer = new SimplePeer({
      initiator: isInitiator,
      trickle: false,
      stream: this.localStream || undefined,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    peer.on('signal', (data) => {
      // Send signaling data to the other peer
      if (this.socket) {
        this.socket.emit('call-signal', {
          callId: this.callState.currentCallId,
          from: this.currentUserId,
          to: userId,
          signal: data,
          type: 'offer'
        });
      }
    });

    peer.on('stream', (stream) => {
      // Handle incoming stream from remote peer
      console.log('Received remote stream from', userId);
      this.updateCallState({
        remoteStreams: {
          ...this.callState.remoteStreams,
          [userId]: stream
        }
      });

      try {
        if (!this.remoteAudioElements[userId]) {
          const audio = document.createElement('audio');
          audio.autoplay = true;
          ;(audio as any).playsInline = true;
          audio.style.display = 'none';
          audio.srcObject = stream as any;
          document.body.appendChild(audio);
          this.remoteAudioElements[userId] = audio;
        } else {
          this.remoteAudioElements[userId].srcObject = stream as any;
        }
      } catch (e) {
        console.warn('Failed to attach remote audio element', e);
      }
    });

    peer.on('connect', () => {
      console.log('Peer connection established with', userId);
    });

    peer.on('error', (err) => {
      console.error('Peer connection error:', err);
    });

    peer.on('close', () => {
      console.log('Peer connection closed with', userId);
      delete this.peers[userId];
    });

    this.peers[userId] = peer;
  }

  private handleCallSignal(signal: CallSignal) {
    // Handle WebRTC signaling
    if (this.peers[signal.from]) {
      this.peers[signal.from].signal(signal.signal);
    } else {
      // Create peer connection if it doesn't exist
      this.createPeerConnection(signal.from, false);
      // Signal will be handled by the peer's signal event
      setTimeout(() => {
        if (this.peers[signal.from]) {
          this.peers[signal.from].signal(signal.signal);
        }
      }, 100);
    }
  }

  private handleUserOnline(userId: string) {
    // Update user online status
    console.log(`User ${userId} is online`);
    this.onlineUsers.add(userId);
  }

  private handleUserOffline(userId: string) {
    // Update user offline status
    console.log(`User ${userId} is offline`);
    this.onlineUsers.delete(userId);
  }

  public getCallState(): CallState {
    return this.callState;
  }

  public getOnlineUsers(): string[] {
    return Array.from(this.onlineUsers);
  }

  public isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }

  public updateCallSettings(settings: Partial<CallSettings>) {
    this.callSettings = { ...this.callSettings, ...settings };
  }

  public getCallSettings(): CallSettings {
    return this.callSettings;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.cleanupCall();
  }
}

// Export singleton instance
export const webrtcService = new WebRTCService();
export default webrtcService;
