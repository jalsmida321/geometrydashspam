import React from 'react';
import { Game } from '../../types/game';
import GameCard from './GameCard';
import { Clock, TrendingUp, RotateCcw, X } from 'lucide-react';

interface RecentlyPlayedSectionProps {
  games: Game[];
  title?: string;
  maxVisible?: number;
  onGameClick?: (game: Game) => void;
  onClearHistory?: () => void;
  showClearButton?: boolean;
  className?: string;
}

/**
 * RecentlyPlayedSection component for displaying recently played games
 */
const RecentlyPlayedSection: React.FC<RecentlyPlayedSectionProps> = ({
  games,
  title = 'Recently Played',
  maxVisible = 4,
  onGameClick,
  onClearHistory,
  showClearButton = true,
  className = ''
}) => {
  // Handle game click
  const handleGameClick = (game: Game) => {
    if (onGameClick) {
      onGameClick(game);
    }
  };

  // Handle clear history
  const handleClearHistory = () => {
    if (onClearHistory) {
      onClearHistory();
    }
  };

  // Get visible games based on maxVisible
  const visibleGames = games.slice(0, maxVisible);

  if (games.length === 0) {
    return null;
  }

  return (
    <section className={`recently-played-section ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2 mr-3">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Continue where you left off
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {games.length > maxVisible && (
            <span className="text-sm text-gray-500">
              Showing {maxVisible} of {games.length}
            </span>
          )}
          
          {showClearButton && onClearHistory && (
            <button
              onClick={handleClearHistory}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Clear recently played history"
            >
              <X className="w-4 h-4 mr-1" />
              Clear History
            </button>
          )}
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleGames.map((game, index) => (
          <div
            key={`${game.id}-${index}`}
            className="transform transition-all duration-300 hover:scale-105"
            onClick={() => handleGameClick(game)}
          >
            <div className="relative">
              {/* Recently Played Badge */}
              <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Recent
              </div>
              
              {/* Play Order Badge */}
              {index < 3 && (
                <div className="absolute top-2 right-2 z-10 bg-gray-900 bg-opacity-75 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              )}
              
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

      {/* Recently Played Stats */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-center flex-1">
          <div className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
            {games.length} game{games.length !== 1 ? 's' : ''} played recently
          </div>
        </div>
        
        {games.length > maxVisible && (
          <div className="text-sm text-gray-500">
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View all {games.length} games →
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          💡 Tip: Games are automatically added here when you play them
        </div>
      </div>
    </section>
  );
};

/**
 * EmptyRecentlyPlayedSection component for when no games have been played
 */
export const EmptyRecentlyPlayedSection: React.FC<{
  onBrowseGames?: () => void;
  className?: string;
}> = ({ onBrowseGames, className = '' }) => {
  return (
    <section className={`empty-recently-played-section ${className}`}>
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full p-6 mx-auto mb-4 w-20 h-20 flex items-center justify-center">
          <Clock className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Recently Played Games
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Start playing some games and they'll appear here for quick access. 
          Your gaming history helps you pick up where you left off.
        </p>
        
        {onBrowseGames && (
          <button
            onClick={onBrowseGames}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Browse Games
          </button>
        )}
        
        <div className="mt-6 text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>Auto-tracked</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Private to you</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span>Quick access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentlyPlayedSection;