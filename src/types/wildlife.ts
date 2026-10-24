export interface WildlifePhoto {
  id: number | string;
  url: string;
  originalUrl?: string;
  mediumUrl?: string;
  attribution: string;
  licenseCode?: string | null;
  references?: string;
  isSpeciesFallback?: boolean;
}

export interface TaxonomicClassification {
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
}

export interface Species {
  key: number | string;
  provider: 'gbif' | 'inaturalist' | 'llm' | 'fallback';
  scientificName: string;
  canonicalName: string;
  commonName: string;
  preferredCommonName?: string;
  matchedTerm?: string;
  vernacularNames?: string[];
  rank: string;
  taxonomicStatus?: string;
  iconicTaxonName?: string;
  gbifTaxonKey?: number;
  inaturalistId?: number;
  classification: TaxonomicClassification;
  description?: string;
  habitat?: string;
  diet?: string;
  distribution?: string;
  conservationStatus?: string;
  aiAssisted?: boolean;
  primaryPhoto?: WildlifePhoto | null;
  photos: WildlifePhoto[];
  occurrencesCount?: number;
  gbifUrl?: string;
  inatUrl?: string;
}

export interface ObservationRecord {
  key: number | string;
  speciesKey?: number | string;
  provider?: 'gbif' | 'inaturalist' | 'llm' | 'fallback';
  scientificName: string;
  commonName?: string;
  eventDate: string;
  country: string;
  countryCode?: string;
  stateProvince?: string;
  locality?: string;
  latitude: number | null;
  longitude: number | null;
  basisOfRecord: string; // e.g. Human Observation, Preserved Specimen, Research Grade
  recordedBy: string;
  institutionCode?: string;
  datasetName?: string;
  photos: WildlifePhoto[];
  gbifUrl?: string;
  inatUrl?: string;
}

export interface WildlifeResponse {
  speciesList: Species[];
  selectedSpecies: Species | null;
  observations: ObservationRecord[];
  totalObservations: number;
  isFallback: boolean;
  source: 'api' | 'fallback' | 'llm';
  aiAssisted?: boolean;
  query: string;
  countryFilter?: string;
  timestamp: string;
  error?: string;
}

export type IconicCategory =
  | 'All'
  | 'Mammalia'
  | 'Aves'
  | 'Reptilia'
  | 'Amphibia'
  | 'Actinopterygii'
  | 'Insecta'
  | 'Plantae';
