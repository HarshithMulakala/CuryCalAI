import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../config/firebase.config';

// Firebase configuration

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth (AsyncStorage persistence is handled automatically in React Native)
const auth = getAuth(app);

export { auth };
export default app;
