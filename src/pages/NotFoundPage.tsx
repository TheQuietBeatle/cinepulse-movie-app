import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-20 h-20 bg-red-600/10 border border-red-500/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
          <Film className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-white tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-gray-200">Scene Not Found</h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            The reel you are looking for has been cut from the final release or moved to another archive.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-red-600/30 flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
          <Link
            to="/explore"
            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-semibold rounded-xl border border-gray-800 transition-colors flex items-center gap-2"
          >
            <Compass className="w-4 h-4" /> Browse Cinema
          </Link>
        </div>
      </div>
    </div>
  );
};
