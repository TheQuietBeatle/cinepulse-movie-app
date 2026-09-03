import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMovieSearchViewModel } from '../viewmodels/useMovieSearchViewModel';
import { useMovieDetailsViewModel } from '../viewmodels/useMovieDetailsViewModel';
import { SearchBar } from '../components/movies/SearchBar';
import { FilterBar } from '../components/movies/FilterBar';
import { MovieGrid } from '../components/movies/MovieGrid';
import { MovieDetailModal } from '../components/movies/MovieDetailModal';
import { ChevronLeft, ChevronRight, AlertCircle, Compass } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || 'Batman';

  const {
    query,
    contentType,
    year,
    sortBy,
    page,
    movies,
    totalResults,
    totalPages,
    loading,
    error,
    searchHistory,
    setQuery,
    setContentType,
    setYear,
    setSortBy,
    nextPage,
    prevPage,
    handleSelectHistoryItem,
    handleClearHistory
  } = useMovieSearchViewModel(initialQuery);

  const {
    isOpen,
    movieDetails,
    loading: modalLoading,
    openDetails,
    closeDetails
  } = useMovieDetailsViewModel();

  // Keep URL query in sync when user types
  useEffect(() => {
    if (query && query !== searchParams.get('q')) {
      setSearchParams({ q: query }, { replace: true });
    }
  }, [query, setSearchParams, searchParams]);

  const handleResetFilters = () => {
    setYear('');
    setSortBy('relevance');
    setContentType('all');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" /> OMDB Search & Discovery
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Cinema & Series
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Search millions of titles from the Open Movie Database with instantaneous debounced filtering.
        </p>
      </div>

      {/* Search Bar with Autocomplete suggestions */}
      <div className="max-w-3xl mx-auto">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          contentType={contentType}
          onContentTypeChange={setContentType}
          searchHistory={searchHistory}
          onSelectHistory={handleSelectHistoryItem}
          onClearHistory={handleClearHistory}
          totalResults={totalResults}
          loading={loading}
        />
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="max-w-7xl mx-auto">
        <FilterBar
          year={year}
          onYearChange={setYear}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onReset={handleResetFilters}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-200 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Movie Results Grid */}
      <div className="max-w-7xl mx-auto">
        <MovieGrid
          movies={movies}
          loading={loading}
          skeletonCount={10}
          onSelectMovie={openDetails}
          emptyMessage={`No titles found matching "${query}". Try another title or adjust your filters.`}
        />
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-gray-900">
          <button
            onClick={prevPage}
            disabled={page <= 1 || loading}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl border border-gray-800 flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-xs text-gray-400 font-medium px-2">
            Page <strong className="text-white">{page}</strong> of{' '}
            <strong className="text-white">{totalPages}</strong>
          </span>

          <button
            onClick={nextPage}
            disabled={page >= totalPages || loading}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl border border-gray-800 flex items-center gap-1.5 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Movie Detail Modal */}
      <MovieDetailModal
        isOpen={isOpen}
        movie={movieDetails}
        loading={modalLoading}
        onClose={closeDetails}
      />
    </div>
  );
};
