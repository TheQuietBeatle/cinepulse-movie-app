import React from 'react';
import { useHomeViewModel } from '../viewmodels/useHomeViewModel';
import { useMovieDetailsViewModel } from '../viewmodels/useMovieDetailsViewModel';
import { HeroBanner } from '../components/movies/HeroBanner';
import { MovieGrid } from '../components/movies/MovieGrid';
import { MovieDetailModal } from '../components/movies/MovieDetailModal';
import { HeroSkeleton } from '../components/common/Skeleton';
import { Sparkles, Film } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { heroMovie, sections, loading, error } = useHomeViewModel();
  const {
    isOpen,
    movieDetails,
    loading: modalLoading,
    openDetails,
    closeDetails
  } = useMovieDetailsViewModel();

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Spotlight Section */}
      {loading ? (
        <HeroSkeleton />
      ) : (
        <HeroBanner movie={heroMovie} onOpenDetails={openDetails} />
      )}

      {/* Error notification if API failed */}
      {error && (
        <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-2xl text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Serving curated offline selection ({error}).</span>
          </div>
        </div>
      )}

      {/* Curated Category Sections */}
      {sections.map((section, idx) => (
        <section key={idx} className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-gray-800 pb-2.5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Film className="w-5 h-5 text-red-500" />
                {section.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{section.subtitle}</p>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {section.movies.length} titles
            </span>
          </div>

          <MovieGrid
            movies={section.movies}
            loading={loading}
            skeletonCount={5}
            onSelectMovie={openDetails}
          />
        </section>
      ))}

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
