import { GOOGLE_CLIENT_ID, GOOGLE_OAUTH_ENDPOINTS } from '../config/googleOAuth';

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

interface GoogleAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  authuser: string;
  prompt: string;
}

class GoogleAuthService {
  private generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private generateCodeVerifier(): string {
    return this.generateRandomString(128);
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const uint8Array = new Uint8Array(digest);
    const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
    return btoa(binaryString)
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  async initiateGoogleLogin(): Promise<void> {
    if (!GOOGLE_CLIENT_ID) {
      throw new Error('Google Client ID is not configured');
    }

    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    const state = this.generateRandomString(32);

    // Store code verifier and state for later verification
    sessionStorage.setItem('google_code_verifier', codeVerifier);
    sessionStorage.setItem('google_state', state);

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${window.location.origin}/auth/google/callback`,
      response_type: 'code',
      scope: 'email profile',
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      access_type: 'offline',
      prompt: 'consent',
    });

    const authUrl = `${GOOGLE_OAUTH_ENDPOINTS.authorization}?${params.toString()}`;
    window.location.href = authUrl;
  }

  async handleGoogleCallback(code: string, state: string): Promise<GoogleUser> {
    const storedState = sessionStorage.getItem('google_state');
    const codeVerifier = sessionStorage.getItem('google_code_verifier');

    if (!storedState || !codeVerifier) {
      throw new Error('Invalid state or code verifier');
    }

    if (state !== storedState) {
      throw new Error('State mismatch');
    }

    // Exchange code for access token
    const tokenResponse = await fetch(GOOGLE_OAUTH_ENDPOINTS.token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        code: code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: `${window.location.origin}/auth/google/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData: GoogleAuthResponse = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch(GOOGLE_OAUTH_ENDPOINTS.userInfo, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const userData: GoogleUser = await userResponse.json();

    // Clean up session storage
    sessionStorage.removeItem('google_state');
    sessionStorage.removeItem('google_code_verifier');

    return userData;
  }

  // Alternative method using Google Identity Services (recommended)
  async loginWithGoogle(): Promise<GoogleUser> {
    return new Promise((resolve, reject) => {
      console.log('Starting Google login...');
      console.log('Google Client ID:', GOOGLE_CLIENT_ID);
      
      if (!GOOGLE_CLIENT_ID) {
        reject(new Error('Google Client ID is not configured'));
        return;
      }
      
      if (typeof window.google === 'undefined') {
        reject(new Error('Google Identity Services not loaded'));
        return;
      }

      window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (response) => {
          if (response.error) {
            reject(new Error(response.error));
            return;
          }

          try {
            // Get user info using the access token
            const userResponse = await fetch(GOOGLE_OAUTH_ENDPOINTS.userInfo, {
              headers: {
                Authorization: `Bearer ${response.access_token}`,
              },
            });

            if (!userResponse.ok) {
              throw new Error('Failed to get user info');
            }

            const userData: GoogleUser = await userResponse.json();
            resolve(userData);
          } catch (error) {
            reject(error);
          }
        },
      }).requestAccessToken();
    });
  }
}

export const googleAuthService = new GoogleAuthService();
