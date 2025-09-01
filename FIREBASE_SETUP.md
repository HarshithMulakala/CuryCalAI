# Firebase Authentication Setup Guide

## 1. Firebase Configuration

The app is configured to load Firebase values from environment variables. Create a `.env` file in your project root with your actual Firebase project values:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Google Sign-In Configuration
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
```

**Important:** Make sure to add `.env` to your `.gitignore` file to keep your credentials secure!

## 2. Getting Your Firebase Config Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on your web app or create one if you haven't
6. Copy the config values from the Firebase SDK snippet

## 3. Google Sign-In Setup

### For Google Sign-In to work, you need to:

1. **Enable Google Sign-In in Firebase Console:**
   - Go to Authentication > Sign-in method
   - Enable Google provider
   - Add your app's SHA-1 fingerprint (for Android)
   - Add your bundle ID (for iOS)

2. **Get Web Client ID:**
   - In Firebase Console > Authentication > Sign-in method > Google
   - Copy the "Web client ID" (not the Android/iOS client ID)
   - This goes in `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` in your `.env` file

3. **Configure OAuth Redirect URI:**
   - **Important:** Google OAuth does NOT accept localhost, 127.0.0.1, or exp:// URLs
   - The app uses Expo's AuthSession proxy for development
   - Run the app and check console logs for the redirect URI (will look like: `https://auth.expo.io/@your-username/your-app-slug`)
   - Add this exact URI to Firebase Console > Authentication > Sign-in method > Google > Authorized Redirect URIs
   - For production, you'll need a custom domain (like myapp.com)

4. **Expo Configuration:**
   - The app uses Expo's AuthSession with proxy for Google Sign-In
   - Uses `useProxy: true` to generate Google OAuth compatible redirect URIs
   - No additional native configuration needed for Expo managed workflow
   - Works on both iOS and Android without native linking

## 4. Features Implemented

✅ **Email/Password Authentication**
- Sign up with email and password
- Login with email and password
- Form validation and error handling
- Loading states during authentication

✅ **Google Sign-In**
- One-tap Google authentication
- Proper error handling
- Loading states

✅ **UI Improvements**
- Beautiful, centered design for all iOS devices
- Proper keyboard handling
- Loading indicators
- Disabled states during authentication
- Improved spacing and typography
- Shadow effects and modern styling

✅ **Error Handling**
- User-friendly error messages
- Network error handling
- Form validation
- Loading states

## 5. Apple Sign-In (Future Implementation)

Apple Sign-In is prepared in the UI but disabled until you set it up in Firebase Console:
- Enable Apple Sign-In in Firebase Console
- Configure Apple Developer account
- Add Apple Sign-In capability to your iOS app

## 6. Testing

1. Create a `.env` file with your Firebase config values
2. Run the app: `npm start`
3. Test email/password signup and login
4. Test Google Sign-In (requires proper setup)

## 7. Troubleshooting Google Sign-In

### If you get "Authorization Error" or "invalid_request":

1. **Check your redirect URI:**
   - Run the app and check the console logs for the redirect URI
   - The URI should look like: `https://auth.expo.io/@anonymous/currycal`
   - Add this exact URI to Firebase Console > Authentication > Sign-in method > Google > Authorized Redirect URIs
   - **DO NOT use:** localhost, 127.0.0.1, exp://, or any non-public domains

2. **Verify your Web Client ID:**
   - Make sure you're using the "Web client ID" from Firebase Console
   - Not the Android or iOS client ID
   - Should look like: `123456789-abcdefg.apps.googleusercontent.com`

3. **Check Firebase Console settings:**
   - Ensure Google Sign-In is enabled
   - Verify your app's bundle ID is added (for iOS)
   - Verify your SHA-1 fingerprint is added (for Android)

4. **Development vs Production:**
   - **Development:** Use Expo AuthSession proxy URI (https://auth.expo.io/...)
   - **Production:** You'll need a custom domain (like myapp.com) - no localhost allowed

## 8. Security Notes

- Never commit your actual Firebase config to version control
- Use environment variables in production
- Consider using Firebase App Check for additional security
- Implement proper user data validation on your backend

## 9. Next Steps

After authentication is working:
1. Set up user profile management
2. Implement password reset functionality
3. Add email verification
4. Connect to your backend API
5. Implement proper user session management
