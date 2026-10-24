'use client';

import React from 'react';
import { Leaf, ExternalLink, ShieldCheck, Sparkles, Globe, Compass } from 'lucide-react';

interface FooterProps {
  onOpenAbout?: () => void;
  onScrollToExplore?: () => void;
  onScrollToHome?: () => void;
  isDarkMode?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAbout,
  onScrollToExplore,
  onScrollToHome,
  isDarkMode,
}) => {
  return (
    <footer
      className={`w-full border-t py-14 text-xs transition-all relative overflow-hidden ${
        isDarkMode
          ? 'bg-stone-950 border-emerald-900/30 text-stone-400'
          : 'bg-emerald-950 border-emerald-900/80 text-emerald-200/80'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission & Slogan */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 text-white font-extrabold text-lg font-display">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="bg-gradient-to-r from-emerald-200 to-green-300 bg-clip-text text-transparent">
                WildLife Explorer
              </span>
            </div>
            <p className="text-emerald-100/70 text-sm leading-relaxed max-w-md">
              An enterprise-grade global biodiversity discovery platform connecting nature explorers, researchers, and students with verified species taxonomy and real-world field observation records worldwide.
            </p>
            <div className="p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-800/60 inline-block backdrop-blur-md shadow-inner">
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-300">
                Project Mission:
              </span>
              <div className="text-white font-extrabold text-sm italic font-serif mt-0.5">
                &ldquo;Exploring today. Conserving tomorrow.&rdquo;
              </div>
            </div>
          </div>

          {/* Navigation & Details */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-[11px] font-display">
              Quick Navigation
            </div>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={onScrollToHome}
                  className="hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onScrollToExplore}
                  className="hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Explore Wildlife</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>About Project</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Scientific Data Source & Compliance */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-[11px] font-display">
              Biodiversity Data
            </div>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://www.gbif.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>GBIF Public Occurrence API</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.inaturalist.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>iNaturalist Taxa API</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.openstreetmap.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>OpenStreetMap &amp; Esri GIS</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Open Science Compliant</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-emerald-900/60 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 dark:text-stone-500">
          <div>
            &copy; 2026 WildLife Explorer &bull; College Team Project Submission. Open Science &amp; Citizen Biodiversity Discovery.
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span>Next.js 16</span>
            <span>&bull;</span>
            <span>TypeScript</span>
            <span>&bull;</span>
            <span>GBIF API</span>
            <span>&bull;</span>
            <span>Esri &amp; Leaflet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
