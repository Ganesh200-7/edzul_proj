import { NextRequest, NextResponse } from 'next/server';
import { ObservationRecord, WildlifePhoto } from '@/types/wildlife';

const GBIF_API_BASE = 'https://api.gbif.org/v1';
const INAT_API_BASE = 'https://api.inaturalist.org/v1';

type GbifMediaItem = {
  identifier?: string;
  references?: string;
  creator?: string;
  rightsHolder?: string;
  publisher?: string;
  license?: string;
};

type GbifOccurrence = {
  key?: number | string;
  media?: GbifMediaItem[];
  decimalLatitude?: number;
  decimalLongitude?: number;
  locality?: string;
  stateProvince?: string;
  country?: string;
  eventDate?: string;
  year?: number;
  month?: number;
  day?: number;
  scientificName?: string;
  vernacularName?: string;
  basisOfRecord?: string;
  recordedBy?: string;
  institutionCode?: string;
  collectionCode?: string;
  datasetName?: string;
  countryCode?: string;
};

type InatPhoto = {
  id?: number | string;
  url?: string;
  attribution?: string;
  license_code?: string;
};

type InatObservation = {
  id?: number | string;
  photos?: InatPhoto[];
  geojson?: { coordinates?: unknown[] };
  taxon?: { name?: string; preferred_common_name?: string };
  observed_on?: string;
  created_at?: string;
  place_guess?: string;
  quality_grade?: string;
  user?: { name?: string; login?: string };
};

