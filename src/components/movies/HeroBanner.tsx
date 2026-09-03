import React from 'react';
import type { MovieDetails } from '../../models/movie';
import { useFavoritesViewModel } from '../../viewmodels/useFavoritesViewModel';
import { Play, Info, Heart, Star, Calendar, Clock } from 'lucide-react';
import { Badge } from '../common/Badge';

interface HeroBannerProps {
  movie: MovieDetails;
  onOpenDetails: (imdbID: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ movie, onOpenDetails }) => {
  const { isFavorite, toggleFavorite } = useFavoritesViewModel();
  const favorited = isFavorite(movie.imdbID);

  const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${movie.Title} ${movie.Year} official trailer`
  )}`;

  return (
    <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-gray-800/80 shadow-2xl bg-gray-950 mb-12">
      <div className="absolute inset-0 z-0">
        <img
          src={movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80'}
          alt={movie.Title}
          className="w-full h-full object-cover object-center filter blur-md opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-black/50" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 md:p-14 flex flex-col md:flex-row items-center md:items-end gap-8">
        <div className="hidden sm:block shrink-0 w-44 md:w-56 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-2 border-gray-800">
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <Badge variant="primary">Spotlight Feature</Badge>
            <Badge variant="secondary">{movie.Rated || 'PG-13'}</Badge>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{movie.imdbRating || '8.8'} IMDb</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            {movie.Title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-gray-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              {movie.Year}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              {movie.Runtime}
            </span>
            <span>•</span>
            <span className="text-red-400 font-medium">{movie.Genre}</span>
          </div>

          <p className="text-gray-300 text-sm md:text-base line-clamp-3 max-w-2xl leading-relaxed">
            {movie.Plot}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <a
              href={trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-red-600/30 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch Trailer
            </a>

            <button
              onClick={() => onOpenDetails(movie.imdbID)}
              className="px-5 py-2.5 bg-gray-900/90 hover:bg-gray-800 text-white font-medium border border-gray-700 rounded-xl text-sm transition-colors flex items-center gap-2 backdrop-blur-md"
            >
              <Info className="w-4 h-4 text-gray-400" />
              Details
            </button>

            <button
              onClick={() => toggleFavorite(movie)}
              className={`p-2.5 rounded-xl border transition-all ${
                favorited
                  ? 'bg-red-600/20 border-red-500/40 text-red-400'
                  : 'bg-gray-900/90 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              title={favorited ? 'In Watchlist' : 'Add to Watchlist'}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current text-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
