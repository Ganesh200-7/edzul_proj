'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { SpeciesCard } from '@/components/SpeciesCard';
import { ImageGallery } from '@/components/ImageGallery';
import { CountryFilter } from '@/components/CountryFilter';
import { ObservationList } from '@/components/ObservationList';
import { ObservationMap } from '@/components/ObservationMap';
import { AboutModal } from '@/components/AboutModal';
import {
  LoadingSkeleton,
  ErrorState,
  EmptyState,
  SampleDataBanner,
} from '@/components/StatusAlerts';
import { Footer } from '@/components/Footer';
import { WildlifeResponse, Species, WildlifePhoto, ObservationRecord } from '@/types/wildlife';
import { searchWildlife, getSampleWildlife, fetchObservationsForSpecies } from '@/services/wildlifeService';

export default function WildlifeExplorerPage() {
  const [query, setQuery] = useState('Elephant');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [isSampleMode, setIsSampleMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WildlifeResponse | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  const exploreSectionRef = useRef<HTMLDivElement>(null);
  const homeSectionRef = useRef<HTMLDivElement>(null);
  const searchSeqRef = useRef(0);
  const speciesSeqRef = useRef(0);
  const hasInitialLoadRef = useRef(false);

  // Execute search via API route or service fallback with race condition protection
  const executeSearch = useCallback(
    async (searchTerm: string, countryCode: string = 'ALL', forceSample: boolean = false) => {
      const trimmed = searchTerm.trim();
      if (!trimmed) return;

      const currentSeq = ++searchSeqRef.current;
      setIsLoading(true);
      setError(null);
      setLoadMoreError(null);
      setData(null);
      setSelectedSpecies(null);

      try {
        let result: WildlifeResponse;

        if (forceSample) {
          result = getSampleWildlife(trimmed, countryCode);
        } else {
          // Attempt using server route /api/species first
          try {
            const params = new URLSearchParams({
              q: trimmed,
              country: countryCode,
              fallback: forceSample ? '1' : '0',
            });
            const res = await fetch(`/api/species?${params.toString()}`);
            if (res.ok) {
              result = await res.json();
            } else {
              // Direct client call fallback if route responds with error
              result = await searchWildlife(trimmed, {
                forceFallback: forceSample,
                country: countryCode,
              });
            }
          } catch {
            // Direct client call fallback if fetch to /api/species encountered network error
            result = await searchWildlife(trimmed, {
              forceFallback: forceSample,
              country: countryCode,
            });
          }
        }

        // Prevent old search results from overwriting newer results
        if (currentSeq !== searchSeqRef.current) return;

        setData(result);
        setSelectedSpecies(result.selectedSpecies);
      } catch (err: unknown) {
        if (currentSeq !== searchSeqRef.current) return;
        const message = err instanceof Error ? err.message : 'Failed to retrieve species data from GBIF. Please check your network or try again.';
        setError(message);
        setData(null);
        setSelectedSpecies(null);
      } finally {
        if (currentSeq === searchSeqRef.current) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  // Synchronously update selected species, its observation records, map coordinates, and photos
  const handleSelectSpecies = useCallback(
    async (species: Species) => {
      setSelectedSpecies(species);
      setLoadMoreError(null);
      const specSeq = ++speciesSeqRef.current;

      try {
        const { observations, totalObservations, photos } = await fetchObservationsForSpecies(
          species,
          selectedCountry
        );

        if (specSeq !== speciesSeqRef.current) return;

        if (photos && photos.length > 0 && (!species.photos || species.photos.length === 0)) {
          species.photos = photos;
          if (!species.primaryPhoto) species.primaryPhoto = photos[0];
        }

        setData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            selectedSpecies: species,
            observations,
            totalObservations,
          };
        });
      } catch (err) {
        console.warn('Failed to load observations for species:', err);
      }
    },
    [selectedCountry]
  );

  // Dynamically load additional observation records from GBIF Occurrence API
  const handleLoadMoreObservations = useCallback(async () => {
    if (!selectedSpecies || isLoadingMore || !data) return;

    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const currentCount = data.observations.length;
      let newObs: ObservationRecord[] = [];
      let totalObs = data.totalObservations;

      // Try occurrences API route first
      if (selectedSpecies.gbifTaxonKey || selectedSpecies.inaturalistId) {
        try {
          const params = new URLSearchParams({
            offset: String(currentCount),
            limit: '24',
          });
          if (selectedSpecies.gbifTaxonKey) params.set('taxonKey', String(selectedSpecies.gbifTaxonKey));
          if (selectedSpecies.inaturalistId) params.set('inatId', String(selectedSpecies.inaturalistId));
          if (selectedCountry && selectedCountry !== 'ALL') params.set('country', selectedCountry);

          const res = await fetch(`/api/occurrences?${params.toString()}`);
          if (res.ok) {
            const json = await res.json();
            newObs = json.observations || [];
            totalObs = json.totalObservations || totalObs;
          }
        } catch {
          // non-fatal, fallback to client service
        }
      }

      // Client-side fallback if route didn't return
      if (newObs.length === 0) {
        const res = await fetchObservationsForSpecies(
          selectedSpecies,
          selectedCountry,
          undefined,
          currentCount,
          24
        );
        newObs = res.observations;
        totalObs = res.totalObservations;
      }

      // Deduplicate new records by key
      const existingKeys = new Set(data.observations.map((o) => String(o.key)));
      const uniqueNew = newObs.filter((o) => !existingKeys.has(String(o.key)));

      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          observations: [...prev.observations, ...uniqueNew],
          totalObservations: Math.max(prev.totalObservations, totalObs),
        };
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load additional records from GBIF.';
      setLoadMoreError(message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [selectedSpecies, isLoadingMore, data, selectedCountry]);

  // Initial load with featured species (Elephant as required by the prompt)
  useEffect(() => {
    if (hasInitialLoadRef.current) return;
    hasInitialLoadRef.current = true;

    queueMicrotask(() => {
      void executeSearch('Elephant', 'ALL', false);
    });
  }, [executeSearch]);

  const handleSearchSubmit = (newQuery: string) => {
    setQuery(newQuery);
    executeSearch(newQuery, selectedCountry, isSampleMode);
  };

  const handleCountryFilterChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
    executeSearch(query, newCountry, isSampleMode);
  };

  const handleToggleSampleMode = () => {
    const newMode = !isSampleMode;
    setIsSampleMode(newMode);
    executeSearch(query, selectedCountry, newMode);
  };

  const handleSwitchToLive = () => {
    setIsSampleMode(false);
    executeSearch(query, selectedCountry, false);
  };

  const handleSwitchToSample = () => {
    setIsSampleMode(true);
    executeSearch(query, selectedCountry, true);
  };

  const scrollToExplore = () => {
    exploreSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHome = () => {
    homeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Combine species photos and observation photos for a rich gallery strictly matching selected species
  const galleryPhotos: WildlifePhoto[] = React.useMemo(() => {
    const photoList: WildlifePhoto[] = [];
    const seenUrls = new Set<string>();

    if (selectedSpecies?.photos) {
      selectedSpecies.photos.forEach((p) => {
        if (p.url && !seenUrls.has(p.url)) {
          seenUrls.add(p.url);
          photoList.push(p);
        }
      });
    }

    if (data?.observations && selectedSpecies) {
      data.observations.forEach((obs) => {
        const matchesTaxon =
          !obs.speciesKey ||
          String(obs.speciesKey) === String(selectedSpecies.key) ||
          (selectedSpecies.gbifTaxonKey && String(obs.speciesKey) === String(selectedSpecies.gbifTaxonKey));

        if (matchesTaxon && obs.photos) {
          obs.photos.forEach((p) => {
            if (p.url && !seenUrls.has(p.url)) {
              seenUrls.add(p.url);
              photoList.push(p);
            }
          });
        }
      });
    }

    return photoList.slice(0, 9);
  }, [data, selectedSpecies]);

  const hasZeroResults =
    data &&
    !isLoading &&
    !error &&
    data.speciesList.length === 0 &&
    data.observations.length === 0;

  return (
    <div
      className={`${isDarkMode ? 'dark' : ''} min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? 'bg-[#03120c] text-stone-100' : 'bg-[#f5faf6] text-stone-900'
      }`}
    >
      <div ref={homeSectionRef} />

      {/* Header with App Title, Brand, Navigation & Live/Sample Badge */}
      <Header
        isSampleMode={isSampleMode || (data?.isFallback ?? false)}
        onToggleSampleMode={handleToggleSampleMode}
        onOpenAbout={() => setIsAboutOpen(true)}
        onScrollToExplore={scrollToExplore}
        onScrollToHome={scrollToHome}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Hero Section with Search Bar, Validation, and Feature Highlights */}
      <HeroSection
        onSearch={handleSearchSubmit}
        isLoading={isLoading}
        currentQuery={query}
      />

      {/* Main Content Area */}
      <main
        ref={exploreSectionRef}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12"
      >
        {/* Sample Data Notice Banner if Fallback is Active */}
        {(isSampleMode || data?.isFallback) && !isLoading && (
          <SampleDataBanner onSwitchToLive={handleSwitchToLive} />
        )}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton isDarkMode={isDarkMode} />}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorState
            message={error}
            onRetry={() => executeSearch(query, selectedCountry, isSampleMode)}
            onUseSampleData={handleSwitchToSample}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Empty Results State */}
        {hasZeroResults && (
          <EmptyState
            query={query}
            onSelectSuggestion={(s) => {
              setQuery(s);
              executeSearch(s, selectedCountry, isSampleMode);
            }}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Active Content when Results Exist */}
        {!isLoading &&
          !error &&
          data &&
          (data.speciesList.length > 0 || data.observations.length > 0) && (
            <div className="space-y-12 animate-fade-in">
              {/* Species Profile Section with multiple matching tabs */}
              {selectedSpecies && (
                <SpeciesCard
                  species={selectedSpecies}
                  allSpecies={data.speciesList}
                  onSelectSpecies={handleSelectSpecies}
                  isDarkMode={isDarkMode}
                />
              )}

              {/* Wildlife Image Gallery Section */}
              <ImageGallery
                photos={galleryPhotos}
                speciesName={
                  selectedSpecies?.commonName || selectedSpecies?.scientificName || query
                }
                isDarkMode={isDarkMode}
              />

              {/* Bonus Feature: Country Filter Toolbar */}
              <div
                className={`p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-3d shadow-xl ${
                  isDarkMode
                    ? 'glass-panel-dark border-emerald-500/20'
                    : 'glass-panel-light border-emerald-200/80 shadow-emerald-950/5'
                }`}
              >
                <div>
                  <h4 className="text-base font-extrabold text-stone-900 dark:text-white font-display">
                    Filter Observation Records by Country or Region
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Queries the GBIF Occurrence API directly using the country ISO-2 standard parameter.
                  </p>
                </div>
                <CountryFilter
                  selectedCountry={selectedCountry}
                  onSelectCountry={handleCountryFilterChange}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Geographic Observation Map Section (Bonus Feature) */}
              {data.observations && data.observations.length > 0 && (
                <ObservationMap
                  observations={data.observations}
                  speciesName={
                    selectedSpecies?.commonName || selectedSpecies?.scientificName || query
                  }
                  isDarkMode={isDarkMode}
                />
              )}

              {/* Observation Records Section */}
              {data.observations && data.observations.length > 0 && (
                <ObservationList
                  observations={data.observations}
                  totalObservations={data.totalObservations}
                  speciesName={selectedSpecies?.commonName || selectedSpecies?.scientificName || query}
                  speciesPhoto={selectedSpecies?.primaryPhoto}
                  onLoadMore={handleLoadMoreObservations}
                  isLoadingMore={isLoadingMore}
                  loadMoreError={loadMoreError}
                  hasMore={Boolean(data && data.observations.length < data.totalObservations)}
                  onSelectObservation={(obs) => {
                    if (obs.latitude !== null && obs.longitude !== null) {
                      exploreSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  isDarkMode={isDarkMode}
                />
              )}
            </div>
          )}
      </main>

      {/* About Project Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Footer with Attribution and About Project */}
      <Footer
        onOpenAbout={() => setIsAboutOpen(true)}
        onScrollToExplore={scrollToExplore}
        onScrollToHome={scrollToHome}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
