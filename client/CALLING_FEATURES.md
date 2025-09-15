# Audio and Video Calling Features

This document describes the audio and video calling functionality implemented in the FitLife fitness community platform.

## Overview

The calling system uses WebRTC (Web Real-Time Communication) technology to enable peer-to-peer audio and video calls between community members. The implementation includes:

- **Audio Calls**: Voice-only communication
- **Video Calls**: Video and audio communication with screen sharing
- **Real-time Signaling**: Socket.io-based signaling server
- **Call Management**: Incoming/outgoing call handling
- **Device Management**: Camera, microphone, and speaker selection
- **Call Controls**: Mute, video toggle, screen share, settings

## Architecture

### Frontend Components

1. **WebRTC Service** (`src/services/webrtcService.ts`)
   - Manages WebRTC peer connections
   - Handles media stream acquisition
   - Manages call state and signaling

2. **Calling Context** (`src/contexts/CallingContext.tsx`)
   - Provides calling state management across the app
   - Handles permissions and settings
   - Manages call lifecycle

3. **UI Components**:
   - `IncomingCallModal.tsx` - Handles incoming call notifications
   - `ActiveCallInterface.tsx` - Main call interface with controls
   - `UserCallList.tsx` - User selection for starting calls
   - `CallSettings.tsx` - Device and quality settings

### Backend Signaling

The server (`server/index.js`) includes WebRTC signaling handlers:

- `join-calling` - User joins calling room
- `call-offer` - Initiates a call
- `call-answer` - Responds to call offer
- `call-end` - Terminates a call
- `call-signal` - WebRTC signaling data
- `user-online/offline` - User presence updates

## Features

### Call Types

#### Audio Calls
- Voice-only communication
- Noise suppression and echo cancellation
- Audio quality settings (Low/Medium/High)
- Microphone mute/unmute

#### Video Calls
- Video and audio communication
- Picture-in-picture local video
- Video quality settings (480p/720p/1080p)
- Camera on/off toggle
- Screen sharing capability

### Call Management

#### Starting Calls
1. Click "Call" button in community dashboard
2. Select user from online users list
3. Choose audio or video call
4. System requests permissions if needed
5. Call offer sent to recipient

#### Receiving Calls
1. Incoming call modal appears
2. Shows caller information and call type
3. Accept or decline options
4. Permissions requested if needed

#### During Calls
- Call duration display
- Mute/unmute microphone
- Enable/disable video
- Screen sharing toggle
- Call settings access
- Minimize/maximize interface
- End call functionality

### Device Management

#### Audio Devices
- Microphone selection
- Speaker/headphone selection
- Audio quality settings
- Echo cancellation toggle
- Noise suppression toggle
- Auto gain control toggle

#### Video Devices
- Camera selection
- Video quality settings
- Test functionality for devices

### Permissions

The system handles browser permissions for:
- Camera access
- Microphone access
- Screen sharing (requested at runtime)

## Technical Implementation

### WebRTC Configuration

```typescript
const constraints = {
  video: callType === 'video' ? {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 }
  } : false,
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }
};
```

### Signaling Flow

1. **Call Initiation**:
   - User A calls User B
   - WebRTC offer created
   - Offer sent via Socket.io to User B

2. **Call Answer**:
   - User B receives offer
   - User B accepts/declines
   - Answer sent back to User A

3. **Media Exchange**:
   - ICE candidates exchanged
   - Media streams established
   - Call becomes active

4. **Call Termination**:
   - Either user ends call
   - Cleanup of streams and connections
   - Notify all participants

### State Management

The calling system maintains state for:
- Call status (incoming/outgoing/active)
- Participants list
- Media streams (local/remote)
- Device settings
- Permissions status
- Call duration

## Browser Compatibility

### Supported Browsers
- Chrome 56+
- Firefox 52+
- Safari 11+
- Edge 79+

### Required Features
- WebRTC support
- MediaDevices API
- WebSocket support
- HTTPS (required for camera/microphone access)

## Security Considerations

### Data Privacy
- No call content is stored on servers
- Peer-to-peer communication
- Signaling data is temporary

### Access Control
- User authentication required
- Permission-based access to devices
- Call participant validation

## Usage Instructions

### For Users

1. **Enable Calling**:
   - Navigate to Community section
   - Click "Call" button
   - Grant camera/microphone permissions

2. **Start a Call**:
   - Select user from call list
   - Choose audio or video call
   - Wait for recipient to answer

3. **During a Call**:
   - Use controls to mute/unmute
   - Toggle video on/off
   - Access settings for device changes
   - Minimize for background operation

4. **End a Call**:
   - Click red phone button
   - Call will terminate for all participants

### For Developers

1. **Adding New Features**:
   - Extend `CallState` interface in `types/calling.ts`
   - Update `webrtcService.ts` for new functionality
   - Add UI components as needed

2. **Customizing UI**:
   - Modify component styles in respective files
   - Update animations using Framer Motion
   - Customize call controls layout

3. **Server Configuration**:
   - Add new signaling events in `server/index.js`
   - Implement call logging if needed
   - Add authentication middleware

## Troubleshooting

### Common Issues

1. **No Camera/Microphone Access**:
   - Check browser permissions
   - Ensure HTTPS connection
   - Try different devices

2. **Call Connection Failed**:
   - Check network connectivity
   - Verify signaling server connection
   - Check firewall settings

3. **Poor Audio/Video Quality**:
   - Adjust quality settings
   - Check network bandwidth
   - Try different devices

4. **Screen Share Not Working**:
   - Ensure browser supports screen sharing
   - Check for browser updates
   - Try different browser

### Debug Information

Enable debug logging by setting:
```javascript
localStorage.setItem('webrtc-debug', 'true');
```

## Future Enhancements

### Planned Features
- Group video calls (3+ participants)
- Call recording functionality
- Call history and logs
- Advanced audio processing
- Virtual backgrounds
- Call quality metrics
- Mobile app support

### Technical Improvements
- STUN/TURN server integration
- Better error handling
- Call quality monitoring
- Bandwidth adaptation
- Mobile optimization
