import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import type { FavoriteMovie } from '../models/user';
import type { Movie, MovieDetails } from '../models/movie';
import { favoritesService } from '../services/firebase/favoritesService';

export const useFavoritesViewModel = () => {
  const { user, openAuthModal } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = favoritesService.subscribeToFavorites(user.uid, (data) => {
      setFavorites(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const isFavorite = useCallback(
    (imdbID: string): boolean => {
      return favorites.some((f) => f.imdbID === imdbID);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (movie: Movie | MovieDetails) => {
      if (!user) {
        openAuthModal('signin');
        return;
      }

      const exists = isFavorite(movie.imdbID);
      try {
        if (exists) {
          await favoritesService.removeFavorite(user.uid, movie.imdbID);
          showToast(`Removed "${movie.Title}" from Watchlist`);
        } else {
          await favoritesService.addFavorite(user.uid, movie);
          showToast(`Added "${movie.Title}" to Watchlist`);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Action failed';
        setError(msg);
        showToast(msg);
      }
    },
    [user, isFavorite, openAuthModal]
  );

  const removeFavorite = useCallback(
    async (imdbID: string, title?: string) => {
      if (!user) return;
      try {
        await favoritesService.removeFavorite(user.uid, imdbID);
        showToast(`Removed ${title ? `"${title}"` : 'movie'} from Watchlist`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to remove movie';
        setError(msg);
      }
    },
    [user]
  );

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const stats = useMemo(() => {
    const total = favorites.length;
    const moviesCount = favorites.filter((f) => f.type === 'movie').length;
    const seriesCount = favorites.filter((f) => f.type === 'series').length;
    return { total, moviesCount, seriesCount };
  }, [favorites]);

  return {
    favorites,
    loading,
    error,
    toastMessage,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    stats,
    isAuthenticated: Boolean(user)
  };
};
