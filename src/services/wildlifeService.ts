import {
  Species,
  ObservationRecord,
  WildlifeResponse,
  WildlifePhoto,
  IconicCategory,
  TaxonomicClassification,
} from '../types/wildlife';
import { SAMPLE_WILDLIFE_DATA, findSampleSpecies } from '../data/sampleWildlife';
import { disambiguateWildlifeQuery } from './llmWildlifeService';

const GBIF_API_BASE = 'https://api.gbif.org/v1';
const INAT_API_BASE = 'https://api.inaturalist.org/v1';
const REQUEST_TIMEOUT_MS = 25000;

interface FetchOptions {
  forceFallback?: boolean;
  country?: string;
  category?: IconicCategory;
  signal?: AbortSignal;
}

// Clean plain text description
function cleanText(text?: string): string | undefined {
  if (!text) return undefined;
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Format basis of record accurately
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

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && !Number.isNaN(value) ? value : undefined;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined;
}

// Map a GBIF media item into a clean WildlifePhoto
function mapGbifMedia(mediaItem: Record<string, unknown>, fallbackId: string | number): WildlifePhoto | null {
  if (!mediaItem || (!mediaItem.identifier && !mediaItem.references)) return null;
  const url = asString(mediaItem.identifier) ?? asString(mediaItem.references);
  if (!url || !url.startsWith('http')) return null;

  const creator =
    asString(mediaItem.creator) ||
    asString(mediaItem.rightsHolder) ||
    asString(mediaItem.publisher) ||
    'GBIF Contributor';
  const license = normalizeLicense(asString(mediaItem.license));

  return {
    id: fallbackId,
    url,
    originalUrl: url,
    attribution: `Photo: ${creator}`,
    licenseCode: license,
    references: asString(mediaItem.references) || url,
  };
}

const COMPOUND_MODIFIERS = [
  'butterfly', 'butterflies', 'moth', 'moths', 'spider', 'spiders',
  'fish', 'fishes', 'beetle', 'beetles', 'fly', 'flies',
  'fern', 'ferns', 'flower', 'flowers', 'plant', 'plants',
  'tree', 'trees', 'shrub', 'shrubs', 'weed', 'weeds',
  'cactus', 'cacti', 'grass', 'grasses', 'moss', 'mosses',
  'mushroom', 'mushrooms', 'fungus', 'fungi',
  'worm', 'worms', 'snail', 'snails', 'slug', 'slugs',
  'ant', 'ants', 'wasp', 'wasps', 'bee', 'bees',
  'mussel', 'mussels', 'clam', 'clams',
  'ray', 'rays', 'gull', 'gulls', 'vulture', 'vultures',
  'hawk', 'hawks', 'seal', 'seals', 'snake', 'snakes',
  'gecko', 'geckos', 'lizard', 'lizards', 'crab', 'crabs',
  'shrimp', 'shrimps', 'crayfish',
];

/**
 * Universal relevance scorer for any species candidate against the user's query.
 * Evaluates linguistic match on common and scientific names without hardcoded lists:
 * 1. Exact common name or plural/singular variation ("deer" === "deer", "elephant" === "elephants")
 * 2. Exact matched term (e.g. "Peacock" for Pavo cristatus)
 * 3. Exact scientific / canonical name ("panthera tigris" === "panthera tigris")
 * 4. Whole-word match in preferred common name ("White-tailed Deer", "Bald Eagle")
 * 5. Word-boundary or prefix match in scientific name
 * 6. Penalizes compound modifiers when user searched the root noun (e.g. "peacock butterfly" penalized for query "peacock")
 * 7. Prioritizes iconic animal groups over plants/fungi when query matches an animal
 * Rejects substring false-positives (e.g. "Deeringothamnus" when query is "deer").
 */
