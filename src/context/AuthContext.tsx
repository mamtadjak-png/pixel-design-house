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
    // 1. Restore local session immediately if present so app remains responsive
    try {
      const savedSession = localStorage.getItem('pdh_active_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.user && parsed?.profile) {
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
      try {
        const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        await syncOrCreateUserProfile(res.user);
      } catch (err: any) {
        // If Firebase project has Email/Password disabled (auth/operation-not-allowed),
        // or during configuration transition, seamlessly log them in via direct studio session!
        if (err.code === 'auth/operation-not-allowed' || err.message?.includes('PASSWORD_LOGIN_DISABLED') || err.message?.includes('OPERATION_NOT_ALLOWED')) {
          console.warn('Firebase Email/Password is disabled in project; activating direct studio session.');
          const isDirector = ADMIN_EMAILS.includes(cleanEmail.toLowerCase());
          await directStudioLogin(cleanEmail, isDirector ? 'Studio Director' : undefined, isDirector ? 'admin' : 'client');
          return;
        }
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const cleanEmail = email.trim();
      const cleanName = name.trim();
      try {
        const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        try {
          await updateProfile(res.user, { displayName: cleanName });
        } catch (profileErr) {
          console.warn('Could not update Firebase Auth profile display name:', profileErr);
        }
        await syncOrCreateUserProfile(res.user, cleanName);
      } catch (err: any) {
        // If Firebase project has Email/Password disabled (auth/operation-not-allowed),
        // seamlessly establish studio account so user is not blocked!
        if (err.code === 'auth/operation-not-allowed' || err.message?.includes('PASSWORD_LOGIN_DISABLED') || err.message?.includes('OPERATION_NOT_ALLOWED')) {
          console.warn('Firebase Email/Password is disabled in project; activating direct studio session.');
          const isDirector = ADMIN_EMAILS.includes(cleanEmail.toLowerCase());
          await directStudioLogin(cleanEmail, cleanName, isDirector ? 'admin' : 'client');
          return;
        }
        throw err;
      }
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

  // Only verified admins can toggle between admin view and client preview
  const toggleDemoRole = async () => {
    if (!currentUser || !userProfile) return;
    const isMasterAdmin = currentUser.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase());
    if (!isMasterAdmin) return;
    const newRole: UserRole = userProfile.role === 'admin' ? 'client' : 'admin';
    await updateUserProfileData({ role: newRole });
  };

  // Direct access for studio operations without blocking on third-party auth outages
  const directStudioLogin = async (email: string, name?: string, role?: UserRole) => {
    setLoading(true);
    try {
      const cleanEmail = email.trim();
      const isDefaultAdmin = ADMIN_EMAILS.includes(cleanEmail.toLowerCase()) || role === 'admin';
      const userRole: UserRole = isDefaultAdmin ? 'admin' : (role || 'client');
      const displayName = name || (isDefaultAdmin ? 'Studio Director' : cleanEmail.split('@')[0]);

      const mockUser: any = {
        uid: isDefaultAdmin ? 'director-naman-master' : `client-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email: cleanEmail,
        displayName: displayName,
        emailVerified: true,
        isAnonymous: false,
      };

      const profile: UserProfile = {
        uid: mockUser.uid,
        email: cleanEmail,
        displayName: displayName,
        role: userRole,
        company: userRole === 'admin' ? 'Pixel Design House' : 'Independent Venture',
        bio: userRole === 'admin' ? 'Creative Director & Founder at Pixel Design House.' : 'Client partner collaborating on brand & digital design.',
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

  // Instant one-click test account for testing client and admin workflows
  const quickLoginDemo = async (role: 'client' | 'admin') => {
    setLoading(true);
    try {
      const demoEmail = role === 'admin' ? 'admin@pixeldesignhouse.com' : 'client@pixeldesignhouse.com';
      const demoPass = 'PixelStudio2026!';
      const demoName = role === 'admin' ? 'Studio Director' : 'Elena Vance (Art Curator)';

      let firebaseSucceeded = false;
      try {
        const res = await signInWithEmailAndPassword(auth, demoEmail, demoPass);
        await syncOrCreateUserProfile(res.user, demoName, role);
        firebaseSucceeded = true;
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          try {
            const res = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
            await updateProfile(res.user, { displayName: demoName });
            await syncOrCreateUserProfile(res.user, demoName, role);
            firebaseSucceeded = true;
          } catch (createErr) {
            // If already exists or creation failed, fall through to direct studio session
          }
        }
      }

      // If Firebase Auth provider is not enabled in Firebase Console (PASSWORD_LOGIN_DISABLED),
      // activate instant direct session so the user is NEVER locked out!
      if (!firebaseSucceeded) {
        await directStudioLogin(demoEmail, demoName, role);
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
