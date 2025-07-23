import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Play, Star, Tag, Clock, User } from 'lucide-react';
import { GameCardProps } from '../../types/game';
import { useUserInteractions } from '../../hooks';
import LazyImage from '../common/LazyImage';

/**
 * GameCard component for displaying game information in a card format
 * Features: Multiple sizes, category badges, hover effects, responsive design
 */
const GameCard: React.FC<GameCardProps> = ({
  game,
  size = 'medium',
  showCategory = true,
  showDescription = true
}) => {
  const { isFavorite, toggleFavorite } = useUserInteractions();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Enhanced size configurations with better responsive design
  const sizeConfig = {
    small: {
      container: 'w-full max-w-sm',
      image: 'h-32 sm:h-36',
      title: 'text-base sm:text-lg',
      description: 'text-xs sm:text-sm',
      padding: 'p-3 sm:p-4',
      button: 'px-3 py-1.5 text-xs sm:text-sm',
      playIcon: 'w-3 h-3 sm:w-4 sm:h-4'
    },
    medium: {
      container: 'w-full',
      image: 'h-40 sm:h-48 md:h-52',
      title: 'text-lg sm:text-xl',
      description: 'text-sm sm:text-base',
      padding: 'p-4 sm:p-6',
      button: 'px-4 py-2 text-sm',
      playIcon: 'w-4 h-4'
    },
    large: {
      container: 'w-full',
      image: 'h-56 sm:h-64 md:h-72',
      title: 'text-xl sm:text-2xl',
      description: 'text-base sm:text-lg',
      padding: 'p-6 sm:p-8',
      button: 'px-6 py-3 text-base',
      playIcon: 'w-5 h-5'
    }
  };

  const config = sizeConfig[size as keyof typeof sizeConfig];
  const isGameFavorite = isFavorite(game.id);

  /**
   * Handle favorite toggle
   */
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(game.id);
  };

  /**
   * Get enhanced category color classes with hover effects
   */
  const getCategoryColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/25',
      red: 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/25',
      green: 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/25',
      purple: 'bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/25',
      orange: 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25',
      indigo: 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/25',
      yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-500/25',
      pink: 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-500/25',
      teal: 'bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/25'
    };
    return colorMap[color] || 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/25';
  };

  /**
   * Format date for display
   */
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <article 
      className={`${config.container} bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2`}
      role="article"
      aria-labelledby={`game-title-${game.id}`}
    >
      {/* Image Container */}
      <div className={`relative ${config.image} overflow-hidden bg-gray-200`}>
        <LazyImage
          src={game.image}
          alt={`${game.name} game screenshot`}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          placeholderColor="#f3f4f6"
          style={{ objectFit: 'cover' }}
        />

        {/* Enhanced overlay with play button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-lg">
              <Play className={`${config.playIcon} text-blue-600`} fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Enhanced featured badge */}
        {game.featured && (
          <div className="absolute top-3 left-3">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-lg">
              <Star className="w-3 h-3 mr-1" fill="currentColor" />
              Featured
            </div>
          </div>
        )}

        {/* Enhanced favorite button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label={isGameFavorite ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites`}
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              isGameFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          />
        </button>

        {/* Enhanced popularity indicator */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              game.popularity >= 90 ? 'bg-green-400' : 
              game.popularity >= 70 ? 'bg-yellow-400' : 'bg-red-400'
            }`}></div>
            {game.popularity}% popular
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={config.padding}>
        {/* Category badge and date */}
        <div className="flex items-center justify-between mb-3">
          {showCategory && (
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition-all duration-200 ${getCategoryColorClass(
                game.category.color
              )}`}
            >
              <Tag className="w-3 h-3 mr-1.5" />
              {game.category.name}
            </span>
          )}
          
          {size !== 'small' && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {formatDate(game.dateAdded)}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 
          id={`game-title-${game.id}`}
          className={`${config.title} font-bold text-gray-900 mb-2 line-clamp-2 leading-tight`}
        >
          {game.name}
        </h3>

        {/* Description */}
        {showDescription && (
          <p className={`${config.description} text-gray-600 mb-4 line-clamp-3 leading-relaxed`}>
            {game.description}
          </p>
        )}

        {/* Enhanced tags */}
        {game.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {game.tags.slice(0, size === 'small' ? 2 : 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150"
                >
                  #{tag}
                </span>
              ))}
              {game.tags.length > (size === 'small' ? 2 : 3) && (
                <span className="inline-block bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium">
                  +{game.tags.length - (size === 'small' ? 2 : 3)} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Enhanced metadata for medium and large sizes */}
        {game.metadata && size !== 'small' && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="space-y-1.5 text-xs">
              {game.metadata.developer && (
                <div className="flex items-center text-gray-600">
                  <User className="w-3 h-3 mr-2 text-gray-400" />
                  <span className="font-medium">Developer:</span>
                  <span className="ml-1">{game.metadata.developer}</span>
                </div>
              )}
              {game.metadata.controls && (
                <div className="flex items-start text-gray-600">
                  <div className="w-3 h-3 mr-2 mt-0.5 rounded-sm bg-gray-400 flex-shrink-0"></div>
                  <span className="font-medium">Controls:</span>
                  <span className="ml-1">{game.metadata.controls}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced play button */}
        <Link
          to={`/game/${encodeURIComponent(game.name)}`}
          state={{ 
            gameUrl: game.url, 
            gameImage: game.image, 
            gameId: game.id 
          }}
          className={`inline-flex items-center ${config.button} border border-transparent font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 w-full justify-center group/button`}
        >
          <Play className={`${config.playIcon} mr-2 group-hover/button:scale-110 transition-transform duration-200`} />
          <span className="truncate">
            Play {size === 'small' ? 'Game' : game.name}
          </span>
          <ArrowRight className={`ml-2 ${config.playIcon} group-hover/button:translate-x-0.5 transition-transform duration-200`} />
        </Link>
      </div>
    </article>
  );
};

export default GameCard;