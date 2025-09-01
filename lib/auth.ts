import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { auth } from './firebase';
import { googleConfig } from '../config/firebase.config';
import { getRedirectUri, getProxyRedirectUri } from './redirect-uri';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const authService = {
  // Email/Password Authentication
  async signUp(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  // Google Authentication
  async signInWithGoogle(): Promise<AuthUser> {
    try {
      // Create a random state for security
      const state = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      );

      // Get the redirect URI (use proxy for Google OAuth compatibility)
      const redirectUri = getProxyRedirectUri();
      
      // Log the redirect URI for debugging (remove in production)
      console.log('Google OAuth Redirect URI:', redirectUri);
      console.log('Make sure this HTTPS URI is added to Firebase Console > Auth > Google > Authorized Redirect URIs');

      // Create the Google OAuth request
      const request = new AuthSession.AuthRequest({
        clientId: googleConfig.webClientId,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        state,
        extraParams: {
          access_type: 'offline',
        },
        prompt: AuthSession.Prompt.SelectAccount,
      });

      // Start the authentication flow
      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      });

      if (result.type !== 'success') {
        throw new Error('Google sign-in was cancelled or failed');
      }

      // Exchange the authorization code for an ID token
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: googleConfig.webClientId,
          code: result.params.code,
          redirectUri,
          extraParams: {
            code_verifier: request.codeVerifier,
          },
        },
        {
          tokenEndpoint: 'https://oauth2.googleapis.com/token',
        }
      );

      if (!tokenResponse.idToken) {
        throw new Error('Failed to get Google ID token');
      }

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(tokenResponse.idToken);
      
      // Sign-in the user with the credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error('Failed to sign out');
    }
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  // Error message helper
  getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please try logging in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
};
