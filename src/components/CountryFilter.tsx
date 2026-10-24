'use client';

import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface CountryFilterProps {
  selectedCountry: string;
  onSelectCountry: (countryCode: string) => void;
  isDarkMode?: boolean;
}

export const TOP_COUNTRIES: { code: string; name: string }[] = [
  { code: 'ALL', name: '🌍 Global / All Countries' },
  { code: 'ZA', name: '🇿🇦 South Africa' },
  { code: 'IN', name: '🇮🇳 India' },
  { code: 'TH', name: '🇹🇭 Thailand' },
  { code: 'KE', name: '🇰🇪 Kenya' },
  { code: 'ZW', name: '🇿🇼 Zimbabwe' },
  { code: 'BW', name: '🇧🇼 Botswana' },
  { code: 'US', name: '🇺🇸 United States' },
  { code: 'MX', name: '🇲🇽 Mexico' },
  { code: 'BR', name: '🇧🇷 Brazil' },
  { code: 'AU', name: '🇦🇺 Australia' },
  { code: 'NP', name: '🇳🇵 Nepal' },
  { code: 'LK', name: '🇱🇰 Sri Lanka' },
  { code: 'TZ', name: '🇹🇿 Tanzania' },
  { code: 'ID', name: '🇮🇩 Indonesia' },
  { code: 'CA', name: '🇨🇦 Canada' },
  { code: 'RU', name: '🇷🇺 Russian Federation' },
];

export const CountryFilter: React.FC<CountryFilterProps> = ({
  selectedCountry,
  onSelectCountry,
  isDarkMode,
}) => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
        <Filter className="w-3.5 h-3.5" />
        <span>Region:</span>
      </div>

      <div className="relative">
        <select
          value={selectedCountry}
          onChange={(e) => onSelectCountry(e.target.value)}
          className={`text-xs pl-3.5 pr-9 py-2 rounded-2xl border font-bold appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm ${
            isDarkMode
              ? 'bg-stone-900 border-emerald-800/60 text-stone-200 hover:border-emerald-500/60'
              : 'bg-white border-emerald-200 text-stone-900 hover:border-emerald-400'
          }`}
        >
          {TOP_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code} className="bg-stone-900 text-white py-1">
              {c.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
