'use client';

import React, { useState } from 'react';
import { Species } from '../types/wildlife';
import {
  Tag,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Globe,
  Sparkles,
  Compass,
  MapPin,
  Utensils,
  ShieldAlert,
} from 'lucide-react';

interface SpeciesCardProps {
  species: Species;
  allSpecies?: Species[];
  onSelectSpecies?: (species: Species) => void;
  isDarkMode?: boolean;
}

export const SpeciesCard: React.FC<SpeciesCardProps> = ({
  species,
  allSpecies = [],
  onSelectSpecies,
  isDarkMode,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Taxonomic classification hierarchy
  const classificationEntries = [
    { label: 'Kingdom', val: species.classification?.kingdom },
    { label: 'Phylum', val: species.classification?.phylum },
    { label: 'Class', val: species.classification?.class },
    { label: 'Order', val: species.classification?.order },
    { label: 'Family', val: species.classification?.family },
    { label: 'Genus', val: species.classification?.genus },
  ].filter((item) => Boolean(item.val));

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 p-6 sm:p-9 shadow-2xl relative overflow-hidden card-3d ${
        isDarkMode
          ? 'glass-panel-dark text-stone-100 border-emerald-500/20'
          : 'glass-panel-light text-stone-900 border-emerald-200/80 shadow-emerald-950/5'
      }`}
    >
      {/* Ambient Corner Glow Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Multiple Matching Taxa Selector Tabs */}
      {allSpecies.length > 1 && onSelectSpecies && (
        <div className="mb-7 pb-6 border-b border-emerald-800/20 dark:border-emerald-800/40">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Matching Wildlife Taxa in Database ({allSpecies.length}):</span>
            </p>
            <span className="text-[11px] text-stone-400 hidden sm:inline">
              Select any candidate to view its taxonomic profile
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allSpecies.map((s) => {
              const isCurrent = s.key === species.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => onSelectSpecies(s)}
                  className={`text-xs px-3.5 py-2 rounded-2xl font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-sm active:scale-95 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 text-white shadow-md shadow-emerald-950/40 ring-2 ring-emerald-400/50'
                      : isDarkMode
                      ? 'bg-emerald-950/40 hover:bg-emerald-900/60 text-stone-300 hover:text-white border border-emerald-800/40'
                      : 'bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80'
                  }`}
                >
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/20 dark:bg-white/15">
                    {s.rank?.toLowerCase() || 'taxon'}
                  </span>
                  <span>{s.commonName || s.canonicalName || s.scientificName}</span>
                  <span className="italic text-[11px] opacity-75 font-normal hidden sm:inline">
                    ({s.canonicalName || s.scientificName})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Species Profile Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 mb-8">
        <div>
          {/* Rank & Taxon Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
              <Tag className="w-3.5 h-3.5 text-emerald-500" />
              <span>{species.rank?.toLowerCase() || 'Species'}</span>
            </span>

            {species.taxonomicStatus && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-teal-500/15 text-teal-800 dark:text-teal-300 border border-teal-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                <span>{species.taxonomicStatus}</span>
              </span>
            )}

            {species.occurrencesCount !== undefined && species.occurrencesCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span>{species.occurrencesCount.toLocaleString()} Global Occurrences</span>
              </span>
            )}

            {species.aiAssisted && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span>AI-Assisted Taxonomy</span>
              </span>
            )}

            <span className="text-xs font-mono text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-900/60 px-2.5 py-1 rounded-xl border border-stone-200 dark:border-stone-800">
              Taxon ID: {species.key}
            </span>
          </div>

          {/* Common Name */}
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-stone-900 dark:text-white leading-tight">
            {species.commonName || species.canonicalName}
          </h2>

          {/* Scientific Name (Italicized) */}
          <p className="text-xl sm:text-2xl text-emerald-700 dark:text-emerald-400 italic font-serif mt-1 font-medium flex items-center gap-2">
            <span>{species.scientificName}</span>
          </p>
        </div>

        {/* Database Verification Links */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {species.gbifUrl && (
            <a
              href={species.gbifUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/30 transition-all cursor-pointer active:scale-95"
            >
              <span>GBIF Backbone</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {species.inatUrl && (
            <a
              href={species.inatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-all cursor-pointer active:scale-95"
            >
              <span>iNaturalist Taxon</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Complete Taxonomic Classification Hierarchy Grid */}
      {classificationEntries.length > 0 && (
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>Taxonomic Classification Hierarchy:</span>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {classificationEntries.map((item, idx) => (
              <div
                key={item.label}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isDarkMode
                    ? 'bg-emerald-950/30 border-emerald-800/30 hover:border-emerald-500/50'
                    : 'bg-emerald-50/60 border-emerald-200/70 hover:border-emerald-300'
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 flex items-center justify-between">
                  <span>{item.label}</span>
                  <span className="text-[9px] opacity-50 font-mono">#{idx + 1}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                  {item.val}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ecological & Conservation Profile */}
      {(species.habitat || species.diet || species.distribution || species.conservationStatus) && (
        <div
          className={`p-5 mb-5 rounded-2xl border transition-all ${
            isDarkMode
              ? 'bg-emerald-950/20 border-emerald-800/30 text-stone-200'
              : 'bg-white border-emerald-100 text-stone-800 shadow-sm'
          }`}
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mb-3.5">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Ecological Profile &amp; Conservation Status</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {species.habitat && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-900/10 dark:bg-emerald-950/40 border border-emerald-500/20">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 block mb-0.5">Native Habitat:</span>
                  <span className="text-stone-700 dark:text-stone-300 leading-relaxed">{species.habitat}</span>
                </div>
              </div>
            )}
            {species.diet && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-900/10 dark:bg-emerald-950/40 border border-emerald-500/20">
                <Utensils className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-teal-700 dark:text-teal-300 block mb-0.5">Primary Diet:</span>
                  <span className="text-stone-700 dark:text-stone-300 leading-relaxed">{species.diet}</span>
                </div>
              </div>
            )}
            {species.distribution && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-900/10 dark:bg-emerald-950/40 border border-emerald-500/20">
                <Globe className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-green-700 dark:text-green-300 block mb-0.5">Geographic Range:</span>
                  <span className="text-stone-700 dark:text-stone-300 leading-relaxed">{species.distribution}</span>
                </div>
              </div>
            )}
            {species.conservationStatus && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-700 dark:text-amber-300 block mb-0.5">IUCN Conservation Status:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{species.conservationStatus}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Natural History Description Drawer */}
      {species.description && (
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? 'bg-emerald-950/20 border-emerald-800/30 text-stone-200'
              : 'bg-white border-emerald-100 text-stone-800 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span>Natural History &amp; Botanical Summary</span>
            </h4>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isExpanded ? 'Show Less' : 'Read Full Overview'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <p
            className={`text-sm leading-relaxed ${
              isExpanded ? '' : 'line-clamp-3'
            } text-stone-700 dark:text-stone-300`}
          >
            {species.description}
          </p>
        </div>
      )}
    </div>
  );
};
