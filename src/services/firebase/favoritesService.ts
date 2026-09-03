import { ref, set, remove, onValue, get } from 'firebase/database';
import { database, isFirebaseConfigured } from './firebaseConfig';
import type { FavoriteMovie } from '../../models/user';
import type { Movie, MovieDetails } from '../../models/movie';
import { localStorageService } from '../storage/localStorageService';

class FavoritesService {
  async addFavorite(uid: string, movie: Movie | MovieDetails): Promise<void> {
    const favoriteItem: FavoriteMovie = {
      imdbID: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      type: movie.Type,
      poster: movie.Poster,
      imdbRating: 'imdbRating' in movie ? movie.imdbRating : undefined,
      genre: 'Genre' in movie ? movie.Genre : undefined,
      plot: 'Plot' in movie ? movie.Plot : undefined,
      addedAt: Date.now()
    };

    if (isFirebaseConfigured && database) {
      const favRef = ref(database, `users/${uid}/favorites/${movie.imdbID}`);
      await set(favRef, favoriteItem);
      localStorageService.saveFavorite(uid, favoriteItem);
      return;
    }

    localStorageService.saveFavorite(uid, favoriteItem);
  }

  async removeFavorite(uid: string, imdbID: string): Promise<void> {
    if (isFirebaseConfigured && database) {
      const favRef = ref(database, `users/${uid}/favorites/${imdbID}`);
      await remove(favRef);
      localStorageService.removeFavorite(uid, imdbID);
      return;
    }

    localStorageService.removeFavorite(uid, imdbID);
  }

  async isFavorite(uid: string, imdbID: string): Promise<boolean> {
    if (isFirebaseConfigured && database) {
      try {
        const favRef = ref(database, `users/${uid}/favorites/${imdbID}`);
        const snapshot = await get(favRef);
        return snapshot.exists();
      } catch {
        return localStorageService.isFavorite(uid, imdbID);
      }
    }
    return localStorageService.isFavorite(uid, imdbID);
  }

  subscribeToFavorites(uid: string, callback: (favorites: FavoriteMovie[]) => void): () => void {
    if (!uid) {
      callback([]);
      return () => {};
    }

    if (isFirebaseConfigured && database) {
      const userFavsRef = ref(database, `users/${uid}/favorites`);
      const unsubscribe = onValue(
        userFavsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const list: FavoriteMovie[] = Object.values(data);
            list.sort((a, b) => b.addedAt - a.addedAt);
            callback(list);
          } else {
            callback([]);
          }
        },
        (error) => {
          console.warn('Realtime database subscription error, using local storage fallback:', error);
          callback(localStorageService.getFavorites(uid));
        }
      );

      return unsubscribe;
    }

    callback(localStorageService.getFavorites(uid));

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ uid: string }>;
      if (customEvent.detail.uid === uid) {
        callback(localStorageService.getFavorites(uid));
      }
    };

    window.addEventListener('favorites_updated', handleUpdate);
    return () => {
      window.removeEventListener('favorites_updated', handleUpdate);
    };
  }

  async getFavorites(uid: string): Promise<FavoriteMovie[]> {
    if (!uid) return [];

    if (isFirebaseConfigured && database) {
      try {
        const userFavsRef = ref(database, `users/${uid}/favorites`);
        const snapshot = await get(userFavsRef);
        if (snapshot.exists()) {
          const list: FavoriteMovie[] = Object.values(snapshot.val());
          return list.sort((a, b) => b.addedAt - a.addedAt);
        }
        return [];
      } catch {
        return localStorageService.getFavorites(uid);
      }
    }

    return localStorageService.getFavorites(uid);
  }
}

export const favoritesService = new FavoritesService();