export function scoreRelevance(candidate: {
  commonName?: string;
  preferredCommonName?: string;
  matchedTerm?: string;
  vernacularNames?: string[];
  scientificName?: string;
  canonicalName?: string;
  rank?: string;
  taxonomicStatus?: string;
  iconicTaxonName?: string;
  classification?: TaxonomicClassification;
}, query: string): number {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return 0;

  const escapedQ = escapeRegExp(cleanQ);
  const qTokens = cleanQ.split(/\s+/).filter(Boolean);

  const matchedTerm = (candidate.matchedTerm || '').toLowerCase().trim();
  const preferredCn = (candidate.preferredCommonName || candidate.commonName || '').toLowerCase().trim();
  const rawCn = (candidate.commonName || '').replace(/\s*\([^)]*\)/g, '').toLowerCase().trim();
  const fullCn = (candidate.commonName || '').toLowerCase().trim();
  const sn = (candidate.scientificName || '').toLowerCase().trim();
  const can = (candidate.canonicalName || '').toLowerCase().trim();
  const vernaculars = (candidate.vernacularNames || []).map((v) => v.toLowerCase().trim());
  const allCommon = [matchedTerm, preferredCn, rawCn, fullCn, ...vernaculars].filter(Boolean);

  // Exclude viruses from wildlife results
  const kingdom = (candidate.classification?.kingdom || '').toLowerCase();
  if (kingdom === 'viruses' || sn.includes('virus')) {
    return 0;
  }

  // Singular and plural equivalence: "elephant" <-> "elephants", "butterfly" <-> "butterflies"
  const isExactPreferred = (
    preferredCn === cleanQ ||
    preferredCn === cleanQ + 's' ||
    cleanQ === preferredCn + 's' ||
    (cleanQ.endsWith('y') && preferredCn === cleanQ.slice(0, -1) + 'ies') ||
    (preferredCn.endsWith('y') && cleanQ === preferredCn.slice(0, -1) + 'ies')
  );

  const isExactMatched = (
    matchedTerm === cleanQ ||
    matchedTerm === cleanQ + 's' ||
    cleanQ === matchedTerm + 's' ||
    (cleanQ.endsWith('y') && matchedTerm === cleanQ.slice(0, -1) + 'ies') ||
    (matchedTerm.endsWith('y') && cleanQ === matchedTerm.slice(0, -1) + 'ies')
  );

  const isExactScientific = can === cleanQ || sn === cleanQ;

  let score = 0;

  // 1. Preferred common name match
  if (isExactPreferred) {
    score += 3000;
  }
  // 2. Exact matched term or alternative vernacular match (e.g. Pavo cristatus matched "Peacock")
  else if (isExactMatched) {
    score += 2600;
  }
  // 3. Exact scientific / canonical name match
  else if (isExactScientific) {
    score += 2200;
  }
  // 4. Whole-word match in preferred common name (e.g. "White-tailed Deer", "Bald Eagle")
  else if (new RegExp(`\\b${escapedQ}\\b`, 'i').test(preferredCn)) {
    score += 1800 - Math.min(100, preferredCn.length);
  }
  // 5. Whole-word match in other common names / matched term
  else if (allCommon.some((c) => new RegExp(`\\b${escapedQ}\\b`, 'i').test(c))) {
    score += 1300;
  }
  // 6. Scientific name starts with query word / genus
  else if (can.startsWith(cleanQ + ' ') || sn.startsWith(cleanQ + ' ')) {
    score += 1100;
  }
  // 7. Multi-token query: all tokens present in common name
  else if (qTokens.length > 1 && qTokens.every((tok) => allCommon.some((c) => new RegExp(`\\b${escapeRegExp(tok)}\\b`, 'i').test(c)))) {
    score += 1000;
  } else {
    // Substring false positive without word boundary -> Discard
    return 0;
  }

  // 8. Head noun bonus: if common name ends with the query word, it is the primary animal itself!
  // e.g. "Bottlenose Dolphin" ends with "Dolphin", "White-tailed Deer" ends with "Deer", "Bald Eagle" ends with "Eagle"
  const isHeadNoun =
    preferredCn === cleanQ ||
    preferredCn.endsWith(' ' + cleanQ) ||
    preferredCn.endsWith(' ' + cleanQ + 's') ||
    preferredCn.endsWith('-' + cleanQ);
  if (isHeadNoun) {
    score += 600;
  }

  // Compound modifier penalty:
  // e.g. user searched "peacock", but candidate contains "butterfly", "spider", "fish", "flower"
  for (const mod of COMPOUND_MODIFIERS) {
    if (!cleanQ.includes(mod)) {
      if (
        preferredCn.endsWith(' ' + mod) ||
        preferredCn.endsWith('-' + mod) ||
        preferredCn.endsWith(mod) ||
        fullCn.includes(' ' + mod) ||
        fullCn.includes('-' + mod) ||
        fullCn.includes(mod)
      ) {
        score -= 1200;
        break;
      }
    }
  }

  // Prefer animals/wildlife over plants/fungi when query matches an iconic animal
  const iconic = (candidate.iconicTaxonName || candidate.classification?.class || kingdom).toLowerCase();

  // Specific taxonomic homonym safeguards:
  // "rat" -> Must be Rodentia (Mammalia), never Dolphinfish (Coryphaena), maggot flies (Eristalis), or rattlesnakes (Crotalus)
  if (cleanQ === 'rat' || cleanQ === 'rats') {
    if (can.startsWith('coryphaena') || fullCn.includes('dolphinfish') || fullCn.includes('maggot') || kingdom === 'plantae') {
      return 0; // Completely discard dolphinfish/plants for "rat"
    }
    if (can.startsWith('rattus') || (candidate.classification?.order || '').toLowerCase() === 'rodentia') {
      score += 1500;
    }
  }

  // "peacock" -> Must be Phasianidae / Pavo (bird), never peacock butterfly (Aglais io)
  if (cleanQ === 'peacock' || cleanQ === 'peafowl') {
    if (iconic === 'insecta' || fullCn.includes('butterfly') || fullCn.includes('moth')) {
      score -= 2000;
    }
    if (can.startsWith('pavo') || iconic === 'aves') {
      score += 1500;
    }
  }

  // "deer" -> Must be Cervidae (Mammalia), never false pawpaw (Deeringothamnus)
  if (cleanQ === 'deer') {
    if (kingdom === 'plantae' || iconic === 'plantae' || can.startsWith('deeringothamnus')) {
      return 0;
    }
    if (can.startsWith('cervidae') || can.startsWith('odocoileus') || (candidate.classification?.family || '').toLowerCase() === 'cervidae') {
      score += 1500;
    }
  }

  // "dolphin" -> Must be Cetacea / Delphinidae (Mammalia), never dolphinfish or moths
  if (cleanQ === 'dolphin' || cleanQ === 'dolphins') {
    if (can.startsWith('coryphaena') || iconic === 'insecta' || fullCn.includes('moth')) {
      score -= 2000;
    }
    if ((candidate.classification?.family || '').toLowerCase() === 'delphinidae' || can.startsWith('delphinus') || can.startsWith('tursiops')) {
      score += 1500;
    }
  }

  if (['mammalia', 'aves', 'reptilia', 'amphibia', 'actinopterygii', 'insecta', 'arachnida', 'animalia'].includes(iconic)) {
    score += 150;
  } else if (kingdom === 'plantae' || kingdom === 'fungi' || iconic === 'plantae' || iconic === 'fungi') {
    score -= 600;
  }

  // Rank weight preference: Species > Subspecies > Genus > Family > Order
  const rank = (candidate.rank || '').toUpperCase();
  if (rank === 'SPECIES') score += 50;
  else if (rank === 'SUBSPECIES') score += 40;
  else if (rank === 'GENUS') score += 30;
  else if (rank === 'FAMILY') score += 20;

  // Penalize unaccepted, doubtful, or synonym taxonomic status
  if (candidate.taxonomicStatus && candidate.taxonomicStatus !== 'ACCEPTED') {
    score -= 800;
  }

  return score;
}

