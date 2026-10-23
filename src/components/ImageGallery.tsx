'use client';

import React, { useState } from 'react';
import { WildlifePhoto } from '../types/wildlife';
import { Camera, ImageOff, Maximize2, X, ExternalLink, Shield } from 'lucide-react';

interface ImageGalleryProps {
  photos: WildlifePhoto[];
  speciesName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ photos, speciesName }) => {
  const [activePhoto, setActivePhoto] = useState<WildlifePhoto | null>(null);
  const [brokenImageIds, setBrokenImageIds] = useState<Set<number | string>>(new Set());

  const handleImageError = (id: number | string) => {
    setBrokenImageIds((prev) => new Set(prev).add(id));
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="bg-stone-900/60 rounded-2xl border border-dashed border-stone-800 p-8 text-center text-stone-400">
        <ImageOff className="w-10 h-10 mx-auto text-stone-600 mb-2" />
        <p className="text-sm font-medium">No photos currently cataloged for this species.</p>
        <p className="text-xs text-stone-500 mt-1">Community naturalists may submit photos on iNaturalist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-emerald-400" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Wildlife Photography &amp; Field Imagery
          </h3>
        </div>
        <span className="text-xs text-stone-400">
          {photos.length} {photos.length === 1 ? 'image' : 'images'}
        </span>
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, idx) => {
          const isBroken = brokenImageIds.has(photo.id);

          return (
            <div
              key={photo.id || idx}
              className="group relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800/80 shadow-md hover:border-emerald-500/50 hover:shadow-emerald-950/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-900">
                {!isBroken ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.url}
                    alt={`${speciesName} photo by ${photo.attribution}`}
                    loading="lazy"
                    onError={() => handleImageError(photo.id)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => setActivePhoto(photo)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-stone-500 bg-stone-900">
                    <ImageOff className="w-8 h-8 mb-1" />
                    <span className="text-xs">Image unavailable</span>
                  </div>
                )}

                {/* Quick overlay preview button */}
                {!isBroken && (
                  <button
                    onClick={() => setActivePhoto(photo)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-stone-200 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-md"
                    title="View high-resolution"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Attribution and license */}
              <div className="p-3 bg-stone-900/90 text-[11px] text-stone-400 border-t border-stone-800 flex items-center justify-between gap-2">
                <span className="truncate" title={photo.attribution}>
                  {photo.attribution}
                </span>
                {photo.licenseCode && (
                  <span className="shrink-0 px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px] font-mono border border-stone-700">
                    {photo.licenseCode}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-stone-900 rounded-2xl overflow-hidden border border-stone-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-16/10 sm:aspect-16/9 w-full bg-black flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePhoto.originalUrl || activePhoto.url}
                alt={`${speciesName}`}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-stone-200 bg-stone-900">
              <div>
                <p className="text-sm font-semibold text-white">{speciesName}</p>
                <p className="text-xs text-stone-400 mt-0.5">{activePhoto.attribution}</p>
              </div>
              <div className="flex items-center gap-2">
                {activePhoto.licenseCode && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-stone-800 text-emerald-400 border border-stone-700 font-mono">
                    <Shield className="w-3 h-3" />
                    <span>{activePhoto.licenseCode}</span>
                  </span>
                )}
                {activePhoto.originalUrl && (
                  <a
                    href={activePhoto.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                  >
                    <span>Original File</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
