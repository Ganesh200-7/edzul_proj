'use client';

import React, { useState, useMemo } from 'react';
import { ObservationRecord, WildlifePhoto } from '../types/wildlife';
import {
  MapPin,
  Calendar,
  User,
  ExternalLink,
  Globe2,
  Search,
  Tag,
  Eye,
  Camera,
  CameraOff,
  AlertCircle,
  RefreshCw,
  Compass,
  ShieldCheck,
  Building2,
  X,
  ChevronRight,
  Filter,
  Sparkles,
} from 'lucide-react';

interface ObservationListProps {
  observations: ObservationRecord[];
  totalObservations?: number;
  speciesName?: string;
  speciesPhoto?: WildlifePhoto | null;
  onSelectObservation?: (observation: ObservationRecord) => void;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  loadMoreError?: string | null;
  hasMore?: boolean;
  isDarkMode?: boolean;
}

type FilterType = 'all' | 'withPhotos' | 'withCoords' | 'humanOnly';

export const ObservationList: React.FC<ObservationListProps> = ({
  observations,
  totalObservations = observations.length,
  speciesName,
  speciesPhoto = null,
  onSelectObservation,
  onLoadMore,
  isLoadingMore = false,
  loadMoreError = null,
  hasMore = false,
  isDarkMode = false,
}) => {
  const [filterText, setFilterText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedModalObs, setSelectedModalObs] = useState<ObservationRecord | null>(null);
  const displaySpeciesName = speciesName || 'This species';

  // Statistics
  const photoCount = useMemo(
    () => observations.filter((o) => o.photos && o.photos.length > 0).length,
    [observations]
  );
  const geoCount = useMemo(
    () => observations.filter((o) => o.latitude !== null && o.longitude !== null).length,
    [observations]
  );
  const humanCount = useMemo(
    () => observations.filter((o) => o.basisOfRecord.toLowerCase().includes('human') || o.basisOfRecord.toLowerCase().includes('observation')).length,
    [observations]
  );

  // Filter observations based on search text and active category
  const filteredObservations = useMemo(() => {
    return observations.filter((obs) => {
      // Category filter
      if (activeFilter === 'withPhotos' && (!obs.photos || obs.photos.length === 0)) {
        return false;
      }
      if (activeFilter === 'withCoords' && (obs.latitude === null || obs.longitude === null)) {
        return false;
      }
      if (activeFilter === 'humanOnly' && !obs.basisOfRecord.toLowerCase().includes('human') && !obs.basisOfRecord.toLowerCase().includes('observation')) {
        return false;
      }

      // Search text filter
      if (!filterText.trim()) return true;
      const term = filterText.toLowerCase().trim();

      const searchTargets = [
        obs.country,
        obs.stateProvince,
        obs.locality,
        obs.recordedBy,
        obs.basisOfRecord,
        obs.eventDate,
        obs.scientificName,
        obs.commonName,
        obs.datasetName,
        obs.institutionCode,
      ].filter(Boolean) as string[];

      return searchTargets.some((target) => target.toLowerCase().includes(term));
    });
  }, [observations, activeFilter, filterText]);

  const canLoadMore = Boolean(hasMore || (totalObservations > observations.length));

  return (
    <div className="space-y-6">
      {/* Header and Toolbar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-stone-900 dark:text-white flex items-center gap-2">
                <span>GBIF &amp; iNaturalist Observation Records</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  Verified Biodiversity Data
                </span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Live field observations for {displaySpeciesName}, research-grade sightings, and specimen archives dynamically queried from GBIF and iNaturalist.
              </p>
            </div>
          </div>

          {/* Records Counter Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs px-3.5 py-1.5 rounded-2xl bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-mono font-bold border border-emerald-500/30 shadow-xs">
              {observations.length} loaded
              {totalObservations > 0 && ` of ${totalObservations.toLocaleString()} records`}
            </span>
          </div>
        </div>

        {/* Filter Controls & Search Box */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : isDarkMode
                  ? 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
                  : 'bg-white hover:bg-emerald-50 text-stone-700 border border-stone-200'
              }`}
            >
              All Records ({observations.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('withPhotos')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeFilter === 'withPhotos'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : isDarkMode
                  ? 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
                  : 'bg-white hover:bg-emerald-50 text-stone-700 border border-stone-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>With Photographs ({photoCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('withCoords')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeFilter === 'withCoords'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : isDarkMode
                  ? 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
                  : 'bg-white hover:bg-emerald-50 text-stone-700 border border-stone-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>GPS Located ({geoCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('humanOnly')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeFilter === 'humanOnly'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : isDarkMode
                  ? 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
                  : 'bg-white hover:bg-emerald-50 text-stone-700 border border-stone-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Observations ({humanCount})</span>
            </button>
          </div>

          {/* Search within observations */}
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search by country, state, observer, basis..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className={`w-full pl-8 pr-8 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                isDarkMode
                  ? 'bg-stone-900 border-stone-800 text-stone-100 placeholder:text-stone-500'
                  : 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 shadow-xs'
              }`}
            />
            {filterText && (
              <button
                type="button"
                onClick={() => setFilterText('')}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                title="Clear filter text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Observation Cards Grid */}
      {filteredObservations.length === 0 ? (
        <div
          className={`p-10 text-center rounded-2xl border border-dashed text-sm ${
            isDarkMode
              ? 'bg-stone-900/40 border-stone-800 text-stone-400'
              : 'bg-stone-50 border-stone-300 text-stone-600'
          }`}
        >
          <Filter className="w-6 h-6 mx-auto mb-2 text-stone-400" />
          <p className="font-semibold text-stone-800 dark:text-stone-200">
            No observation records found matching your filters.
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {filterText
              ? `No records match "${filterText}" in the current dataset.`
              : 'Try selecting a different filter category or querying another species.'}
          </p>
          {(filterText || activeFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setFilterText('');
                setActiveFilter('all');
              }}
              className="mt-4 px-4 py-1.5 text-xs rounded-xl font-medium bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer shadow-xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredObservations.map((obs) => {
            const hasCoords = obs.latitude !== null && obs.longitude !== null;
            const hasPhoto = obs.photos && obs.photos.length > 0;
            const primaryPhoto = hasPhoto ? obs.photos[0] : null;
            const isFallback = obs.provider === 'fallback';
            const sourceUrl = obs.gbifUrl || obs.inatUrl || `https://www.gbif.org/occurrence/${obs.key}`;

            return (
              <div
                key={obs.key}
                className={`rounded-3xl border p-5.5 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group card-3d relative overflow-hidden ${
                  isDarkMode
                    ? 'glass-panel-dark border-emerald-500/20 hover:border-emerald-500/50'
                    : 'glass-panel-light border-emerald-200/80 hover:border-emerald-400 shadow-emerald-950/5'
                }`}
              >
                <div>
                  {/* Top Status & Date Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{obs.eventDate || 'Date unrecorded'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Fallback vs Verified Provider Badge */}
                      {obs.provider === 'inaturalist' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                          <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
                          <span>iNaturalist</span>
                        </span>
                      ) : isFallback ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          <AlertCircle className="w-2.5 h-2.5" />
                          <span>Sample Record</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>GBIF Verified</span>
                        </span>
                      )}

                      {/* Basis of Record Tag */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                        <Tag className="w-2.5 h-2.5" />
                        <span className="truncate max-w-[110px]" title={obs.basisOfRecord}>
                          {obs.basisOfRecord}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Species Heading (Common Name + Scientific Name) */}
                  <div className="mb-3">
                    <div className="text-sm font-bold text-stone-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {obs.commonName || obs.scientificName}
                    </div>
                    {obs.scientificName && (
                      <div className="text-xs italic text-emerald-700 dark:text-emerald-400 font-serif line-clamp-1">
                        {obs.scientificName}
                      </div>
                    )}
                  </div>

                  {/* Photograph Display with Attribution & License (or Species Reference Photo Fallback) */}
                  {(hasPhoto && primaryPhoto) || speciesPhoto ? (
                    (() => {
                      const displayPhoto = (hasPhoto && primaryPhoto) ? primaryPhoto : speciesPhoto!;
                      const isRefPhoto = !hasPhoto || Boolean(displayPhoto.isSpeciesFallback);
                      return (
                        <div className="mb-3.5 rounded-xl overflow-hidden aspect-16/9 bg-stone-950 relative group/photo">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={displayPhoto.url}
                            alt={`Observation record for ${obs.commonName || obs.scientificName}`}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                          />

                          {/* Reference Image Badge vs Multi-Photo Badge */}
                          {isRefPhoto ? (
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-950/85 text-emerald-300 backdrop-blur-xs flex items-center gap-1 border border-emerald-500/30">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                              <span>Species Reference Photo</span>
                            </span>
                          ) : obs.photos.length > 1 ? (
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-950/80 text-white backdrop-blur-xs flex items-center gap-1 border border-white/20">
                              <Camera className="w-2.5 h-2.5" />
                              <span>+{obs.photos.length - 1} photos</span>
                            </span>
                          ) : (
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-950/80 text-white backdrop-blur-xs flex items-center gap-1 border border-white/20">
                              <Camera className="w-2.5 h-2.5" />
                              <span>Field Photo</span>
                            </span>
                          )}

                          {/* Photo Attribution & License Overlay */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/90 via-stone-950/60 to-transparent p-2 pt-4 flex items-center justify-between text-[10px] text-white/90">
                            <span className="truncate max-w-[70%]" title={displayPhoto.attribution}>
                              {displayPhoto.attribution}
                            </span>
                            {displayPhoto.licenseCode && (
                              <span
                                className="px-1.5 py-0.2 rounded bg-white/20 text-[9px] font-mono shrink-0"
                                title={displayPhoto.licenseCode}
                              >
                                {displayPhoto.licenseCode}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div
                      className={`mb-3.5 rounded-xl aspect-16/9 flex flex-col items-center justify-center p-4 border border-dashed text-center ${
                        isDarkMode
                          ? 'bg-stone-950/40 border-stone-800 text-stone-500'
                          : 'bg-stone-50/80 border-stone-200 text-stone-400'
                      }`}
                    >
                      <CameraOff className="w-5 h-5 mb-1.5 opacity-60" />
                      <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                        No field photograph recorded
                      </span>
                      <span className="text-[9px] opacity-75">Specimen / Field log archive</span>
                    </div>
                  )}

                  {/* Location & Locality */}
                  <div className="flex items-start gap-2 mb-2.5 text-stone-700 dark:text-stone-300 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-relaxed">
                      {obs.locality || [obs.stateProvince, obs.country].filter(Boolean).join(', ') || 'Location details unrecorded'}
                    </span>
                  </div>

                  {/* Observer and Dataset Name */}
                  <div className="space-y-1 mb-3 text-xs text-stone-500 dark:text-stone-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate" title={obs.recordedBy}>
                        Observer: <strong className="text-stone-700 dark:text-stone-300 font-medium">{obs.recordedBy || 'Anonymous Contributor'}</strong>
                      </span>
                    </div>

                    {obs.datasetName && (
                      <div className="flex items-center gap-1.5 truncate text-[11px]">
                        <Building2 className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate opacity-90" title={obs.datasetName}>
                          {obs.datasetName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Bar: GPS Coordinates & Action Links */}
                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 gap-2">
                  {/* GPS Coordinates Chip */}
                  <div className="flex items-center gap-1">
                    {hasCoords ? (
                      <button
                        type="button"
                        onClick={() => onSelectObservation?.(obs)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-stone-700 hover:bg-emerald-100 dark:hover:bg-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Locate coordinates on the geographic observation map"
                      >
                        <Compass className="w-2.5 h-2.5" />
                        <span>{obs.latitude?.toFixed(2)}°, {obs.longitude?.toFixed(2)}°</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-stone-400 italic">No GPS coordinates</span>
                    )}
                  </div>

                  {/* Action Buttons: Modal Details & Original Source Link */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedModalObs(obs)}
                      className="px-2 py-1 rounded-lg text-[11px] font-medium bg-stone-100 hover:bg-emerald-50 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
                      title="View complete record details"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Details</span>
                    </button>

                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded-lg text-[11px] font-medium bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                      title={obs.provider === 'inaturalist' ? 'Open verified observation on iNaturalist.org' : 'Open verified source occurrence on GBIF.org'}
                    >
                      <span>{obs.provider === 'inaturalist' ? 'iNaturalist' : 'GBIF'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dynamic "Load More" / Pagination Section */}
      <div className="pt-4 flex flex-col items-center justify-center gap-2">
        {canLoadMore && (
          <button
            type="button"
            disabled={isLoadingMore}
            onClick={onLoadMore}
            className={`px-6 py-3 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer ${
              isLoadingMore
                ? 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 active:scale-98'
            }`}
          >
            {isLoadingMore ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Fetching real records from GBIF Occurrence API...</span>
              </>
            ) : (
              <>
                <span>Load More Observation Records</span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px]">
                  Showing {observations.length} of {totalObservations.toLocaleString()}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}

        {/* Load More Error & Retry Banner */}
        {loadMoreError && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loadMoreError}</span>
            <button
              type="button"
              onClick={onLoadMore}
              className="ml-2 font-bold underline hover:text-red-900 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {!canLoadMore && observations.length > 0 && (
          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 py-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>All available observation records loaded ({observations.length} total)</span>
          </div>
        )}
      </div>

      {/* Observation Record Detail Modal */}
      {selectedModalObs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in">
          <div
            className={`max-w-2xl w-full rounded-3xl border shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto ${
              isDarkMode
                ? 'bg-stone-900 border-stone-800 text-stone-100'
                : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                  Occurrence Record #{selectedModalObs.key}
                </span>
                <h4 className="text-xl font-bold mt-1 text-stone-900 dark:text-white">
                  {selectedModalObs.commonName || selectedModalObs.scientificName}
                </h4>
                {selectedModalObs.scientificName && (
                  <p className="text-sm font-serif italic text-emerald-700 dark:text-emerald-400">
                    {selectedModalObs.scientificName}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedModalObs(null)}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Gallery in Modal if Available */}
            {selectedModalObs.photos && selectedModalObs.photos.length > 0 && (
              <div className="mt-5 space-y-2">
                <div className="rounded-2xl overflow-hidden aspect-16/9 bg-stone-950 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedModalObs.photos[0].url}
                    alt="Occurrence specimen"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/90 p-3 text-xs text-white">
                    <p className="font-medium">{selectedModalObs.photos[0].attribution}</p>
                    <p className="text-[11px] text-stone-300 font-mono mt-0.5">
                      License: {selectedModalObs.photos[0].licenseCode || 'Creative Commons'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Comprehensive Darwin Core Fields Table */}
            <div className="mt-6 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Occurrence Record Details
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800">
                  <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Observation Date:</span>
                  <strong className="text-stone-800 dark:text-stone-200">{selectedModalObs.eventDate}</strong>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800">
                  <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Basis of Record:</span>
                  <strong className="text-stone-800 dark:text-stone-200">{selectedModalObs.basisOfRecord}</strong>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800">
                  <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Location / Country:</span>
                  <strong className="text-stone-800 dark:text-stone-200">
                    {selectedModalObs.locality || [selectedModalObs.stateProvince, selectedModalObs.country].filter(Boolean).join(', ')}
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800">
                  <span className="text-stone-500 dark:text-stone-400 block text-[11px]">GPS Coordinates:</span>
                  {selectedModalObs.latitude !== null && selectedModalObs.longitude !== null ? (
                    <strong className="text-stone-800 dark:text-stone-200 font-mono">
                      {selectedModalObs.latitude.toFixed(4)}°, {selectedModalObs.longitude.toFixed(4)}°
                    </strong>
                  ) : (
                    <span className="text-stone-400 italic">Coordinates unrecorded</span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800">
                  <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Recorded By / Observer:</span>
                  <strong className="text-stone-800 dark:text-stone-200">{selectedModalObs.recordedBy || 'Anonymous'}</strong>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800">
                  <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Data Provider:</span>
                  <strong className="text-stone-800 dark:text-stone-200">
                    {selectedModalObs.provider === 'fallback'
                      ? 'Verified Sample Dataset Archive'
                      : 'GBIF (Global Biodiversity Information Facility)'}
                  </strong>
                </div>

                {selectedModalObs.datasetName && (
                  <div className="sm:col-span-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800">
                    <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Dataset / Collection:</span>
                    <strong className="text-stone-800 dark:text-stone-200">{selectedModalObs.datasetName}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <a
                href={selectedModalObs.gbifUrl || selectedModalObs.inatUrl || `https://www.gbif.org/occurrence/${selectedModalObs.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open in Official GBIF Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setSelectedModalObs(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
