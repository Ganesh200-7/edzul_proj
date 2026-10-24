'use client';

import React from 'react';
import { Leaf, Globe, Database, Wifi, Sun, Moon, Sparkles } from 'lucide-react';

interface HeaderProps {
  isSampleMode: boolean;
  onToggleSampleMode: () => void;
  onOpenAbout?: () => void;
  onScrollToExplore?: () => void;
  onScrollToHome?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSampleMode,
  onToggleSampleMode,
  onOpenAbout,
  onScrollToExplore,
  onScrollToHome,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-emerald-950/90 border-b border-emerald-800/40 text-white shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={onScrollToHome}
          className="flex items-center gap-3.5 group text-left cursor-pointer focus:outline-none"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-300/30 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <Leaf className="w-6 h-6 text-white drop-shadow" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-emerald-950 flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-emerald-950" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight font-display bg-gradient-to-r from-emerald-200 via-teal-100 to-green-300 bg-clip-text text-transparent">
                WildLife Explorer
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                GBIF Verified
              </span>
            </div>
            <p className="text-xs text-emerald-200/70 hidden sm:block font-medium">
              Global Species Discovery &amp; Biodiversity Observations
            </p>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-emerald-100/90">
          <button
            onClick={onScrollToHome}
            className="hover:text-emerald-300 transition-colors cursor-pointer py-1 relative group"
          >
            <span>Home</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button
            onClick={onScrollToExplore}
            className="hover:text-emerald-300 transition-colors cursor-pointer py-1 relative group"
          >
            <span>Species &amp; Records</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button
            onClick={onOpenAbout}
            className="hover:text-emerald-300 transition-colors cursor-pointer py-1 relative group"
          >
            <span>About Project</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
          </button>
        </nav>

        {/* Actions Toolbar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Live vs Offline Sample Mode Switcher */}
          <button
            onClick={onToggleSampleMode}
            type="button"
            className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md border cursor-pointer active:scale-95 ${
              isSampleMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30 shadow-amber-950/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30 shadow-emerald-950/30'
            }`}
            title="Toggle between Live GBIF API network stream and Offline Curated Sample dataset"
          >
            {isSampleMode ? (
              <>
                <Database className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Offline Mode</span>
                <span className="sm:hidden">Offline</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Live GBIF API</span>
                <span className="sm:hidden">Live</span>
              </>
            )}
          </button>

          {/* Theme Toggle Button */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-2xl bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 hover:text-white transition-all border border-emerald-700/50 shadow-md cursor-pointer active:scale-90"
              title={isDarkMode ? 'Switch to Light Forest Mode' : 'Switch to Dark Forest Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-300" />
              )}
            </button>
          )}
          {/* Link to GBIF */}
          <a
            href="https://www.gbif.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-emerald-300/80 hover:text-emerald-100 transition-colors px-2 py-1"
            title="Visit Global Biodiversity Information Facility"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>gbif.org</span>
          </a>
        </div>
      </div>
    </header>
  );
};
