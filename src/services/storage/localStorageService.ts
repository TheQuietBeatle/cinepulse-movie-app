import type { FavoriteMovie, UserProfile } from '../../models/user';

const STORAGE_KEYS = {
  FAVORITES: 'cinepulse_favorites',
  USER: 'cinepulse_current_user',
  SEARCH_HISTORY: 'cinepulse_search_history'
};

class LocalStorageService {
  getFavorites(uid: string): FavoriteMovie[] {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.FAVORITES}_${uid}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  saveFavorite(uid: string, movie: FavoriteMovie): FavoriteMovie[] {
    const favorites = this.getFavorites(uid);
    const existingIndex = favorites.findIndex(f => f.imdbID === movie.imdbID);
    
    let updated: FavoriteMovie[];
    if (existingIndex >= 0) {
      updated = favorites;
    } else {
      updated = [movie, ...favorites];
    }
    
    localStorage.setItem(`${STORAGE_KEYS.FAVORITES}_${uid}`, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('favorites_updated', { detail: { uid } }));
    return updated;
  }

  removeFavorite(uid: string, imdbID: string): FavoriteMovie[] {
    const favorites = this.getFavorites(uid);
    const updated = favorites.filter(f => f.imdbID !== imdbID);
    localStorage.setItem(`${STORAGE_KEYS.FAVORITES}_${uid}`, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('favorites_updated', { detail: { uid } }));
    return updated;
  }

  isFavorite(uid: string, imdbID: string): boolean {
    const favorites = this.getFavorites(uid);
    return favorites.some(f => f.imdbID === imdbID);
  }

  getCurrentUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  setCurrentUser(user: UserProfile | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    window.dispatchEvent(new CustomEvent('user_updated', { detail: { user } }));
  }

  getSearchHistory(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      return raw ? JSON.parse(raw) : ['Inception', 'Spider-Man', 'Interstellar', 'Batman'];
    } catch {
      return [];
    }
  }

  addSearchHistory(term: string): string[] {
    const trimmed = term.trim();
    if (!trimmed) return this.getSearchHistory();
    const history = this.getSearchHistory().filter(item => item.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...history].slice(0, 8);
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updated));
    return updated;
  }

  clearSearchHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  }
}

export const localStorageService = new LocalStorageService();
