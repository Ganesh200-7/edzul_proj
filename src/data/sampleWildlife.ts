import { Species, ObservationRecord } from '../types/wildlife';

export interface SampleSpeciesEntry {
  species: Species;
  observations: ObservationRecord[];
}

export const SAMPLE_WILDLIFE_DATA: SampleSpeciesEntry[] = [
  {
    species: {
      key: 2440965,
      provider: 'fallback',
      scientificName: 'Odocoileus virginianus (Zimmermann, 1780)',
      canonicalName: 'Odocoileus virginianus',
      commonName: 'White-tailed Deer',
      rank: 'SPECIES',
      taxonomicStatus: 'ACCEPTED',
      classification: {
        kingdom: 'Animalia',
        phylum: 'Chordata',
        class: 'Mammalia',
        order: 'Artiodactyla',
        family: 'Cervidae',
        genus: 'Odocoileus',
      },
      description:
        'The white-tailed deer (Odocoileus virginianus), also known as the whitetail, is a medium-sized deer native to North America, Central America, and South America. Distinctive for the white underside to its tail, which it displays as an alarm signal when alarmed.',
      primaryPhoto: {
        id: 'sample-photo-deer-1',
        url: '/images/wildlife/white-tailed-deer.jpg',
        originalUrl: '/images/wildlife/white-tailed-deer.jpg',
        attribution: 'Charles J. Sharp / Wikimedia Commons (CC BY-SA 4.0)',
        licenseCode: 'CC BY-SA 4.0',
        references: 'https://commons.wikimedia.org/wiki/File:White-tailed_deer_(Odocoileus_virginianus_goudotii)_male_head_Chingaza.jpg',
      },
      photos: [
        {
          id: 'sample-photo-deer-1',
          url: '/images/wildlife/white-tailed-deer.jpg',
          originalUrl: '/images/wildlife/white-tailed-deer.jpg',
          attribution: 'Charles J. Sharp / Wikimedia Commons (CC BY-SA 4.0)',
          licenseCode: 'CC BY-SA 4.0',
          references: 'https://commons.wikimedia.org/wiki/File:White-tailed_deer_(Odocoileus_virginianus_goudotii)_male_head_Chingaza.jpg',
        },
        {
          id: 'sample-photo-deer-2',
          url: '/images/wildlife/white-tailed-deer.jpg',
          attribution: 'Charles J. Sharp / Wikimedia Commons (CC BY-SA 4.0)',
          licenseCode: 'CC BY-SA 4.0',
          references: 'https://commons.wikimedia.org/wiki/File:White-tailed_deer_(Odocoileus_virginianus_goudotii)_male_head_Chingaza.jpg',
        },
      ],
      occurrencesCount: 142850,
      gbifUrl: 'https://www.gbif.org/species/2440965',
    },
    observations: [
      {
        key: 'obs-deer-1',
        speciesKey: 2440965,
        provider: 'fallback',
        scientificName: 'Odocoileus virginianus (Zimmermann, 1780)',
        commonName: 'White-tailed Deer',
        eventDate: '2026-01-12',
        country: 'United States',
        countryCode: 'US',
        locality: 'Shenandoah National Park, Virginia',
        latitude: 38.4755,
        longitude: -78.4535,
        basisOfRecord: 'Human Observation',
        recordedBy: 'Appalachian Field Biology Survey',
        photos: [
          {
            id: 'obs-ph-deer-1',
            url: '/images/wildlife/white-tailed-deer.jpg',
            attribution: 'Charles J. Sharp / Wikimedia Commons (CC BY-SA 4.0)',
            licenseCode: 'CC BY-SA 4.0',
            references: 'https://commons.wikimedia.org/wiki/File:White-tailed_deer_(Odocoileus_virginianus_goudotii)_male_head_Chingaza.jpg',
          },
        ],
        gbifUrl: 'https://www.gbif.org/species/2440965',
      },
      {
        key: 'obs-deer-2',
        speciesKey: 2440965,
        provider: 'fallback',
        scientificName: 'Odocoileus virginianus (Zimmermann, 1780)',
        commonName: 'White-tailed Deer',
        eventDate: '2025-11-20',
        country: 'Canada',
        countryCode: 'CA',
        locality: 'Algonquin Provincial Park, Ontario',
        latitude: 45.8372,
        longitude: -78.3795,
        basisOfRecord: 'Human Observation',
        recordedBy: 'Ontario Naturalist Society',
        photos: [],
        gbifUrl: 'https://www.gbif.org/species/2440965',
      },
    ],
  },
  {
    species: {
      key: 2435350,
      provider: 'fallback',
      scientificName: 'Loxodonta africana (Blumenbach, 1797)',
      canonicalName: 'Loxodonta africana',
      commonName: 'African elephant',
      rank: 'SPECIES',
      taxonomicStatus: 'ACCEPTED',
      classification: {
        kingdom: 'Animalia',
        phylum: 'Chordata',
        class: 'Mammalia',
        order: 'Proboscidea',
        family: 'Elephantidae',
        genus: 'Loxodonta',
      },
      description:
        'The African bush elephant (Loxodonta africana) is the largest living terrestrial animal. Characterised by large ears that radiate heat, a long trunk with two opposing finger-like extensions, and curved ivory tusks in both males and females. Found across savannas and bushlands of Sub-Saharan Africa.',
      primaryPhoto: {
        id: 'gbif-photo-elephant-1',
        url: '/images/wildlife/african-elephant.jpg',
        originalUrl: '/images/wildlife/african-elephant.jpg',
        attribution: 'Charles J. Sharp / Wikimedia Commons (CC BY-SA 4.0)',
        licenseCode: 'CC BY-SA 4.0',
        references: 'https://commons.wikimedia.org/wiki/File:Desert_elephant_(Loxodonta_africana)_spraying_sand.jpg',
      },
      photos: [
        {
          id: 'gbif-photo-elephant-1',
          url: '/images/wildlife/african-elephant.jpg',
          originalUrl: '/images/wildlife/african-elephant.jpg',
          attribution: 'Charles J. Sharp / Wikimedia Commons (CC BY-SA 4.0)',
          licenseCode: 'CC BY-SA 4.0',
          references: 'https://commons.wikimedia.org/wiki/File:Desert_elephant_(Loxodonta_africana)_spraying_sand.jpg',
        },
        {
          id: 'gbif-photo-elephant-2',
          url: '/images/wildlife/african-elephant.jpg',
          originalUrl: '/images/wildlife/african-elephant.jpg',
          attribution: 'Charles J. Sharp / Wikimedia Commons (CC BY-SA 4.0)',
          licenseCode: 'CC BY-SA 4.0',
          references: 'https://commons.wikimedia.org/wiki/File:Desert_elephant_(Loxodonta_africana)_spraying_sand.jpg',
        },
        {
          id: 'gbif-photo-elephant-3',
          url: '/images/wildlife/african-elephant.jpg',
          originalUrl: '/images/wildlife/african-elephant.jpg',
          attribution: 'Charles J. Sharp / Wikimedia Commons (CC BY-SA 4.0)',
          licenseCode: 'CC BY-SA 4.0',
          references: 'https://commons.wikimedia.org/wiki/File:Desert_elephant_(Loxodonta_africana)_spraying_sand.jpg',
        },
      ],
      occurrencesCount: 31417,
      gbifUrl: 'https://www.gbif.org/species/2435350',
    },
    observations: [
      {
        key: 5938087563,
        speciesKey: 2435350,
        provider: 'fallback',
        scientificName: 'Loxodonta africana (Blumenbach, 1797)',
        commonName: 'African elephant',
        eventDate: '2026-01-04',
        country: 'South Africa',
        countryCode: 'ZA',
        locality: 'Kruger National Park, Mpumalanga',
        latitude: -24.921259,
        longitude: 31.557271,
        basisOfRecord: 'Human Observation',
        recordedBy: 'Harrison T.',
        photos: [
          {
            id: 'obs-el-1',
            url: '/images/wildlife/african-elephant.jpg',
            attribution: 'Charles J. Sharp / Wikimedia Commons (CC BY-SA 4.0)',
            licenseCode: 'CC BY-SA 4.0',
            references: 'https://commons.wikimedia.org/wiki/File:Desert_elephant_(Loxodonta_africana)_spraying_sand.jpg',
          },
        ],
        gbifUrl: 'https://www.gbif.org/occurrence/5938087563',
      },
      {
        key: 5938102738,
        speciesKey: 2435350,
        provider: 'fallback',
        scientificName: 'Loxodonta africana (Blumenbach, 1797)',
        commonName: 'African elephant',
        eventDate: '2026-01-02',
        country: 'Zimbabwe',
        countryCode: 'ZW',
        locality: 'Hwange National Park, Matabeleland North',
        latitude: -19.14888,
        longitude: 27.249077,
        basisOfRecord: 'Human Observation',
        recordedBy: 'Anthea Pietersen',
        photos: [
          {
            id: 'obs-el-2',
            url: '/images/wildlife/african-elephant.jpg',
            attribution: 'Charles J. Sharp / Wikimedia Commons (CC BY-SA 4.0)',
            licenseCode: 'CC BY-SA 4.0',
            references: 'https://commons.wikimedia.org/wiki/File:Desert_elephant_(Loxodonta_africana)_spraying_sand.jpg',
          },
        ],
        gbifUrl: 'https://www.gbif.org/occurrence/5938102738',
      },
    ],
  },
  {
    species: {
      key: 5219416,
      provider: 'fallback',
      scientificName: 'Panthera tigris (Linnaeus, 1758)',
      canonicalName: 'Panthera tigris',
      commonName: 'Tiger',
      rank: 'SPECIES',
      taxonomicStatus: 'ACCEPTED',
      classification: {
        kingdom: 'Animalia',
        phylum: 'Chordata',
        class: 'Mammalia',
        order: 'Carnivora',
        family: 'Felidae',
        genus: 'Panthera',
      },
      description:
        'The tiger (Panthera tigris) is the largest living cat species and a member of the genus Panthera. It is most recognisable for its dark vertical stripes on orange fur with a white underside. An apex predator, it primarily preys on ungulates such as deer and wild boar across Asian forests.',
      primaryPhoto: {
        id: 'gbif-photo-tiger-1',
        url: '/images/wildlife/tiger.jpg',
        originalUrl: '/images/wildlife/tiger.jpg',
        attribution: 'Charles J. Sharp / Wikimedia Commons (CC BY-SA 4.0)',
        licenseCode: 'CC BY-SA 4.0',
        references: 'https://commons.wikimedia.org/wiki/File:Bengal_tiger_(Panthera_tigris_tigris)_female_3.jpg',
      },
      photos: [
        {
          id: 'gbif-photo-tiger-1',
          url: '/images/wildlife/tiger.jpg',
          attribution: 'Charles J. Sharp / Wikimedia Commons (CC BY-SA 4.0)',
          licenseCode: 'CC BY-SA 4.0',
          references: 'https://commons.wikimedia.org/wiki/File:Bengal_tiger_(Panthera_tigris_tigris)_female_3.jpg',
        },
      ],
      occurrencesCount: 2985,
      gbifUrl: 'https://www.gbif.org/species/5219416',
    },
    observations: [
      {
        key: 5938402756,
        speciesKey: 5219416,
        provider: 'fallback',
        scientificName: 'Panthera tigris tigris (Linnaeus, 1758)',
        commonName: 'Bengal tiger',
        eventDate: '2026-02-14',
        country: 'India',
        countryCode: 'IN',
        locality: 'Ranthambore National Park, Rajasthan',
        latitude: 26.0173,
        longitude: 76.5026,
        basisOfRecord: 'Human Observation',
        recordedBy: 'Arun Wildlife Conservation Trust',
        photos: [
          {
            id: 'obs-tig-1',
            url: '/images/wildlife/tiger.jpg',
            attribution: 'Charles J. Sharp / Wikimedia Commons (CC BY-SA 4.0)',
            licenseCode: 'CC BY-SA 4.0',
            references: 'https://commons.wikimedia.org/wiki/File:Bengal_tiger_(Panthera_tigris_tigris)_female_3.jpg',
          },
        ],
        gbifUrl: 'https://www.gbif.org/occurrence/5938402756',
      },
    ],
  },
  {
    species: {
      key: 5133088,
      provider: 'fallback',
      scientificName: 'Danaus plexippus (Linnaeus, 1758)',
      canonicalName: 'Danaus plexippus',
      commonName: 'Monarch butterfly',
      rank: 'SPECIES',
      taxonomicStatus: 'ACCEPTED',
      classification: {
        kingdom: 'Animalia',
        phylum: 'Arthropoda',
        class: 'Insecta',
        order: 'Lepidoptera',
        family: 'Nymphalidae',
        genus: 'Danaus',
      },
      description:
        'The monarch butterfly (Danaus plexippus) is a milkweed butterfly in the family Nymphalidae. Famous for its incredible multi-generational annual migration covering thousands of miles across North America between Canada, the United States, and overwintering mountain forests of Michoacán, Mexico.',
      primaryPhoto: {
        id: 'gbif-photo-monarch-1',
        url: '/images/wildlife/monarch-butterfly.jpg',
        originalUrl: '/images/wildlife/monarch-butterfly.jpg',
        attribution: 'Thomas Bresson / Wikimedia Commons (CC BY 2.0)',
        licenseCode: 'CC BY 2.0',
        references: 'https://commons.wikimedia.org/wiki/File:Danaus_plexippus_(7).jpg',
      },
      photos: [
        {
          id: 'gbif-photo-monarch-1',
          url: '/images/wildlife/monarch-butterfly.jpg',
          attribution: 'Thomas Bresson / Wikimedia Commons (CC BY 2.0)',
          licenseCode: 'CC BY 2.0',
          references: 'https://commons.wikimedia.org/wiki/File:Danaus_plexippus_(7).jpg',
        },
      ],
      occurrencesCount: 184520,
      gbifUrl: 'https://www.gbif.org/species/5133088',
    },
    observations: [
      {
        key: 5881023941,
        speciesKey: 5133088,
        provider: 'fallback',
        scientificName: 'Danaus plexippus (Linnaeus, 1758)',
        commonName: 'Monarch butterfly',
        eventDate: '2025-10-14',
        country: 'Mexico',
        countryCode: 'MX',
        locality: 'Monarch Butterfly Biosphere Reserve, Michoacán',
        latitude: 19.6012,
        longitude: -100.2885,
        basisOfRecord: 'Human Observation',
        recordedBy: 'Reserva Mariposa Monarca Naturalists',
        photos: [
          {
            id: 'obs-mon-1',
            url: '/images/wildlife/monarch-butterfly.jpg',
            attribution: 'Thomas Bresson / Wikimedia Commons (CC BY 2.0)',
            licenseCode: 'CC BY 2.0',
            references: 'https://commons.wikimedia.org/wiki/File:Danaus_plexippus_(7).jpg',
          },
        ],
        gbifUrl: 'https://www.gbif.org/occurrence/5881023941',
      },
    ],
  },
  {
    species: {
      key: 2440735,
      provider: 'fallback',
      scientificName: 'Balaenoptera musculus (Linnaeus, 1758)',
      canonicalName: 'Balaenoptera musculus',
      commonName: 'Blue whale',
      rank: 'SPECIES',
      taxonomicStatus: 'ACCEPTED',
      classification: {
        kingdom: 'Animalia',
        phylum: 'Chordata',
        class: 'Mammalia',
        order: 'Artiodactyla',
        family: 'Balaenopteridae',
        genus: 'Balaenoptera',
      },
      description:
        'The blue whale (Balaenoptera musculus) is a marine mammal and a baleen whale. Reaching maximum lengths of 29.9 metres and weights up to 199 tonnes, it is the largest animal known ever to have existed on Earth.',
      primaryPhoto: {
        id: 'gbif-photo-whale-1',
        url: '/images/wildlife/blue-whale.jpg',
        originalUrl: '/images/wildlife/blue-whale.jpg',
        attribution: 'NMFS Northeast Fisheries Science Center / NOAA (Public domain)',
        licenseCode: 'Public domain',
        references: 'https://commons.wikimedia.org/wiki/File:Bluewhale877.jpg',
      },
      photos: [
        {
          id: 'gbif-photo-whale-1',
          url: '/images/wildlife/blue-whale.jpg',
          attribution: 'NMFS Northeast Fisheries Science Center / NOAA (Public domain)',
          licenseCode: 'Public domain',
          references: 'https://commons.wikimedia.org/wiki/File:Bluewhale877.jpg',
        },
      ],
      occurrencesCount: 12430,
      gbifUrl: 'https://www.gbif.org/species/2440735',
    },
    observations: [
      {
        key: 5772391024,
        speciesKey: 2440735,
        provider: 'fallback',
        scientificName: 'Balaenoptera musculus (Linnaeus, 1758)',
        commonName: 'Blue whale',
        eventDate: '2025-07-19',
        country: 'Iceland',
        countryCode: 'IS',
        locality: 'Skjálfandi Bay, Húsavík',
        latitude: 66.0829,
        longitude: -17.4382,
        basisOfRecord: 'Human Observation',
        recordedBy: 'North Sailing Whale Research Group',
        photos: [
          {
            id: 'obs-bw-1',
            url: '/images/wildlife/blue-whale.jpg',
            attribution: 'NMFS Northeast Fisheries Science Center / NOAA (Public domain)',
            licenseCode: 'Public domain',
            references: 'https://commons.wikimedia.org/wiki/File:Bluewhale877.jpg',
          },
        ],
        gbifUrl: 'https://www.gbif.org/occurrence/5772391024',
      },
    ],
  },
  {
    species: {
      key: 5218861,
      provider: 'fallback',
      scientificName: 'Ailurus fulgens F.G.Cuvier, 1825',
      canonicalName: 'Ailurus fulgens',
      commonName: 'Red panda',
      rank: 'SPECIES',
      taxonomicStatus: 'ACCEPTED',
      classification: {
        kingdom: 'Animalia',
        phylum: 'Chordata',
        class: 'Mammalia',
        order: 'Carnivora',
        family: 'Ailuridae',
        genus: 'Ailurus',
      },
      description:
        'The red panda (Ailurus fulgens), also known as the lesser panda, is a small mammal native to the eastern Himalayas and southwestern China. It has dense reddish-brown fur with a long, shaggy ringed tail and a waddling gait.',
      primaryPhoto: {
        id: 'gbif-photo-panda-1',
        url: '/images/wildlife/red-panda.jpg',
        originalUrl: '/images/wildlife/red-panda.jpg',
        attribution: 'William Crochot / Wikimedia Commons (CC BY-SA 4.0)',
        licenseCode: 'CC BY-SA 4.0',
        references: 'https://commons.wikimedia.org/wiki/File:Ailurus_fulgens_(Panda_roux)_-_128.jpg',
      },
      photos: [
        {
          id: 'gbif-photo-panda-1',
          url: '/images/wildlife/red-panda.jpg',
          attribution: 'William Crochot / Wikimedia Commons (CC BY-SA 4.0)',
          licenseCode: 'CC BY-SA 4.0',
          references: 'https://commons.wikimedia.org/wiki/File:Ailurus_fulgens_(Panda_roux)_-_128.jpg',
        },
      ],
      occurrencesCount: 4210,
      gbifUrl: 'https://www.gbif.org/species/5218861',
    },
    observations: [
      {
        key: 5661902847,
        speciesKey: 5218861,
        provider: 'fallback',
        scientificName: 'Ailurus fulgens F.G.Cuvier, 1825',
        commonName: 'Red panda',
        eventDate: '2025-05-11',
        country: 'Nepal',
        countryCode: 'NP',
        locality: 'Langtang National Park, Bagmati',
        latitude: 28.2104,
        longitude: 85.5684,
        basisOfRecord: 'Human Observation',
        recordedBy: 'Red Panda Network Field Biologists',
        photos: [
          {
            id: 'obs-rp-1',
            url: '/images/wildlife/red-panda.jpg',
            attribution: 'William Crochot / Wikimedia Commons (CC BY-SA 4.0)',
            licenseCode: 'CC BY-SA 4.0',
            references: 'https://commons.wikimedia.org/wiki/File:Ailurus_fulgens_(Panda_roux)_-_128.jpg',
          },
        ],
        gbifUrl: 'https://www.gbif.org/occurrence/5661902847',
      },
    ],
  },
];

export function findSampleSpecies(query: string): SampleSpeciesEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return SAMPLE_WILDLIFE_DATA;

  return SAMPLE_WILDLIFE_DATA.filter((entry) => {
    const s = entry.species;
    return (
      s.commonName.toLowerCase().includes(q) ||
      s.scientificName.toLowerCase().includes(q) ||
      s.canonicalName.toLowerCase().includes(q) ||
      s.classification.order?.toLowerCase().includes(q) ||
      s.classification.family?.toLowerCase().includes(q) ||
      s.classification.class?.toLowerCase().includes(q)
    );
  });
}
