import React from 'react';

export const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-gray-900/60 rounded-xl overflow-hidden border border-gray-800 animate-pulse">
      <div className="w-full aspect-[2/3] bg-gray-800" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-3 bg-gray-800 rounded w-1/4" />
          <div className="h-3 bg-gray-800 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="w-full h-[65vh] min-h-[450px] bg-gray-900/80 rounded-2xl animate-pulse relative overflow-hidden flex items-end p-8 md:p-12">
      <div className="max-w-2xl space-y-4 w-full">
        <div className="h-6 bg-gray-800 rounded w-1/4" />
        <div className="h-10 bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-800 rounded w-4/5" />
        <div className="flex gap-4 pt-4">
          <div className="h-12 w-32 bg-gray-700 rounded-lg" />
          <div className="h-12 w-36 bg-gray-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
