import { useState, useCallback, useRef } from 'react';
import type { MovieDetails } from '../models/movie';
import { omdbService } from '../services/api/omdbService';

export const useMovieDetailsViewModel = () => {
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const openDetails = useCallback(async (imdbID: string) => {
    setSelectedMovieId(imdbID);
    setLoading(true);
    setError(null);

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const details = await omdbService.getMovieDetails(imdbID, controller.signal);
      setMovieDetails(details);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      const message = err instanceof Error ? err.message : 'Could not fetch movie details';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const closeDetails = useCallback(() => {
    setSelectedMovieId(null);
    setMovieDetails(null);
    setError(null);
    if (abortRef.current) {
      abortRef.current.abort();
    }
  }, []);

  return {
    isOpen: Boolean(selectedMovieId),
    selectedMovieId,
    movieDetails,
    loading,
    error,
    openDetails,
    closeDetails
  };
};
