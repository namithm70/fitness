import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX,
  Monitor,
  Wifi,
  WifiOff,
  X
} from 'lucide-react';
import { useCalling } from '../../contexts/CallingContext';
import { CallSettings as CallSettingsType } from '../../types/calling';

interface CallSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const CallSettings: React.FC<CallSettingsProps> = ({ isOpen, onClose }) => {
  const { callSettings, updateCallSettings, permissions } = useCalling();
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [localSettings, setLocalSettings] = useState<CallSettingsType>(callSettings);

  useEffect(() => {
    if (isOpen) {
      loadDevices();
    }
  }, [isOpen]);

  const loadDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      setDevices(deviceList);
      
      const audioInputs = deviceList.filter(device => device.kind === 'audioinput');
      const audioOutputs = deviceList.filter(device => device.kind === 'audiooutput');
      const videoInputs = deviceList.filter(device => device.kind === 'videoinput');
      
      setAudioDevices([...audioInputs, ...audioOutputs]);
      setVideoDevices(videoInputs);
    } catch (error) {
      console.error('Failed to load devices:', error);
    }
  };

  const handleSettingChange = (key: keyof CallSettingsType, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateCallSettings(newSettings);
  };

  const testAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audio = new Audio();
      audio.srcObject = stream;
      audio.play();
      
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
      }, 2000);
    } catch (error) {
      console.error('Audio test failed:', error);
    }
  };

  const testVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Create a temporary video element to test
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        video.remove();
      }, 3000);
    } catch (error) {
      console.error('Video test failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Call Settings</h2>
                <p className="text-white/70 text-sm">Configure your audio and video preferences</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Audio Settings */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Mic className="w-5 h-5 mr-2" />
                Audio Settings
              </h3>
              
              <div className="space-y-4">
                {/* Audio Input */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Microphone
                  </label>
                  <select
                    value={localSettings.audioInput}
                    onChange={(e) => handleSettingChange('audioInput', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    {audioDevices.filter(d => d.kind === 'audioinput').map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={testAudio}
                    className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
                  >
                    Test Audio
                  </button>
                </div>

                {/* Audio Output */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Speaker
                  </label>
                  <select
                    value={localSettings.audioOutput}
                    onChange={(e) => handleSettingChange('audioOutput', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    {audioDevices.filter(d => d.kind === 'audiooutput').map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Speaker ${device.deviceId.slice(0, 8)}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Audio Quality */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Audio Quality
                  </label>
                  <select
                    value={localSettings.audioQuality}
                    onChange={(e) => handleSettingChange('audioQuality', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="low">Low (8kHz)</option>
                    <option value="medium">Medium (16kHz)</option>
                    <option value="high">High (48kHz)</option>
                  </select>
                </div>

                {/* Audio Processing */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">Echo Cancellation</span>
                    <button
                      onClick={() => handleSettingChange('echoCancellation', !localSettings.echoCancellation)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        localSettings.echoCancellation ? 'bg-green-500' : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        localSettings.echoCancellation ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">Noise Suppression</span>
                    <button
                      onClick={() => handleSettingChange('noiseSuppression', !localSettings.noiseSuppression)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        localSettings.noiseSuppression ? 'bg-green-500' : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        localSettings.noiseSuppression ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">Auto Gain Control</span>
                    <button
                      onClick={() => handleSettingChange('autoGainControl', !localSettings.autoGainControl)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        localSettings.autoGainControl ? 'bg-green-500' : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        localSettings.autoGainControl ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Settings */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Video className="w-5 h-5 mr-2" />
                Video Settings
              </h3>
              
              <div className="space-y-4">
                {/* Video Input */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Camera
                  </label>
                  <select
                    value={localSettings.videoInput}
                    onChange={(e) => handleSettingChange('videoInput', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    {videoDevices.map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={testVideo}
                    className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
                  >
                    Test Video
                  </button>
                </div>

                {/* Video Quality */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Video Quality
                  </label>
                  <select
                    value={localSettings.videoQuality}
                    onChange={(e) => handleSettingChange('videoQuality', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="low">Low (480p)</option>
                    <option value="medium">Medium (720p)</option>
                    <option value="high">High (1080p)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Permissions Status */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Permissions
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Camera Access</span>
                  <div className="flex items-center space-x-2">
                    {permissions.camera ? (
                      <Wifi className="w-4 h-4 text-green-500" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm ${permissions.camera ? 'text-green-500' : 'text-red-500'}`}>
                      {permissions.camera ? 'Granted' : 'Denied'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Microphone Access</span>
                  <div className="flex items-center space-x-2">
                    {permissions.microphone ? (
                      <Wifi className="w-4 h-4 text-green-500" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm ${permissions.microphone ? 'text-green-500' : 'text-red-500'}`}>
                      {permissions.microphone ? 'Granted' : 'Denied'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Screen Share</span>
                  <div className="flex items-center space-x-2">
                    {permissions.screenShare ? (
                      <Wifi className="w-4 h-4 text-green-500" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm ${permissions.screenShare ? 'text-green-500' : 'text-red-500'}`}>
                      {permissions.screenShare ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CallSettings;
