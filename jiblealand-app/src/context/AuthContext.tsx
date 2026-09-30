import React, { createContext, useContext, useState, useEffect } from 'react';

export interface GoogleAccount {
  id: string;
  name: string;
  email: string;
  picture: string;
  givenName: string;
  familyName: string;
  isSignedIn: boolean;
  authProvider: 'google';
  lastLoginAt: string;
}

// Active session default based on current user environment
export const ACTIVE_GOOGLE_USER: GoogleAccount = {
  id: 'goog_108492049182390192',
  name: 'Alexandra Elena Georgescu',
  email: 'alexandraelena_georgescu@trimble.com',
  picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  givenName: 'Alexandra',
  familyName: 'Georgescu',
  isSignedIn: true,
  authProvider: 'google',
  lastLoginAt: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
};

interface AuthContextType {
  currentUser: GoogleAccount | null;
  isSignedIn: boolean;
  signInWithActiveGoogleSession: () => void;
  signInWithGoogleAccount: (email: string, name: string) => void;
  signOut: () => void;
  openGoogleModal: () => void;
  closeGoogleModal: () => void;
  isGoogleModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'jiblealand_google_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<GoogleAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved Google session', e);
    }
    // Default to active session from environment
    return ACTIVE_GOOGLE_USER;
  });

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  useEffect(() => {
    // Attempt to load Google Identity Services client script dynamically
    if (!document.getElementById('google-gsi-script')) {
      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const signInWithActiveGoogleSession = () => {
    const updated = {
      ...ACTIVE_GOOGLE_USER,
      isSignedIn: true,
      lastLoginAt: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
    };
    setCurrentUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setIsGoogleModalOpen(false);
  };

  const signInWithGoogleAccount = (email: string, name: string) => {
    const parts = name.trim().split(' ');
    const givenName = parts[0] || 'Utilizator';
    const familyName = parts.slice(1).join(' ') || 'Google';

    const account: GoogleAccount = {
      id: `goog_${Date.now()}`,
      name: name || 'Utilizator Google',
      email: email.trim(),
      picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      givenName,
      familyName,
      isSignedIn: true,
      authProvider: 'google',
      lastLoginAt: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
    };

    setCurrentUser(account);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    setIsGoogleModalOpen(false);
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isSignedIn: !!currentUser?.isSignedIn,
        signInWithActiveGoogleSession,
        signInWithGoogleAccount,
        signOut,
        openGoogleModal: () => setIsGoogleModalOpen(true),
        closeGoogleModal: () => setIsGoogleModalOpen(false),
        isGoogleModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
