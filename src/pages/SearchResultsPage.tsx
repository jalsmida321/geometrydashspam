import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, SortAsc, SortDesc, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { GameGrid, SearchBar, CategoryFilter } from '../components/game';
import { SEOHead } from '../components/SEO';
import { useGames, useCategories } from '../hooks';
import { GameFilter } from '../types/game';
import { gameService } from '../services';
import { generateMetaDescription } from '../utils/seoUtils';

/**
 * SearchResultsPage component for displaying search results with highlighting
 */
const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get data
  const { categories } = useCategories();
  
  // Get search query from URL
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  
  // Local state
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'dateAdded'>('popularity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured'>('all');
  
  const gamesPerPage = 20;

  // Create filter object
  const filter: GameFilter = {
    search: searchQuery,
    category: selectedCategory || undefined,
    sortBy,
    sortOrder
  };

  // Get filtered games
  const { games: searchResults } = useGames(filter);
  
  // Apply additional filters
  const filteredResults = searchResults.filter(game => {
    if (featuredFilter === 'featured' && !game.featured) {
      return false;
    }
    return true;
  });

  // Get search suggestions for no results
  const searchSuggestions = useMemo(() => {
    if (filteredResults.length > 0 || !searchQuery) return [];
    
    // Get popular games and trending games as suggestions
    const popular = gameService.getPopularGames(3);
    const trending = gameService.getTrendingGames(3);
    const featured = gameService.getFeaturedGames().slice(0, 3);
    
    return [...new Set([...popular, ...trending, ...featured])].slice(0, 6);
  }, [filteredResults.length, searchQuery]);

  // Get related games based on partial matches
  const relatedGames = useMemo(() => {
    if (filteredResults.length > 0 || !searchQuery) return [];
    
    const allGames = gameService.getAllGames();
    const query = searchQuery.toLowerCase();
    
    // Find games with partial matches in tags or descriptions
    const related = allGames.filter(game => {
      const hasTagMatch = game.tags.some(tag => 
        tag.toLowerCase().includes(query) || query.includes(tag.toLowerCase())
      );
      const hasDescMatch = game.description.toLowerCase().includes(query);
      const hasNamePartialMatch = game.name.toLowerCase().includes(query.substring(0, 3));
      
      return hasTagMatch || hasDescMatch || hasNamePartialMatch;
    }).slice(0, 6);
    
    return related;
  }, [filteredResults.length, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / gamesPerPage);
  const startIndex = (currentPage - 1) * gamesPerPage;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + gamesPerPage);

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy, sortOrder, featuredFilter]);

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

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  // Generate SEO metadata
  const seoTitle = searchQuery 
    ? `Search Results for "${searchQuery}" - Geometry Dash Spam Games` 
    : 'Search Games - Find Your Perfect Game';
  
  const seoDescription = searchQuery
    ? generateMetaDescription('search', { searchQuery, gameCount: filteredResults.length })
    : 'Search through our collection of free online games. Find exactly what you\'re looking for!';
  
  // Generate keywords based on search query and results
  const seoKeywords = [
    'search games',
    'find games',
    'online games',
    'free games'
  ];
  
  if (searchQuery) {
    seoKeywords.push(searchQuery);
    // Add related terms
    const relatedTerms = gameService.getAllTags()
      .filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()) || 
              searchQuery.toLowerCase().includes(tag.toLowerCase()))
      .slice(0, 5);
    seoKeywords.push(...relatedTerms);
  }
  
  if (selectedCategory) {
    const category = categories.find(c => c.id === selectedCategory);
    if (category) {
      seoKeywords.push(category.name.toLowerCase());
      seoKeywords.push(`${category.name.toLowerCase()} games`);
    }
  }

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        games={filteredResults}
        type="search"
        searchQuery={searchQuery}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Search Results</h1>
            {searchQuery ? (
              <p className="text-xl opacity-90 mb-4">
                Results for "{searchQuery}"
              </p>
            ) : (
              <p className="text-xl opacity-90 mb-4">
                Search our complete game collection
              </p>
            )}
            <div className="flex items-center space-x-4 text-sm">
              <span>{filteredResults.length} games found</span>
              {selectedCategory && (
                <>
                  <span>•</span>
                  <span>in {categories.find(c => c.id === selectedCategory)?.name}</span>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <Search className="w-16 h-16 opacity-50" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search games..."
            initialValue={searchQuery}
          />
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            showAll={true}
          />
        </div>
      )}

      {/* Results Section */}
      {filteredResults.length > 0 ? (
        <>
          {/* Controls */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>

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
                  <option value="popularity-desc">Most Relevant</option>
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
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  {/* Search Statistics */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Results
                    </label>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Total: {filteredResults.length} games</div>
                      <div>Featured: {filteredResults.filter(g => g.featured).length}</div>
                      <div>Categories: {new Set(filteredResults.map(g => g.category.id)).size}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Search Results
            </h2>
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(startIndex + gamesPerPage, filteredResults.length)} of {filteredResults.length} games
            </div>
          </div>

          {/* Games Grid */}
          <div className="mb-8">
            <GameGrid
              games={paginatedResults}
              columns={4}
              loading={false}
              highlightQuery={searchQuery}
            />
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
        </>
      ) : (
        /* No Results Section */
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No games found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? `We couldn't find any games matching "${searchQuery}"`
                : "Try entering a search term to find games"
              }
            </p>
            
            {/* Search Suggestions */}
            <div className="text-left max-w-md mx-auto">
              <div className="flex items-center mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="font-medium text-gray-900">Search suggestions:</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 mb-6">
                <li>• Try different keywords or shorter terms</li>
                <li>• Check your spelling</li>
                <li>• Use more general terms</li>
                <li>• Browse by category instead</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  navigate('/games');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse All Games
              </button>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to Home
              </button>
            </div>
          </div>

          {/* Search Suggestions Games */}
          {searchSuggestions.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Popular Games</h3>
              </div>
              <GameGrid
                games={searchSuggestions}
                columns={3}
                loading={false}
              />
            </div>
          )}

          {/* Related Games */}
          {relatedGames.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Search className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">You might also like</h3>
              </div>
              <GameGrid
                games={relatedGames}
                columns={3}
                loading={false}
              />
            </div>
          )}
        </div>
      )}

      {/* Related Games Section (when there are results) */}
      {filteredResults.length > 0 && searchQuery && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Searches</h3>
          <div className="flex flex-wrap gap-2">
            {gameService.getAllTags()
              .filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery.toLowerCase().includes(tag.toLowerCase()))
              .slice(0, 8)
              .map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-full hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                >
                  {tag}
                </button>
              ))
            }
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default SearchResultsPage;