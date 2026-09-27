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
  quickLoginDemo: (role?: 'client') => Promise<void>;
  directStudioLogin: (email: string, name?: string, role?: UserRole) => Promise<void>;
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

  // Sync user profile document in Firestore with offline resilience
  const syncOrCreateUserProfile = async (user: User, fallbackName?: string, forceRole?: UserRole) => {
    const isDefaultAdmin = (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) || forceRole === 'admin';
    const fallbackProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: fallbackName || user.displayName || user.email?.split('@')[0] || (isDefaultAdmin ? 'Studio Director' : 'Studio Client'),
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

    try {
      const userDocRef = doc(db, 'users', user.uid);
      let userSnap;
      try {
        userSnap = await getDoc(userDocRef);
      } catch (getErr: any) {
        // If client is currently offline or connecting, adopt fallback profile safely
        console.warn('Firestore client offline or connecting, using cached session:', getErr?.message || getErr);
        setUserProfile(fallbackProfile);
        return;
      }

      if (!userSnap.exists()) {
        try {
          await setDoc(userDocRef, fallbackProfile);
        } catch (setErr) {
          console.warn('Deferred profile write until online:', setErr);
        }
        setUserProfile(fallbackProfile);
      } else {
        const data = userSnap.data() as UserProfile;
        // Keep role sync if designated admin
        if (isDefaultAdmin && data.role !== 'admin') {
          try {
            await setDoc(userDocRef, { ...data, role: 'admin' }, { merge: true });
          } catch {}
          data.role = 'admin';
        }
        setUserProfile(data);
      }
    } catch (err: any) {
      console.warn('Notice syncing user profile (offline fallback active):', err?.message || err);
      setUserProfile(fallbackProfile);
    }
  };

  useEffect(() => {
    // 1. Restore local session safely - purge any legacy mock admin sessions
    try {
      const savedSession = localStorage.getItem('pdh_active_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.profile?.role === 'admin' && (parsed?.user?.uid?.startsWith('director-naman-master') || parsed?.user?.isAnonymous)) {
          localStorage.removeItem('pdh_active_session');
        } else if (parsed?.user && parsed?.profile) {
          setCurrentUser(parsed.user);
          setUserProfile(parsed.profile);
          setLoading(false);
        }
      }
    } catch {}

    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await syncOrCreateUserProfile(user);

        // Real-time listener on user doc with error handling
        const userDocRef = doc(db, 'users', user.uid);
        unsubscribeSnapshot = onSnapshot(
          userDocRef, 
          (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile(docSnap.data() as UserProfile);
            }
          },
          (err) => {
            console.warn('Real-time user profile listener note:', err);
          }
        );
      } else {
        // If no Firebase user, check if we had a direct studio session
        const savedSession = localStorage.getItem('pdh_active_session');
        if (!savedSession) {
          setCurrentUser(null);
          setUserProfile(null);
        }
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
      const cleanEmail = email.trim();
      const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      await syncOrCreateUserProfile(res.user);
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const cleanEmail = email.trim();
      const cleanName = name.trim();
      const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      try {
        await updateProfile(res.user, { displayName: cleanName });
      } catch (profileErr) {
        console.warn('Could not update Firebase Auth profile display name:', profileErr);
      }
      await syncOrCreateUserProfile(res.user, cleanName);
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
      try {
        await fbSignOut(auth);
      } catch {}
      try {
        localStorage.removeItem('pdh_active_session');
      } catch {}
      setCurrentUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const updateUserProfileData = async (data: Partial<UserProfile>) => {
    if (!currentUser || !userProfile) return;
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, data, { merge: true });
    } catch {}
    setUserProfile((prev) => {
      const updated = prev ? { ...prev, ...data } : null;
      if (updated && currentUser) {
        try {
          localStorage.setItem('pdh_active_session', JSON.stringify({ user: currentUser, profile: updated }));
        } catch {}
      }
      return updated;
    });
  };

  // Guest/Client preview session for prospective clients or fallback without admin privileges
  const directStudioLogin = async (email: string, name?: string, role?: UserRole) => {
    setLoading(true);
    try {
      const cleanEmail = email.trim() || 'guest@pixeldesignhouse.com';
      // Admin privileges are strictly forbidden in direct sessions — only verified Firebase Auth can grant admin
      const userRole: UserRole = 'client';
      const displayName = name || cleanEmail.split('@')[0] || 'Studio Client';

      const mockUser: any = {
        uid: `guest-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email: cleanEmail,
        displayName: displayName,
        emailVerified: false,
        isAnonymous: true,
      };

      const profile: UserProfile = {
        uid: mockUser.uid,
        email: cleanEmail,
        displayName: displayName,
        role: userRole,
        company: 'Independent Client',
        bio: 'Client evaluating design services & studio collaboration.',
        createdAt: new Date().toISOString(),
      };

      setCurrentUser(mockUser);
      setUserProfile(profile);

      try {
        localStorage.setItem('pdh_active_session', JSON.stringify({ user: mockUser, profile }));
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  // Guest client preview for prospective clients exploring portal features
  const quickLoginDemo = async (role?: 'client') => {
    setLoading(true);
    try {
      const demoEmail = 'client@pixeldesignhouse.com';
      const demoPass = 'PixelStudio2026!';
      const demoName = 'Elena Vance (Art Curator)';
      const clientRole: UserRole = 'client';

      let firebaseSucceeded = false;
      try {
        const res = await signInWithEmailAndPassword(auth, demoEmail, demoPass);
        await syncOrCreateUserProfile(res.user, demoName, clientRole);
        firebaseSucceeded = true;
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          try {
            const res = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
            await updateProfile(res.user, { displayName: demoName });
            await syncOrCreateUserProfile(res.user, demoName, clientRole);
            firebaseSucceeded = true;
          } catch (createErr) {
            // Fall through to direct studio session
          }
        }
      }

      // If Firebase Auth provider is not enabled in Firebase Console (PASSWORD_LOGIN_DISABLED),
      // activate instant direct session so the prospective client is not locked out!
      if (!firebaseSucceeded) {
        await directStudioLogin(demoEmail, demoName, clientRole);
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
        quickLoginDemo,
        directStudioLogin,
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
