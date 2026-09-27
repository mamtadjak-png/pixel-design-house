import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  fbSignOut, 
  signInWithPopup, 
  sendPasswordResetEmail,
  updateProfile,
  googleProvider,
  auth,
  db 
} from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfileData: (data: Partial<UserProfile>) => Promise<void>;
  toggleDemoRole: () => Promise<void>;
  quickLoginDemo: (role: 'client' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = [
  'namantoshniwal201212@gmail.com',
  'mamtadjak@gmail.com',
  'admin@pixeldesignhouse.com',
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user profile document in Firestore
  const syncOrCreateUserProfile = async (user: User, fallbackName?: string, forceRole?: UserRole) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      const isDefaultAdmin = (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) || forceRole === 'admin';

      if (!userSnap.exists()) {
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: fallbackName || user.displayName || user.email?.split('@')[0] || 'Studio Client',
          photoURL: user.photoURL || undefined,
          role: isDefaultAdmin ? 'admin' : (forceRole || 'client'),
          company: isDefaultAdmin ? 'Pixel Design House' : 'Independent Venture',
          bio: isDefaultAdmin ? 'Creative Director & Founder at Pixel Design House.' : 'Client partner collaborating on brand & digital design.',
          projectPreferences: ['Posters', 'Brand Identity', 'Motion Video'],
          notificationSettings: {
            emailUpdates: true,
            orderProgress: true,
            chatPings: true,
            studioNews: false,
          },
          createdAt: new Date().toISOString(),
        };

        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      } else {
        const data = userSnap.data() as UserProfile;
        // Keep role sync if designated admin
        if (isDefaultAdmin && data.role !== 'admin') {
          await setDoc(userDocRef, { ...data, role: 'admin' }, { merge: true });
          data.role = 'admin';
        }
        setUserProfile(data);
      }
    } catch (err) {
      console.error('Error syncing user profile:', err);
      // Fallback local memory profile so app remains accessible
      setUserProfile({
        uid: user.uid,
        email: user.email || '',
        displayName: fallbackName || user.displayName || user.email?.split('@')[0] || 'Client User',
        role: (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) ? 'admin' : 'client',
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncOrCreateUserProfile(user);

        // Real-time listener on user doc
        const userDocRef = doc(db, 'users', user.uid);
        unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          }
        });
      } else {
        setUserProfile(null);
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      await syncOrCreateUserProfile(res.user);
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: name });
      await syncOrCreateUserProfile(res.user, name);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await syncOrCreateUserProfile(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fbSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfileData = async (data: Partial<UserProfile>) => {
    if (!currentUser || !userProfile) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    await setDoc(userDocRef, data, { merge: true });
    setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
  };

  // Allows toggling between 'client' and 'admin' role seamlessly in preview/demo
  const toggleDemoRole = async () => {
    if (!currentUser || !userProfile) return;
    const newRole: UserRole = userProfile.role === 'admin' ? 'client' : 'admin';
    await updateUserProfileData({ role: newRole });
  };

  // Instant one-click test account for testing client and admin workflows
  const quickLoginDemo = async (role: 'client' | 'admin') => {
    setLoading(true);
    try {
      const demoEmail = role === 'admin' ? 'admin@pixeldesignhouse.com' : 'client@pixeldesignhouse.com';
      const demoPass = 'PixelStudio2026!';
      const demoName = role === 'admin' ? 'Studio Director' : 'Elena Vance (Art Curator)';

      try {
        const res = await signInWithEmailAndPassword(auth, demoEmail, demoPass);
        await syncOrCreateUserProfile(res.user, demoName, role);
      } catch (err: any) {
        // If demo user does not exist, create it
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          const res = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
          await updateProfile(res.user, { displayName: demoName });
          await syncOrCreateUserProfile(res.user, demoName, role);
        } else {
          throw err;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = userProfile?.role === 'admin' || (!!currentUser?.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase()));

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAdmin,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
        updateUserProfileData,
        toggleDemoRole,
        quickLoginDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
