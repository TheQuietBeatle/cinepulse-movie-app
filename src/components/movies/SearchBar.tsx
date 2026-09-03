import React from 'react';
import { Search, X, History, Sparkles } from 'lucide-react';
import type { ContentType } from '../../models/movie';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  contentType: ContentType;
  onContentTypeChange: (t: ContentType) => void;
  searchHistory: string[];
  onSelectHistory: (item: string) => void;
  onClearHistory: () => void;
  totalResults?: number;
  loading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  contentType,
  onContentTypeChange,
  searchHistory,
  onSelectHistory,
  onClearHistory,
  totalResults,
  loading
}) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {loading ? (
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by title, series, or franchise (e.g. Inception, Batman, Star Wars)..."
          className="w-full pl-12 pr-12 py-3.5 bg-gray-900/90 border border-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-2xl text-white text-base placeholder-gray-500 shadow-inner backdrop-blur-sm transition-all"
        />

        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
            aria-label="Clear search query"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-gray-900 border border-gray-800 rounded-xl">
          {(
            [
              { id: 'all', label: 'All Content' },
              { id: 'movie', label: 'Movies' },
              { id: 'series', label: 'Series' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => onContentTypeChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                contentType === tab.id
                  ? 'bg-red-600 text-white shadow'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {totalResults !== undefined && (
          <div className="text-gray-400 font-medium">
            Found <span className="text-white font-bold">{totalResults.toLocaleString()}</span> titles
          </div>
        )}
      </div>

      {searchHistory.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-gray-500 flex items-center gap-1">
            <History className="w-3.5 h-3.5" /> Recent:
          </span>
          {searchHistory.slice(0, 5).map((item) => (
            <button
              key={item}
              onClick={() => onSelectHistory(item)}
              className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-gray-300 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-red-400" />
              {item}
            </button>
          ))}
          {searchHistory.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-gray-500 hover:text-red-400 ml-auto transition-colors"
            >
              Clear history
            </button>
          )}
        </div>
      )}
    </div>
  );
};
