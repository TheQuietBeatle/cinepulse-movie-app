import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavoritesViewModel } from '../../viewmodels/useFavoritesViewModel';
import { isLiveApiConfigured } from '../../services/api/omdbService';
import { isFirebaseConfigured } from '../../services/firebase/firebaseConfig';
import {
  Film,
  Compass,
  Bookmark,
  User,
  LogOut,
  Search,
  CheckCircle2,
  AlertCircle,
  Menu,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, openAuthModal, signOut } = useAuth();
  const { stats } = useFavoritesViewModel();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showStatusTooltip, setShowStatusTooltip] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleQuickSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get('q') as string)?.trim();
    if (q) {
      navigate(`/explore?q=${encodeURIComponent(q)}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              CINE<span className="text-red-500">PULSE</span>
            </span>
            <span className="text-[10px] tracking-widest text-gray-400 uppercase block font-semibold">
              MVVM Movie Hub
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/')
                ? 'text-white bg-gray-800/80 shadow-inner'
                : 'text-gray-400 hover:text-white hover:bg-gray-900'
            }`}
          >
            Home
          </Link>
          <Link
            to="/explore"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/explore')
                ? 'text-white bg-gray-800/80 shadow-inner'
                : 'text-gray-400 hover:text-white hover:bg-gray-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            Explore
          </Link>
          <Link
            to="/favorites"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/favorites')
                ? 'text-white bg-gray-800/80 shadow-inner'
                : 'text-gray-400 hover:text-white hover:bg-gray-900'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Watchlist
            {stats.total > 0 && (
              <span className="bg-red-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                {stats.total}
              </span>
            )}
          </Link>
        </nav>

        {/* Right Section: Quick Search + Status + Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Search Input */}
          <form onSubmit={handleQuickSearchSubmit} className="relative w-48 lg:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              name="q"
              placeholder="Quick search..."
              className="w-full pl-9 pr-3 py-1.5 bg-gray-900/90 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:w-72 transition-all"
            />
          </form>

          {/* System Status Pill */}
          <div className="relative">
            <button
              onClick={() => setShowStatusTooltip(!showStatusTooltip)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-900 border border-gray-800 text-[11px] text-gray-300 hover:border-gray-700"
              title="Click to check API & Backend integration status"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveApiConfigured() && isFirebaseConfigured
                    ? 'bg-emerald-500'
                    : 'bg-amber-400'
                }`}
              />
              <span>{isLiveApiConfigured() ? 'Live OMDB' : 'Demo API'}</span>
            </button>

            {showStatusTooltip && (
              <div
                className="absolute right-0 mt-2 w-72 p-3 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 text-xs"
                onClick={() => setShowStatusTooltip(false)}
              >
                <h4 className="font-bold text-white mb-2 flex items-center justify-between">
                  Backend Integration
                  <span className="text-[10px] text-gray-400">Click to close</span>
                </h4>
                <div className="space-y-1.5 text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>OMDB Movie API:</span>
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isLiveApiConfigured() ? 'Custom API Key' : 'Built-in Demo Key'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Firebase Auth & DB:</span>
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        isFirebaseConfigured ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isFirebaseConfigured ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      {isFirebaseConfigured ? 'Live Firebase' : 'Demo Local Mode'}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 mt-2 border-t border-gray-800 pt-1.5">
                  Check <code className="text-gray-400">.env.example</code> to configure your own keys.
                </p>
              </div>
            )}
          </div>

          {/* User Profile / Auth Action */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
              <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center font-bold text-xs">
                {user.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">
                  {user.displayName || 'User'}
                </p>
                <p className="text-[10px] text-gray-400 leading-tight">
                  {user.isGuest ? 'Guest Reviewer' : user.email}
                </p>
              </div>
              <button
                onClick={() => signOut()}
                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-900 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('signin')}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white rounded-lg"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 p-4 space-y-3">
          <form onSubmit={handleQuickSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              name="q"
              placeholder="Search movies & series..."
              className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white"
            />
          </form>

          <div className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-lg text-sm font-medium ${
                isActive('/') ? 'text-white bg-gray-900 font-bold' : 'text-gray-400'
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                isActive('/explore') ? 'text-white bg-gray-900 font-bold' : 'text-gray-400'
              }`}
            >
              <span>Explore & Search</span>
              <Compass className="w-4 h-4" />
            </Link>
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                isActive('/favorites') ? 'text-white bg-gray-900 font-bold' : 'text-gray-400'
              }`}
            >
              <span>My Watchlist</span>
              {stats.total > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {stats.total}
                </span>
              )}
            </Link>
          </div>

          <div className="border-t border-gray-800 pt-3">
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{user.displayName}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-gray-800 text-xs font-medium text-red-400 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  openAuthModal('signin');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-red-600 text-white font-semibold rounded-xl text-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
