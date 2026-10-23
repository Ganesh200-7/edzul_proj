import { Species, ObservationRecord } from '../types/wildlife';

export interface SampleSpeciesEntry {
  species: Species;
  observations: ObservationRecord[];
}

export const SAMPLE_WILDLIFE_DATA: SampleSpeciesEntry[] = [
  {
    species: {
      id: 41968,
      scientificName: 'Panthera tigris',
      commonName: 'Bengal Tiger',
      rank: 'species',
      iconicTaxonName: 'Mammalia',
      wikipediaSummary: 'The tiger (Panthera tigris) is the largest living cat species and a member of the genus Panthera. It is most recognisable for its dark vertical stripes on orange fur with a white underside. An apex predator, it primarily preys on ungulates, such as deer and wild boar.',
      conservationStatus: 'Endangered',
      primaryPhoto: {
        id: 101,
        url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1000&q=80',
        originalUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1600&q=80',
        attribution: 'Photo by Frida Lannerström on Unsplash (CC-BY-SA)',
        licenseCode: 'CC-BY-SA',
      },
      photos: [
        {
          id: 101,
          url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1000&q=80',
          attribution: 'Photo by Frida Lannerström on Unsplash',
          licenseCode: 'CC-BY-SA',
        },
        {
          id: 102,
          url: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=1000&q=80',
          attribution: 'Photo by Mathew Schwartz on Unsplash',
          licenseCode: 'CC-BY-SA',
        },
        {
          id: 103,
          url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
          attribution: 'Photo by David Clode on Unsplash',
          licenseCode: 'CC-BY-SA',
        },
      ],
      observationsCount: 9780,
    },
    observations: [
      {
        id: 'obs-tiger-1',
        speciesName: 'Panthera tigris',
        commonName: 'Bengal Tiger',
        observedOn: '2026-02-14',
        placeGuess: 'Ranthambore National Park, Rajasthan, India',
        latitude: 26.0173,
        longitude: 76.5026,
        observerName: 'arun_wildlife',
        qualityGrade: 'research',
        photos: [
          {
            id: 'ph-t-1',
            url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
            attribution: 'Arun Sharma (CC-BY-NC)',
            licenseCode: 'CC-BY-NC',
          },
        ],
        inatUrl: 'https://www.inaturalist.org/observations/410131085',
      },
      {
        id: 'obs-tiger-2',
        speciesName: 'Panthera tigris',
        commonName: 'Bengal Tiger',
        observedOn: '2025-11-20',
        placeGuess: 'Jim Corbett National Park, Uttarakhand, India',
        latitude: 29.5300,
        longitude: 78.7747,
        observerName: 'deepa_natarajan',
        qualityGrade: 'research',
        photos: [
          {
            id: 'ph-t-2',
            url: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80',
            attribution: 'Deepa Natarajan (CC-BY)',
            licenseCode: 'CC-BY',
          },
        ],
        inatUrl: 'https://www.inaturalist.org/observations/410198618',
      },
      {
        id: 'obs-tiger-3',
        speciesName: 'Panthera tigris',
        commonName: 'Bengal Tiger',
        observedOn: '2025-09-04',
        placeGuess: 'Sundarbans Biosphere Reserve, West Bengal, India',
        latitude: 21.9497,
        longitude: 89.1833,
        observerName: 'subhash_ranger',
        qualityGrade: 'research',
        photos: [
          {
            id: 'ph-t-3',
            url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
            attribution: 'Subhash Ray (CC-BY-SA)',
            licenseCode: 'CC-BY-SA',
          },
        ],
        inatUrl: 'https://www.inaturalist.org/observations/389012345',
      },
    ],
  },
  {
    species: {
      id: 42805,
      scientificName: 'Ailurus fulgens',
      commonName: 'Red Panda',
      rank: 'species',
      iconicTaxonName: 'Mammalia',
      wikipediaSummary: 'The red panda (Ailurus fulgens) is a small mammal native to the eastern Himalayas and southwestern China. It has dense reddish-brown fur with a black belly and legs, white-lined ears, a mostly white muzzle and a ringed tail.',
      conservationStatus: 'Endangered',
      primaryPhoto: {
        id: 201,
        url: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&w=1000&q=80',
        originalUrl: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&w=1600&q=80',
        attribution: 'Photo by Mark Basarab on Unsplash',
        licenseCode: 'CC-BY-SA',
      },
      photos: [
        {
          id: 201,
          url: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&w=1000&q=80',
          attribution: 'Photo by Mark Basarab on Unsplash',
          licenseCode: 'CC-BY-SA',
        },
        {
          id: 202,
          url: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=1000&q=80',
          attribution: 'Photo by Peter Burdon on Unsplash',
          licenseCode: 'CC-BY-SA',
        },
      ],
      observationsCount: 3410,
    },
    observations: [
      {
        id: 'obs-rp-1',
        speciesName: 'Ailurus fulgens',
        commonName: 'Red Panda',
        observedOn: '2026-01-10',
        placeGuess: 'Singalila National Park, West Bengal, India',
        latitude: 27.0500,
        longitude: 88.0800,
        observerName: 'himalayan_explorer',
        qualityGrade: 'research',
        photos: [
          {
            id: 'ph-rp-1',
            url: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&w=800&q=80',
            attribution: 'Tenzing Sherpa (CC-BY-NC)',
            licenseCode: 'CC-BY-NC',
          },
        ],
        inatUrl: 'https://www.inaturalist.org/observations/409823192',
      },
      {
        id: 'obs-rp-2',
        speciesName: 'Ailurus fulgens',
        commonName: 'Red Panda',
        observedOn: '2025-10-18',
        placeGuess: 'Langtang National Park, Bagmati, Nepal',
        latitude: 28.2167,
        longitude: 85.5833,
        observerName: 'kathmandu_eco',
        qualityGrade: 'research',
        photos: [
          {
            id: 'ph-rp-2',
            url: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=800&q=80',
            attribution: 'Pradip Thapa (CC-BY)',
            licenseCode: 'CC-BY',
          },
        ],
        inatUrl: 'https://www.inaturalist.org/observations/398124019',
      },
    ],
  },
  {
    species: {
      id: 41539,
      scientificName: 'Balaenoptera musculus',
      commonName: 'Blue Whale',
      rank: 'species',
      iconicTaxonName: 'Mammalia',
      wikipediaSummary: 'The blue whale (Balaenoptera musculus) is a marine mammal and a baleen whale. Reaching a maximum confirmed length of 29.9 meters (98 ft) and weighing up to 199 tonnes (196 long tons), it is the largest animal known ever to have existed.',
      conservationStatus: 'Endangered',
      primaryPhoto: {
        id: 301,
        url: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1000&q=80',
        originalUrl: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1600&q=80',
        attribution: 'Photo by Gabriel Barathieu on Unsplash',
        licenseCode: 'CC-BY-SA',
      },
      photos: [
        {
          id: 301,
          url: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1000&q=80',
          attribution: 'Photo by Gabriel Barathieu on Unsplash',
          licenseCode: 'CC-BY-SA',
        },
      ],
      observationsCount: 1250,
    },
    observations: [
      {
        id: 'obs-bw-1',
        speciesName: 'Balaenoptera musculus',
        commonName: 'Blue Whale',
        observedOn: '2026-01-29',
        placeGuess: 'Monterey Bay National Marine Sanctuary, California, USA',
        latitude: 36.8000,
        longitude: -121.9000,
        observerName: 'pacific_marine_life',
        qualityGrade: 'research',
        photos: [
          {
            id: 'ph-bw-1',
            url: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=800&q=80',
            attribution: 'Monterey Bay Observers (CC-BY-SA)',
            licenseCode: 'CC-BY-SA',
          },
        ],
        inatUrl: 'https://www.inaturalist.org/observations/410291881',
      },
      {
        id: 'obs-bw-2',
        speciesName: 'Balaenoptera musculus',
        commonName: 'Blue Whale',
        observedOn: '2025-08-14',
        placeGuess: 'Mirissa, Southern Province, Sri Lanka',
        latitude: 5.9483,
        longitude: 80.4578,
        observerName: 'ocean_census_sl',
        qualityGrade: 'research',
        photos: [
          {
            id: 'ph-bw-2',
            url: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=800&q=80',
            attribution: 'Kasun De Silva (CC-BY)',
            licenseCode: 'CC-BY',
          },
        ],
        inatUrl: 'https://www.inaturalist.org/observations/378129045',
      },
    ],
  },
  {
    species: {
      id: 48662,
      scientificName: 'Danaus plexippus',
      commonName: 'Monarch Butterfly',
      rank: 'species',
      iconicTaxonName: 'Insecta',
      wikipediaSummary: 'The monarch butterfly (Danaus plexippus) is a milkweed butterfly in the family Nymphalidae. Other common names, depending on region, include milkweed, common tiger, wanderer, and black-veined brown. It may be the most familiar North American butterfly.',
      conservationStatus: 'Vulnerable',
      primaryPhoto: {
        id: 401,
        url: 'https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?auto=format&fit=crop&w=1000&q=80',
        originalUrl: 'https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?auto=format&fit=crop&w=1600&q=80',
        attribution: 'Photo by Suzanne D. Williams on Unsplash',
        licenseCode: 'CC-BY-SA',
      },
      photos: [
        {
          id: 401,
          url: 'https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?auto=format&fit=crop&w=1000&q=80',
          attribution: 'Photo by Suzanne D. Williams on Unsplash',
          licenseCode: 'CC-BY-SA',
        },
        {
          id: 402,
          url: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=1000&q=80',
          attribution: 'Photo by David Clode on Unsplash',
          licenseCode: 'CC-BY',
        },
      ],
      observationsCount: 154200,
    },
    observations: [
      {
        id: 'obs-monarch-1',
        speciesName: 'Danaus plexippus',
        commonName: 'Monarch Butterfly',
        observedOn: '2026-03-02',
        placeGuess: 'Monarch Butterfly Biosphere Reserve, Michoacán, Mexico',
        latitude: 19.5936,
        longitude: -100.2711,
        observerName: 'mariposa_guard',
        qualityGrade: 'research',
        photos: [
          {
            id: 'ph-mb-1',
            url: 'https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?auto=format&fit=crop&w=800&q=80',
            attribution: 'Carlos Mendez (CC-BY-SA)',
            licenseCode: 'CC-BY-SA',
          },
        ],
        inatUrl: 'https://www.inaturalist.org/observations/410382901',
      },
      {
        id: 'obs-monarch-2',
        speciesName: 'Danaus plexippus',
        commonName: 'Monarch Butterfly',
        observedOn: '2025-07-22',
        placeGuess: 'Point Pelee National Park, Ontario, Canada',
        latitude: 41.9628,
        longitude: -82.5186,
        observerName: 'canadian_nat',
        qualityGrade: 'research',
        photos: [
          {
            id: 'ph-mb-2',
            url: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=800&q=80',
            attribution: 'Emily Watson (CC-BY)',
            licenseCode: 'CC-BY',
          },
        ],
        inatUrl: 'https://www.inaturalist.org/observations/367192834',
      },
    ],
  },
  {
    species: {
      id: 41969,
      scientificName: 'Panthera uncia',
      commonName: 'Snow Leopard',
      rank: 'species',
      iconicTaxonName: 'Mammalia',
      wikipediaSummary: 'The snow leopard (Panthera uncia), also known as the ounce, is a felid in the genus Panthera native to the mountain ranges of Central and South Asia. It is listed as Vulnerable on the IUCN Red List because the global population is estimated to number fewer than 10,000 mature individuals.',
      conservationStatus: 'Vulnerable',
      primaryPhoto: {
        id: 501,
        url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1000&q=80',
        originalUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=80',
        attribution: 'Photo by Zdeněk Macháček on Unsplash',
        licenseCode: 'CC-BY-SA',
      },
      photos: [
        {
          id: 501,
          url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1000&q=80',
          attribution: 'Photo by Zdeněk Macháček on Unsplash',
          licenseCode: 'CC-BY-SA',
        },
      ],
      observationsCount: 840,
    },
    observations: [
      {
        id: 'obs-sl-1',
        speciesName: 'Panthera uncia',
        commonName: 'Snow Leopard',
        observedOn: '2026-02-05',
        placeGuess: 'Hemis National Park, Ladakh, India',
        latitude: 34.0583,
        longitude: 77.5670,
        observerName: 'ladakh_wild_lens',
        qualityGrade: 'research',
        photos: [
          {
            id: 'ph-sl-1',
            url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
            attribution: 'Stanzin Dorje (CC-BY-NC)',
            licenseCode: 'CC-BY-NC',
          },
        ],
        inatUrl: 'https://www.inaturalist.org/observations/410192847',
      },
      {
        id: 'obs-sl-2',
        speciesName: 'Panthera uncia',
        commonName: 'Snow Leopard',
        observedOn: '2025-12-02',
        placeGuess: 'Altai Mountains, Bayan-Ölgii, Mongolia',
        latitude: 48.9667,
        longitude: 89.9667,
        observerName: 'mongol_ranger',
        qualityGrade: 'research',
        photos: [
          {
            id: 'ph-sl-2',
            url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
            attribution: 'Bataar Enkh (CC-BY)',
            licenseCode: 'CC-BY',
          },
        ],
        inatUrl: 'https://www.inaturalist.org/observations/399182374',
      },
    ],
  },
  {
    species: {
      id: 4652,
      scientificName: 'Falco peregrinus',
      commonName: 'Peregrine Falcon',
      rank: 'species',
      iconicTaxonName: 'Aves',
      wikipediaSummary: 'The peregrine falcon (Falco peregrinus) is a cosmopolitan bird of prey in the family Falconidae. A large, crow-sized falcon, it has a blue-grey back, barred white underparts, and a black head. Renowned for its speed, it reaches over 320 km/h (200 mph) during its characteristic high-speed hunting dive.',
      conservationStatus: 'Least Concern',
      primaryPhoto: {
        id: 601,
        url: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=1000&q=80',
        originalUrl: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=1600&q=80',
        attribution: 'Photo by Frank Cone on Unsplash',
        licenseCode: 'CC-BY-SA',
      },
      photos: [
        {
          id: 601,
          url: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=1000&q=80',
          attribution: 'Photo by Frank Cone on Unsplash',
          licenseCode: 'CC-BY-SA',
        },
      ],
      observationsCount: 42100,
    },
    observations: [
      {
        id: 'obs-pf-1',
        speciesName: 'Falco peregrinus',
        commonName: 'Peregrine Falcon',
        observedOn: '2026-03-12',
        placeGuess: 'Big Sur Coast, California, USA',
        latitude: 36.2704,
        longitude: -121.8081,
        observerName: 'california_raptors',
        qualityGrade: 'research',
        photos: [
          {
            id: 'ph-pf-1',
            url: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=800&q=80',
            attribution: 'Rachel Adams (CC-BY)',
            licenseCode: 'CC-BY',
          },
        ],
        inatUrl: 'https://www.inaturalist.org/observations/410492817',
      },
    ],
  },
];

export function findSampleSpecies(query: string): SampleSpeciesEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SAMPLE_WILDLIFE_DATA.filter(
    (item) =>
      item.species.commonName.toLowerCase().includes(q) ||
      item.species.scientificName.toLowerCase().includes(q) ||
      item.species.iconicTaxonName.toLowerCase().includes(q)
  );
}
