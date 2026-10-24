'use client';

import React, { useEffect } from 'react';
import { X, Leaf, Globe, ShieldCheck, Code2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/90 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`relative max-w-2xl w-full rounded-3xl border shadow-2xl overflow-hidden p-6 sm:p-9 card-3d ${
          isDarkMode
            ? 'glass-panel-dark text-stone-100 border-emerald-500/30'
            : 'glass-panel-light text-stone-900 border-emerald-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight font-display">WildLife Explorer</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
              Global Species Discovery Platform &bull; Academic Project
            </p>
          </div>
        </div>

        {/* Project Slogan */}
        <div className="p-4 mb-6 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-green-500/15 border border-emerald-500/30 text-center shadow-inner">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 tracking-wider uppercase">
            Project Mission:
          </span>
          <p className="text-base font-extrabold text-emerald-950 dark:text-emerald-200 italic mt-0.5 font-serif">
            &ldquo;Exploring today. Conserving tomorrow.&rdquo;
          </p>
        </div>

        {/* Description Body */}
        <div className="space-y-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          <p>
            <strong>WildLife Explorer</strong> is a responsive web application designed for exploring wildlife species, authentic biodiversity observation records, high-resolution photographs, scientific taxonomy, common names, dates, and geographic locations.
          </p>

          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Multi-Source AI &amp; Biodiversity Architecture:</span>
            </h4>
            <p>
              Data is queried in real time across the <strong>Global Biodiversity Information Facility (GBIF)</strong>, <strong>iNaturalist Taxa API</strong>, and the team&apos;s <strong>DeepSeek AI LLM</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1 font-mono text-[11px] bg-stone-100 dark:bg-stone-900/70 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800">
              <li>GBIF /v1/species/match – Canonical scientific name matching</li>
              <li>GBIF /v1/occurrence/search – Verified observation records, coordinates, photos</li>
              <li>iNaturalist v1 Taxa – Community vetted vernacular names &amp; fallback images</li>
              <li>DeepSeek-V4.1-Flash – AI taxonomy disambiguation &amp; ecological profile traits</li>
              <li>Wikimedia Commons – Verified Creative Commons photo archives</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Technology Stack:</span>
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-semibold">
                Next.js 16 (App Router)
              </span>
              <span className="px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-semibold">
                TypeScript 5
              </span>
              <span className="px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-semibold">
                Tailwind CSS v4
              </span>
              <span className="px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-semibold">
                DeepSeek-V4.1-Flash LLM
              </span>
              <span className="px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-semibold">
                Leaflet GIS (Satellite, Topo, Dark, Voyager)
              </span>
              <span className="px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-semibold">
                GBIF &amp; iNaturalist Open APIs
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Open Science &amp; CC-BY Compliant</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer shadow-md active:scale-95 btn-premium"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
