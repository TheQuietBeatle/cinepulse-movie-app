import React, { useEffect } from 'react';
import type { MovieDetails } from '../../models/movie';
import { useFavoritesViewModel } from '../../viewmodels/useFavoritesViewModel';
import {
  X,
  Star,
  Calendar,
  Clock,
  Award,
  DollarSign,
  Heart,
  Play,
  Share2,
  Users,
  Video
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface MovieDetailModalProps {
  movie: MovieDetails | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  loading,
  isOpen,
  onClose
}) => {
  const { isFavorite, toggleFavorite } = useFavoritesViewModel();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const favorited = movie ? isFavorite(movie.imdbID) : false;

  const trailerUrl = movie
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${movie.Title} ${movie.Year} trailer`
      )}`
    : '#';

  const handleShare = () => {
    if (navigator.share && movie) {
      navigator.share({
        title: movie.Title,
        text: `Check out ${movie.Title} (${movie.Year}) on CinePulse!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-gray-950 border border-gray-800 w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-gray-300 hover:text-white hover:bg-black/90 backdrop-blur-sm transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {loading || !movie ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Loading full cinema details...</p>
          </div>
        ) : (
          <div>
            <div className="relative h-48 sm:h-64 w-full bg-gray-900 overflow-hidden">
              <img
                src={movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : FALLBACK_POSTER}
                alt={movie.Title}
                className="w-full h-full object-cover filter blur-lg opacity-30 scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />

              <div className="absolute bottom-4 left-6 right-16">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <Badge variant="primary">{movie.Type?.toUpperCase() || 'MOVIE'}</Badge>
                  {movie.Rated && <Badge variant="secondary">{movie.Rated}</Badge>}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {movie.Title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center sm:items-start gap-4">
                <div className="w-48 sm:w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-gray-800 shrink-0">
                  <img
                    src={movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : FALLBACK_POSTER}
                    alt={movie.Title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full flex flex-col gap-2.5">
                  <a
                    href={trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Watch Trailer
                  </a>

                  <button
                    onClick={() => toggleFavorite(movie)}
                    className={`w-full py-2.5 border rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors ${
                      favorited
                        ? 'bg-red-600/20 border-red-500/40 text-red-400'
                        : 'bg-gray-900 hover:bg-gray-800 border-gray-800 text-gray-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorited ? 'fill-current text-red-500' : ''}`} />
                    {favorited ? 'In Your Watchlist' : 'Add to Watchlist'}
                  </button>

                  <button
                    onClick={handleShare}
                    className="w-full py-2 bg-gray-900/60 hover:bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share Title
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-3 gap-2.5 bg-gray-900/50 p-3 rounded-2xl border border-gray-800/80">
                  <div className="text-center p-2">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">IMDb</p>
                    <p className="text-lg font-bold text-amber-400 flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      {movie.imdbRating || 'N/A'}
                    </p>
                    <p className="text-[10px] text-gray-500">{movie.imdbVotes || '0'} votes</p>
                  </div>

                  <div className="text-center p-2 border-x border-gray-800">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Metascore</p>
                    <p className="text-lg font-bold text-emerald-400">
                      {movie.Metascore && movie.Metascore !== 'N/A' ? `${movie.Metascore}/100` : 'N/A'}
                    </p>
                    <p className="text-[10px] text-gray-500">Critics score</p>
                  </div>

                  <div className="text-center p-2">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Rotten Tomatoes</p>
                    <p className="text-lg font-bold text-rose-400">
                      {movie.Ratings?.find((r) => r.Source.includes('Rotten'))?.Value || 'N/A'}
                    </p>
                    <p className="text-[10px] text-gray-500">Tomatometer</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Synopsis</h4>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {movie.Plot || 'No plot description available for this title.'}
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-gray-300 border-t border-gray-900 pt-4">
                  <div className="flex">
                    <span className="w-24 shrink-0 text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Released:
                    </span>
                    <span className="font-medium text-white">{movie.Released || movie.Year}</span>
                  </div>

                  <div className="flex">
                    <span className="w-24 shrink-0 text-gray-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Runtime:
                    </span>
                    <span className="font-medium text-white">{movie.Runtime}</span>
                  </div>

                  <div className="flex">
                    <span className="w-24 shrink-0 text-gray-500 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5" /> Director:
                    </span>
                    <span className="font-medium text-white">{movie.Director}</span>
                  </div>

                  <div className="flex">
                    <span className="w-24 shrink-0 text-gray-500 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> Cast:
                    </span>
                    <span className="font-medium text-white">{movie.Actors}</span>
                  </div>

                  {movie.Awards && movie.Awards !== 'N/A' && (
                    <div className="flex">
                      <span className="w-24 shrink-0 text-gray-500 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" /> Awards:
                      </span>
                      <span className="font-medium text-amber-300">{movie.Awards}</span>
                    </div>
                  )}

                  {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                    <div className="flex">
                      <span className="w-24 shrink-0 text-gray-500 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" /> Box Office:
                      </span>
                      <span className="font-medium text-emerald-400">{movie.BoxOffice}</span>
                    </div>
                  )}
                </div>

                {movie.Genre && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {movie.Genre.split(',').map((g) => (
                      <span
                        key={g.trim()}
                        className="px-2.5 py-1 bg-gray-900 border border-gray-800 rounded-lg text-xs font-medium text-gray-300"
                      >
                        {g.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
