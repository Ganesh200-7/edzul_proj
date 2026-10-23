'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { SpeciesCard } from '@/components/SpeciesCard';
import { ImageGallery } from '@/components/ImageGallery';
import { ObservationList } from '@/components/ObservationList';
import { ObservationMap } from '@/components/ObservationMap';
import {
  LoadingSkeleton,
  ErrorState,
  EmptyState,
  SampleDataBanner,
} from '@/components/StatusAlerts';
import { Footer } from '@/components/Footer';
import { WildlifeResponse, Species, IconicTaxon, WildlifePhoto } from '@/types/wildlife';
import { searchWildlife, getSampleWildlife } from '@/services/wildlifeService';

export default function WildlifeExplorerPage() {
  const [query, setQuery] = useState('Bengal Tiger');
  const [selectedCategory, setSelectedCategory] = useState<IconicTaxon>('All');
  const [isSampleMode, setIsSampleMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WildlifeResponse | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  // Execute search via API or service fallback
  const executeSearch = useCallback(
    async (searchTerm: string, category: IconicTaxon = 'All', forceSample: boolean = false) => {
      const trimmed = searchTerm.trim();
      if (!trimmed) return;

      setIsLoading(true);
      setError(null);

      try {
        let result: WildlifeResponse;

        if (forceSample) {
          result = getSampleWildlife(trimmed);
        } else {
          // Attempt using server route /api/species first
          try {
            const params = new URLSearchParams({
              q: trimmed,
              iconicTaxon: category,
              fallback: forceSample ? '1' : '0',
            });
            const res = await fetch(`/api/species?${params.toString()}`);
            if (res.ok) {
              result = await res.json();
            } else {
              const errBody = await res.json().catch(() => ({}));
              // Fallback to client service if route responds with error
              result = await searchWildlife(trimmed, {
                forceFallback: forceSample,
                iconicTaxon: category,
              });
            }
          } catch {
            // Direct client call fallback if fetch to /api/species encountered network error
            result = await searchWildlife(trimmed, {
              forceFallback: forceSample,
              iconicTaxon: category,
            });
          }
        }

        setData(result);
        setSelectedSpecies(result.selectedSpecies);
      } catch (err: any) {
        setError(err.message || 'Failed to retrieve species data. Please check your network or try again.');
        setData(null);
        setSelectedSpecies(null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load with featured species
  useEffect(() => {
    executeSearch('Bengal Tiger', 'All', false);
  }, [executeSearch]);

  const handleSearchSubmit = (newQuery: string, category?: IconicTaxon) => {
    const cat = category || selectedCategory;
    setQuery(newQuery);
    executeSearch(newQuery, cat, isSampleMode);
  };

  const handleToggleSampleMode = () => {
    const newMode = !isSampleMode;
    setIsSampleMode(newMode);
    executeSearch(query, selectedCategory, newMode);
  };

  const handleSwitchToLive = () => {
    setIsSampleMode(false);
    executeSearch(query, selectedCategory, false);
  };

  const handleSwitchToSample = () => {
    setIsSampleMode(true);
    executeSearch(query, selectedCategory, true);
  };

  // Combine species photos and observation photos for a rich gallery
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

    if (data?.observations) {
      data.observations.forEach((obs) => {
        obs.photos.forEach((p) => {
          if (p.url && !seenUrls.has(p.url)) {
            seenUrls.add(p.url);
            photoList.push(p);
          }
        });
      });
    }

    return photoList.slice(0, 9);
  }, [selectedSpecies, data?.observations]);

  const hasZeroResults =
    data &&
    !isLoading &&
    !error &&
    data.speciesList.length === 0 &&
    data.observations.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100">
      {/* Header with App Title, Brand, and Live/Sample Badge */}
      <Header
        isSampleMode={isSampleMode || (data?.isFallback ?? false)}
        onToggleSampleMode={handleToggleSampleMode}
      />

      {/* Hero Section with Search Bar, Validation, Categories, and Quick Suggestions */}
      <HeroSection
        onSearch={handleSearchSubmit}
        isLoading={isLoading}
        currentQuery={query}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* Sample Data Notice Banner if Fallback is Active */}
        {(isSampleMode || data?.isFallback) && !isLoading && (
          <SampleDataBanner onSwitchToLive={handleSwitchToLive} />
        )}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorState
            message={error}
            onRetry={() => executeSearch(query, selectedCategory, isSampleMode)}
            onUseSampleData={handleSwitchToSample}
          />
        )}

        {/* Empty Results State */}
        {hasZeroResults && (
          <EmptyState
            query={query}
            onSelectSuggestion={(s) => {
              setQuery(s);
              executeSearch(s, selectedCategory, isSampleMode);
            }}
          />
        )}

        {/* Active Content when Results Exist */}
        {!isLoading && !error && data && (data.speciesList.length > 0 || data.observations.length > 0) && (
          <div className="space-y-10 animate-fade-in">
            {/* Species Profile Section */}
            {selectedSpecies && (
              <SpeciesCard
                species={selectedSpecies}
                allSpecies={data.speciesList}
                onSelectSpecies={(s) => setSelectedSpecies(s)}
              />
            )}

            {/* Wildlife Image Gallery Section */}
            <ImageGallery
              photos={galleryPhotos}
              speciesName={selectedSpecies?.commonName || selectedSpecies?.scientificName || query}
            />

            {/* Geographic Map of Sightings Section */}
            {data.observations && data.observations.length > 0 && (
              <ObservationMap
                observations={data.observations}
                speciesName={selectedSpecies?.commonName || selectedSpecies?.scientificName || query}
              />
            )}

            {/* Observation Records Section */}
            {data.observations && data.observations.length > 0 && (
              <ObservationList observations={data.observations} />
            )}
          </div>
        )}
      </main>

      {/* Footer with Attribution and Project Info */}
      <Footer />
    </div>
  );
}
