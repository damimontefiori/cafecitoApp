import { 
  signInWithRedirect, 
  signInWithPopup,
  getRedirectResult,
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { AdminUser } from '@/types';

export const signInWithGoogle = async (): Promise<AdminUser | null> => {
  try {
    // Primero intentar obtener resultado de redirect (si hubo uno)
    const redirectResult = await getRedirectResult(auth);
    if (redirectResult?.user) {
      const user = redirectResult.user;
      return {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
      };
    }

    // Si no hay resultado de redirect, iniciar nuevo redirect
    await signInWithRedirect(auth, googleProvider);
    return null; // El redirect redirigirá la página
  } catch (error) {
    console.error('Error signing in with Google:', error);
    // Si redirect falla, intentar con popup como fallback
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
      };
    } catch (popupError) {
      console.error('Both redirect and popup failed:', popupError);
      throw popupError;
    }
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