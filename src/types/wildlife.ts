export interface WildlifePhoto {
  id: number | string;
  url: string;
  originalUrl?: string;
  mediumUrl?: string;
  attribution: string;
  licenseCode?: string | null;
}

export interface Species {
  id: number | string;
  scientificName: string;
  commonName: string;
  rank: string;
  iconicTaxonName: string;
  wikipediaSummary?: string;
  conservationStatus?: string;
  primaryPhoto?: WildlifePhoto | null;
  photos: WildlifePhoto[];
  observationsCount?: number;
}

export interface ObservationRecord {
  id: number | string;
  speciesName: string;
  commonName?: string;
  observedOn: string;
  placeGuess: string;
  latitude: number | null;
  longitude: number | null;
  observerName: string;
  qualityGrade: 'research' | 'needs_id' | 'casual' | string;
  photos: WildlifePhoto[];
  inatUrl?: string;
}

export interface WildlifeResponse {
  speciesList: Species[];
  selectedSpecies: Species | null;
  observations: ObservationRecord[];
  totalObservations: number;
  isFallback: boolean;
  source: 'api' | 'fallback';
  query: string;
  timestamp: string;
  error?: string;
}

export type IconicTaxon = 
  | 'All' 
  | 'Mammalia' 
  | 'Aves' 
  | 'Reptilia' 
  | 'Amphibia' 
  | 'Actinopterygii' 
  | 'Insecta' 
  | 'Plantae';
