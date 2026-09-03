import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Calendar, RotateCcw } from 'lucide-react';
import type { SortOption } from '../../models/movie';

interface FilterBarProps {
  year: string;
  onYearChange: (y: string) => void;
  sortBy: SortOption;
  onSortByChange: (s: SortOption) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  year,
  onYearChange,
  sortBy,
  onSortByChange,
  onReset
}) => {
  const hasActiveFilters = Boolean(year || sortBy !== 'relevance');

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-900/60 border border-gray-800 rounded-xl text-xs text-gray-300">
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex items-center gap-1.5 font-semibold text-gray-400">
          <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
          Filter & Sort:
        </span>

        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-500" />
          <input
            type="number"
            min="1900"
            max="2030"
            placeholder="Year (e.g. 2023)"
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-28 px-2.5 py-1 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortOption)}
            className="px-2.5 py-1 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="year-desc">Sort: Year (Newest)</option>
            <option value="year-asc">Sort: Year (Oldest)</option>
            <option value="title-asc">Sort: Title (A–Z)</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-red-400 hover:text-red-300 font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      )}
    </div>
  );
};
