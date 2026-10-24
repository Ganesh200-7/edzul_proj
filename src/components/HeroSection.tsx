'use client';

import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  X,
  AlertCircle,
  Leaf,
  Compass,
  Camera,
  Globe2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  currentQuery: string;
}

const POPULAR_SPECIES = [
  { name: 'Elephant', badge: 'Mammal' },
  { name: 'Tiger', badge: 'Big Cat' },
  { name: 'Peacock', badge: 'Bird' },
  { name: 'Monarch Butterfly', badge: 'Insect' },
  { name: 'Bald Eagle', badge: 'Raptor' },
  { name: 'Bottlenose Dolphin', badge: 'Marine' },
  { name: 'Axolotl', badge: 'Amphibian' },
  { name: 'White-tailed Deer', badge: 'Ungulate' },
  { name: 'Wolf', badge: 'Canid' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  isLoading,
  currentQuery,
}) => {
  const [searchInput, setSearchInput] = useState(currentQuery);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) {
      setValidationError('Please enter a species name or common name before searching.');
      return;
    }
    setValidationError(null);
    onSearch(query);
  };

  const handleQuickSearch = (species: string) => {
    setSearchInput(species);
    setValidationError(null);
    onSearch(species);
  };

  const handleClear = () => {
    setSearchInput('');
    setValidationError(null);
  };

  return (
    <section className="relative overflow-hidden bg-forest-ambient text-white pt-14 pb-20 border-b border-emerald-900/40">
      {/* Background Nature Backdrop with Subtle Wildlife Image Overlay */}
      <div
        className="absolute inset-0 opacity-12 bg-cover bg-center mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=80")',
        }}
      />
      {/* Ambient Gradient Glow Spheres */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Banner Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 mb-6 shadow-inner backdrop-blur-md">
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          <span>WildLife Explorer &bull; Global Species Discovery</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white mb-4 leading-tight">
          Discover Earth&apos;s{' '}
          <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-green-300 bg-clip-text text-transparent">
            Incredible Wildlife
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl font-medium text-emerald-100/90 mb-3 max-w-3xl mx-auto">
          Explore real biodiversity records, verified taxonomy, and authentic citizen science photography worldwide.
        </p>
        <p className="max-w-2xl mx-auto text-emerald-200/70 text-xs sm:text-sm mb-10 leading-relaxed font-normal">
          Powered by the Global Biodiversity Information Facility (GBIF) and iNaturalist open databases, connecting nature explorers, researchers, and students with verified species taxonomy and real occurrence records.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-5">
          <div className="relative flex items-center shadow-2xl rounded-3xl bg-white/95 text-stone-800 border-2 border-emerald-400/80 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-400/30 transition-all duration-300 p-2 backdrop-blur-md">
            <div className="pl-4 pr-2 text-emerald-700">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="species-search-input"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Search for any animal or species (e.g., peacock, deer, tiger, elephant, axolotl)..."
              className="w-full bg-transparent border-0 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none text-sm sm:text-base font-semibold"
              disabled={isLoading}
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer mr-1"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              id="species-search-button"
              disabled={isLoading}
              className="ml-1 inline-flex items-center gap-2 px-7 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-500 hover:to-green-500 active:scale-95 text-white shadow-lg shadow-emerald-950/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer btn-premium"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Searching...</span>
                </>
              ) : (
                <>
                  <span>Explore</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-rose-300 mt-2 font-medium bg-rose-950/60 py-1.5 px-4 rounded-xl border border-rose-800/40 w-fit mx-auto shadow-md">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>{validationError}</span>
            </div>
          )}
        </form>

        {/* Quick Suggestion Pills */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          <span className="text-xs text-emerald-300/80 font-bold uppercase tracking-wider flex items-center gap-1 mr-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Popular:</span>
          </span>
          {POPULAR_SPECIES.map((species) => (
            <button
              key={species.name}
              type="button"
              onClick={() => handleQuickSearch(species.name)}
              className="group text-xs px-3.5 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/90 text-emerald-100 hover:text-white border border-emerald-700/50 hover:border-emerald-400/60 transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>{species.name}</span>
              <span className="text-[10px] opacity-60 font-mono uppercase bg-emerald-950/50 px-1 py-0.2 rounded group-hover:opacity-90">
                {species.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Feature Highlights Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mt-14 pt-10 border-t border-emerald-800/40 text-left">
          <div className="glass-panel-dark p-4 rounded-2xl card-3d flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300 shrink-0 shadow-inner">
              <Compass className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-display">Species Discovery</div>
              <div className="text-[11px] text-emerald-200/70 mt-0.5 leading-snug">
                Scientific taxonomy, rank &amp; accepted hierarchy
              </div>
            </div>
          </div>

          <div className="glass-panel-dark p-4 rounded-2xl card-3d flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300 shrink-0 shadow-inner">
              <Globe2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-display">Spatial Records</div>
              <div className="text-[11px] text-emerald-200/70 mt-0.5 leading-snug">
                Interactive GIS coordinates across countries
              </div>
            </div>
          </div>

          <div className="glass-panel-dark p-4 rounded-2xl card-3d flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300 shrink-0 shadow-inner">
              <Camera className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-display">Wildlife Imagery</div>
              <div className="text-[11px] text-emerald-200/70 mt-0.5 leading-snug">
                Verified CC-licensed wildlife photographs
              </div>
            </div>
          </div>

          <div className="glass-panel-dark p-4 rounded-2xl card-3d flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300 shrink-0 shadow-inner">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-display">GBIF &amp; iNat Data</div>
              <div className="text-[11px] text-emerald-200/70 mt-0.5 leading-snug">
                Authentic, multi-source open biodiversity data
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
