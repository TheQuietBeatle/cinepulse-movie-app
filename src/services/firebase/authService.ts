import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebaseConfig';
import type { UserProfile } from '../../models/user';
import { localStorageService } from '../storage/localStorageService';

class AuthService {
  subscribeToAuth(callback: (user: UserProfile | null) => void): () => void {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
        if (firebaseUser) {
          const userProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            photoURL: firebaseUser.photoURL,
            isGuest: false
          };
          localStorageService.setCurrentUser(userProfile);
          callback(userProfile);
        } else {
          const guestUser = localStorageService.getCurrentUser();
          if (guestUser && guestUser.isGuest) {
            callback(guestUser);
          } else {
            localStorageService.setCurrentUser(null);
            callback(null);
          }
        }
      });
      return unsubscribe;
    }

    const current = localStorageService.getCurrentUser();
    callback(current);

    const handleUserUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ user: UserProfile | null }>;
      callback(customEvent.detail.user);
    };

    window.addEventListener('user_updated', handleUserUpdate);
    return () => {
      window.removeEventListener('user_updated', handleUserUpdate);
    };
  }

  async signInWithEmail(email: string, pass: string): Promise<UserProfile> {
    if (isFirebaseConfigured && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const userProfile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || email.split('@')[0],
        photoURL: cred.user.photoURL,
        isGuest: false
      };
      localStorageService.setCurrentUser(userProfile);
      return userProfile;
    }

    if (!email || !pass) throw new Error('Please provide email and password');
    const demoProfile: UserProfile = {
      uid: 'demo_' + Math.abs(this.hashCode(email)),
      email: email,
      displayName: email.split('@')[0],
      photoURL: null,
      isGuest: false,
      createdAt: Date.now()
    };
    localStorageService.setCurrentUser(demoProfile);
    return demoProfile;
  }

  async signUpWithEmail(email: string, pass: string, name: string): Promise<UserProfile> {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && cred.user) {
        await updateProfile(cred.user, { displayName: name });
      }
      const userProfile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name || email.split('@')[0],
        photoURL: cred.user.photoURL,
        isGuest: false
      };
      localStorageService.setCurrentUser(userProfile);
      return userProfile;
    }

    if (!email || !pass) throw new Error('Please fill in all required fields');
    const demoProfile: UserProfile = {
      uid: 'demo_' + Math.abs(this.hashCode(email)),
      email: email,
      displayName: name || email.split('@')[0],
      photoURL: null,
      isGuest: false,
      createdAt: Date.now()
    };
    localStorageService.setCurrentUser(demoProfile);
    return demoProfile;
  }

  async signInAsGuest(): Promise<UserProfile> {
    const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
    const guestUser: UserProfile = {
      uid: guestId,
      email: 'guest@cinepulse.demo',
      displayName: 'Guest Reviewer',
      photoURL: null,
      isGuest: true,
      createdAt: Date.now()
    };
    localStorageService.setCurrentUser(guestUser);
    return guestUser;
  }

  async signOut(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    }
    localStorageService.setCurrentUser(null);
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}

export const authService = new AuthService();
