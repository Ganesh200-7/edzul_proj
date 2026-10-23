'use client';

import React from 'react';
import { Leaf, Heart, ExternalLink, ShieldCheck, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-stone-950 border-t border-stone-800 text-stone-400 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span>WildLife Explorer</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-md">
              A modern biodiversity discovery platform connecting nature enthusiasts, researchers, and students with verified species taxonomy and citizen-science field observations worldwide.
            </p>
            <div className="flex items-center gap-2 text-stone-500 pt-1">
              <span>Edzul Project Assignment</span>
              <span>•</span>
              <span>Next.js App Router</span>
              <span>•</span>
              <span>TypeScript</span>
            </div>
          </div>

          {/* Data Sources */}
          <div className="space-y-3">
            <div className="font-semibold text-stone-200 uppercase tracking-wider text-[11px]">
              Scientific Data Sources
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.inaturalist.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>iNaturalist Open API</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.gbif.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>GBIF Global Biodiversity</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.iucnredlist.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>IUCN Red List Categories</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Ethics & Attribution */}
          <div className="space-y-3">
            <div className="font-semibold text-stone-200 uppercase tracking-wider text-[11px]">
              Compliance &amp; Licensing
            </div>
            <p className="text-stone-400 leading-normal">
              Photographs and observation data are distributed under their respective Creative Commons (CC) licenses specified by contributing naturalists.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Open Science &amp; Citizen Research</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400">
          <div>
            &copy; 2026 WildLife Explorer – Global Species Discovery. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Built with care for nature and biodiversity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
