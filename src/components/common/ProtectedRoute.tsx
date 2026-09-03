import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Sparkles, UserCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, openAuthModal, signInAsGuest } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center bg-gray-900/70 border border-gray-800 p-8 rounded-2xl backdrop-blur-xl shadow-2xl">
          <div className="w-16 h-16 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Protected Feature</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Your personal Watchlist is synchronized across your devices with Firebase. Please sign in or use 1-click guest access to view and manage your saved movies.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => openAuthModal('signin', location.pathname)}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-5 h-5" />
              Sign In to Continue
            </button>

            <button
              onClick={() => signInAsGuest()}
              className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium rounded-xl border border-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Instant Guest Access (Evaluation Mode)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
