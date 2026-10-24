# WildLife Explorer – Global Species Discovery

> **Project Slogan:** *“Exploring today. Conserving tomorrow.”*

**WildLife Explorer** is a modern, responsive web application designed for exploring wildlife species, authentic biodiversity occurrence records, high-resolution photographs, scientific taxonomy, common names, dates, and geographic locations. The application queries live data from the **Global Biodiversity Information Facility (GBIF) Public API** and provides an offline fallback mode for resilient presentations.

**Live deployment:** [WildLife Explorer on Vercel](https://edzul-proj-ohnqplitg-gani16.vercel.app)

**Demo video:** [Watch the WildLife Explorer demo on Google Drive](https://drive.google.com/file/d/1Gbmzq2zzGiiDsGjsZ8EOyFDTKFc8TLLB/view?usp=sharing)

---

## 🌿 Project Overview

Understanding Earth's living organisms requires connecting scientific taxonomy with real-world field observations. **WildLife Explorer** allows students, naturalists, and researchers to:
- Search for wildlife species across all animal kingdoms by common name (e.g., *Deer*, *Peacock*, *Tiger*, *Elephant*, *Axolotl*) or scientific name (e.g., *Cervidae*, *Pavo cristatus*, *Panthera tigris*).
- Inspect full taxonomic classifications from Kingdom to Species with verified rank badges.
- Explore verified observation records, including dates, locations, coordinates, observer attributions, and specimen photos.
- Browse authentic wildlife photographs with explicit Creative Commons licensing and fullscreen lightbox zoom.
- Analyze species occurrences using an **Interactive Biodiversity GIS Map** with Satellite and Topographic layers, fullscreen viewing, bounds fitting, and pulsing radar beacon pins.
- Filter observation records by country (e.g., South Africa, India, Thailand, United States, Kenya, Brazil).
- Seamlessly transition between **Live GBIF API** mode and a curated **Offline Sample Dataset** for reliable demonstrations.

---

## ✨ Key Features & Enhancements

1. **Forest-Inspired Premium Design System**:
   - Modern typography powered by **Outfit** (headings) and **Plus Jakarta Sans** (clean data hierarchy).
   - Tailored forest-green palette (`#061a12` deep canopy to `#10b981` vibrant emerald).
   - Glassmorphism panels (`.glass-panel-dark`, `.glass-panel-light`) with ambient forest mesh gradients.
   - Subtle **3D card hover effects** (`.card-3d`) that dynamically tilt and elevate on user interaction.
   - Polished buttons with shimmering hover effects (`.btn-premium`) and custom dark/light mode toggle.

2. **Enterprise GIS Biodiversity Map Suite**:
   - **2 Selectable Tile Layers**:
     - 🛰️ **Satellite Imagery**: High-resolution true-color satellite views via Esri World Imagery.
     - ⛰️ **Topographic Terrain**: Contour lines, elevation shading, and trails via Esri World Topo.
   - **Floating GIS HUD Controls**: Layer switcher pills, one-click recenter/fit-to-bounds (`Crosshair`), fullscreen expand/minimize (`Maximize2`/`Minimize2`), and smooth zoom controls.
   - **Animated Radar Beacon Pins**: Custom pulsating beacon rings with basis-of-record color-coding (emerald for live human observations, cyan for preserved museum specimens).
   - **Rich Interactive Popups**: Display specimen thumbnails, observer handles, verified status badges, copyable GPS coordinates, and direct links to official GBIF occurrence records.
   - **Conservation Awareness**: Graceful empty-state explanation when species coordinates are intentionally obscured by conservationists to protect endangered wildlife from poaching.

3. **Intelligent Multi-Source Search & Ranking**:
   - Resolves queries against the **GBIF Backbone Taxonomy** with **iNaturalist Taxa API** fallback.
   - Advanced relevance ranking prioritizes true animal species over botanical names:
     - Searching `"deer"` correctly returns the Cervidae family and true deer species (e.g. *Odocoileus virginianus*) rather than unrelated plants like *Deeringothamnus* (false pawpaw).
     - Searching `"peacock"` returns *Pavo cristatus* rather than the peacock butterfly or plants.
     - Searching `"dolphin"` returns true cetaceans (*Delphinus delphis*, *Tursiops*) rather than moths.
   - Multiple matching taxa selector allows switching between related species, genera, and families with clear rank tags (`[SPECIES]`, `[GENUS]`, `[FAMILY]`).

4. **Dedicated Species Profile**:
   - 6-level taxonomic classification grid (Kingdom, Phylum, Class, Order, Family, Genus).
   - Verified encyclopedia natural history descriptions from GBIF checklist datasets.
   - Total recorded occurrences count badge and direct link to official GBIF taxon profiles.

5. **Wildlife Photography Gallery**:
   - Featured high-resolution specimen photograph with interactive thumbnail carousel.
   - Fullscreen lightbox modal with keyboard dismissal (`Escape`).
   - Strict open-science attribution overlay detailing photographer name, date, and Creative Commons license.

6. **Observation & Occurrence Records Suite**:
   - Retrieved dynamically from the GBIF Occurrence API.
   - Interactive category filter pills: *All Records*, *With Photos*, *GPS Located*, and *Human Observations*.
   - Client-side pagination (*“Load More”*) and quick locality search.
   - Observation detail drawer for deep inspection of individual specimen collection events.

7. **Country Filter (Bonus Feature)**:
   - Filter dropdown supporting major biodiversity countries (e.g., South Africa, India, Thailand, Kenya, Zimbabwe, Botswana, United States, Brazil) as well as *All Countries*.
   - Injects the `country={code}` parameter directly into GBIF Occurrence API queries.

8. **Resilience & Polished UI States**:
   - **Loading State**: Animated skeleton cards with specific progress messaging (*“Searching species & loading observation records from GBIF...”*).
   - **Error State**: Friendly error prompt with a *Retry* button and a one-click option to switch to the curated sample dataset.
   - **Empty State**: Friendly card when no species match, with quick search suggestion pills.
   - **Offline Sample Mode**: Prominent amber banner indicating that verified sample data is active, with a one-click button to resume live API queries.

9. **About Project Modal**:
   - Accessible via the **About Project** navigation link in the header and footer, highlighting the project mission, GBIF and iNaturalist API endpoints, tech stack, and conservation slogan.

---

## 🛠️ Technologies Used

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **Next.js 16 (App Router)** | Server and client component architecture, dynamic routing |
| **Language** | **TypeScript 5** | Strict type safety for GBIF data models and components |
| **Styling** | **Tailwind CSS v4** | Forest-themed responsive styling, custom CSS tokens & 3D animations |
| **Typography** | **Outfit & Plus Jakarta Sans** | Modern geometric display headings & ergonomic data readability |
| **Icons** | **Lucide React** | Clean, accessible iconography |
| **GIS Mapping** | **Leaflet & Esri Tiles** | Interactive observation mapping with satellite imagery and topographic layers |
| **AI LLM Engine** | **DeepSeek-V4.1-Flash** | Zoological taxonomy disambiguation, regional animal parsing & ecological traits |
| **Biodiversity Data** | **GBIF & iNaturalist Public APIs**| Live species taxonomy, vernacular names, and occurrence data |
| **Deployment** | **Vercel** | Edge-ready serverless deployment |

---

## 🌐 API Endpoints Used

The application communicates with public endpoints provided by the **Global Biodiversity Information Facility (GBIF)**, **iNaturalist**, and the team's **DeepSeek LLM**:

1. **GBIF Species Match**: `GET https://api.gbif.org/v1/species/match?name={query}&strict=false&verbose=true`
2. **GBIF Species Suggest**: `GET https://api.gbif.org/v1/species/suggest?q={query}&limit=10`
3. **GBIF Species Search**: `GET https://api.gbif.org/v1/species/search?q={query}&limit=10`
4. **GBIF Species Detail**: `GET https://api.gbif.org/v1/species/{key}`
5. **GBIF Vernacular Names**: `GET https://api.gbif.org/v1/species/{key}/vernacularNames?limit=25`
6. **GBIF Descriptions**: `GET https://api.gbif.org/v1/species/{key}/descriptions?limit=5`
7. **GBIF Occurrence Search**: `GET https://api.gbif.org/v1/occurrence/search?taxonKey={key}&limit=24&country={code}`
8. **GBIF Occurrence Media**: `GET https://api.gbif.org/v1/occurrence/search?taxonKey={key}&mediaType=StillImage&limit=12`
9. **iNaturalist Taxa Fallback**: `GET https://api.inaturalist.org/v1/taxa?q={query}&is_active=true`
10. **Team DeepSeek LLM**: `POST https://api.deepseek.com/chat/completions` (model: `deepseek-flash`)
11. **Wikimedia Commons**: `GET https://en.wikipedia.org/api/rest_v1/page/summary/{title}` (Creative Commons verified imagery)

---

## 📁 Cleaned & Audited Project Structure

```text
wildlife/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── occurrences/
│   │   │   │   └── route.ts          # Server API proxy for paginated GBIF occurrences
│   │   │   └── species/
│   │   │       └── route.ts          # Server API proxy for GBIF & iNaturalist multi-source search
│   │   ├── globals.css               # Design tokens, Google fonts, glassmorphism & 3D animations
│   │   ├── layout.tsx                # Root layout with metadata and fonts
│   │   └── page.tsx                  # Main interactive application page
│   ├── components/
│   │   ├── Header.tsx                # Brand logo, nav links, live/sample toggle & theme switch
│   │   ├── HeroSection.tsx           # Hero banner, search bar, validation & feature highlights
│   │   ├── SpeciesCard.tsx           # Species details, classification badges & matching candidate tabs
│   │   ├── ImageGallery.tsx          # Featured photograph, thumbnails, lightbox modal & attribution
│   │   ├── CountryFilter.tsx         # Country filter dropdown for occurrence queries
│   │   ├── ObservationList.tsx       # Occurrence record cards with filter pills & detail drawer
│   │   ├── ObservationMap.tsx        # GIS map with satellite/topographic layers, fullscreen & radar pins
│   │   ├── StatusAlerts.tsx          # Loading skeletons, error prompt, empty state & fallback banner
│   │   ├── AboutModal.tsx            # Project info modal with slogan and GBIF endpoint list
│   │   └── Footer.tsx                # Forest-green footer with links, mission & open science badges
│   ├── data/
│   │   └── sampleWildlife.ts         # Curated offline dataset (Elephant, Tiger, Monarch, etc.)
│   ├── services/
│   │   └── wildlifeService.ts        # Client/server API client with error handling & timeout
│   └── types/
│       └── wildlife.ts               # TypeScript interfaces for GBIF species, records & photos
├── public/                           # Static assets (audited & cleaned of unused starter icons)
├── README.md                         # Project documentation
├── package.json                      # Project dependencies & scripts
└── tsconfig.json                     # TypeScript configuration
```

---

## ⚙️ Installation & Local Development

### Prerequisites
- **Node.js** v18.18 or higher (Node 20+ recommended)
- **npm** or **yarn** / **pnpm**

### Step-by-Step Setup

1. **Clone or Navigate to the Repository**:
   ```bash
   cd wildlife
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Start Production Server Locally**:
   ```bash
   npm run start
   ```

---

## ⚠️ API Limitations & Missing-Data Handling

GBIF aggregates hundreds of millions of scientific records from museums, universities, camera traps, and citizen science programs. Real-world biodiversity data includes natural limitations that **WildLife Explorer** handles gracefully:

- **Missing Coordinates**: Certain sensitive or endangered species have their geographic coordinates obscured or omitted by institutions to protect against illegal poaching. Our map skips un-georeferenced records without crashing, and clearly informs the user.
- **Records Without Photographs**: Many occurrence records originate from historic preserved herbarium specimens or acoustic monitors rather than cameras. The UI treats imagery as optional, presenting clean placeholders when photos are unavailable.
- **Basis of Record Distinction**: GBIF records encompass diverse scientific methodologies. Records are clearly badged (*“Human Observation”*, *“Preserved Specimen”*, *“Machine Observation”*) to avoid falsely implying that every record is an in-person recent sighting.
- **Network Rate Limits & Downtime**: If the public GBIF API experiences network latency or rate-limiting, the application triggers an AbortController timeout (10s) and offers an instant transition to the verified offline sample dataset.

---
