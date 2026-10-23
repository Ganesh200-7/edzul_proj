import { Species, ObservationRecord, WildlifeResponse, WildlifePhoto } from '../types/wildlife';
import { SAMPLE_WILDLIFE_DATA, findSampleSpecies } from '../data/sampleWildlife';

const INAT_API_BASE = 'https://api.inaturalist.org/v1';
const REQUEST_TIMEOUT_MS = 10000;

interface FetchOptions {
  forceFallback?: boolean;
  iconicTaxon?: string;
  signal?: AbortSignal;
}

// Clean HTML tags from Wikipedia summary if returned
function cleanSummary(html?: string): string | undefined {
  if (!html) return undefined;
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Parse coordinates safely
function parseCoordinates(locationStr?: string, geojson?: { coordinates?: [number, number] }): { lat: number | null; lng: number | null } {
  if (geojson?.coordinates && Array.isArray(geojson.coordinates) && geojson.coordinates.length >= 2) {
    const [lng, lat] = geojson.coordinates;
    if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }
  if (locationStr && typeof locationStr === 'string' && locationStr.includes(',')) {
    const [latStr, lngStr] = locationStr.split(',');
    const lat = parseFloat(latStr.trim());
    const lng = parseFloat(lngStr.trim());
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }
  return { lat: null, lng: null };
}

// Safely map photo
function mapPhoto(photoObj: any): WildlifePhoto | null {
  if (!photoObj) return null;
  const url = photoObj.medium_url || photoObj.url || photoObj.original_url || photoObj.square_url;
  if (!url) return null;

  return {
    id: photoObj.id || Math.random(),
    url: url.replace('/square.', '/medium.'),
    originalUrl: photoObj.original_url || url,
    attribution: photoObj.attribution || '(c) iNaturalist contributor',
    licenseCode: photoObj.license_code || 'All Rights Reserved',
  };
}

/**
 * Searches iNaturalist API for taxa and observations
 */
export async function fetchLiveWildlife(query: string, options?: FetchOptions): Promise<WildlifeResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error('Search query cannot be empty.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    // 1. Fetch taxa
    const taxaUrl = new URL(`${INAT_API_BASE}/taxa`);
    taxaUrl.searchParams.set('q', trimmed);
    taxaUrl.searchParams.set('per_page', '6');
    if (options?.iconicTaxon && options.iconicTaxon !== 'All') {
      taxaUrl.searchParams.set('iconic_taxa', options.iconicTaxon);
    }

    const taxaRes = await fetch(taxaUrl.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!taxaRes.ok) {
      throw new Error(`iNaturalist API responded with status ${taxaRes.status} (${taxaRes.statusText})`);
    }

    const taxaData = await taxaRes.json();
    const rawTaxa: any[] = taxaData.results || [];

    // Map species list
    const speciesList: Species[] = rawTaxa.map((t) => {
      const primaryPhoto = mapPhoto(t.default_photo);
      const taxonPhotos: WildlifePhoto[] = (t.taxon_photos || [])
        .map((tp: any) => mapPhoto(tp.photo))
        .filter(Boolean) as WildlifePhoto[];

      const photos = primaryPhoto ? [primaryPhoto, ...taxonPhotos.filter((p) => p.id !== primaryPhoto.id)] : taxonPhotos;

      return {
        id: t.id,
        scientificName: t.name || 'Unknown species',
        commonName: t.preferred_common_name || t.english_common_name || t.name,
        rank: t.rank || 'species',
        iconicTaxonName: t.iconic_taxon_name || 'Animalia',
        wikipediaSummary: cleanSummary(t.wikipedia_summary),
        conservationStatus: t.conservation_status?.status_name || undefined,
        primaryPhoto: primaryPhoto || (photos.length > 0 ? photos[0] : null),
        photos: photos.slice(0, 6),
        observationsCount: t.observations_count || 0,
      };
    });

    const primaryTaxon = speciesList[0] || null;

    // 2. Fetch observations
    const obsUrl = new URL(`${INAT_API_BASE}/observations`);
    if (primaryTaxon) {
      obsUrl.searchParams.set('taxon_id', String(primaryTaxon.id));
    } else {
      obsUrl.searchParams.set('q', trimmed);
    }
    obsUrl.searchParams.set('per_page', '12');
    obsUrl.searchParams.set('order', 'desc');
    obsUrl.searchParams.set('order_by', 'votes');

    const obsRes = await fetch(obsUrl.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    let observations: ObservationRecord[] = [];
    let totalObservations = 0;

    if (obsRes.ok) {
      const obsData = await obsRes.json();
      totalObservations = obsData.total_results || 0;
      const rawObs: any[] = obsData.results || [];

      observations = rawObs.map((o) => {
        const { lat, lng } = parseCoordinates(o.location, o.geojson);
        const obsPhotos: WildlifePhoto[] = (o.photos || [])
          .map((p: any) => mapPhoto(p))
          .filter(Boolean) as WildlifePhoto[];

        return {
          id: o.id,
          speciesName: o.taxon?.name || o.species_guess || primaryTaxon?.scientificName || 'Unidentified Organism',
          commonName: o.taxon?.preferred_common_name || primaryTaxon?.commonName || o.species_guess,
          observedOn: o.observed_on || (o.time_observed_at ? o.time_observed_at.substring(0, 10) : 'Date unrecorded'),
          placeGuess: o.place_guess || (lat && lng ? `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}` : 'Location not specified'),
          latitude: lat,
          longitude: lng,
          observerName: o.user?.name || o.user?.login || 'Community Naturalist',
          qualityGrade: (o.quality_grade as any) || 'needs_id',
          photos: obsPhotos,
          inatUrl: o.uri || `https://www.inaturalist.org/observations/${o.id}`,
        };
      });
    }

    clearTimeout(timeoutId);

    return {
      speciesList,
      selectedSpecies: primaryTaxon,
      observations,
      totalObservations: totalObservations || observations.length,
      isFallback: false,
      source: 'api',
      query: trimmed,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('iNaturalist API request timed out (10s). The service might be slow or temporarily unreachable.');
    }
    throw err;
  }
}

/**
 * Searches sample wildlife dataset
 */
export function getSampleWildlife(query?: string): WildlifeResponse {
  const trimmed = (query || '').trim();
  const matched = trimmed ? findSampleSpecies(trimmed) : SAMPLE_WILDLIFE_DATA;

  const speciesList: Species[] = matched.map((m) => m.species);
  const selectedSpecies = speciesList[0] || null;
  const observations: ObservationRecord[] = matched.flatMap((m) => m.observations);

  return {
    speciesList,
    selectedSpecies,
    observations,
    totalObservations: observations.length,
    isFallback: true,
    source: 'fallback',
    query: trimmed || 'Sample Dataset',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Main wildlife search function with clear separation between:
 * 1. Live API success
 * 2. Live API empty results (Do NOT substitute unrelated sample data)
 * 3. Live API failure -> fallback to sample data when available, or throw
 */
export async function searchWildlife(
  query: string,
  options?: FetchOptions
): Promise<WildlifeResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error('Please enter a species name to search.');
  }

  // If user explicitly forced fallback / sample mode
  if (options?.forceFallback) {
    const sample = getSampleWildlife(trimmed);
    return sample;
  }

  try {
    const liveResult = await fetchLiveWildlife(trimmed, options);
    // If live API returns 0 species and 0 observations, return genuine empty result (Requirement 6)
    return liveResult;
  } catch (apiError: any) {
    console.warn(`[WildLife Explorer] Live API failed for "${trimmed}":`, apiError.message);

    // Fallback handling when API is unreachable
    const sampleMatches = findSampleSpecies(trimmed);
    if (sampleMatches.length > 0) {
      const fallbackResult = getSampleWildlife(trimmed);
      fallbackResult.error = `Live API was unavailable (${apiError.message}). Switched to matching curated sample dataset.`;
      return fallbackResult;
    }

    // If query has no sample match and API failed, rethrow error so user sees retry / sample toggle options
    throw new Error(
      `Unable to reach the live wildlife API (${apiError.message || 'Network error'}). You can retry or explore our curated sample dataset.`
    );
  }
}
