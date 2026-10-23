'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Database, SearchX, Sparkles, CheckCircle2 } from 'lucide-react';

// Loading Skeleton Component
export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Species Card Skeleton */}
      <div className="bg-stone-900/80 rounded-2xl border border-stone-800 p-6 sm:p-8 space-y-4">
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-stone-800 rounded-md" />
          <div className="h-6 w-24 bg-stone-800 rounded-md" />
          <div className="h-6 w-28 bg-stone-800 rounded-md" />
        </div>
        <div className="h-10 w-2/3 sm:w-1/3 bg-stone-800 rounded-lg" />
        <div className="h-5 w-1/4 bg-stone-800 rounded-md" />
        <div className="h-24 w-full bg-stone-800/60 rounded-xl" />
      </div>

      {/* Image Gallery Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-stone-800 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="aspect-4/3 bg-stone-800 rounded-2xl" />
          <div className="aspect-4/3 bg-stone-800 rounded-2xl" />
          <div className="aspect-4/3 bg-stone-800 rounded-2xl" />
        </div>
      </div>

      {/* Observation List Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-stone-800 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-44 bg-stone-800/80 rounded-2xl" />
          <div className="h-44 bg-stone-800/80 rounded-2xl" />
          <div className="h-44 bg-stone-800/80 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

// Error State Component
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  onUseSampleData?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  onUseSampleData,
}) => {
  return (
    <div className="bg-stone-900/90 rounded-2xl border border-rose-900/50 p-8 sm:p-10 text-center shadow-xl max-w-2xl mx-auto">
      <div className="w-14 h-14 rounded-full bg-rose-950/80 border border-rose-700/50 flex items-center justify-center mx-auto mb-4 text-rose-400">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Species Discovery Request Failed</h3>
      <p className="text-sm text-stone-300 mb-6 leading-relaxed">
        {message || 'Unable to retrieve wildlife records at this time. Please check your network or try again.'}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Search</span>
        </button>

        {onUseSampleData && (
          <button
            onClick={onUseSampleData}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-600/30 transition-all cursor-pointer"
          >
            <Database className="w-4 h-4 text-amber-400" />
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
}

const EMPTY_SUGGESTIONS = [
  'Bengal Tiger',
  'Red Panda',
  'Blue Whale',
  'Monarch Butterfly',
  'Snow Leopard',
  'Peregrine Falcon',
];

export const EmptyState: React.FC<EmptyStateProps> = ({
  query,
  onSelectSuggestion,
}) => {
  return (
    <div className="bg-stone-900/80 rounded-2xl border border-stone-800 p-8 sm:p-12 text-center shadow-lg max-w-2xl mx-auto">
      <div className="w-14 h-14 rounded-full bg-stone-800 flex items-center justify-center mx-auto mb-4 text-stone-400">
        <SearchX className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Species Records Found</h3>
      <p className="text-sm text-stone-300 mb-6 leading-relaxed">
        We couldn&apos;t find any species or field observations matching &ldquo;
        <span className="text-emerald-400 font-semibold">{query}</span>&rdquo;.
        Check your spelling, or try searching for a well-known wildlife species.
      </p>

      <div>
        <p className="text-xs text-stone-400 mb-3 font-medium uppercase tracking-wider">
          Suggested Species Searches:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {EMPTY_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSelectSuggestion(s)}
              className="text-xs px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-emerald-950/80 text-stone-300 hover:text-emerald-300 border border-stone-700/60 hover:border-emerald-600/40 transition-all cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Distinct Sample Data Banner (Requirement 6: Clearly distinguish sample data from live API results)
interface SampleDataBannerProps {
  onSwitchToLive: () => void;
}

export const SampleDataBanner: React.FC<SampleDataBannerProps> = ({ onSwitchToLive }) => {
  return (
    <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-600/40 text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-bold text-amber-100 flex items-center gap-2">
            <span>Offline Curated Sample Dataset Active</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 font-mono">
              OFFLINE / FALLBACK
            </span>
          </div>
          <p className="text-xs text-amber-300/80 mt-0.5">
            You are viewing verified sample wildlife records. Live network API requests are paused.
          </p>
        </div>
      </div>

      <button
        onClick={onSwitchToLive}
        type="button"
        className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Switch to Live API</span>
      </button>
    </div>
  );
};
