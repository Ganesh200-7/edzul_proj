# WildLife Explorer – Global Species Discovery

An interactive, responsive biodiversity web application built for the **Edzul Project Assignment**. WildLife Explorer enables users to discover species across the globe, view validated scientific taxonomy, explore high-resolution wildlife photography with Creative Commons attribution, inspect citizen-science observation records, and visualize sightings on an interactive geographic map.

---

## 🌿 Project Overview

- **Application Title**: WildLife Explorer
- **Core Purpose**: Connect students, naturalists, and researchers with real-world global biodiversity data.
- **Primary Integration**: **iNaturalist Open API** (`/v1/taxa` and `/v1/observations`)
- **Fallback Architecture**: Curated offline sample dataset providing full functionality when public APIs are unreachable or offline.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Modern server-rendered and client components with Turbopack |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type safety for data models, API payloads, and components |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Nature-inspired color scheme (emerald, teal, stone, amber) |
| **Mapping** | [Leaflet](https://leafletjs.com/) | Interactive OpenStreetMap geovisualization of observation coordinates |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible wildlife and interface icons |
| **Data API** | [iNaturalist REST API](https://api.inaturalist.org/v1/) | Live taxonomy, observation coordinates, and CC-licensed imagery |

---

## ✨ Key Features

1. **Species Search & Validation**
   - Search by common name (e.g., *Bengal Tiger*, *Monarch Butterfly*) or scientific name (*Panthera tigris*, *Danaus plexippus*).
   - Instant client-side validation prevents empty searches.
   - Quick-search suggestion pills for famous wildlife species.

2. **Taxonomy & Species Profile**
   - Displays scientific name in italic serif typography and verified common names.
   - Badges for **Taxonomic Rank** (Species, Subspecies, Genus, Family), **Iconic Class** (Mammalia, Aves, Insecta, etc.), and **IUCN Red List Conservation Status** (Critically Endangered, Endangered, Vulnerable, Least Concern).
   - Encyclopedia overview and recorded observation count.
   - Multi-taxa selector tabs when queries return multiple matching organisms.

3. **Field Imagery & Lightbox Gallery**
   - High-resolution photographs from field sightings.
   - Automatic graceful fallback placeholder if an external image fails to load.
   - Full photo attribution and Creative Commons license badge (e.g., `CC-BY-NC`, `CC-BY-SA`).
   - Clickable lightbox modal for inspecting high-res photography.

4. **Community Observation Records**
   - Detailed sightings records with observation date, observer username (`@handle`), location/place name, and quality status (*Research Grade*, *Needs ID*, *Casual*).
   - Geographic coordinates badge with latitude and longitude.
   - Direct link to view the observation on the iNaturalist platform.
   - In-page observation search filter (by country, location name, or observer).

5. **Geographic Observation Map (Enhancement)**
   - Interactive Leaflet map plotting sightings with valid latitude and longitude.
   - Custom emerald pins with interactive popups displaying species thumbnail, date, location, and observer info.
   - Graceful notification when sightings have obscured coordinates for endangered species protection.

6. **Taxonomic Category Filter (Enhancement)**
   - One-click filters for **Mammals**, **Birds**, **Insects**, **Reptiles**, **Amphibians**, **Fishes**, and **Plants**.

7. **Resilient Loading, Error & Fallback System**
   - Animated shimmer loading skeletons during network requests.
   - Informative error alerts with a **Retry** button if the network is disconnected.
   - **Sample Data Fallback**: When the public API is unavailable, the application can automatically fall back to or manually toggle into a curated offline dataset without crashing.
   - **Clear Sample Data Distinction**: Prominent amber badge and notification banner clearly distinguishing sample records from live API results.
   - **True Empty-Results State**: When an API search genuinely returns zero results, the app displays a helpful empty state with suggestions rather than substituting unrelated sample data.

---

## 📂 Project Architecture

```
wildlife/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── species/
│   │   │       └── route.ts         # Server-side API proxy for iNaturalist queries
│   │   ├── globals.css              # Tailwind CSS styling and theme tokens
│   │   ├── layout.tsx               # Root layout, fonts, and metadata
│   │   └── page.tsx                 # Main application view & state orchestrator
│   ├── components/
│   │   ├── Header.tsx               # App branding & Live/Sample mode toggle
│   │   ├── HeroSection.tsx          # Project intro, search form, validation & filters
│   │   ├── SpeciesCard.tsx          # Taxonomy, scientific name, IUCN status & summary
│   │   ├── ImageGallery.tsx         # Photography grid, CC attribution & lightbox
│   │   ├── ObservationList.tsx      # Observation cards & search filter
│   │   ├── ObservationMap.tsx       # Leaflet interactive geolocation map
│   │   ├── StatusAlerts.tsx         # Loading skeletons, error state & empty state
│   │   └── Footer.tsx               # Assignment info, ethics & API credits
│   ├── data/
│   │   └── sampleWildlife.ts        # Curated offline dataset (Tiger, Panda, Whale, etc.)
│   ├── services/
│   │   └── wildlifeService.ts       # Unified API client & fallback controller
│   └── types/
│       └── wildlife.ts              # TypeScript interfaces for species & observations
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node.js `v24`)
- npm `v9+` or `v11+`

### Installation
Clone or navigate to the project directory:
```bash
cd wildlife
npm install
```

### Development Server
Run the local dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Production Build & Verification
Create an optimized production bundle:
```bash
npm run build
```
Start the production server:
```bash
npm run start
```

---

## 📡 API Integration Details

- **API Used**: [iNaturalist Open REST API v1](https://api.inaturalist.org/v1/)
- **Documentation**: [https://www.inaturalist.org/pages/api+reference](https://www.inaturalist.org/pages/api+reference)
- **Endpoints Utilized**:
  - `GET /v1/taxa?q={query}&per_page=6`: Retrieves matched species, taxonomy ranks, Wikipedia summaries, IUCN conservation status, and default photography.
  - `GET /v1/observations?taxon_id={id}&per_page=12`: Retrieves verified community field sightings, observers, dates, coordinates, and quality grades.
- **Rate Limits & Best Practices**:
  - Requests include standard user-agent and timeout guards (10s `AbortController`).
  - No private API keys or authentication credentials required.
  - Open data respect: all photos display photographer credit and Creative Commons license tags.

---

## 🛡️ Sample Data & Offline Mode

To test offline functionality or when the public API is unavailable:
1. Click the **"Live API (iNaturalist)"** pill in the top header.
2. It toggles into **"Sample Data Mode"** and displays a prominent amber banner.
3. The application loads verified offline records for iconic species (Bengal Tiger, Red Panda, Blue Whale, Monarch Butterfly, Snow Leopard, Peregrine Falcon).
4. You can click **"Switch to Live API"** at any time to return to real-time queries.

---

## 👥 Team Presentation & Component Responsibilities

For the Edzul team evaluation, each team member can present a dedicated aspect of the architecture:

| Member / Role | Core Component / Function | Presentation Focus |
| :--- | :--- | :--- |
| **Presenter 1** (Frontend / UI) | `HeroSection.tsx`, `Header.tsx` | Search input validation, UI/UX design, nature color palette, responsive design across mobile/desktop. |
| **Presenter 2** (API & Services) | `wildlifeService.ts`, `/api/species/route.ts` | iNaturalist API integration, payload sanitization, async error handling, and timeout safeguards. |
| **Presenter 3** (Data & Resilience) | `sampleWildlife.ts`, `StatusAlerts.tsx` | Sample fallback architecture, loading skeletons, error retry, empty search handling, and distinguishing sample data from live data. |
| **Presenter 4** (Visuals & Geolocation) | `ImageGallery.tsx`, `ObservationMap.tsx`, `SpeciesCard.tsx` | Lightbox modal, Creative Commons licensing compliance, Leaflet coordinates mapping, and IUCN status classification. |

---

## 📦 How to Publish to GitHub

If you wish to push this repository to GitHub:
```bash
# 1. Initialize git if not already initialized
git init

# 2. Stage all files
git add .

# 3. Create initial commit
git commit -m "feat: complete WildLife Explorer application with iNaturalist API and sample fallback"

# 4. Link your remote GitHub repository
git branch -M main
git remote add origin https://github.com/<your-username>/wildlife-explorer.git

# 5. Push code
git push -u origin main
```

---

## 📝 Known Limitations
- Obscured Coordinates: For certain threatened or endangered species, citizen scientists and conservation organizations intentionally obscure coordinates to protect wildlife from poaching; in these cases, the map displays regional coordinates or notes that coordinates are obscured.
- Public API Rate Limits: iNaturalist requests are subject to public community rate limits (~60 requests/minute). If rate limits are exceeded, the app gracefully falls back to the curated sample dataset with a retry option.

---

*Developed for the Edzul Project Assignment.*
