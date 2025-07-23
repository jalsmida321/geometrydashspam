import React from 'react';

/**
 * Base skeleton component for creating loading animations
 */
const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-300 rounded ${className}`}></div>
);

/**
 * Game card loading skeleton
 */
export const GameCardSkeleton: React.FC = () => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <Skeleton className="w-full h-48" />
    <div className="p-6">
      <Skeleton className="h-6 mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

/**
 * Game grid loading skeleton
 */
export const GameGridSkeleton: React.FC<{ 
  columns?: number; 
  count?: number; 
}> = ({ columns = 3, count = 6 }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-6`}>
      {Array.from({ length: count }).map((_, index) => (
        <GameCardSkeleton key={index} />
      ))}
    </div>
  );
};

/**
 * Category filter loading skeleton
 */
export const CategoryFilterSkeleton: React.FC = () => (
  <div className="flex space-x-4 overflow-x-auto pb-2">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="flex-shrink-0">
        <Skeleton className="w-24 h-10 rounded-full" />
      </div>
    ))}
  </div>
);

/**
 * Search bar loading skeleton
 */
export const SearchBarSkeleton: React.FC = () => (
  <div className="relative">
    <Skeleton className="w-full h-10 rounded-md" />
  </div>
);

/**
 * Page header loading skeleton
 */
export const PageHeaderSkeleton: React.FC = () => (
  <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg p-8 mb-8">
    <div className="animate-pulse">
      <Skeleton className="h-10 w-1/3 mb-4 bg-gray-200" />
      <Skeleton className="h-6 w-2/3 mb-6 bg-gray-200" />
      <div className="flex space-x-4">
        <Skeleton className="h-4 w-20 bg-gray-200" />
        <Skeleton className="h-4 w-16 bg-gray-200" />
        <Skeleton className="h-4 w-24 bg-gray-200" />
      </div>
    </div>
  </div>
);

/**
 * Game page loading skeleton
 */
export const GamePageSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Breadcrumb skeleton */}
    <div className="flex items-center space-x-2 mb-6">
      <Skeleton className="h-4 w-12" />
      <span className="text-gray-300">/</span>
      <Skeleton className="h-4 w-16" />
      <span className="text-gray-300">/</span>
      <Skeleton className="h-4 w-20" />
    </div>

    {/* Game header skeleton */}
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <Skeleton className="h-10 w-2/3 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-6" />
          
          {/* Action buttons skeleton */}
          <div className="flex items-center space-x-4 mb-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
          
          {/* Rating skeleton */}
          <div className="flex items-center space-x-4">
            <Skeleton className="h-4 w-20" />
            <div className="flex space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-6" />
              ))}
            </div>
          </div>
        </div>
        
        {/* Metadata skeleton */}
        <div className="lg:w-80">
          <div className="bg-gray-50 rounded-lg p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-4 w-16 mr-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Game container skeleton */}
    <div className="flex justify-center mb-12">
      <Skeleton className="w-full h-[590px] max-w-[850px] rounded-lg" />
    </div>

    {/* Related games skeleton */}
    <div className="mb-12">
      <Skeleton className="h-8 w-48 mb-6" />
      <GameGridSkeleton columns={3} count={6} />
    </div>
  </div>
);

/**
 * Category page loading skeleton
 */
export const CategoryPageSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Breadcrumb skeleton */}
    <div className="flex items-center space-x-2 mb-6">
      <Skeleton className="h-4 w-12" />
      <span className="text-gray-300">/</span>
      <Skeleton className="h-4 w-20" />
    </div>

    {/* Page header skeleton */}
    <PageHeaderSkeleton />

    {/* Search and filters skeleton */}
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <SearchBarSkeleton />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>

    {/* Results header skeleton */}
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>

    {/* Games grid skeleton */}
    <GameGridSkeleton columns={3} count={12} />
  </div>
);

/**
 * Search results page loading skeleton
 */
export const SearchResultsSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Search header skeleton */}
    <PageHeaderSkeleton />

    {/* Search bar skeleton */}
    <div className="mb-8">
      <div className="max-w-2xl mx-auto">
        <SearchBarSkeleton />
      </div>
    </div>

    {/* Category filter skeleton */}
    <div className="mb-8">
      <CategoryFilterSkeleton />
    </div>

    {/* Controls skeleton */}
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>

    {/* Results header skeleton */}
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-40" />
    </div>

    {/* Results grid skeleton */}
    <GameGridSkeleton columns={4} count={16} />
  </div>
);

/**
 * Loading spinner component
 */
export const LoadingSpinner: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`}></div>
  );
};

/**
 * Full page loading component
 */
export const FullPageLoading: React.FC<{ message?: string }> = ({ 
  message = 'Loading...' 
}) => (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
    <LoadingSpinner size="lg" className="mb-4" />
    <p className="text-gray-600 text-lg">{message}</p>
  </div>
);

/**
 * Inline loading component
 */
export const InlineLoading: React.FC<{ 
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ message = 'Loading...', size = 'md' }) => (
  <div className="flex items-center justify-center py-8">
    <LoadingSpinner size={size} className="mr-3" />
    <span className="text-gray-600">{message}</span>
  </div>
);