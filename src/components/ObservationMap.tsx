'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ObservationRecord } from '../types/wildlife';
import {
  Map as MapIcon,
  MapPinOff,
  Maximize2,
  Minimize2,
  Crosshair,
  Compass,
  Satellite,
  Mountain,
  type LucideIcon,
} from 'lucide-react';
import type { FeatureGroup, Map as LeafletMap, TileLayer } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ObservationMapProps {
  observations: ObservationRecord[];
  speciesName: string;
  isDarkMode?: boolean;
}

type MapLayerType = 'satellite' | 'terrain';

const MAP_LAYERS: {
  id: MapLayerType;
  label: string;
  url: string;
  attribution: string;
  maxZoom: number;
  icon: LucideIcon;
}[] = [
  {
    id: 'satellite',
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics | GBIF',
    maxZoom: 17,
    icon: Satellite,
  },
  {
    id: 'terrain',
    label: 'Terrain',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, HERE, Garmin, Intermap | GBIF',
    maxZoom: 17,
    icon: Mountain,
  },
];

export const ObservationMap: React.FC<ObservationMapProps> = ({
  observations,
  speciesName,
  isDarkMode,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const activeTileLayerRef = useRef<TileLayer | null>(null);
  const markersLayerRef = useRef<FeatureGroup | null>(null);
  const hasMountedRef = useRef(false);
  const activeLayerRef = useRef<MapLayerType>('satellite');
  const layerSwitchSequenceRef = useRef(0);

  const [activeLayer, setActiveLayer] = useState<MapLayerType>('satellite');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter observations with valid GPS coordinates
  const geoObservations = React.useMemo(() => {
    return observations.filter(
      (obs) =>
        obs.latitude !== null &&
        obs.longitude !== null &&
        !isNaN(obs.latitude) &&
        !isNaN(obs.longitude) &&
        obs.latitude >= -90 &&
        obs.latitude <= 90 &&
        obs.longitude >= -180 &&
        obs.longitude <= 180
    );
  }, [observations]);

  useEffect(() => {
    hasMountedRef.current = true;
  }, []);

  // Fit bounds helper
  const fitToObservations = useCallback(() => {
    if (!mapInstanceRef.current || geoObservations.length === 0) return;
    const bounds = geoObservations.map((o) => [o.latitude!, o.longitude!] as [number, number]);
    if (bounds.length > 1) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 10 });
    } else if (bounds.length === 1) {
      mapInstanceRef.current.setView(bounds[0], 7);
    }
  }, [geoObservations]);

  // Switch tile layer seamlessly
  const switchLayer = useCallback(
    (layerId: MapLayerType) => {
      const switchSequence = ++layerSwitchSequenceRef.current;
      activeLayerRef.current = layerId;
      setActiveLayer(layerId);
      const currentMap = mapInstanceRef.current;
      if (!currentMap) return;

      import('leaflet').then((L) => {
        if (
          switchSequence !== layerSwitchSequenceRef.current ||
          mapInstanceRef.current !== currentMap ||
          !currentMap.getPane('tilePane')
        ) {
          return;
        }

        if (activeTileLayerRef.current) {
          currentMap.removeLayer(activeTileLayerRef.current);
        }

        const config = MAP_LAYERS.find((l) => l.id === layerId) || MAP_LAYERS[0];
        const newLayer = L.tileLayer(config.url, {
          attribution: config.attribution,
          maxZoom: config.maxZoom,
          subdomains: 'abcd',
        });
        newLayer.addTo(currentMap);
        activeTileLayerRef.current = newLayer;
      });
    },
    []
  );

  // Initialize or update Leaflet map
  useEffect(() => {
    if (!hasMountedRef.current || !mapContainerRef.current) return;

    let isCancelled = false;

    import('leaflet').then((L) => {
      if (isCancelled || !mapContainerRef.current) return;

      // Clean up previous instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        activeTileLayerRef.current = null;
        markersLayerRef.current = null;
      }

      const defaultCenter: [number, number] =
        geoObservations.length > 0
          ? [geoObservations[0].latitude!, geoObservations[0].longitude!]
          : [20, 0];
      const defaultZoom = geoObservations.length > 0 ? 4 : 2;

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false, // We supply custom styled controls
        scrollWheelZoom: true,
      });
      mapInstanceRef.current = map;

      // Add default tile layer
      const config = MAP_LAYERS.find((l) => l.id === activeLayerRef.current) || MAP_LAYERS[0];
      const tile = L.tileLayer(config.url, {
        attribution: config.attribution,
        maxZoom: config.maxZoom,
        subdomains: 'abcd',
      }).addTo(map);
      activeTileLayerRef.current = tile;

      // Create high-end pulsing radar divIcon
      const createWildlifeMarker = (obs: ObservationRecord) => {
        const isSpecimen = obs.basisOfRecord.toLowerCase().includes('specimen');
        const pinColor = isSpecimen ? '#0284c7' : '#10b981';

        return L.divIcon({
          className: 'custom-wildlife-pin',
          html: `
            <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <div style="position: absolute; inset: 0; border-radius: 50%; background: ${pinColor}; opacity: 0.35;" class="radar-ping"></div>
              <div style="
                position: relative;
                width: 24px;
                height: 24px;
                background: linear-gradient(135deg, ${pinColor}, #047857);
                border: 2.5px solid #ffffff;
                border-radius: 50%;
                box-shadow: 0 4px 14px rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
              ">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -18],
        });
      };

      const markersGroup = L.featureGroup();
      markersLayerRef.current = markersGroup;

      geoObservations.forEach((obs) => {
        const lat = obs.latitude!;
        const lng = obs.longitude!;
        const marker = L.marker([lat, lng], { icon: createWildlifeMarker(obs) });

        const firstPhoto = obs.photos?.[0]?.url;
        const photoHtml = firstPhoto
          ? `<div style="height: 120px; width: 100%; overflow: hidden; position: relative;">
               <img src="${firstPhoto}" alt="${obs.commonName || speciesName}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.style.display='none'"/>
               <div style="position: absolute; bottom: 6px; right: 8px; font-size: 10px; background: rgba(0,0,0,0.7); color: #a7f3d0; padding: 2px 6px; border-radius: 6px; backdrop-filter: blur(4px);">Verified Photo</div>
             </div>`
          : '';

        const popupHtml = `
          <div style="font-family: inherit; width: 260px; text-align: left;">
            ${photoHtml}
            <div style="padding: 12px 14px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
                <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #34d399; background: rgba(16,185,129,0.18); padding: 2px 6px; border-radius: 6px;">
                  ${obs.basisOfRecord}
                </span>
                <span style="font-size: 11px; color: #a7f3d0; font-mono;">${obs.eventDate}</span>
              </div>
              <h4 style="font-size: 14px; font-weight: 800; color: #ffffff; margin: 0 0 2px 0; line-height: 1.2;">
                ${obs.commonName || speciesName}
              </h4>
              <p style="font-size: 11px; font-style: italic; color: #6ee7b7; margin: 0 0 8px 0; font-family: serif;">
                ${obs.scientificName}
              </p>
              <div style="font-size: 11px; color: #e2e8f0; margin-bottom: 4px;">
                <strong>Location:</strong> ${obs.locality || obs.stateProvince || obs.country}
              </div>
              <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 8px;">
                <strong>Observer:</strong> ${obs.recordedBy || 'Research Contributor'}
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 6px;">
                <span style="font-family: monospace; font-size: 11px; color: #34d399;">
                  ${lat.toFixed(3)}°, ${lng.toFixed(3)}°
                </span>
                ${
                  obs.gbifUrl
                    ? `<a href="${obs.gbifUrl}" target="_blank" rel="noopener noreferrer" style="color: #6ee7b7; font-size: 11px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 3px;">
                        GBIF Record &rarr;
                       </a>`
                    : ''
                }
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml);
        markersGroup.addLayer(marker);
      });

      markersGroup.addTo(map);

      // Fit bounds
      if (geoObservations.length > 1) {
        map.fitBounds(markersGroup.getBounds(), { padding: [60, 60], maxZoom: 10 });
      } else if (geoObservations.length === 1) {
        map.setView([geoObservations[0].latitude!, geoObservations[0].longitude!], 6);
      }
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        activeTileLayerRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, [geoObservations, speciesName]);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        fitToObservations();
      }
    }, 200);
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <div
      ref={mapWrapperRef}
      className={`space-y-3 transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 p-4 sm:p-6 bg-stone-950/95 backdrop-blur-xl flex flex-col'
          : 'relative'
      }`}
    >
      {/* Top Header & GIS Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
            <MapIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-stone-900 dark:text-white flex items-center gap-2">
              <span>Geographic Distribution &amp; Field Coordinates</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                Interactive GIS
              </span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Live spatial occurrence mapping powered by verified citizen science &amp; museum specimens
            </p>
          </div>
        </div>

        {/* Right Status Chips */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{geoObservations.length} verified coordinates</span>
          </span>

          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-md flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Exit Fullscreen</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Map Box */}
      <div
        className={`relative rounded-3xl overflow-hidden border shadow-2xl transition-all duration-300 ${
          isFullscreen ? 'flex-1 w-full min-h-0' : 'h-[440px] sm:h-[520px]'
        } ${
          isDarkMode
            ? 'border-emerald-500/20 bg-stone-950 shadow-emerald-950/20'
            : 'border-emerald-200 bg-stone-100 shadow-stone-300/40'
        }`}
      >
        {geoObservations.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-stone-900/50 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
              <MapPinOff className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-stone-200">
              Geographic Coordinates Obscured or Unavailable
            </h4>
            <p className="text-xs text-stone-400 mt-1 max-w-md leading-relaxed">
              For vulnerable or endangered wildlife, precise geographic GPS coordinates are often
              deliberately generalized by conservation agencies (such as GBIF and iNaturalist) to
              safeguard natural populations from illegal poaching and disturbance.
            </p>
          </div>
        ) : (
          <>
            {/* The Actual Leaflet Map Canvas */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Floating Map Control Bar (Top Left): Multi-layer Switcher */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 p-1.5 rounded-2xl bg-stone-950/85 backdrop-blur-md border border-emerald-500/30 shadow-xl">
              {MAP_LAYERS.map((layer) => {
                const IconComponent = layer.icon;
                const isActive = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => switchLayer(layer.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-950/50'
                        : 'text-stone-300 hover:text-white hover:bg-white/10'
                    }`}
                    title={`Switch to ${layer.label} layer`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{layer.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Floating Navigation Controls (Top Right): Fullscreen & Recenter */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={toggleFullscreen}
                className="w-9 h-9 rounded-xl bg-stone-950/85 hover:bg-stone-900 backdrop-blur-md border border-emerald-500/30 text-emerald-300 hover:text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen Map'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={fitToObservations}
                className="w-9 h-9 rounded-xl bg-stone-950/85 hover:bg-stone-900 backdrop-blur-md border border-emerald-500/30 text-emerald-300 hover:text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
                title="Fit to All Species Points"
              >
                <Crosshair className="w-4 h-4" />
              </button>

              {/* Custom Zoom Buttons */}
              <div className="flex flex-col rounded-xl overflow-hidden border border-emerald-500/30 bg-stone-950/85 backdrop-blur-md shadow-lg">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="w-9 h-9 text-emerald-300 hover:text-white hover:bg-white/10 flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  +
                </button>
                <div className="h-[1px] bg-emerald-500/20" />
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="w-9 h-9 text-emerald-300 hover:text-white hover:bg-white/10 flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  &minus;
                </button>
              </div>
            </div>

            {/* Bottom Floating Legend Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none flex flex-wrap items-center justify-between gap-2">
              <div className="pointer-events-auto flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-stone-950/85 backdrop-blur-md border border-emerald-500/30 text-[11px] text-stone-200 shadow-xl">
                <span className="font-semibold text-emerald-400">Map Legend:</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50" />
                  <span>Field Observation</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block shadow-sm shadow-sky-500/50" />
                  <span>Museum Specimen</span>
                </span>
              </div>

              <div className="pointer-events-auto hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-stone-950/85 backdrop-blur-md border border-emerald-500/30 text-[11px] text-emerald-300 shadow-xl">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Click any beacon to view observer records and field photos</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
