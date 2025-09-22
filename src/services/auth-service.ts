import { 
  signInWithPopup,
  signInWithRedirect, 
  getRedirectResult,
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { AdminUser } from '@/types';

export const signInWithGoogle = async (): Promise<AdminUser | null> => {
  try {
    // Try popup first (faster, better UX)
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
    };
  } catch (error: any) {
    console.error('Popup failed, trying redirect:', error);
    
    // If popup fails, try redirect as fallback
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      try {
        await signInWithRedirect(auth, googleProvider);
        return null; // Redirect will handle the auth
      } catch (redirectError) {
        console.error('Both popup and redirect failed:', redirectError);
        throw redirectError;
      }
    }
    
    throw error;
  }
};

export const handleRedirectResult = async (): Promise<AdminUser | null> => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      const user = result.user;
      return {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
      };
    }
    return null;
  } catch (error) {
    console.error('Error handling redirect result:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const onAuthChange = (callback: (user: AdminUser | null) => void) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
      });
    } else {
      callback(null);
    }
  });
};

export const getCurrentUser = (): AdminUser | null => {
  const user = auth.currentUser;
  if (user) {
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
    };
  }
  return null;
};