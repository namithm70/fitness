import React from 'react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
        <p className="text-white/70 mb-4">Notification system coming soon!</p>
        <button onClick={onClose} className="btn-primary w-full">Close</button>
      </div>
    </div>
  );
};

export default NotificationPanel;
