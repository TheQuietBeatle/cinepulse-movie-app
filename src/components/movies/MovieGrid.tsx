import React from 'react';
import type { Movie, MovieDetails } from '../../models/movie';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from '../common/Skeleton';
import { Film } from 'lucide-react';

interface MovieGridProps {
  movies: (Movie | MovieDetails)[];
  loading?: boolean;
  skeletonCount?: number;
  onSelectMovie?: (imdbID: string) => void;
  emptyMessage?: string;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  loading = false,
  skeletonCount = 10,
  onSelectMovie,
  emptyMessage = 'No movies or series found.'
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-gray-800 rounded-2xl bg-gray-900/30">
        <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400 font-medium text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onSelect={onSelectMovie}
        />
      ))}
    </div>
  );
};
