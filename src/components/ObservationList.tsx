'use client';

import React, { useState } from 'react';
import { ObservationRecord } from '../types/wildlife';
import { MapPin, Calendar, User, ExternalLink, CheckCircle2, Clock, Globe2, Search } from 'lucide-react';

interface ObservationListProps {
  observations: ObservationRecord[];
  onSelectObservation?: (observation: ObservationRecord) => void;
}

export const ObservationList: React.FC<ObservationListProps> = ({
  observations,
  onSelectObservation,
}) => {
  const [filterText, setFilterText] = useState('');

  const filteredObservations = observations.filter((obs) => {
    if (!filterText.trim()) return true;
    const term = filterText.toLowerCase();
    return (
      obs.placeGuess.toLowerCase().includes(term) ||
      obs.observerName.toLowerCase().includes(term) ||
      obs.observedOn.includes(term)
    );
  });

  const getQualityBadge = (grade: string) => {
    switch (grade) {
      case 'research':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-700/60">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Research Grade</span>
          </span>
        );
      case 'needs_id':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/70 text-amber-300 border border-amber-700/60">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Needs ID</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-800 text-stone-300 border border-stone-700">
            <span>Casual</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Field Observation Records
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-mono">
            {observations.length}
          </span>
        </div>

        {observations.length > 3 && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Filter by country, city, observer..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-900 border border-stone-800 rounded-xl text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}
      </div>

      {/* Observation Cards */}
      {filteredObservations.length === 0 ? (
        <div className="p-8 text-center bg-stone-900/60 rounded-2xl border border-dashed border-stone-800 text-stone-400 text-sm">
          No observations match your filter &ldquo;{filterText}&rdquo;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredObservations.map((obs) => {
            const hasCoords = obs.latitude !== null && obs.longitude !== null;

            return (
              <div
                key={obs.id}
                onClick={() => onSelectObservation?.(obs)}
                className="bg-stone-900/90 rounded-2xl border border-stone-800/80 p-5 shadow-lg hover:border-emerald-600/40 hover:shadow-emerald-950/20 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-stone-400">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{obs.observedOn}</span>
                    </div>
                    {getQualityBadge(obs.qualityGrade)}
                  </div>

                  {/* Location Info */}
                  <div className="flex items-start gap-2 mb-3 text-stone-200 text-sm">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-snug font-medium">
                      {obs.placeGuess || 'Location coordinates not resolved'}
                    </span>
                  </div>

                  {/* Observation photo thumbnail if available */}
                  {obs.photos.length > 0 && (
                    <div className="mb-3 rounded-xl overflow-hidden aspect-16/9 bg-stone-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={obs.photos[0].url}
                        alt={`Observation by ${obs.observerName}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-stone-500" />
                    <span className="truncate">@{obs.observerName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasCoords && (
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800/80 text-emerald-400/90"
                        title={`Coordinates: ${obs.latitude?.toFixed(4)}, ${obs.longitude?.toFixed(4)}`}
                      >
                        {obs.latitude?.toFixed(2)}°, {obs.longitude?.toFixed(2)}°
                      </span>
                    )}

                    {obs.inatUrl && (
                      <a
                        href={obs.inatUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-emerald-300 transition-colors"
                        title="View on iNaturalist"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
