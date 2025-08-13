import React from 'react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Post</h2>
        <p className="text-gray-600 mb-4">Post creation feature coming soon!</p>
        <div className="flex space-x-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={onPostCreated} className="btn-primary flex-1">Create</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