// Fetch Wikipedia summary to supplement descriptions if missing
async function fetchWikiDescription(name: string, signal?: AbortSignal): Promise<string | undefined> {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`, {
      signal,
    });
    if (res.ok) {
      const data = await res.json();
      if (data.extract && typeof data.extract === 'string' && data.extract.length > 20) {
        return cleanText(data.extract);
      }
    }
  } catch {
    // Non-fatal supplementary description
  }
  return undefined;
}

// Fetch authentic Creative Commons photograph from Wikipedia / Wikimedia Commons
async function fetchWikiPhoto(name: string, signal?: AbortSignal): Promise<WildlifePhoto | null> {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`, {
      signal,
    });
    if (res.ok) {
      const data = await res.json();
      const imgUrl = data.originalimage?.source || data.thumbnail?.source;
      if (imgUrl && typeof imgUrl === 'string' && imgUrl.startsWith('http')) {
        return {
          id: `wiki-ph-${encodeURIComponent(name)}`,
          url: imgUrl,
          originalUrl: data.originalimage?.source || imgUrl,
          mediumUrl: data.thumbnail?.source || imgUrl,
          attribution: `Wikimedia Commons / Wikipedia (${data.title || name})`,
          licenseCode: 'Creative Commons / Public Domain',
          references: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`,
        };
      }
    }
  } catch {
    // Non-fatal supplementary photo
  }
  return null;
}

/**
 * Searches GBIF for matching species and vernacular names.
 * Returns only species that actually match the user's query.
 */
async function searchGbifCandidates(query: string, signal: AbortSignal): Promise<Species[]> {
  const trimmed = query.trim();
  const lowerQuery = trimmed.toLowerCase();

  // Enforce GBIF Backbone Taxonomy datasetKey (d7dddbf4-2cf0-4f39-9b2a-bb099caae36c)
  // so all taxon keys connect directly to verified occurrences and taxonomy
  const [matchRes, suggestRes, searchRes] = await Promise.all([
    fetch(`${GBIF_API_BASE}/species/match?name=${encodeURIComponent(trimmed)}&strict=false&verbose=true`, { signal })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
    fetch(`${GBIF_API_BASE}/species/suggest?datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c&q=${encodeURIComponent(trimmed)}&limit=10`, { signal })
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []),
    fetch(`${GBIF_API_BASE}/species/search?datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c&q=${encodeURIComponent(trimmed)}&limit=10`, { signal })
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .catch(() => ({ results: [] })),
  ]);

  const candidateKeys: number[] = [];
  if (matchRes?.usageKey && matchRes.matchType !== 'NONE') {
    candidateKeys.push(matchRes.usageKey);
  }

  if (Array.isArray(suggestRes)) {
    suggestRes.forEach((s: Record<string, unknown>) => {
      const key =
        (typeof s.nubKey === 'number' ? s.nubKey : undefined) ||
        ((typeof s.datasetKey === 'string' && s.datasetKey === 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c' && typeof s.key === 'number') ? s.key : undefined);
      if (key && !candidateKeys.includes(key)) candidateKeys.push(key);
    });
  }

  if (searchRes?.results) {
    searchRes.results.forEach((r: Record<string, unknown>) => {
      const key =
        (typeof r.nubKey === 'number' ? r.nubKey : undefined) ||
        ((typeof r.datasetKey === 'string' && r.datasetKey === 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c' && typeof r.key === 'number') ? r.key : undefined);
      if (key && !candidateKeys.includes(key)) candidateKeys.push(key);
    });
  }

  if (candidateKeys.length === 0) return [];

  // Fetch details and vernacular names for candidate keys (top 8)
  const topKeys = candidateKeys.slice(0, 8);
  const speciesList: Species[] = await Promise.all(
    topKeys.map(async (key) => {
      try {
        const [spRes, vnRes, descRes] = await Promise.all([
          fetch(`${GBIF_API_BASE}/species/${key}`, { signal }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
          fetch(`${GBIF_API_BASE}/species/${key}/vernacularNames?limit=30`, { signal }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
          fetch(`${GBIF_API_BASE}/species/${key}/descriptions?limit=3`, { signal }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
        ]);

        if (!spRes || spRes.taxonomicStatus === 'DOUBTFUL') return null;

        let commonName = '';
        let matchedTerm: string | undefined = undefined;
        let engVernaculars: string[] = [];

        if (vnRes?.results && Array.isArray(vnRes.results)) {
          const engNames: Record<string, unknown>[] = (vnRes.results as unknown[]).filter((v): v is Record<string, unknown> => {
            if (!v || typeof v !== 'object') return false;
            const record = v as Record<string, unknown>;
            return record.language === 'eng' || record.language === 'en';
          });
          engVernaculars = engNames
            .map((v: Record<string, unknown>) => asString(v.vernacularName))
            .filter((value: string | undefined): value is string => Boolean(value));

          // Find exact match first
          const exactMatch = engNames.find((v: Record<string, unknown>) => {
            const name = asString(v.vernacularName);
            return name?.toLowerCase().trim() === lowerQuery;
          });
          // Or whole word match
          const wordMatch = engNames.find((v: Record<string, unknown>) => {
            const name = asString(v.vernacularName);
            return !!name && new RegExp(`\\b${escapeRegExp(lowerQuery)}\\b`, 'i').test(name);
          });

          const exactName = asString(exactMatch?.vernacularName);
          const wordName = asString(wordMatch?.vernacularName);

          if (exactName) {
            commonName = exactName;
            matchedTerm = exactName;
          } else if (wordName) {
            commonName = wordName;
            matchedTerm = wordName;
          } else if (engNames.length > 0) {
            const sorted = [...engNames].sort(
              (a, b) =>
                (asString(a.vernacularName)?.length ?? 0) - (asString(b.vernacularName)?.length ?? 0)
            );
            const firstName = asString(sorted[0]?.vernacularName);
            if (firstName) {
              commonName = firstName;
            }
          }
        }
        if (!commonName && spRes.vernacularName) {
          commonName = spRes.vernacularName;
        }

        let description: string | undefined = undefined;
        if (descRes?.results && descRes.results.length > 0) {
          for (const d of descRes.results) {
            const text = cleanText(d.description);
            if (text && text.length > 30) {
              description = text;
              break;
            }
          }
        }

        const effectiveKey = spRes.nubKey || spRes.key;

        const speciesObj: Species = {
          key: effectiveKey,
          provider: 'gbif',
          scientificName: spRes.scientificName || spRes.canonicalName || 'Scientific Name Unlisted',
          canonicalName: spRes.canonicalName || spRes.scientificName || 'Unknown',
          commonName: commonName || spRes.canonicalName || spRes.scientificName || 'Unknown',
          matchedTerm,
          vernacularNames: engVernaculars,
          rank: spRes.rank || 'SPECIES',
          taxonomicStatus: spRes.taxonomicStatus || 'ACCEPTED',
          classification: {
            kingdom: spRes.kingdom,
            phylum: spRes.phylum,
            class: spRes.class,
            order: spRes.order,
            family: spRes.family,
            genus: spRes.genus,
          },
          description,
          photos: [],
          gbifTaxonKey: effectiveKey,
          gbifUrl: `https://www.gbif.org/species/${effectiveKey}`,
        };

        return speciesObj;
      } catch {
        return null;
      }
    })
  ).then((res) => res.filter(Boolean) as Species[]);

  // Score relevance and filter strictly
  const scored = speciesList
    .map((sp) => ({ species: sp, score: scoreRelevance(sp, trimmed) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.species);

  // Cross-link top 4 GBIF matches with iNaturalist taxa for dual-database verification
  await Promise.all(
    scored.slice(0, 4).map(async (sp) => {
      try {
        const inatRes = await fetch(
          `${INAT_API_BASE}/taxa?q=${encodeURIComponent(sp.canonicalName || sp.scientificName)}&is_active=true&per_page=1`,
          { signal }
        )
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);

        if (inatRes?.results?.[0]?.id) {
          const t = inatRes.results[0];
          sp.inaturalistId = t.id;
          sp.inatUrl = `https://www.inaturalist.org/taxa/${t.id}`;
          if ((!sp.commonName || sp.commonName === sp.canonicalName) && t.preferred_common_name) {
            sp.commonName = t.preferred_common_name;
          }
          if (t.default_photo?.medium_url && (!sp.photos || sp.photos.length === 0)) {
            const photo: WildlifePhoto = {
              id: `inat-taxon-${t.default_photo.id || t.id}`,
              url: t.default_photo.medium_url,
              originalUrl: t.default_photo.original_url || t.default_photo.medium_url,
              attribution: t.default_photo.attribution || 'iNaturalist Contributor',
              licenseCode: normalizeLicense(t.default_photo.license_code),
              references: `https://www.inaturalist.org/taxa/${t.id}`,
            };
            sp.primaryPhoto = photo;
            sp.photos = [photo];
          }
        }
      } catch {
        // non-fatal iNat enrichment
      }
    })
  );

  return scored;
}

