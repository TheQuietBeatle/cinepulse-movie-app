import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { UserProfile } from '../models/user';
import { authService } from '../services/firebase/authService';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  redirectAfterLogin: string | null;
  openAuthModal: (mode?: 'signin' | 'signup', redirectAfter?: string) => void;
  closeAuthModal: () => void;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin', redirectAfter?: string) => {
    setAuthModalMode(mode);
    if (redirectAfter) {
      setRedirectAfterLogin(redirectAfter);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signIn = async (email: string, pass: string) => {
    await authService.signInWithEmail(email, pass);
    setIsAuthModalOpen(false);
  };

  const signUp = async (email: string, pass: string, name: string) => {
    await authService.signUpWithEmail(email, pass, name);
    setIsAuthModalOpen(false);
  };

  const signInAsGuest = async () => {
    await authService.signInAsGuest();
    setIsAuthModalOpen(false);
  };

  const signOut = async () => {
    await authService.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        authModalMode,
        redirectAfterLogin,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        signInAsGuest,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