function normalizeLicense(rawLicense?: string): string {
  if (!rawLicense) return 'Creative Commons';
  const clean = rawLicense.replace(/http[s]?:\/\//i, '').replace(/\/$/, '');
  if (clean.includes('creativecommons.org/publicdomain/zero') || clean.includes('cc0')) {
    return 'CC0 1.0 (Public Domain)';
  }
  if (clean.includes('by-nc-nd')) return 'CC BY-NC-ND';
  if (clean.includes('by-nc-sa')) return 'CC BY-NC-SA';
  if (clean.includes('by-nc')) return 'CC BY-NC';
  if (clean.includes('by-sa')) return 'CC BY-SA';
  if (clean.includes('by-nd')) return 'CC BY-ND';
  if (clean.includes('by/')) return 'CC BY';
  return clean.toUpperCase().includes('CC') ? clean : 'Creative Commons';
}

function formatBasisOfRecord(rawBasis?: string): string {
  if (!rawBasis) return 'Biodiversity Record';
  switch (rawBasis.toUpperCase()) {
    case 'HUMAN_OBSERVATION':
      return 'Human Observation';
    case 'MACHINE_OBSERVATION':
      return 'Machine Observation';
    case 'OBSERVATION':
      return 'Field Observation';
    case 'PRESERVED_SPECIMEN':
      return 'Preserved Specimen';
    case 'FOSSIL_SPECIMEN':
      return 'Fossil Specimen';
    case 'LIVING_SPECIMEN':
      return 'Living Specimen';
    case 'MATERIAL_CITATION':
      return 'Material Citation';
    default:
      return rawBasis.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

function mapGbifMedia(mediaItem: GbifMediaItem | null | undefined, fallbackId: string | number): WildlifePhoto | null {
  if (!mediaItem || (!mediaItem.identifier && !mediaItem.references)) return null;
  const url = mediaItem.identifier || mediaItem.references;
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return null;

  const creator = mediaItem.creator || mediaItem.rightsHolder || mediaItem.publisher || 'GBIF Contributor';
  const license = normalizeLicense(mediaItem.license);

  return {
    id: fallbackId,
    url,
    originalUrl: url,
    attribution: `Photo: ${creator}`,
    licenseCode: license,
    references: mediaItem.references || url,
  };
}

function toNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const taxonKey = searchParams.get('taxonKey');
  const inatId = searchParams.get('inatId');
  const country = searchParams.get('country') || undefined;
  const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10));
  const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '24', 10)), 50);

  if (!taxonKey && !inatId) {
    return NextResponse.json(
      { error: 'Query parameter "taxonKey" or "inatId" is required.' },
      { status: 400 }
    );
  }

  try {
    if (taxonKey && !inatId) {
      const photoOccUrl = `${GBIF_API_BASE}/occurrence/search?taxonKey=${encodeURIComponent(taxonKey)}&mediaType=StillImage&limit=${limit}&offset=${offset}${country && country !== 'ALL' ? `&country=${encodeURIComponent(country)}` : ''}`;
      const standardOccUrl = `${GBIF_API_BASE}/occurrence/search?taxonKey=${encodeURIComponent(taxonKey)}&limit=${limit}&offset=${offset}${country && country !== 'ALL' ? `&country=${encodeURIComponent(country)}` : ''}`;

      const [photoRes, standardRes] = await Promise.all([
        fetch(photoOccUrl, { headers: { Accept: 'application/json' }, next: { revalidate: 60 } }).then((response) => (response.ok ? response.json() : null)).catch(() => null),
        fetch(standardOccUrl, { headers: { Accept: 'application/json' }, next: { revalidate: 60 } }).then((response) => (response.ok ? response.json() : null)).catch(() => null),
      ]);

      const photoResults = Array.isArray((photoRes as { results?: GbifOccurrence[] } | null)?.results) ? ((photoRes as { results?: GbifOccurrence[] }).results ?? []) : [];
      const standardResults = Array.isArray((standardRes as { results?: GbifOccurrence[] } | null)?.results) ? ((standardRes as { results?: GbifOccurrence[] }).results ?? []) : [];

      const rawCombined: GbifOccurrence[] = [...photoResults, ...standardResults];
      const seenKeys = new Set<string>();
      const dedupedResults: GbifOccurrence[] = [];

      for (const item of rawCombined) {
        const k = String(item.key ?? '');
        if (k && !seenKeys.has(k)) {
          seenKeys.add(k);
          dedupedResults.push(item);
        }
      }

      dedupedResults.sort((a, b) => {
        const aMedia = a.media && a.media.length > 0 ? 1 : 0;
        const bMedia = b.media && b.media.length > 0 ? 1 : 0;
        return bMedia - aMedia;
      });

      const totalCount = Math.max((standardRes as { count?: number } | null)?.count ?? 0, (photoRes as { count?: number } | null)?.count ?? 0);
      const observations: ObservationRecord[] = [];

      for (let i = 0; i < dedupedResults.length; i++) {
        const o = dedupedResults[i];
        const recordKey = String(o.key ?? `gbif-occ-${offset + i}`);

        const obsPhotos: WildlifePhoto[] = [];
        if (Array.isArray(o.media)) {
          o.media.forEach((mediaItem, mIdx) => {
            const mapped = mapGbifMedia(mediaItem, `photo-${recordKey}-${mIdx}`);
            if (mapped) obsPhotos.push(mapped);
          });
        }

        const lat = toNumber(o.decimalLatitude);
        const lng = toNumber(o.decimalLongitude);
        const locParts = [o.locality, o.stateProvince, o.country].filter(Boolean) as string[];
        const locationStr = locParts.length > 0 ? locParts.join(', ') : o.country || 'Location details unrecorded';

        let dateStr = 'Date not recorded';
        if (o.eventDate) {
          dateStr = o.eventDate.substring(0, 10);
        } else if (o.year) {
          dateStr = `${o.year}${o.month ? `-${String(o.month).padStart(2, '0')}` : ''}${o.day ? `-${String(o.day).padStart(2, '0')}` : ''}`;
        }

        observations.push({
          key: recordKey,
          speciesKey: taxonKey,
          provider: 'gbif',
          scientificName: o.scientificName || 'Scientific Name Unlisted',
          commonName: o.vernacularName || undefined,
          eventDate: dateStr,
          country: o.country || 'Global / Unknown',
          countryCode: o.countryCode || undefined,
          stateProvince: o.stateProvince || undefined,
          locality: locationStr,
          latitude: lat,
          longitude: lng,
          basisOfRecord: formatBasisOfRecord(o.basisOfRecord),
          recordedBy: o.recordedBy || 'Field Researcher / Contributor',
          institutionCode: o.institutionCode || o.collectionCode || undefined,
          datasetName: o.datasetName || undefined,
          photos: obsPhotos,
          gbifUrl: `https://www.gbif.org/occurrence/${o.key}`,
        });
      }

      return NextResponse.json({
        observations,
        totalObservations: totalCount,
        offset,
        limit,
        hasMore: offset + observations.length < totalCount,
      });
    }

    if (taxonKey && inatId) {
      const halfLimit = Math.max(12, Math.ceil(limit / 2));
      const photoOccUrl = `${GBIF_API_BASE}/occurrence/search?taxonKey=${encodeURIComponent(taxonKey)}&mediaType=StillImage&limit=${halfLimit}&offset=${offset}${country && country !== 'ALL' ? `&country=${encodeURIComponent(country)}` : ''}`;
      const standardOccUrl = `${GBIF_API_BASE}/occurrence/search?taxonKey=${encodeURIComponent(taxonKey)}&limit=${halfLimit}&offset=${offset}${country && country !== 'ALL' ? `&country=${encodeURIComponent(country)}` : ''}`;
      const page = Math.floor(offset / halfLimit) + 1;
      const inatUrl = `${INAT_API_BASE}/observations?taxon_id=${encodeURIComponent(inatId)}&per_page=${halfLimit}&page=${page}&order=desc&order_by=votes`;

      const [photoRes, standardRes, inatRes] = await Promise.all([
        fetch(photoOccUrl, { headers: { Accept: 'application/json' }, next: { revalidate: 60 } }).then((response) => (response.ok ? response.json() : null)).catch(() => null),
        fetch(standardOccUrl, { headers: { Accept: 'application/json' }, next: { revalidate: 60 } }).then((response) => (response.ok ? response.json() : null)).catch(() => null),
        fetch(inatUrl, { headers: { Accept: 'application/json' }, next: { revalidate: 60 } }).then((response) => (response.ok ? response.json() : null)).catch(() => null),
      ]);

      const photoResults = Array.isArray((photoRes as { results?: GbifOccurrence[] } | null)?.results) ? ((photoRes as { results?: GbifOccurrence[] }).results ?? []) : [];
      const standardResults = Array.isArray((standardRes as { results?: GbifOccurrence[] } | null)?.results) ? ((standardRes as { results?: GbifOccurrence[] }).results ?? []) : [];
      const rawCombined: GbifOccurrence[] = [...photoResults, ...standardResults];

      const seenKeys = new Set<string>();
      const gbifObs: ObservationRecord[] = [];

      for (let i = 0; i < rawCombined.length; i++) {
        const o = rawCombined[i];
        const recordKey = String(o.key ?? `gbif-occ-${offset + i}`);
        if (seenKeys.has(recordKey)) continue;
        seenKeys.add(recordKey);

        const obsPhotos: WildlifePhoto[] = [];
        if (Array.isArray(o.media)) {
          o.media.forEach((mediaItem, mIdx) => {
            const mapped = mapGbifMedia(mediaItem, `photo-${recordKey}-${mIdx}`);
            if (mapped) obsPhotos.push(mapped);
          });
        }

        const lat = toNumber(o.decimalLatitude);
        const lng = toNumber(o.decimalLongitude);
        const locParts = [o.locality, o.stateProvince, o.country].filter(Boolean) as string[];
        const locationStr = locParts.length > 0 ? locParts.join(', ') : o.country || 'Location details unrecorded';

        let dateStr = 'Date not recorded';
        if (o.eventDate) dateStr = o.eventDate.substring(0, 10);
        else if (o.year) dateStr = `${o.year}${o.month ? `-${String(o.month).padStart(2, '0')}` : ''}${o.day ? `-${String(o.day).padStart(2, '0')}` : ''}`;

        gbifObs.push({
          key: recordKey,
          speciesKey: taxonKey,
          provider: 'gbif',
          scientificName: o.scientificName || 'Scientific Name Unlisted',
          commonName: o.vernacularName || undefined,
          eventDate: dateStr,
          country: o.country || 'Global / Unknown',
          countryCode: o.countryCode || undefined,
          stateProvince: o.stateProvince || undefined,
          locality: locationStr,
          latitude: lat,
          longitude: lng,
          basisOfRecord: formatBasisOfRecord(o.basisOfRecord),
          recordedBy: o.recordedBy || 'Field Researcher / Contributor',
          institutionCode: o.institutionCode || o.collectionCode || undefined,
          datasetName: o.datasetName || undefined,
          photos: obsPhotos,
          gbifUrl: `https://www.gbif.org/occurrence/${o.key}`,
        });
      }

      const inatObs: ObservationRecord[] = [];
      if (inatRes && typeof inatRes === 'object' && Array.isArray((inatRes as { results?: InatObservation[] }).results)) {
        const results = (inatRes as { results: InatObservation[] }).results;
        results.forEach((o, idx) => {
          const recordKey = `inat-obs-${o.id ?? offset + idx}`;
          if (seenKeys.has(recordKey)) return;
          seenKeys.add(recordKey);

          const obsPhotos: WildlifePhoto[] = [];
          if (Array.isArray(o.photos)) {
            o.photos.forEach((photo) => {
              const url = photo.url ? photo.url.replace('square', 'medium') : null;
              if (url) {
                obsPhotos.push({
                  id: `inat-ph-${photo.id ?? o.id ?? idx}`,
                  url,
                  originalUrl: photo.url ? photo.url.replace('square', 'original') : url,
                  attribution: photo.attribution || 'iNaturalist Observer',
                  licenseCode: normalizeLicense(photo.license_code),
                  references: `https://www.inaturalist.org/observations/${o.id}`,
                });
              }
            });
          }

          let lat: number | null = null;
          let lng: number | null = null;
          const coordinates = o.geojson?.coordinates;
          if (Array.isArray(coordinates) && coordinates.length >= 2) {
            const longitude = toNumber(coordinates[0]);
            const latitude = toNumber(coordinates[1]);
            lng = longitude;
            lat = latitude;
          }

          inatObs.push({
            key: recordKey,
            speciesKey: taxonKey,
            provider: 'inaturalist',
            scientificName: o.taxon?.name || 'Scientific Name Unlisted',
            commonName: o.taxon?.preferred_common_name || undefined,
            eventDate: o.observed_on || (o.created_at ? o.created_at.substring(0, 10) : 'Recent Observation'),
            country: o.place_guess || 'Global',
            locality: o.place_guess || 'Field Observation Location',
            latitude: lat,
            longitude: lng,
            basisOfRecord: o.quality_grade === 'research' ? 'Research Grade Observation' : 'Community Observation',
            recordedBy: o.user?.name || o.user?.login || 'iNaturalist Naturalist',
            photos: obsPhotos,
            inatUrl: `https://www.inaturalist.org/observations/${o.id}`,
          });
        });
      }

      const merged = [...gbifObs, ...inatObs];
      merged.sort((a, b) => {
        const aMedia = a.photos.length > 0 ? 1 : 0;
        const bMedia = b.photos.length > 0 ? 1 : 0;
        return bMedia - aMedia;
      });

      const gbifCount = Math.max((standardRes as { count?: number } | null)?.count ?? 0, (photoRes as { count?: number } | null)?.count ?? 0);
      const inatCount = (inatRes as { total_results?: number } | null)?.total_results ?? 0;
      const totalCount = Math.max(gbifCount + inatCount, gbifCount, inatCount, merged.length);

      return NextResponse.json({
        observations: merged,
        totalObservations: totalCount,
        offset,
        limit,
        hasMore: offset + merged.length < totalCount,
      });
    }

    if (inatId) {
      const page = Math.floor(offset / limit) + 1;
      const inatUrl = `${INAT_API_BASE}/observations?taxon_id=${encodeURIComponent(inatId)}&per_page=${limit}&page=${page}&order=desc&order_by=votes`;

      const res = await fetch(inatUrl, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        throw new Error(`iNaturalist API responded with status ${res.status}`);
      }

      const data = (await res.json()) as { results?: InatObservation[]; total_results?: number };
      const rawResults = data.results ?? [];
      const totalCount = data.total_results ?? 0;

      const observations: ObservationRecord[] = rawResults.map((o, idx) => {
        const obsPhotos: WildlifePhoto[] = [];
        if (Array.isArray(o.photos)) {
          o.photos.forEach((photo) => {
            const url = photo.url ? photo.url.replace('square', 'medium') : null;
            if (url) {
              obsPhotos.push({
                id: `inat-ph-${photo.id ?? o.id ?? idx}`,
                url,
                originalUrl: photo.url ? photo.url.replace('square', 'original') : url,
                attribution: photo.attribution || 'iNaturalist Observer',
                licenseCode: normalizeLicense(photo.license_code),
                references: `https://www.inaturalist.org/observations/${o.id}`,
              });
            }
          });
        }

        let lat: number | null = null;
        let lng: number | null = null;
        const coordinates = o.geojson?.coordinates;
        if (Array.isArray(coordinates) && coordinates.length >= 2) {
          const longitude = toNumber(coordinates[0]);
          const latitude = toNumber(coordinates[1]);
          lng = longitude;
          lat = latitude;
        }

        return {
          key: `inat-obs-${o.id ?? offset + idx}`,
          speciesKey: inatId,
          provider: 'inaturalist' as const,
          scientificName: o.taxon?.name || 'Scientific Name Unlisted',
          commonName: o.taxon?.preferred_common_name || undefined,
          eventDate: o.observed_on || (o.created_at ? o.created_at.substring(0, 10) : 'Recent Observation'),
          country: o.place_guess || 'Global',
          locality: o.place_guess || 'Field Observation Location',
          latitude: lat,
          longitude: lng,
          basisOfRecord: o.quality_grade === 'research' ? 'Research Grade Observation' : 'Community Observation',
          recordedBy: o.user?.name || o.user?.login || 'iNaturalist Contributor',
          photos: obsPhotos,
          inatUrl: `https://www.inaturalist.org/observations/${o.id}`,
        };
      });

      return NextResponse.json({
        observations,
        totalObservations: totalCount,
        offset,
        limit,
        hasMore: offset + observations.length < totalCount,
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch occurrence records from biodiversity API.';
    return NextResponse.json(
      { error: message },
      { status: 502 }
    );
  }
}
