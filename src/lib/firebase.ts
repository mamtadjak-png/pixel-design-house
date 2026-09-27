import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  type User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import defaultJsonConfig from '../../firebase-applet-config.json';

// Resolve Firebase configuration dynamically:
// Prioritizes VITE_FIREBASE_* environment variables (set in Vercel or .env),
// with full fallback to firebase-applet-config.json
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {} as any;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || defaultJsonConfig.apiKey || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || defaultJsonConfig.authDomain || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || defaultJsonConfig.projectId || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || defaultJsonConfig.storageBucket || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultJsonConfig.messagingSenderId || '',
  appId: env.VITE_FIREBASE_APP_ID || defaultJsonConfig.appId || '',
};

const firestoreDatabaseId = env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || defaultJsonConfig.firestoreDatabaseId || '';

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Explicitly configure local browser persistence so login state persists across refreshes
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('Firebase Auth persistence setup warning:', err);
  });
}

// Google Auth Provider setup with account selection prompt
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Initialize Cloud Firestore using the configured database ID or default
let firestoreInstance;
try {
  firestoreInstance = firestoreDatabaseId && firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firestoreDatabaseId)
    : getFirestore(app);
} catch (err) {
  console.warn('Falling back to default Firestore database instance:', err);
  firestoreInstance = getFirestore(app);
}

export const db = firestoreInstance;

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  type User
};
