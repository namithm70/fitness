export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '340843559721-7m0fqnkp0kai4vrvfsse0orhjmuu9urh.apps.googleusercontent.com';
export const GOOGLE_CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET || '';

// Debug logging
console.log('Google Client ID loaded:', GOOGLE_CLIENT_ID ? 'YES' : 'NO');
console.log('Google Client Secret loaded:', GOOGLE_CLIENT_SECRET ? 'YES' : 'NO');
console.log('Environment variable value:', process.env.REACT_APP_GOOGLE_CLIENT_ID);

export const GOOGLE_OAUTH_CONFIG = {
  clientId: GOOGLE_CLIENT_ID,
  scope: 'email profile',
  accessType: 'offline',
  includeGrantedScopes: true,
};

// Google OAuth endpoints
export const GOOGLE_OAUTH_ENDPOINTS = {
  authorization: 'https://accounts.google.com/o/oauth2/v2/auth',
  token: 'https://oauth2.googleapis.com/token',
  userInfo: 'https://www.googleapis.com/oauth2/v2/userinfo',
};
