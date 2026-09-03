import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFavoritesViewModel } from '../viewmodels/useFavoritesViewModel';
import { useMovieDetailsViewModel } from '../viewmodels/useMovieDetailsViewModel';
import { MovieDetailModal } from '../components/movies/MovieDetailModal';
import {
  Bookmark,
  Trash2,
  Eye,
  Film,
  Tv,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const FavoritesPage: React.FC = () => {
  const { favorites, loading, removeFavorite, stats } = useFavoritesViewModel();
  const {
    isOpen,
    movieDetails,
    loading: modalLoading,
    openDetails,
    closeDetails
  } = useMovieDetailsViewModel();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'series'>('all');

  const filteredFavorites = useMemo(() => {
    return favorites.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.year.includes(searchTerm);
      const matchType = filterType === 'all' || item.type.toLowerCase() === filterType;
      return matchSearch && matchType;
    });
  }, [favorites, searchTerm, filterType]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-current" /> Firebase Realtime Sync
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            My Watchlist & Favorites
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Persisted in your cloud profile and synchronized in real time.
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-center">
            <p className="text-[10px] uppercase font-bold text-gray-400">Total Saved</p>
            <p className="text-lg font-extrabold text-white">{stats.total}</p>
          </div>
          <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-center">
            <p className="text-[10px] uppercase font-bold text-gray-400 flex items-center justify-center gap-1">
              <Film className="w-3 h-3 text-red-400" /> Movies
            </p>
            <p className="text-lg font-extrabold text-white">{stats.moviesCount}</p>
          </div>
          <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-center">
            <p className="text-[10px] uppercase font-bold text-gray-400 flex items-center justify-center gap-1">
              <Tv className="w-3 h-3 text-indigo-400" /> Series
            </p>
            <p className="text-lg font-extrabold text-white">{stats.seriesCount}</p>
          </div>
        </div>
      </div>

      {/* Internal Search & Filter Controls */}
      {favorites.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search your watchlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-gray-900 border border-gray-800 rounded-xl text-xs self-start sm:self-auto">
            {(['all', 'movie', 'series'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg font-medium capitalize transition-all ${
                  filterType === t
                    ? 'bg-red-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-xs">Syncing your watchlist from Firebase...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="py-20 text-center bg-gray-900/40 border border-dashed border-gray-800 rounded-3xl p-8 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-red-600/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Your Watchlist is empty</h3>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Explore movies, series, and blockbusters. Click the heart icon on any card to save titles to your personal collection.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-red-600/30"
          >
            <Sparkles className="w-4 h-4" />
            Discover Movies Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="py-16 text-center text-gray-400 text-sm">
          No saved titles match "{searchTerm}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredFavorites.map((item) => (
            <div
              key={item.imdbID}
              className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all flex flex-col group"
            >
              {/* Card Poster */}
              <div
                onClick={() => openDetails(item.imdbID)}
                className="relative w-full aspect-[2/3] bg-gray-950 cursor-pointer overflow-hidden"
              >
                <img
                  src={
                    item.poster && item.poster !== 'N/A'
                      ? item.poster
                      : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5">
                  <Badge variant={item.type === 'series' ? 'accent' : 'primary'}>
                    {item.type}
                  </Badge>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                <div>
                  <h3
                    onClick={() => openDetails(item.imdbID)}
                    className="font-bold text-white text-sm line-clamp-1 hover:text-red-400 cursor-pointer transition-colors"
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Released: {item.year}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-800/80">
                  <button
                    onClick={() => openDetails(item.imdbID)}
                    className="text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                    Details
                  </button>

                  <button
                    onClick={() => removeFavorite(item.imdbID, item.title)}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Global Movie Detail Modal */}
      <MovieDetailModal
        isOpen={isOpen}
        movie={movieDetails}
        loading={modalLoading}
        onClose={closeDetails}
      />
    </div>
  );
};
