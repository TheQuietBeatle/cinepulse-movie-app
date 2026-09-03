import React, { useState } from 'react';
import type { Movie, MovieDetails } from '../../models/movie';
import { useFavoritesViewModel } from '../../viewmodels/useFavoritesViewModel';
import { Heart, Star, Film, Eye } from 'lucide-react';
import { Badge } from '../common/Badge';

interface MovieCardProps {
  movie: Movie | MovieDetails;
  onSelect?: (imdbID: string) => void;
}

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
  const { isFavorite, toggleFavorite } = useFavoritesViewModel();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const favorited = isFavorite(movie.imdbID);
  const hasValidPoster = movie.Poster && movie.Poster !== 'N/A' && !imgError;
  const posterSrc = hasValidPoster ? movie.Poster : FALLBACK_POSTER;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(movie.imdbID);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-gray-900/80 rounded-xl overflow-hidden border border-gray-800/80 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20 hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative w-full aspect-[2/3] bg-gray-950 overflow-hidden">
        <img
          src={posterSrc}
          alt={movie.Title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-black/40 opacity-70 group-hover:opacity-90 transition-opacity" />

        <div className="absolute top-2.5 left-2.5">
          <Badge variant={movie.Type === 'series' ? 'accent' : 'primary'}>
            {movie.Type || 'Movie'}
          </Badge>
        </div>

        <button
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remove from Watchlist' : 'Add to Watchlist'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            favorited
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-110'
              : 'bg-black/50 text-gray-300 hover:text-white hover:bg-black/80 hover:scale-110'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>

        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="px-3.5 py-1.5 bg-red-600/90 text-white font-semibold text-xs rounded-full backdrop-blur-sm flex items-center gap-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5" /> Details
          </span>
        </div>
      </div>

      <div className="p-3.5 flex flex-col justify-between flex-1 gap-1">
        <h3
          className="font-semibold text-white text-sm line-clamp-1 group-hover:text-red-400 transition-colors"
          title={movie.Title}
        >
          {movie.Title}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <span className="font-medium text-gray-300">{movie.Year}</span>

          {'imdbRating' in movie && movie.imdbRating && movie.imdbRating !== 'N/A' ? (
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{movie.imdbRating}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-gray-500">
              <Film className="w-3 h-3" />
              <span>OMDB</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
