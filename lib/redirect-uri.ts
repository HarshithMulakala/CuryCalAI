import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';

// Get the redirect URI for Google OAuth using Expo proxy
export const getProxyRedirectUri = () => {
  const { expoConfig } = Constants;
  
  // Try to get the proxy URI from Constants first
  if (expoConfig?.slug && expoConfig?.owner) {
    return `https://auth.expo.io/@${expoConfig.owner}/${expoConfig.slug}`;
  }
  
  // Fallback: construct from available info
  if (expoConfig?.slug) {
    // Use anonymous owner if not available
    return `https://auth.expo.io/@anonymous/${expoConfig.slug}`;
  }
  
  // Default fallback for currycal app
  return 'https://auth.expo.io/@anonymous/currycal';
};

// Legacy method for compatibility
export const getRedirectUri = () => {
  return getProxyRedirectUri();
};

// Log the redirect URI for debugging
export const logRedirectUri = () => {
  const uri = getRedirectUri();
  const proxyUri = getProxyRedirectUri();
  console.log('Google OAuth Redirect URI (AuthSession):', uri);
  console.log('Google OAuth Redirect URI (Proxy):', proxyUri);
  console.log('Add the HTTPS URI to Firebase Console > Auth > Google > Authorized Redirect URIs');
  return uri;
};