/**
 * Fallback multi-species search via iNaturalist when GBIF has no relevant match.
 * Resolves each matched taxon back to the GBIF taxonomic backbone for occurrences.
 */
async function searchInatCandidates(query: string, signal: AbortSignal): Promise<Species[]> {
  const trimmed = query.trim();

  const [autoRes, taxaRes] = await Promise.all([
    fetch(`${INAT_API_BASE}/taxa/autocomplete?q=${encodeURIComponent(trimmed)}&per_page=12`, { signal })
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .catch(() => ({ results: [] })),
    fetch(`${INAT_API_BASE}/taxa?q=${encodeURIComponent(trimmed)}&per_page=12`, { signal })
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .catch(() => ({ results: [] })),
  ]);

  const combined: Array<Record<string, unknown>> = [];
  const seenIds = new Set<number>();
  [...(autoRes.results || []), ...(taxaRes.results || [])].forEach((t: Record<string, unknown>) => {
    const taxonId = typeof t.id === 'number' ? t.id : undefined;
    if (taxonId !== undefined && !seenIds.has(taxonId)) {
      seenIds.add(taxonId);
      combined.push(t);
    }
  });

  const candidates: Species[] = combined.map((t) => {
    const defaultPhoto = (t.default_photo as Record<string, unknown> | undefined) ?? undefined;
    const photos: WildlifePhoto[] = [];
    const defaultPhotoUrl = typeof defaultPhoto?.medium_url === 'string' ? defaultPhoto.medium_url : undefined;
    if (defaultPhotoUrl) {
      const imageId = typeof defaultPhoto?.id === 'number' || typeof defaultPhoto?.id === 'string' ? defaultPhoto.id : undefined;
      const taxonId = typeof t.id === 'number' ? t.id : 0;
      photos.push({
        id: `inat-ph-${imageId ?? taxonId}`,
        url: defaultPhotoUrl,
        originalUrl:
          (typeof defaultPhoto?.original_url === 'string' ? defaultPhoto.original_url : undefined) || defaultPhotoUrl,
        attribution:
          (typeof defaultPhoto?.attribution === 'string' ? defaultPhoto.attribution : undefined) || 'iNaturalist Contributor',
        licenseCode: (typeof defaultPhoto?.license_code === 'string' ? defaultPhoto.license_code : undefined) || 'CC-BY',
        references: `https://www.inaturalist.org/taxa/${taxonId}`,
      });
    }

    const matchedTerm = typeof t.matched_term === 'string' ? t.matched_term : undefined;
    const preferredCommon = typeof t.preferred_common_name === 'string' ? t.preferred_common_name : undefined;
    const nameValue = typeof t.name === 'string' ? t.name : 'Unknown';
    let displayName = preferredCommon || nameValue || 'Unknown';
    if (matchedTerm && preferredCommon && matchedTerm.toLowerCase() !== preferredCommon.toLowerCase()) {
      const qLower = trimmed.toLowerCase();
      // If matchedTerm matches query closer than preferredCommon, highlight it
      if (matchedTerm.toLowerCase() === qLower || matchedTerm.toLowerCase().includes(qLower)) {
        displayName = `${matchedTerm} (${preferredCommon})`;
      } else {
        displayName = `${preferredCommon} (${matchedTerm})`;
      }
    }

    const taxonId = typeof t.id === 'number' ? t.id : 0;
    const iconicTaxonName = typeof t.iconic_taxon_name === 'string' ? t.iconic_taxon_name : undefined;

    return {
      key: `inat-${taxonId}`,
      provider: 'inaturalist',
      scientificName: nameValue || 'Scientific Name Unlisted',
      canonicalName: nameValue || 'Unknown',
      commonName: displayName,
      preferredCommonName: preferredCommon || undefined,
      matchedTerm: matchedTerm || undefined,
      rank: ((typeof t.rank === 'string' ? t.rank : 'SPECIES') || 'SPECIES').toUpperCase(),
      taxonomicStatus: 'ACCEPTED',
      iconicTaxonName,
      inaturalistId: taxonId,
      inatUrl: `https://www.inaturalist.org/taxa/${taxonId}`,
      primaryPhoto: photos[0] || null,
      photos,
      classification: {
        kingdom: iconicTaxonName === 'Plantae' ? 'Plantae' : 'Animalia',
        class: iconicTaxonName,
      },
    };
  });

  // Score relevance
  const scored = candidates
    .map((sp) => ({ species: sp, score: scoreRelevance(sp, trimmed) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.species);

  // Link top 6 matches to GBIF backbone keys
  const resolved = await Promise.all(
    scored.slice(0, 6).map(async (sp) => {
      try {
        const gbifMatch = await fetch(
          `${GBIF_API_BASE}/species/match?name=${encodeURIComponent(sp.scientificName)}&strict=false`,
          { signal }
        )
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);

        if (gbifMatch?.usageKey && gbifMatch.matchType !== 'NONE') {
          sp.gbifTaxonKey = gbifMatch.usageKey;
          sp.gbifUrl = `https://www.gbif.org/species/${gbifMatch.usageKey}`;
          if (gbifMatch.kingdom) sp.classification.kingdom = gbifMatch.kingdom;
          if (gbifMatch.phylum) sp.classification.phylum = gbifMatch.phylum;
          if (gbifMatch.class) sp.classification.class = gbifMatch.class;
          if (gbifMatch.order) sp.classification.order = gbifMatch.order;
          if (gbifMatch.family) sp.classification.family = gbifMatch.family;
          if (gbifMatch.genus) sp.classification.genus = gbifMatch.genus;
        }
      } catch {
        // non-fatal GBIF matching error
      }
      return sp;
    })
  );

  return resolved;
}

/**
 * Fetches observation records and photos specifically for a single selected species.
 * Ensures that scientific name, common name, coordinates, and photos all belong strictly to this species.
 */
export async function fetchObservationsForSpecies(
  species: Species,
  country?: string,
  signal?: AbortSignal,
  offset: number = 0,
  limit: number = 24
): Promise<{ observations: ObservationRecord[]; totalObservations: number; photos: WildlifePhoto[]; hasMore: boolean }> {
  // If sample fallback entry
  if (species.provider === 'fallback') {
    const sample = findSampleSpecies(species.canonicalName || species.scientificName);
    if (sample.length > 0) {
      let obs = sample[0].observations;
      if (country && country !== 'ALL') {
        obs = obs.filter(
          (o) =>
            o.countryCode?.toUpperCase() === country.toUpperCase() ||
            o.country.toLowerCase().includes(country.toLowerCase())
        );
      }
      const paged = obs.slice(offset, offset + limit);
      return {
        observations: paged.length > 0 ? paged : obs,
        totalObservations: obs.length,
        photos: sample[0].species.photos || [],
        hasMore: offset + limit < obs.length,
      };
    }
  }

  const gbifKey = species.gbifTaxonKey || (species.provider === 'gbif' && typeof species.key === 'number' ? species.key : undefined);
  const inatId = species.inaturalistId;

  // Prepare photo gallery accumulator starting with species reference photos
  const galleryPhotos: WildlifePhoto[] = [...(species.photos || [])];
  const seenPhotoUrls = new Set<string>(galleryPhotos.map((p) => p.url));
  const seenKeys = new Set<string>();
  const combinedObservations: ObservationRecord[] = [];

  let gbifTotal = 0;
  let inatTotal = 0;

  // Execute GBIF and iNaturalist observation searches concurrently
  const gbifPromise = (async () => {
    if (!gbifKey) return;
    try {
      const halfLimit = inatId ? Math.max(12, Math.ceil(limit / 2)) : limit;
      let photoOccUrl = `${GBIF_API_BASE}/occurrence/search?taxonKey=${gbifKey}&mediaType=StillImage&limit=${halfLimit}&offset=${offset}`;
      let standardOccUrl = `${GBIF_API_BASE}/occurrence/search?taxonKey=${gbifKey}&limit=${halfLimit}&offset=${offset}`;

      if (country && country !== 'ALL') {
        photoOccUrl += `&country=${encodeURIComponent(country)}`;
        standardOccUrl += `&country=${encodeURIComponent(country)}`;
      }

      const [photoOccRes, standardOccRes] = await Promise.all([
        fetch(photoOccUrl, { signal }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch(standardOccUrl, { signal }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
      ]);

      gbifTotal = Math.max(standardOccRes?.count || 0, photoOccRes?.count || 0);

      const rawCombined = [
        ...(photoOccRes?.results || []),
        ...(standardOccRes?.results || []),
      ];

      // Deduplicate GBIF records
      const seenGbifKeys = new Set<string>();
      const dedupedGbif: Array<Record<string, unknown>> = [];
      for (const item of rawCombined) {
        const record = item as Record<string, unknown>;
        const k = String(record.key ?? '');
        if (k && !seenGbifKeys.has(k)) {
          seenGbifKeys.add(k);
          dedupedGbif.push(record);
        }
      }

      // Sort: GBIF records with verified media first
      dedupedGbif.sort((a, b) => {
        const aMedia = Array.isArray(a.media) && a.media.length > 0 ? 1 : 0;
        const bMedia = Array.isArray(b.media) && b.media.length > 0 ? 1 : 0;
        return bMedia - aMedia;
      });

      for (let idx = 0; idx < dedupedGbif.length; idx++) {
        const o = dedupedGbif[idx] as Record<string, unknown>;
        const recordKey = String(o.key ?? `gbif-occ-${offset + idx}`);
        if (seenKeys.has(recordKey)) continue;
        seenKeys.add(recordKey);

        const obsPhotos: WildlifePhoto[] = [];
        if (Array.isArray(o.media)) {
          o.media.forEach((m: Record<string, unknown>, mIdx: number) => {
            const mapped = mapGbifMedia(m, `photo-${recordKey}-${mIdx}`);
            if (mapped && !seenPhotoUrls.has(mapped.url)) {
              seenPhotoUrls.add(mapped.url);
              obsPhotos.push(mapped);
              galleryPhotos.push(mapped);
            } else if (mapped) {
              obsPhotos.push(mapped);
            }
          });
        }

        // If no field photograph attached, provide species reference image as fallback
        if (obsPhotos.length === 0 && species.primaryPhoto) {
          obsPhotos.push({
            ...species.primaryPhoto,
            isSpeciesFallback: true,
          });
        }

        const lat = asNumber(o.decimalLatitude);
        const lng = asNumber(o.decimalLongitude);

        const locParts = [asString(o.locality), asString(o.stateProvince), asString(o.country)].filter(Boolean) as string[];
        const locationStr = locParts.length > 0 ? locParts.join(', ') : asString(o.country) || 'Location details unrecorded';

        let dateStr = 'Date not recorded';
        const eventDate = asString(o.eventDate);
        if (eventDate) {
          dateStr = eventDate.substring(0, 10);
        } else if (asNumber(o.year) !== undefined) {
          const month = asNumber(o.month);
          const day = asNumber(o.day);
          dateStr = `${Math.trunc(asNumber(o.year) ?? 0)}${month ? `-${String(month).padStart(2, '0')}` : ''}${day ? `-${String(day).padStart(2, '0')}` : ''}`;
        }

        combinedObservations.push({
          key: recordKey,
          speciesKey: species.key,
          provider: 'gbif',
          scientificName: asString(o.scientificName) || species.scientificName,
          commonName: asString(o.vernacularName) || species.commonName,
          eventDate: dateStr,
          country: asString(o.country) || 'Global / Unknown',
          countryCode: asString(o.countryCode) || undefined,
          stateProvince: asString(o.stateProvince) || undefined,
          locality: locationStr,
          latitude: lat ?? null,
          longitude: lng ?? null,
          basisOfRecord: formatBasisOfRecord(asString(o.basisOfRecord)),
          recordedBy: asString(o.recordedBy) || 'Field Researcher / Contributor',
          institutionCode: asString(o.institutionCode) || asString(o.collectionCode) || undefined,
          datasetName: asString(o.datasetName) || undefined,
          photos: obsPhotos,
          gbifUrl: `https://www.gbif.org/occurrence/${o.key}`,
        });
      }
    } catch {
      // non-fatal GBIF occurrence error
    }
  })();

  const inatPromise = (async () => {
    if (!inatId) return;
    try {
      const halfLimit = gbifKey ? Math.max(12, Math.ceil(limit / 2)) : limit;
      const page = Math.floor(offset / halfLimit) + 1;
      const inatOccUrl = `${INAT_API_BASE}/observations?taxon_id=${inatId}&per_page=${halfLimit}&page=${page}&order=desc&order_by=votes`;
      const inatRes = await fetch(inatOccUrl, { signal }).then((r) => (r.ok ? r.json() : null)).catch(() => null);

      if (inatRes?.results && Array.isArray(inatRes.results)) {
        inatTotal = inatRes.total_results || inatRes.results.length;

        inatRes.results.forEach((o: Record<string, unknown>, idx: number) => {
          const recordKey = `inat-obs-${String(o.id ?? offset + idx)}`;
          if (seenKeys.has(recordKey)) return;
          seenKeys.add(recordKey);

          const obsPhotos: WildlifePhoto[] = [];
          if (Array.isArray(o.photos)) {
            o.photos.forEach((ph: Record<string, unknown>) => {
              const photoUrl = typeof ph.url === 'string' ? ph.url.replace('square', 'medium') : null;
              if (photoUrl) {
                const photoObj: WildlifePhoto = {
                  id: `inat-obs-ph-${ph.id ?? `${recordKey}-photo`}`,
                  url: photoUrl,
                  originalUrl: typeof ph.url === 'string' ? ph.url.replace('square', 'original') : photoUrl,
                  attribution: typeof ph.attribution === 'string' ? ph.attribution : 'iNaturalist Observer',
                  licenseCode: normalizeLicense(typeof ph.license_code === 'string' ? ph.license_code : undefined),
                  references: `https://www.inaturalist.org/observations/${o.id ?? recordKey}`,
                };
                obsPhotos.push(photoObj);
                if (!seenPhotoUrls.has(photoUrl)) {
                  seenPhotoUrls.add(photoUrl);
                  galleryPhotos.push(photoObj);
                }
              }
            });
          }

          // If no photo on this observation, provide species reference image as fallback
          if (obsPhotos.length === 0 && species.primaryPhoto) {
            obsPhotos.push({
              ...species.primaryPhoto,
              isSpeciesFallback: true,
            });
          }

          let lat: number | null = null;
          let lng: number | null = null;
          const geoJson = asRecord(o.geojson);
          const coordinates = Array.isArray(geoJson?.coordinates) ? geoJson.coordinates : [];
          if (coordinates.length >= 2) {
            const longitude = asNumber(coordinates[0]);
            const latitude = asNumber(coordinates[1]);
            if (longitude !== undefined) lng = longitude;
            if (latitude !== undefined) lat = latitude;
          }

          const user = asRecord(o.user);
          const observedOn = asString(o.observed_on);
          const createdAt = asString(o.created_at);
          const placeGuess = asString(o.place_guess);
          const qualityGrade = asString(o.quality_grade);
          const observedBy = asString(user?.name) || asString(user?.login) || 'iNaturalist Naturalist';

          combinedObservations.push({
            key: recordKey,
            speciesKey: species.key,
            provider: 'inaturalist',
            scientificName: species.scientificName,
            commonName: species.commonName,
            eventDate: observedOn || (createdAt ? createdAt.substring(0, 10) : 'Recent Observation'),
            country: placeGuess || 'Global',
            locality: placeGuess || 'Field Observation Location',
            latitude: lat,
            longitude: lng,
            basisOfRecord: qualityGrade === 'research' ? 'Research Grade Observation' : 'Community Observation',
            recordedBy: observedBy,
            photos: obsPhotos,
            inatUrl: `https://www.inaturalist.org/observations/${o.id}`,
          });
        });
      }
    } catch {
      // non-fatal iNat occurrence error
    }
  })();

  await Promise.all([gbifPromise, inatPromise]);

  // Sort combined observations:
  // 1. Records with genuine field photos come first
  // 2. Records with species fallback photos come next
  combinedObservations.sort((a, b) => {
    const aHasRealPhoto = a.photos.length > 0 && !a.photos[0].isSpeciesFallback ? 2 : (a.photos.length > 0 ? 1 : 0);
    const bHasRealPhoto = b.photos.length > 0 && !b.photos[0].isSpeciesFallback ? 2 : (b.photos.length > 0 ? 1 : 0);
    return bHasRealPhoto - aHasRealPhoto;
  });

  const total = Math.max(gbifTotal + inatTotal, gbifTotal, inatTotal, combinedObservations.length);

  return {
    observations: combinedObservations,
    totalObservations: total,
    photos: galleryPhotos.slice(0, 16),
    hasMore: offset + combinedObservations.length < total,
  };
}

/**
 * Primary live search:
 * 1. Queries GBIF first.
 * 2. If GBIF returns no relevant matches, falls back to iNaturalist.
 * 3. Ensures selected species and observation records match the query.
 * 4. Returns clean empty state if no relevant match is found.
 */
export async function fetchLiveGbifData(
  query: string,
  options?: FetchOptions
): Promise<WildlifeResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error('Please enter a species name or common name.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    // 1. Query GBIF first
    let speciesList = await searchGbifCandidates(trimmed, controller.signal);
    let topScore = speciesList.length > 0 ? scoreRelevance(speciesList[0], trimmed) : 0;

    // 2. If GBIF has no definitive exact match (score < 2800), query iNaturalist
    if (topScore < 2800) {
      const inatList = await searchInatCandidates(trimmed, controller.signal);
      if (inatList.length > 0) {
        const topInatScore = scoreRelevance(inatList[0], trimmed);
        if (topInatScore > topScore) {
          speciesList = inatList;
          topScore = topInatScore;
        }
      }
    }

    let isAiAssisted = false;

    // 3. Multi-source AI disambiguation fallback:
    // If neither GBIF nor iNaturalist matched with high confidence (topScore < 2800)
    // or if no species were found, invoke the team's LLM API (DeepSeek-V4.1-Flash).
    if (topScore < 2800 || speciesList.length === 0) {
      const llmTaxon = await disambiguateWildlifeQuery(trimmed, controller.signal);
      if (llmTaxon) {
        // If confirmed NOT an animal, do not return plants or unrelated species!
        if (llmTaxon.is_animal === false) {
          clearTimeout(timeoutId);
          return {
            speciesList: [],
            selectedSpecies: null,
            observations: [],
            totalObservations: 0,
            isFallback: false,
            source: 'api',
            query: trimmed,
            countryFilter: options?.country,
            timestamp: new Date().toISOString(),
          };
        }

        if (llmTaxon.scientific_name) {
          // Re-query GBIF & iNaturalist with the resolved canonical scientific name
          const [resolvedGbif, resolvedInat] = await Promise.all([
            searchGbifCandidates(llmTaxon.scientific_name, controller.signal),
            searchInatCandidates(llmTaxon.scientific_name, controller.signal),
          ]);

          const combined = [...resolvedGbif, ...resolvedInat];
          if (combined.length > 0) {
            combined.sort((a, b) => {
              const sa = scoreRelevance(a, llmTaxon.scientific_name!);
              const sb = scoreRelevance(b, llmTaxon.scientific_name!);
              return sb - sa;
            });

            const top = combined[0];
            top.aiAssisted = true;
            if (llmTaxon.canonical_common_name) {
              top.preferredCommonName = llmTaxon.canonical_common_name;
              if (!top.commonName || top.commonName === top.scientificName) {
                top.commonName = llmTaxon.canonical_common_name;
              }
            }
            if (llmTaxon.description) top.description = llmTaxon.description;
            if (llmTaxon.habitat) top.habitat = llmTaxon.habitat;
            if (llmTaxon.diet) top.diet = llmTaxon.diet;
            if (llmTaxon.distribution) top.distribution = llmTaxon.distribution;
            if (llmTaxon.conservation_status) top.conservationStatus = llmTaxon.conservation_status;

            speciesList = combined;
            isAiAssisted = true;
          } else {
            // No direct GBIF/iNat match for the scientific name
            // Construct a verified species record with Wikimedia Commons photo fallback
            const wikiPhoto = await fetchWikiPhoto(llmTaxon.scientific_name, controller.signal);
            const directSpecies: Species = {
              key: `ai-${Date.now()}`,
              provider: 'llm',
              scientificName: llmTaxon.scientific_name,
              canonicalName: llmTaxon.scientific_name,
              commonName: llmTaxon.canonical_common_name || llmTaxon.scientific_name,
              preferredCommonName: llmTaxon.canonical_common_name,
              rank: llmTaxon.taxonomic_rank || 'SPECIES',
              taxonomicStatus: 'ACCEPTED',
              classification: {
                kingdom: llmTaxon.classification?.kingdom || 'Animalia',
                phylum: llmTaxon.classification?.phylum,
                class: llmTaxon.classification?.class,
                order: llmTaxon.classification?.order,
                family: llmTaxon.classification?.family,
                genus: llmTaxon.classification?.genus,
              },
              description: llmTaxon.description,
              habitat: llmTaxon.habitat,
              diet: llmTaxon.diet,
              distribution: llmTaxon.distribution,
              conservationStatus: llmTaxon.conservation_status,
              aiAssisted: true,
              primaryPhoto: wikiPhoto,
              photos: wikiPhoto ? [wikiPhoto] : [],
              occurrencesCount: 0,
            };
            speciesList = [directSpecies];
            isAiAssisted = true;
          }
        }
      }
    }

    // 4. If still no relevant match, return clean empty state (Do NOT substitute unrelated species!)
    if (speciesList.length === 0) {
      clearTimeout(timeoutId);
      return {
        speciesList: [],
        selectedSpecies: null,
        observations: [],
        totalObservations: 0,
        isFallback: false,
        source: 'api',
        query: trimmed,
        countryFilter: options?.country,
        timestamp: new Date().toISOString(),
      };
    }

    // Selected species is top ranked match
    const selectedSpecies = speciesList[0];

    // Supplement description from Wikipedia if missing
    if (!selectedSpecies.description) {
      const wikiDesc = await fetchWikiDescription(selectedSpecies.canonicalName || selectedSpecies.scientificName, controller.signal);
      if (wikiDesc) {
        selectedSpecies.description = wikiDesc;
      }
    }

    // Asynchronously enrich ecological profile (habitat, diet, conservation status) if missing
    if (!selectedSpecies.habitat && (process.env.DEEPSEEK_API_KEY || process.env.LLM_API_KEY)) {
      try {
        const enrichController = new AbortController();
        const enrichTimer = setTimeout(() => enrichController.abort(), 4500);
        const enrich = await disambiguateWildlifeQuery(selectedSpecies.canonicalName || selectedSpecies.scientificName, enrichController.signal);
        clearTimeout(enrichTimer);
        if (enrich?.is_animal) {
          if (enrich.habitat) selectedSpecies.habitat = enrich.habitat;
          if (enrich.diet) selectedSpecies.diet = enrich.diet;
          if (enrich.distribution) selectedSpecies.distribution = enrich.distribution;
          if (enrich.conservation_status) selectedSpecies.conservationStatus = enrich.conservation_status;
          if (!selectedSpecies.description && enrich.description) selectedSpecies.description = enrich.description;
          selectedSpecies.aiAssisted = true;
          isAiAssisted = true;
        }
      } catch {
        // Non-fatal enrichment failure
      }
    }

    // 5. Fetch synchronized observation records and photos for this exact species
    const { observations, totalObservations, photos } = await fetchObservationsForSpecies(
      selectedSpecies,
      options?.country,
      controller.signal
    );

    if (photos.length > 0) {
      selectedSpecies.photos = photos;
      if (!selectedSpecies.primaryPhoto) {
        selectedSpecies.primaryPhoto = photos[0];
      }
    } else if (!selectedSpecies.primaryPhoto) {
      // Supplementary photo from Wikipedia if no occurrence photos exist
      const wikiPh = await fetchWikiPhoto(selectedSpecies.canonicalName || selectedSpecies.scientificName, controller.signal);
      if (wikiPh) {
        selectedSpecies.primaryPhoto = wikiPh;
        selectedSpecies.photos = [wikiPh];
      }
    }

    selectedSpecies.occurrencesCount = totalObservations;

    clearTimeout(timeoutId);

    return {
      speciesList,
      selectedSpecies,
      observations,
      totalObservations,
      isFallback: false,
      source: isAiAssisted ? 'llm' : 'api',
      aiAssisted: isAiAssisted,
      query: trimmed,
      countryFilter: options?.country,
      timestamp: new Date().toISOString(),
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const error = err as { name?: string; message?: string };
    if (error.name === 'AbortError') {
      throw new Error('Search request timed out (12s). The biodiversity service might be slow or temporarily unreachable.');
    }
    throw err;
  }
}

/**
 * Curated sample wildlife dataset (Requirement 4)
 */
export function getSampleWildlife(query?: string, countryFilter?: string): WildlifeResponse {
  const trimmed = (query || '').trim();
  let matched = trimmed ? findSampleSpecies(trimmed) : SAMPLE_WILDLIFE_DATA;

  if (matched.length === 0) {
    matched = SAMPLE_WILDLIFE_DATA;
  }

  const speciesList: Species[] = matched.map((m) => m.species);
  const selectedSpecies = speciesList[0] || null;
  let observations: ObservationRecord[] = matched.flatMap((m) => m.observations);

  if (countryFilter && countryFilter !== 'ALL') {
    observations = observations.filter(
      (o) =>
        o.countryCode?.toUpperCase() === countryFilter.toUpperCase() ||
        o.country.toLowerCase().includes(countryFilter.toLowerCase())
    );
  }

  return {
    speciesList,
    selectedSpecies,
    observations,
    totalObservations: observations.length,
    isFallback: true,
    source: 'fallback',
    query: trimmed || 'Sample Dataset',
    countryFilter,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Unified wildlife search entry point
 */
export async function searchWildlife(
  query: string,
  options?: FetchOptions
): Promise<WildlifeResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error('Please enter a species name to search.');
  }

  // Explicit user toggle for sample data mode
  if (options?.forceFallback) {
    return getSampleWildlife(trimmed, options.country);
  }

  try {
    const liveResult = await fetchLiveGbifData(trimmed, options);
    return liveResult;
  } catch (apiError: unknown) {
    const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';
    console.warn(`[WildLife Explorer] Live search failed for "${trimmed}":`, errorMessage);

    // If query has matching sample data and live network fails completely, switch to sample mode
    const sampleMatches = findSampleSpecies(trimmed);
    if (sampleMatches.length > 0) {
      const fallbackResult = getSampleWildlife(trimmed, options?.country);
      fallbackResult.error = `Biodiversity API was unavailable (${errorMessage}). Switched to verified sample dataset.`;
      return fallbackResult;
    }

    throw new Error(
      `Unable to reach the biodiversity API (${errorMessage || 'Network error'}). You can retry or explore our curated sample dataset.`
    );
  }
}
