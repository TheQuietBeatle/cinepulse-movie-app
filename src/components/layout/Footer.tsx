import React from 'react';
import { Film, Heart, Shield, Code, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-gray-900 bg-gray-950/90 text-gray-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-base font-black tracking-tight text-white">
                CINE<span className="text-red-500">PULSE</span>
              </span>
            </div>
            <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
              A modern cinema discovery platform built with React, TypeScript, and the MVVM (Model-View-ViewModel) architectural pattern, powered by the OMDB API and Firebase Authentication & Realtime Database.
            </p>
          </div>

          {/* Architecture Highlights */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-red-500" />
              Architecture
            </h4>
            <ul className="space-y-1.5 text-gray-400">
              <li>• MVVM Pattern Separation</li>
              <li>• Custom ViewModel Hooks</li>
              <li>• Typed API Client & AbortControllers</li>
              <li>• Firebase Realtime Sync</li>
              <li>• Protected Route Guards</li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Tech Stack
            </h4>
            <ul className="space-y-1.5 text-gray-400">
              <li>• React 19 + TypeScript</li>
              <li>• Tailwind CSS & Lucide Icons</li>
              <li>• Vite Build Pipeline</li>
              <li>• OMDB API Service</li>
              <li>• Firebase Auth + Realtime DB</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-1 text-gray-500">
            Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> using AI-assisted engineering & rigorous developer refactoring.
          </p>
          <div className="flex items-center gap-4 text-gray-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500" /> Enterprise Clean Code
            </span>
            <span>•</span>
            <span>OMDB API & Firebase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
