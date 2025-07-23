import React, { useState, useEffect } from 'react';
import { GameGridProps } from '../../types/game';
import GameCard from './GameCard';
import { Gamepad2, Search } from 'lucide-react';
import VirtualList from '../common/VirtualList';
import { debounce } from '../../utils/performanceUtils';

/**
 * GameGrid component for displaying games in a responsive grid layout
 */
const GameGrid: React.FC<GameGridProps> = ({
  games,
  columns = 3,
  spacing = 'normal',
  loading = false,
  onGameClick,
  className = '',
  emptyStateMessage,
  showResultsCount = true
}) => {
  // Grid column classes based on column count with enhanced responsive breakpoints
  const getGridClass = (cols: number) => {
    const gridClasses: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
    };
    return gridClasses[cols] || gridClasses[3];
  };

  // Spacing classes based on spacing prop
  const getSpacingClass = (spacingType: 'tight' | 'normal' | 'loose') => {
    const spacingClasses = {
      tight: 'gap-3',
      normal: 'gap-6',
      loose: 'gap-8'
    };
    return spacingClasses[spacingType];
  };

  // Enhanced loading skeleton component with responsive design
  const LoadingSkeleton = () => (
    <div className="bg-white shadow-md rounded-lg overflow-hidden animate-pulse">
      <div className="h-40 sm:h-48 md:h-52 bg-gray-300"></div>
      <div className="p-4 sm:p-6">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  // Enhanced empty state component with custom message support
  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 rounded-full p-6 mb-4">
        <Search className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No games found</h3>
      <p className="text-gray-600 mb-4 max-w-md">
        {emptyStateMessage || "We couldn't find any games matching your criteria. Try adjusting your search or filters."}
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-gray-500">Popular searches:</span>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">geometry dash</span>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">spam</span>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">challenge</span>
      </div>
    </div>
  );

  // Handle game click with proper typing
  const handleGameClick = (game: any) => {
    if (onGameClick) {
      onGameClick(game);
    }
  };

  // Calculate number of loading skeletons based on columns and spacing
  const getLoadingSkeletonCount = () => {
    // Show more skeletons for smaller column counts to fill the screen better
    const baseCount = columns <= 2 ? 4 : columns * 2;
    return Math.min(baseCount, 12); // Cap at 12 to avoid excessive loading skeletons
  };

  // State for virtualization
  const [useVirtualization, setUseVirtualization] = useState(false);
  const [itemHeight, setItemHeight] = useState(400); // Approximate height of a game card
  
  // Determine if we should use virtualization based on game count
  useEffect(() => {
    // Only use virtualization for large lists (more than 20 games)
    setUseVirtualization(games.length > 20);
  }, [games.length]);
  
  // Render a game card
  const renderGameCard = (game: any) => (
    <div
      key={game.id}
      onClick={() => handleGameClick(game)}
      className={onGameClick ? 'cursor-pointer' : ''}
    >
      <GameCard
        game={game}
        size="medium"
        showCategory={true}
        showDescription={true}
      />
    </div>
  );

  return (
    <div className={`w-full ${className}`}>
      {loading ? (
        // Loading skeletons in a grid
        <div className={`grid ${getGridClass(columns)} ${getSpacingClass(spacing)}`}>
          {Array.from({ length: getLoadingSkeletonCount() }).map((_, index) => (
            <LoadingSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      ) : games.length === 0 ? (
        // Empty state
        <div className={`grid ${getGridClass(columns)} ${getSpacingClass(spacing)}`}>
          <EmptyState />
        </div>
      ) : useVirtualization ? (
        // Virtual list for large datasets
        <div style={{ height: '800px' }}>
          <VirtualList
            items={games}
            itemHeight={itemHeight}
            renderItem={(game, index) => (
              <div className={`grid ${getGridClass(columns)} ${getSpacingClass(spacing)}`}>
                {renderGameCard(game)}
              </div>
            )}
            overscan={5}
            onEndReached={() => console.log('End reached')}
          />
        </div>
      ) : (
        // Standard grid for smaller datasets
        <div className={`grid ${getGridClass(columns)} ${getSpacingClass(spacing)}`}>
          {games.map(renderGameCard)}
        </div>
      )}

      {/* Results summary */}
      {!loading && games.length > 0 && showResultsCount && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
            <Gamepad2 className="w-4 h-4 mr-2" />
            Showing {games.length} game{games.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameGrid;