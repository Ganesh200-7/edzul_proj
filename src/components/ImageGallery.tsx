'use client';

import React, { useState, useEffect } from 'react';
import { WildlifePhoto } from '../types/wildlife';
import {
  Camera,
  ImageOff,
  Maximize2,
  X,
  ExternalLink,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ImageGalleryProps {
  photos: WildlifePhoto[];
  speciesName: string;
  isDarkMode?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  photos,
  speciesName,
  isDarkMode,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [activeModalPhoto, setActiveModalPhoto] = useState<WildlifePhoto | null>(null);
  const [brokenImageIds, setBrokenImageIds] = useState<Set<number | string>>(new Set());

  const handleImageError = (id: number | string) => {
    setBrokenImageIds((prev) => new Set(prev).add(id));
  };

  const seenPhotoUrls = new Set<string>();
  const validPhotos = (photos || []).filter((photo) => {
    if (brokenImageIds.has(photo.id) || seenPhotoUrls.has(photo.url)) return false;
    seenPhotoUrls.add(photo.url);
    return true;
  });

  // Handle escape key in modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalPhoto(null);
    };
    if (activeModalPhoto) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalPhoto]);

  if (!photos || photos.length === 0 || validPhotos.length === 0) {
    return (
      <div
        className={`rounded-3xl border border-dashed p-10 text-center transition-all ${
          isDarkMode
            ? 'glass-panel-dark text-stone-400 border-emerald-900/40'
            : 'glass-panel-light text-stone-500 border-emerald-200'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500 mb-3">
          <ImageOff className="w-7 h-7" />
        </div>
        <p className="text-base font-bold text-stone-800 dark:text-stone-200">
          No Licensed Wildlife Imagery Available
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
          No open-license photographic records were cataloged for this specific taxon in the current observation feed.
        </p>
      </div>
    );
  }

  const currentMainPhoto = validPhotos[selectedPhotoIndex] || validPhotos[0];

  const handlePrev = () => {
    setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : validPhotos.length - 1));
  };

  const handleNext = () => {
    setSelectedPhotoIndex((prev) => (prev < validPhotos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-4">
      {/* Gallery Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-stone-900 dark:text-white flex items-center gap-2">
              <span>Wildlife Photography &amp; Field Imagery</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                Verified Species Media
              </span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              High-resolution community field captures and research specimen photographs
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 shadow-sm">
          {validPhotos.length} {validPhotos.length === 1 ? 'Photograph' : 'Photographs'}
        </span>
      </div>

      {/* Main Large Featured Photo + Thumbnails Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Featured Main Image (2 Columns) with 3D Hover & Ambient Glow */}
        <div
          className={`lg:col-span-2 rounded-3xl overflow-hidden border shadow-2xl flex flex-col justify-between card-3d relative group ${
            isDarkMode
              ? 'glass-panel-dark border-emerald-500/20'
              : 'glass-panel-light border-emerald-200/80 shadow-emerald-950/5'
          }`}
        >
          <div className="relative aspect-16/10 sm:aspect-16/9 w-full overflow-hidden bg-black flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentMainPhoto.url}
              alt={`${speciesName} photo`}
              loading="lazy"
              onError={() => handleImageError(currentMainPhoto.id)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
              onClick={() => setActiveModalPhoto(currentMainPhoto)}
            />

            {/* Prev / Next Arrows */}
            {validPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
                  title="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
                  title="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Expand Modal Button */}
            <button
              onClick={() => setActiveModalPhoto(currentMainPhoto)}
              className="absolute top-3.5 right-3.5 p-2 rounded-xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition-all shadow-lg cursor-pointer border border-white/10 active:scale-95"
              title="Expand full resolution"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Main Photo Caption and Attribution */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-black/10 dark:bg-black/20">
            <div className="truncate font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="truncate">{currentMainPhoto.attribution}</span>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              {currentMainPhoto.licenseCode && (
                <span className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  {currentMainPhoto.licenseCode}
                </span>
              )}
              {currentMainPhoto.references && (
                <a
                  href={currentMainPhoto.references}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Source Record</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnails Column with Smooth Scrolling and 3D Accent */}
        <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[460px] pb-2 lg:pb-0 pr-1">
          {validPhotos.map((photo, idx) => {
            const isSelected = photo.id === currentMainPhoto.id;
            return (
              <button
                key={photo.id || idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`relative rounded-2xl overflow-hidden aspect-16/10 sm:aspect-16/9 lg:aspect-auto lg:h-24 w-32 sm:w-40 lg:w-full shrink-0 border-2 transition-all duration-300 cursor-pointer group active:scale-95 ${
                  isSelected
                    ? 'border-emerald-500 ring-4 ring-emerald-500/30 shadow-lg shadow-emerald-950/30'
                    : 'border-transparent opacity-75 hover:opacity-100 hover:border-emerald-400/60'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={`${speciesName} thumbnail ${idx + 1}`}
                  loading="lazy"
                  onError={() => handleImageError(photo.id)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <span className="text-[10px] font-medium text-white truncate drop-shadow">
                    {photo.attribution}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeModalPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/95 backdrop-blur-xl animate-fade-in"
          onClick={() => setActiveModalPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-stone-900 rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-16/10 sm:aspect-16/9 w-full bg-black flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeModalPhoto.originalUrl || activeModalPhoto.url}
                alt={`${speciesName}`}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
              <button
                onClick={() => setActiveModalPhoto(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white transition-colors cursor-pointer border border-white/10 shadow-lg"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-stone-200 bg-stone-900">
              <div>
                <p className="text-base font-extrabold text-white font-display">{speciesName}</p>
                <p className="text-xs text-emerald-300 mt-1">{activeModalPhoto.attribution}</p>
              </div>
              <div className="flex items-center gap-2.5">
                {activeModalPhoto.licenseCode && (
                  <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-stone-800 text-emerald-400 border border-stone-700 font-mono">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{activeModalPhoto.licenseCode}</span>
                  </span>
                )}
                {activeModalPhoto.references && (
                  <a
                    href={activeModalPhoto.references}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md"
                  >
                    <span>View Record</span>
                    <ExternalLink className="w-3.5 h-3.5" />
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
