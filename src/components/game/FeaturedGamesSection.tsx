import React, { useState, useEffect } from 'react';
import { Game } from '../../types/game';
import GameCard from './GameCard';
import { ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react';

interface FeaturedGamesSectionProps {
  games: Game[];
  title?: string;
  displayMode?: 'carousel' | 'grid';
  autoRotate?: boolean;
  rotationInterval?: number; // in milliseconds
  maxVisible?: number;
  onGameClick?: (game: Game) => void;
  className?: string;
}

/**
 * FeaturedGamesSection component for displaying featured games
 * Supports both carousel and grid display modes with auto-rotation
 */
const FeaturedGamesSection: React.FC<FeaturedGamesSectionProps> = ({
  games,
  title = 'Featured Games',
  displayMode = 'carousel',
  autoRotate = true,
  rotationInterval = 5000,
  maxVisible = 4,
  onGameClick,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate || isHovered || games.length <= maxVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = Math.max(0, games.length - maxVisible);
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, isHovered, games.length, maxVisible, rotationInterval]);

  // Navigation handlers
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, games.length - maxVisible);
      return prevIndex <= 0 ? maxIndex : prevIndex - 1;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, games.length - maxVisible);
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  // Handle game click
  const handleGameClick = (game: Game) => {
    if (onGameClick) {
      onGameClick(game);
    }
  };

  // Get visible games based on current index and max visible
  const getVisibleGames = () => {
    if (displayMode === 'grid') {
      return games.slice(0, maxVisible);
    }
    return games.slice(currentIndex, currentIndex + maxVisible);
  };

  const visibleGames = getVisibleGames();
  const showNavigation = displayMode === 'carousel' && games.length > maxVisible;

  if (games.length === 0) {
    return null;
  }

  return (
    <section className={`featured-games-section ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 mr-3">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Handpicked games for the best experience
            </p>
          </div>
        </div>
        
        {/* Auto-rotation indicator */}
        {autoRotate && displayMode === 'carousel' && games.length > maxVisible && (
          <div className="flex items-center text-sm text-gray-500">
            <Sparkles className="w-4 h-4 mr-1" />
            <span>Auto-rotating</span>
          </div>
        )}
      </div>

      {/* Games Container */}
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Navigation Buttons */}
        {showNavigation && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200"
              aria-label="Previous games"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200"
              aria-label="Next games"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}

        {/* Games Grid */}
        <div
          className={`grid gap-6 ${
            displayMode === 'carousel'
              ? `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(maxVisible, 4)}`
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          } transition-all duration-300`}
        >
          {visibleGames.map((game, index) => (
            <div
              key={`${game.id}-${currentIndex}-${index}`}
              className="transform transition-all duration-300 hover:scale-105"
              onClick={() => handleGameClick(game)}
            >
              <div className="relative">
                {/* Featured Badge */}
                <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </div>
                
                <GameCard
                  game={game}
                  size="medium"
                  showCategory={true}
                  showDescription={true}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        {showNavigation && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.ceil(games.length / maxVisible) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * maxVisible)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  Math.floor(currentIndex / maxVisible) === index
                    ? 'bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Featured Games Stats */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
          <Star className="w-4 h-4 mr-2 text-yellow-500" />
          {games.length} featured game{games.length !== 1 ? 's' : ''} available
        </div>
      </div>
    </section>
  );
};

export default FeaturedGamesSection;