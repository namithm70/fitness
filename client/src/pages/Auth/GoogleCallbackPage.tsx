import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { googleAuthService } from '../../services/googleAuth';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const GoogleCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { socialLogin } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state');
        }

        // Handle the Google callback
        const googleUser = await googleAuthService.handleGoogleCallback(code, state);

        // Call the social login function from auth context
        await socialLogin('google', {
          id: googleUser.id,
          email: googleUser.email,
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          profilePicture: googleUser.picture,
          verified: googleUser.verified_email,
        });

        toast.success('Successfully signed in with Google!');
        navigate('/dashboard');
      } catch (error: any) {
        console.error('Google callback error:', error);
        toast.error('Failed to complete Google sign-in');
        navigate('/login');
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, socialLogin]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Completing your sign-in...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCallbackPage;
