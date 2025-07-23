import React, { useState } from 'react';
import { Game } from '../../types/game';
import { useFeaturedGames } from '../../hooks/useFeaturedGames';
import GameCard from '../game/GameCard';
import { 
  Star, 
  Settings, 
  Search, 
  Filter, 
  RotateCcw, 
  Save,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

interface FeaturedGamesAdminProps {
  onClose?: () => void;
  className?: string;
}

/**
 * Admin component for managing featured games
 */
const FeaturedGamesAdmin: React.FC<FeaturedGamesAdminProps> = ({
  onClose,
  className = ''
}) => {
  const {
    featuredGames,
    allGames,
    config,
    isLoading,
    error,
    toggleFeatured,
    updateConfig,
    refreshFeaturedGames,
    getFeaturedGameIds,
    canFeatureMore
  } = useFeaturedGames({ adminMode: true });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [tempConfig, setTempConfig] = useState(config);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Filter games based on search and category
  const filteredGames = allGames.filter(game => {
    const matchesSearch = !searchQuery || 
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || game.category.id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(allGames.map(game => game.category.id)))
    .map(categoryId => allGames.find(game => game.category.id === categoryId)?.category)
    .filter(Boolean);

  // Handle config save
  const handleSaveConfig = async () => {
    setSaveStatus('saving');
    try {
      updateConfig(tempConfig);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Handle game toggle
  const handleToggleFeatured = (gameId: string) => {
    toggleFeatured(gameId);
  };

  const featuredGameIds = getFeaturedGameIds();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading featured games...</span>
      </div>
    );
  }

  return (
    <div className={`featured-games-admin bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 mr-3">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Featured Games Admin</h2>
            <p className="text-sm text-gray-600">
              Manage which games appear in the featured section
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Games Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Featured Games
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={tempConfig.maxFeatured}
                onChange={(e) => setTempConfig(prev => ({ 
                  ...prev, 
                  maxFeatured: parseInt(e.target.value) || 8 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotation Interval (seconds)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={tempConfig.rotationInterval / 1000}
                onChange={(e) => setTempConfig(prev => ({ 
                  ...prev, 
                  rotationInterval: (parseInt(e.target.value) || 5) * 1000 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={tempConfig.rotationEnabled}
                onChange={(e) => setTempConfig(prev => ({ 
                  ...prev, 
                  rotationEnabled: e.target.checked 
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable auto-rotation</span>
            </label>
          </div>
          
          <div className="mt-4 flex items-center space-x-2">
            <button
              onClick={handleSaveConfig}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
            </button>
            
            {saveStatus === 'saved' && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">Settings saved!</span>
              </div>
            )}
            
            {saveStatus === 'error' && (
              <div className="flex items-center text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">Failed to save settings</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Current Featured Games */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Current Featured Games ({featuredGames.length}/{config.maxFeatured})
          </h3>
          <button
            onClick={refreshFeaturedGames}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        
        {featuredGames.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No featured games selected
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featuredGames.map((game) => (
              <div key={game.id} className="relative">
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => handleToggleFeatured(game.id)}
                    className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                    title="Remove from featured"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <GameCard
                  game={game}
                  size="small"
                  showCategory={true}
                  showDescription={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Games */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Games</h3>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category!.id} value={category!.id}>
                  {category!.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {filteredGames.map((game) => {
            const isFeatured = featuredGameIds.includes(game.id);
            return (
              <div key={game.id} className="relative">
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => handleToggleFeatured(game.id)}
                    disabled={!isFeatured && !canFeatureMore}
                    className={`p-1 rounded-full transition-colors ${
                      isFeatured
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : canFeatureMore
                        ? 'bg-gray-200 text-gray-600 hover:bg-yellow-500 hover:text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    title={
                      isFeatured 
                        ? 'Remove from featured' 
                        : canFeatureMore 
                        ? 'Add to featured' 
                        : 'Maximum featured games reached'
                    }
                  >
                    <Star className={`w-3 h-3 ${isFeatured ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <GameCard
                  game={game}
                  size="small"
                  showCategory={true}
                  showDescription={false}
                />
              </div>
            );
          })}
        </div>
        
        {filteredGames.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No games found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedGamesAdmin;