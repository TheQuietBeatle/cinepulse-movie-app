import type { Movie, MovieDetails, OmdbSearchResponse } from '../../models/movie';
import { MOCK_MOVIES, HERO_FEATURED_MOVIE } from './mockMovieData';

const OMDB_BASE_URL = 'https://www.omdbapi.com/';

const ENV_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
export const OMDB_API_KEY = ENV_API_KEY || 'b9a5e69d'; 

export const isLiveApiConfigured = (): boolean => {
  return Boolean(ENV_API_KEY && ENV_API_KEY.trim() !== '');
};

class OmdbService {
  async searchMovies(
    query: string,
    page: number = 1,
    type?: string,
    year?: string,
    signal?: AbortSignal
  ): Promise<{ movies: Movie[]; totalResults: number }> {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return { movies: [], totalResults: 0 };
    }

    try {
      const url = new URL(OMDB_BASE_URL);
      url.searchParams.set('apikey', OMDB_API_KEY);
      url.searchParams.set('s', trimmedQuery);
      url.searchParams.set('page', String(page));
      
      if (type && type !== 'all') {
        url.searchParams.set('type', type);
      }
      if (year && year.trim()) {
        url.searchParams.set('y', year.trim());
      }

      const response = await fetch(url.toString(), { signal });
      if (!response.ok) {
        throw new Error(`OMDB API network error: ${response.status} ${response.statusText}`);
      }

      const data: OmdbSearchResponse = await response.json();

      if (data.Response === 'False') {
        const localMatches = this.searchMockData(trimmedQuery, type, year);
        if (localMatches.length > 0) {
          return {
            movies: localMatches,
            totalResults: localMatches.length
          };
        }
        
        if (data.Error === 'Too many results.') {
          throw new Error('Too many results. Please refine your search query.');
        }
        if (data.Error === 'Movie not found!') {
          return { movies: [], totalResults: 0 };
        }
        throw new Error(data.Error || 'Failed to fetch movies from OMDB');
      }

      const rawMovies = data.Search || [];
      const uniqueMovies = Array.from(new Map(rawMovies.map(m => [m.imdbID, m])).values());

      return {
        movies: uniqueMovies,
        totalResults: parseInt(data.totalResults || `${uniqueMovies.length}`, 10)
      };
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }
      const localMatches = this.searchMockData(trimmedQuery, type, year);
      if (localMatches.length > 0) {
        return { movies: localMatches, totalResults: localMatches.length };
      }
      throw error;
    }
  }

  async getMovieDetails(imdbID: string, signal?: AbortSignal): Promise<MovieDetails> {
    const mockMatch = MOCK_MOVIES.find(m => m.imdbID === imdbID);

    try {
      const url = new URL(OMDB_BASE_URL);
      url.searchParams.set('apikey', OMDB_API_KEY);
      url.searchParams.set('i', imdbID);
      url.searchParams.set('plot', 'full');

      const response = await fetch(url.toString(), { signal });
      if (!response.ok) {
        if (mockMatch) return mockMatch;
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (data.Response === 'False') {
        if (mockMatch) return mockMatch;
        throw new Error(data.Error || 'Movie details not found');
      }

      return data as MovieDetails;
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }
      if (mockMatch) return mockMatch;
      throw error;
    }
  }

  async getCuratedRow(query: string, type: 'all' | 'movie' | 'series' = 'movie'): Promise<Movie[]> {
    try {
      const result = await this.searchMovies(query, 1, type === 'all' ? undefined : type);
      if (result.movies.length > 0) {
        return result.movies.slice(0, 10);
      }
    } catch {
      // Fall back to mock
    }
    return MOCK_MOVIES.filter(m => type === 'all' || m.Type === type).slice(0, 10);
  }

  getHeroMovie(): MovieDetails {
    return HERO_FEATURED_MOVIE;
  }

  private searchMockData(query: string, type?: string, year?: string): Movie[] {
    const q = query.toLowerCase();
    return MOCK_MOVIES.filter(m => {
      const matchTitle = m.Title.toLowerCase().includes(q) || m.Genre.toLowerCase().includes(q) || m.Director.toLowerCase().includes(q);
      const matchType = !type || type === 'all' || m.Type.toLowerCase() === type.toLowerCase();
      const matchYear = !year || m.Year.includes(year);
      return matchTitle && matchType && matchYear;
    });
  }
}

export const omdbService = new OmdbService();
