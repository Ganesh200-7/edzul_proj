'use client';

import React, { useState } from 'react';
import { Search, Sparkles, X, Filter, AlertCircle, Leaf } from 'lucide-react';
import { IconicTaxon } from '../types/wildlife';

interface HeroSectionProps {
  onSearch: (query: string, iconicTaxon?: IconicTaxon) => void;
  isLoading: boolean;
  currentQuery: string;
  selectedCategory: IconicTaxon;
  onSelectCategory: (category: IconicTaxon) => void;
}

const POPULAR_SPECIES = [
  'Bengal Tiger',
  'Red Panda',
  'Blue Whale',
  'Monarch Butterfly',
  'Snow Leopard',
  'Peregrine Falcon',
  'Giant Panda',
  'Koala',
];

const CATEGORIES: { label: string; value: IconicTaxon }[] = [
  { label: 'All Life', value: 'All' },
  { label: 'Mammals', value: 'Mammalia' },
  { label: 'Birds', value: 'Aves' },
  { label: 'Insects', value: 'Insecta' },
  { label: 'Reptiles', value: 'Reptilia' },
  { label: 'Amphibians', value: 'Amphibia' },
  { label: 'Fishes', value: 'Actinopterygii' },
  { label: 'Plants', value: 'Plantae' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  isLoading,
  currentQuery,
  selectedCategory,
  onSelectCategory,
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
    onSearch(query, selectedCategory);
  };

  const handleQuickSearch = (species: string) => {
    setSearchInput(species);
    setValidationError(null);
    onSearch(species, selectedCategory);
  };

  const handleClear = () => {
    setSearchInput('');
    setValidationError(null);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900/95 to-stone-950 text-stone-100 pt-10 pb-12 border-b border-stone-800/80">
      {/* Decorative nature gradient accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Intro Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 mb-6 shadow-inner">
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          <span>Global Biodiversity & Species Catalog</span>
        </div>

        {/* Title & Short Project Introduction */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
          Discover Earth&apos;s{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            Wildlife Heritage
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base lg:text-lg mb-8 leading-relaxed">
          Search thousands of living species across continents. Explore scientific taxonomy, authentic common names, high-resolution wildlife photography, and verified real-world citizen science observations.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-3">
          <div className="relative flex items-center shadow-2xl rounded-2xl bg-stone-800/90 border border-stone-700/80 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all p-1.5">
            <div className="pl-3.5 pr-2 text-stone-400">
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
              placeholder="Search by common or scientific name (e.g., Bengal Tiger, Ailurus fulgens, Blue Whale)..."
              className="w-full bg-transparent border-0 py-3 text-stone-100 placeholder:text-stone-400 focus:outline-none text-sm sm:text-base"
              disabled={isLoading}
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-stone-400 hover:text-stone-200 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              id="species-search-button"
              disabled={isLoading}
              className="ml-2 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white shadow-md shadow-emerald-950/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Searching...</span>
                </>
              ) : (
                <>
                  <span>Search</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 mt-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{validationError}</span>
            </div>
          )}
        </form>

        {/* Taxonomic Category Filter */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 mt-5 max-w-3xl mx-auto">
          <span className="text-xs text-stone-400 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3 text-stone-500" /> Filter:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => {
                  onSelectCategory(cat.value);
                  if (searchInput.trim()) {
                    onSearch(searchInput.trim(), cat.value);
                  }
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50 border border-emerald-400/40'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 border border-stone-700/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          <span className="text-xs text-stone-400">Popular:</span>
          {POPULAR_SPECIES.map((species) => (
            <button
              key={species}
              type="button"
              onClick={() => handleQuickSearch(species)}
              className="text-xs px-2.5 py-1 rounded-lg bg-stone-800/50 hover:bg-emerald-950/70 text-stone-300 hover:text-emerald-300 border border-stone-700/50 hover:border-emerald-600/40 transition-colors"
            >
              {species}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
