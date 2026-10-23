'use client';

import React, { useState } from 'react';
import { Species } from '../types/wildlife';
import { ShieldCheck, Tag, BookOpen, Layers, ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface SpeciesCardProps {
  species: Species;
  allSpecies?: Species[];
  onSelectSpecies?: (species: Species) => void;
}

export const SpeciesCard: React.FC<SpeciesCardProps> = ({
  species,
  allSpecies = [],
  onSelectSpecies,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Status color helper
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const lower = status.toLowerCase();
    let colorClasses = 'bg-stone-700 text-stone-200 border-stone-600';

    if (lower.includes('critically') || lower.includes('cr')) {
      colorClasses = 'bg-rose-950/80 text-rose-300 border-rose-700/60';
    } else if (lower.includes('endangered') || lower.includes('en')) {
      colorClasses = 'bg-orange-950/80 text-orange-300 border-orange-700/60';
    } else if (lower.includes('vulnerable') || lower.includes('vu')) {
      colorClasses = 'bg-amber-950/80 text-amber-300 border-amber-700/60';
    } else if (lower.includes('least concern') || lower.includes('lc')) {
      colorClasses = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
    } else if (lower.includes('near threatened') || lower.includes('nt')) {
      colorClasses = 'bg-yellow-950/80 text-yellow-300 border-yellow-700/60';
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colorClasses}`}>
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>IUCN: {status}</span>
      </span>
    );
  };

  return (
    <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-6 sm:p-8 shadow-xl text-stone-100">
      {/* If multiple taxa were returned, show tabs to switch between species */}
      {allSpecies.length > 1 && onSelectSpecies && (
        <div className="mb-6 pb-4 border-b border-stone-800">
          <p className="text-xs font-medium text-stone-400 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Multiple matching taxa found ({allSpecies.length}):</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {allSpecies.map((s) => {
              const isCurrent = s.id === species.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectSpecies(s)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                  }`}
                >
                  <span className="font-semibold">{s.commonName || s.scientificName}</span>
                  {s.commonName && s.commonName !== s.scientificName && (
                    <span className="italic text-[11px] opacity-80 ml-1.5 font-normal">
                      ({s.scientificName})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Species Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
              <Tag className="w-3 h-3" />
              {species.rank}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20">
              {species.iconicTaxonName}
            </span>
            {getStatusBadge(species.conservationStatus)}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {species.commonName || species.scientificName}
          </h2>
          <p className="text-base sm:text-lg text-emerald-300 italic font-serif mt-0.5">
            {species.scientificName}
          </p>
        </div>

        {species.observationsCount !== undefined && species.observationsCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800/80 border border-stone-700/60 self-start lg:self-center">
            <Eye className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-xs text-stone-400 font-medium">Recorded Sightings</div>
              <div className="text-sm sm:text-base font-bold text-white">
                {species.observationsCount.toLocaleString()} observations
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wikipedia Summary if available */}
      {species.wikipediaSummary && (
        <div className="mt-4 p-4 rounded-xl bg-stone-800/50 border border-stone-800/80 text-stone-300 text-sm leading-relaxed">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-1.5 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encyclopedia Summary</span>
          </div>
          <p className={isExpanded ? '' : 'line-clamp-3'}>
            {species.wikipediaSummary}
          </p>
          {species.wikipediaSummary.length > 250 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>{isExpanded ? 'Show less' : 'Read full overview'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
