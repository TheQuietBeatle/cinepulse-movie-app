import { useState, useEffect } from 'react';
import type { Movie, MovieDetails } from '../models/movie';
import { omdbService } from '../services/api/omdbService';
import { MOCK_MOVIES } from '../services/api/mockMovieData';

export interface MovieSection {
  title: string;
  subtitle: string;
  movies: Movie[];
}

export const useHomeViewModel = () => {
  const [heroMovie, setHeroMovie] = useState<MovieDetails>(omdbService.getHeroMovie());
  const [sections, setSections] = useState<MovieSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [blockbusters, scifi, series, action] = await Promise.all([
          omdbService.getCuratedRow('Avengers', 'movie'),
          omdbService.getCuratedRow('Interstellar', 'movie'),
          omdbService.getCuratedRow('Breaking Bad', 'series'),
          omdbService.getCuratedRow('Batman', 'movie')
        ]);

        if (isMounted) {
          setSections([
            {
              title: 'Trending Blockbusters',
              subtitle: 'The highest-grossing and most talked-about films',
              movies: blockbusters.length ? blockbusters : MOCK_MOVIES.slice(0, 6)
            },
            {
              title: 'Mind-Bending Sci-Fi',
              subtitle: 'Journeys through space, time, and alternate realities',
              movies: scifi.length ? scifi : MOCK_MOVIES.filter(m => m.Genre.includes('Sci-Fi'))
            },
            {
              title: 'Critically Acclaimed Series',
              subtitle: 'Golden-era bingeable television and mini-series',
              movies: series.length ? series : MOCK_MOVIES.filter(m => m.Type === 'series')
            },
            {
              title: 'Adrenaline & Action',
              subtitle: 'Explosive stunts and iconic superhero cinema',
              movies: action.length ? action : MOCK_MOVIES.filter(m => m.Genre.includes('Action'))
            }
          ]);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Error loading homepage';
          setError(msg);
          setSections([
            {
              title: 'Trending Films',
              subtitle: 'Popular cinematic hits',
              movies: MOCK_MOVIES.slice(0, 6)
            },
            {
              title: 'Sci-Fi Classics',
              subtitle: 'Visionary science fiction epics',
              movies: MOCK_MOVIES.filter(m => m.Genre.includes('Sci-Fi'))
            }
          ]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const rotateHero = (movie: MovieDetails) => {
    setHeroMovie(movie);
  };

  return {
    heroMovie,
    sections,
    loading,
    error,
    rotateHero
  };
};
