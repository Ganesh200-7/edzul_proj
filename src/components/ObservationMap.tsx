'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ObservationRecord } from '../types/wildlife';
import { Map, MapPinOff, Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface ObservationMapProps {
  observations: ObservationRecord[];
  speciesName: string;
}

export const ObservationMap: React.FC<ObservationMapProps> = ({ observations, speciesName }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  // Filter observations with valid latitude and longitude
  const geoObservations = observations.filter(
    (obs) =>
      obs.latitude !== null &&
      obs.longitude !== null &&
      !isNaN(obs.latitude) &&
      !isNaN(obs.longitude)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapContainerRef.current) return;

    let isCancelled = false;

    // Dynamically import Leaflet on client
    import('leaflet').then((L) => {
      if (isCancelled || !mapContainerRef.current) return;

      // Clean up previous map if it exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default center: world view or center of first valid observation
      const defaultCenter: [number, number] = geoObservations.length > 0
        ? [geoObservations[0].latitude!, geoObservations[0].longitude!]
        : [20, 0];
      const defaultZoom = geoObservations.length > 0 ? 4 : 2;

      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: true,
        scrollWheelZoom: false,
      });
      mapInstanceRef.current = map;

      // Add OpenStreetMap tile layer (reliable, open, no API key needed)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Custom emerald pin icon
      const customIcon = L.divIcon({
        className: 'custom-wildlife-pin',
        html: `
          <div style="
            background: #059669;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.4);
            border: 2px solid white;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background: white;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });

      const bounds: [number, number][] = [];

      // Add markers
      geoObservations.forEach((obs) => {
        const lat = obs.latitude!;
        const lng = obs.longitude!;
        bounds.push([lat, lng]);

        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; color: #1c1917; max-width: 220px; padding: 2px;">
            <strong style="color: #047857; font-size: 13px;">${obs.commonName || speciesName}</strong>
            <div style="margin-top: 4px; color: #44403c;"><strong>Date:</strong> ${obs.observedOn}</div>
            <div style="color: #44403c;"><strong>Location:</strong> ${obs.placeGuess}</div>
            <div style="color: #44403c;"><strong>Observer:</strong> @${obs.observerName}</div>
            <div style="margin-top: 4px; font-size: 11px; color: #059669;">
              Lat: ${lat.toFixed(3)}, Lng: ${lng.toFixed(3)}
            </div>
            ${
              obs.inatUrl
                ? `<a href="${obs.inatUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 6px; color: #047857; text-decoration: underline; font-weight: 600;">View record &rarr;</a>`
                : ''
            }
          </div>
        `;

        L.marker([lat, lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(popupContent);
      });

      // Fit map to markers bounds if multiple
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
      } else if (bounds.length === 1) {
        map.setView(bounds[0], 6);
      }
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mounted, geoObservations.length, speciesName]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-emerald-400" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Geographic Observation Map
          </h3>
        </div>
        <span className="text-xs text-stone-400 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          {geoObservations.length} mapped {geoObservations.length === 1 ? 'location' : 'locations'}
        </span>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 shadow-xl">
        {geoObservations.length === 0 ? (
          <div className="h-64 sm:h-80 flex flex-col items-center justify-center p-6 text-center text-stone-400">
            <MapPinOff className="w-10 h-10 text-stone-600 mb-2" />
            <p className="text-sm font-medium">No valid geographic coordinates recorded for these sightings.</p>
            <p className="text-xs text-stone-500 mt-1">
              Some observers obscure coordinates to protect sensitive or endangered wildlife habitats.
            </p>
          </div>
        ) : (
          <div
            ref={mapContainerRef}
            className="w-full h-80 sm:h-96 z-0"
            style={{ background: '#1c1917' }}
          />
        )}
      </div>
    </div>
  );
};
