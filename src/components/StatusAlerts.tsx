'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Database, SearchX, Sparkles, Loader2 } from 'lucide-react';

// Loading State with Skeleton Cards and messaging
export const LoadingSkeleton: React.FC<{ isDarkMode?: boolean }> = ({ isDarkMode }) => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Loading banner message */}
      <div className="flex items-center justify-center gap-3 p-4 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-sm font-semibold shadow-md">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
        <span>Querying GBIF &amp; iNaturalist biodiversity databases...</span>
      </div>

      {/* Species Card Skeleton */}
      <div
        className={`rounded-3xl border p-7 sm:p-9 space-y-5 ${
          isDarkMode ? 'glass-panel-dark border-emerald-900/40' : 'glass-panel-light border-emerald-200'
        }`}
      >
        <div className="flex gap-2">
          <div className="h-6 w-24 bg-emerald-500/10 rounded-xl" />
          <div className="h-6 w-28 bg-emerald-500/10 rounded-xl" />
        </div>
        <div className="h-10 w-2/3 sm:w-1/3 bg-emerald-500/15 rounded-2xl" />
        <div className="h-5 w-1/4 bg-emerald-500/10 rounded-xl" />
        <div className="h-24 w-full bg-emerald-500/5 rounded-2xl" />
      </div>

      {/* Image Gallery Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-emerald-500/10 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 aspect-16/10 bg-emerald-500/10 rounded-3xl" />
          <div className="flex flex-col gap-3">
            <div className="h-24 bg-emerald-500/10 rounded-2xl" />
            <div className="h-24 bg-emerald-500/10 rounded-2xl" />
            <div className="h-24 bg-emerald-500/10 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Observation List Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-emerald-500/10 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="h-56 bg-emerald-500/10 rounded-3xl" />
          <div className="h-56 bg-emerald-500/10 rounded-3xl" />
          <div className="h-56 bg-emerald-500/10 rounded-3xl" />
        </div>
      </div>
    </div>
  );
};

// Error State with Retry and Switch to Sample Data
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  onUseSampleData?: () => void;
  isDarkMode?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  onUseSampleData,
  isDarkMode,
}) => {
  return (
    <div
      className={`rounded-3xl border p-8 sm:p-12 text-center shadow-2xl max-w-2xl mx-auto card-3d ${
        isDarkMode
          ? 'glass-panel-dark border-rose-900/60 text-stone-100'
          : 'glass-panel-light border-rose-200 text-stone-900 shadow-rose-950/5'
      }`}
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-500">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-extrabold tracking-tight font-display mb-2">Species Discovery Request Paused</h3>
      <p className="text-sm text-stone-600 dark:text-stone-300 mb-7 leading-relaxed max-w-md mx-auto">
        {message ||
          'Unable to reach biodiversity API endpoints at this moment. Please verify your internet connection or switch to verified offline sample data.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all cursor-pointer active:scale-95 btn-premium"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Search</span>
        </button>

        {onUseSampleData && (
          <button
            onClick={onUseSampleData}
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 border border-amber-500/40 transition-all cursor-pointer active:scale-95"
          >
            <Database className="w-4 h-4 text-amber-500" />
            <span>Switch to Sample Dataset</span>
          </button>
        )}
      </div>
    </div>
  );
};

// Empty Results State Component
interface EmptyStateProps {
  query: string;
  onSelectSuggestion: (species: string) => void;
  isDarkMode?: boolean;
}

const EMPTY_SUGGESTIONS = [
  'Elephant',
  'Tiger',
  'Peacock',
  'Deer',
  'Monarch Butterfly',
  'Bald Eagle',
  'Wolf',
  'Bottlenose Dolphin',
  'Axolotl',
];

export const EmptyState: React.FC<EmptyStateProps> = ({
  query,
  onSelectSuggestion,
  isDarkMode,
}) => {
  return (
    <div
      className={`rounded-3xl border p-8 sm:p-14 text-center shadow-2xl max-w-2xl mx-auto card-3d ${
        isDarkMode
          ? 'glass-panel-dark border-emerald-900/40 text-stone-100'
          : 'glass-panel-light border-emerald-200 text-stone-900 shadow-emerald-950/5'
      }`}
    >
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-500">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-extrabold tracking-tight font-display mb-2">No Matching Species Found</h3>
      <p className="text-sm text-stone-600 dark:text-stone-300 mb-7 leading-relaxed max-w-lg mx-auto">
        We couldn&apos;t find any verified living wildlife records matching &ldquo;
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{query}</span>&rdquo;.
        Check your spelling, or explore one of the popular wildlife groups below:
      </p>

      <div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-3.5 font-bold uppercase tracking-wider">
          Suggested Species to Discover:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {EMPTY_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSelectSuggestion(s)}
              className="text-xs px-4 py-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer font-bold active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Clearly labeled Sample Data Banner
interface SampleDataBannerProps {
  onSwitchToLive: () => void;
}

export const SampleDataBanner: React.FC<SampleDataBannerProps> = ({ onSwitchToLive }) => {
  return (
    <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-3.5">
        <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-500 shrink-0 border border-amber-500/30">
          <Database className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-bold flex items-center gap-2">
            <span>Offline Curated Sample Dataset Active</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-950 dark:text-amber-200 font-mono font-bold">
              VERIFIED OFFLINE
            </span>
          </div>
          <p className="text-xs text-amber-900/80 dark:text-amber-300/80 mt-0.5">
            You are viewing verified local sample wildlife records. Live network calls to the GBIF API are currently paused.
          </p>
        </div>
      </div>

      <button
        onClick={onSwitchToLive}
        type="button"
        className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md cursor-pointer active:scale-95 btn-premium"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Switch to Live API</span>
      </button>
    </div>
  );
};
