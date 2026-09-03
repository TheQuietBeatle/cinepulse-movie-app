import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { Movie, ContentType, SortOption } from '../models/movie';
import { omdbService } from '../services/api/omdbService';
import { localStorageService } from '../services/storage/localStorageService';

export const useMovieSearchViewModel = (initialQuery = 'Marvel') => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [contentType, setContentType] = useState<ContentType>('all');
  const [year, setYear] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [page, setPage] = useState<number>(1);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setSearchHistory(localStorageService.getSearchHistory());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = useCallback(async () => {
    const term = debouncedQuery.trim();
    if (!term) {
      setMovies([]);
      setTotalResults(0);
      setError(null);
      setLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const typeParam = contentType === 'all' ? undefined : contentType;
      const res = await omdbService.searchMovies(
        term,
        page,
        typeParam,
        year,
        controller.signal
      );

      setMovies(res.movies);
      setTotalResults(res.totalResults);

      if (term.length >= 3) {
        const updatedHistory = localStorageService.addSearchHistory(term);
        setSearchHistory(updatedHistory);
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      const message = err instanceof Error ? err.message : 'Error fetching movies';
      setError(message);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page, contentType, year]);

  useEffect(() => {
    performSearch();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [performSearch]);

  const sortedMovies = useMemo(() => {
    if (!movies || movies.length === 0) return [];
    const list = [...movies];

    switch (sortBy) {
      case 'year-desc':
        return list.sort((a, b) => parseInt(b.Year, 10) - parseInt(a.Year, 10));
      case 'year-asc':
        return list.sort((a, b) => parseInt(a.Year, 10) - parseInt(b.Year, 10));
      case 'title-asc':
        return list.sort((a, b) => a.Title.localeCompare(b.Title));
      case 'relevance':
      default:
        return list;
    }
  }, [movies, sortBy]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalResults / 10);
  }, [totalResults]);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleSelectHistoryItem = (item: string) => {
    setQuery(item);
    setDebouncedQuery(item);
    setPage(1);
  };

  const handleClearHistory = () => {
    localStorageService.clearSearchHistory();
    setSearchHistory([]);
  };

  const nextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  return {
    query,
    contentType,
    year,
    sortBy,
    page,
    movies: sortedMovies,
    totalResults,
    totalPages,
    loading,
    error,
    searchHistory,
    setQuery: handleQueryChange,
    setContentType: (type: ContentType) => {
      setContentType(type);
      setPage(1);
    },
    setYear: (y: string) => {
      setYear(y);
      setPage(1);
    },
    setSortBy,
    setPage,
    nextPage,
    prevPage,
    handleSelectHistoryItem,
    handleClearHistory,
    refresh: performSearch
  };
};
