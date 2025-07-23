import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, SortAsc, SortDesc, Grid3X3, BarChart3, TrendingUp } from 'lucide-react';
import { GameGrid, SearchBar, CategoryFilter } from '../components/game';
import { useGames, useCategories } from '../hooks';
import { GameFilter } from '../types/game';
import { gameService } from '../services';

/**
 * AllGamesPage component for displaying all games with comprehensive filtering
 */
const AllGamesPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Get data
  const { categories } = useCategories();
  
  // Local state for filtering and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'dateAdded'>('popularity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const gamesPerPage = 24;

  // Create filter object
  const filter: GameFilter = {
    search: searchQuery,
    category: selectedCategory || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    sortBy,
    sortOrder
  };

  // Get filtered games
  const { games: allGames } = useGames(filter);
  
  // Apply additional filters
  const filteredGames = allGames.filter(game => {
    if (featuredFilter === 'featured' && !game.featured) {
      return false;
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
  const startIndex = (currentPage - 1) * gamesPerPage;
  const paginatedGames = filteredGames.slice(startIndex, startIndex + gamesPerPage);

  // Get game statistics
  const gameStats = gameService.getGameStats();
  const allTags = gameService.getAllTags();

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy, sortOrder, featuredFilter, selectedTags]);

  // Handle search
  const handleSearch = (query: string, filter?: GameFilter) => {
    setSearchQuery(query);
    if (filter?.category) {
      setSelectedCategory(filter.category);
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Handle tag toggle
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTags([]);
    setFeaturedFilter('all');
    setSortBy('popularity');
    setSortOrder('desc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">All Games</h1>
            <p className="text-xl opacity-90 mb-4">
              Discover and play from our complete collection of games
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Grid3X3 className="w-4 h-4" />
                <span>{gameStats.totalGames} total games</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>{gameStats.totalCategories} categories</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>{gameStats.featuredGames} featured</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Grid3X3 className="w-16 h-16 opacity-50" />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          showAll={true}
        />
      </div>

      {/* Search and Controls */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search all games..."
            />
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popularity-desc">Most Popular</option>
                <option value="popularity-asc">Least Popular</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="dateAdded-desc">Newest First</option>
                <option value="dateAdded-asc">Oldest First</option>
              </select>
              {sortOrder === 'asc' ? (
                <SortAsc className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              ) : (
                <SortDesc className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              )}
            </div>

            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Game Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="featured" 
                      value="all" 
                      checked={featuredFilter === 'all'}
                      onChange={(e) => setFeaturedFilter(e.target.value as 'all' | 'featured')}
                      className="mr-2" 
                    />
                    All Games
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="featured" 
                      value="featured" 
                      checked={featuredFilter === 'featured'}
                      onChange={(e) => setFeaturedFilter(e.target.value as 'all' | 'featured')}
                      className="mr-2" 
                    />
                    Featured Only
                  </label>
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {allTags.slice(0, 10).map(tag => (
                    <label key={tag} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        className="mr-2" 
                      />
                      <span className="text-sm">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Results
                </label>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Total: {filteredGames.length} games</div>
                  <div>Featured: {filteredGames.filter(g => g.featured).length}</div>
                  <div>Categories: {new Set(filteredGames.map(g => g.category.id)).size}</div>
                  <div>Average Rating: {filteredGames.length > 0 ? Math.round(filteredGames.reduce((sum, g) => sum + g.popularity, 0) / filteredGames.length) : 0}%</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {(searchQuery || selectedCategory || selectedTags.length > 0 || featuredFilter === 'featured') && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Category: {categories.find(c => c.id === selectedCategory)?.name}
                <button
                  onClick={() => setSelectedCategory('')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Tag: {tag}
                <button
                  onClick={() => handleTagToggle(tag)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            ))}
            {featuredFilter === 'featured' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Featured Only
                <button
                  onClick={() => setFeaturedFilter('all')}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Games'}
        </h2>
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1}-{Math.min(startIndex + gamesPerPage, filteredGames.length)} of {filteredGames.length} games
        </div>
      </div>

      {/* Games Grid */}
      <div className="mb-8">
        {filteredGames.length > 0 ? (
          <GameGrid
            games={paginatedGames}
            columns={4}
            loading={false}
          />
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <Grid3X3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No games found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search terms to find more games.
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mb-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            const page = i + Math.max(1, currentPage - 3);
            if (page > totalPages) return null;
            
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === currentPage
                    ? 'text-white bg-blue-600 border border-blue-600'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Game Discovery Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Discover More Games</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Trending Games</h4>
            <p className="text-sm text-gray-500">Check out what's popular right now</p>
            <button
              onClick={() => {
                setSortBy('popularity');
                setSortOrder('desc');
                setFeaturedFilter('all');
              }}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              View Trending →
            </button>
          </div>
          
          <div className="text-center">
            <Grid3X3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Featured Games</h4>
            <p className="text-sm text-gray-500">Hand-picked favorites from our collection</p>
            <button
              onClick={() => setFeaturedFilter('featured')}
              className="mt-2 text-sm text-green-600 hover:text-green-800"
            >
              View Featured →
            </button>
          </div>
          
          <div className="text-center">
            <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Browse Categories</h4>
            <p className="text-sm text-gray-500">Explore games by category</p>
            <button
              onClick={() => navigate('/')}
              className="mt-2 text-sm text-purple-600 hover:text-purple-800"
            >
              Browse Categories →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllGamesPage;