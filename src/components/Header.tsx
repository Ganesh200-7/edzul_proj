'use client';

import React from 'react';
import { Compass, Globe, Sparkles, Database, Wifi } from 'lucide-react';

interface HeaderProps {
  isSampleMode: boolean;
  onToggleSampleMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isSampleMode, onToggleSampleMode }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-stone-900/90 border-b border-emerald-950/40 text-stone-100 shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-900/40 border border-emerald-400/30">
            <Compass className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                WildLife Explorer
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v1.0
              </span>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block">
              Global Species Discovery & Biodiversity Records
            </p>
          </div>
        </div>

        {/* Live / Fallback Mode Badge & Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSampleMode}
            type="button"
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm border ${
              isSampleMode
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
            }`}
            title="Click to toggle between Live iNaturalist API and Curated Sample Data"
          >
            {isSampleMode ? (
              <>
                <Database className="w-4 h-4 text-amber-400" />
                <span>Sample Data Mode</span>
                <span className="hidden md:inline text-[11px] opacity-75">(Click for Live API)</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Live API (iNaturalist)</span>
                <span className="hidden md:inline text-[11px] opacity-75">(Click for Sample)</span>
              </>
            )}
          </button>

          <a
            href="https://www.inaturalist.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs text-stone-400 hover:text-emerald-300 transition-colors px-2 py-1 rounded-lg hover:bg-stone-800"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>iNaturalist Network</span>
          </a>
        </div>
      </div>
    </header>
  );
};
