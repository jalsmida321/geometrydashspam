import React from 'react';
import { Heart, Star, TrendingUp, Gamepad2 } from 'lucide-react';
import { GameGrid } from '../components/game';
import { useUserInteractions } from '../hooks/useUserInteractions';
import { useNavigate } from 'react-router-dom';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { getFavorites, hasFavorites, favoritesCount, clearFavorites } = useUserInteractions();
  
  const favoriteGames = getFavorites();

  // Handle clear favorites with confirmation
  const handleClearFavorites = () => {
    if (window.confirm('Are you sure you want to remove all games from your favorites? This action cannot be undone.')) {
      clearFavorites();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-full p-3 mr-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
              <p className="text-gray-600 mt-1">
                {hasFavorites 
                  ? `${favoritesCount} game${favoritesCount !== 1 ? 's' : ''} in your favorites collection`
                  : 'Build your personal collection of favorite games'
                }
              </p>
            </div>
          </div>
          
          {hasFavorites && (
            <button
              onClick={handleClearFavorites}
              className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-gray-200"
            >
              <Heart className="w-4 h-4 mr-2" />
              Clear All Favorites
            </button>
          )}
        </div>
      </div>

      {/* Favorites Content */}
      {hasFavorites ? (
        <>
          {/* Favorites Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6">
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-red-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{favoritesCount}</div>
                  <div className="text-sm text-gray-600">Favorite Games</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(favoriteGames.reduce((sum, game) => sum + game.popularity, 0) / favoriteGames.length)}%
                  </div>
                  <div className="text-sm text-gray-600">Avg. Popularity</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {new Set(favoriteGames.map(game => game.category.id)).size}
                  </div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
              </div>
            </div>
          </div>

          {/* Favorites Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Favorite Games</h2>
            <GameGrid
              games={favoriteGames}
              columns={3}
              loading={false}
            />
          </div>

          {/* Tips Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Tips for Managing Favorites</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                <span>Click the heart icon on any game card to add it to favorites</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                <span>Your favorites are saved locally and private to you</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                <span>Organize your collection by keeping only your best games</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                <span>Access favorites quickly from the navigation menu</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full p-8 mx-auto mb-6 w-24 h-24 flex items-center justify-center">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            No Favorite Games Yet
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start building your personal collection by adding games to your favorites. 
            Click the heart icon on any game card to save it here for quick access.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              Browse Games
            </button>
            
            <button
              onClick={() => navigate('/games')}
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <Star className="w-5 h-5 mr-2" />
              View All Games
            </button>
          </div>
          
          {/* How to Add Favorites */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">How to Add Favorites</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 mx-auto mb-3 w-12 h-12 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div className="text-blue-800 font-medium mb-1">Find a Game</div>
                <div className="text-blue-600">Browse or search for games you enjoy</div>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 mx-auto mb-3 w-12 h-12 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div className="text-blue-800 font-medium mb-1">Click the Heart</div>
                <div className="text-blue-600">Click the heart icon on the game card</div>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 mx-auto mb-3 w-12 h-12 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div className="text-blue-800 font-medium mb-1">Access Anytime</div>
                <div className="text-blue-600">Find your favorites here for quick access</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;