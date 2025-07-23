import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, SortAsc, SortDesc, Grid3X3 } from 'lucide-react';
import { GameGrid, SearchBar } from '../components/game';
import { SEOHead } from '../components/SEO';
import { useGamesByCategory, useCategoryBySlug, useCategories } from '../hooks';
import { GameFilter } from '../types/game';
import { gameService } from '../services';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  
  const { category, loading: categoryLoading, error: categoryError } = useCategoryBySlug(categorySlug || '');
  const { categories } = useCategories();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'dateAdded'>('popularity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured'>('all');
  
  const gamesPerPage = 12;

  const allCategoryGames = category ? gameService.getGamesByCategory(category.id) : [];
  
  const filteredGames = allCategoryGames.filter(game => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        game.name.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query) ||
        game.tags.some(tag => tag.toLowerCase().includes(query))
      );
      if (!matchesSearch) return false;
    }
    
    if (featuredFilter === 'featured' && !game.featured) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'popularity':
        comparison = b.popularity - a.popularity;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'dateAdded':
        comparison = b.dateAdded.getTime() - a.dateAdded.getTime();
        break;
    }
    
    return sortOrder === 'asc' ? -comparison : comparison;
  });

  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
  const startIndex = (currentPage - 1) * gamesPerPage;
  const paginatedGames = filteredGames.slice(startIndex, startIndex + gamesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, sortOrder, featuredFilter]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (categoryLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (categoryError || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="bg-red-50 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-red-900 mb-4">Category Not Found</h1>
            <p className="text-red-700 mb-6">
              The category "{categorySlug}" could not be found.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600',
      red: 'from-red-500 to-red-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      indigo: 'from-indigo-500 to-indigo-600'
    };
    return colorMap[color] || 'from-blue-500 to-blue-600';
  };

  return (
    <>
      <SEOHead
        title={`${category.name} Games - Play Online for Free`}
        description={`Play ${category.name.toLowerCase()} games online for free. ${category.description} Discover ${allCategoryGames.length} amazing games in this category.`}
        keywords={[category.name.toLowerCase(), 'games', 'online', 'free', 'browser games']}
        type="website"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <button
            onClick={() => navigate('/')}
            className="hover:text-gray-700 transition-colors duration-200"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">{category.name}</span>
        </nav>

        <div className={`bg-gradient-to-r ${getCategoryColorClass(category.color)} rounded-lg p-8 mb-8 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
              <p className="text-xl opacity-90 mb-4">{category.description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span>{allCategoryGames.length} games available</span>
                <span>•</span>
                <span>{allCategoryGames.filter(g => g.featured).length} featured</span>
              </div>
            </div>
            <div className="hidden md:block">
              <Grid3X3 className="w-16 h-16 opacity-50" />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <SearchBar
                onSearch={handleSearch}
                placeholder={`Search ${category.name.toLowerCase()} games...`}
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>

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
            </div>
          </div>

          {showFilters && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Stats
                  </label>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Total: {filteredGames.length} games</div>
                    <div>Featured: {filteredGames.filter(g => g.featured).length}</div>
                    <div>Average Rating: {Math.round(filteredGames.reduce((sum, g) => sum + g.popularity, 0) / filteredGames.length)}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : `${category.name} Games`}
          </h2>
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(startIndex + gamesPerPage, filteredGames.length)} of {filteredGames.length} games
          </div>
        </div>

        <div className="mb-8">
          <GameGrid
            games={paginatedGames}
            columns={3}
            loading={false}
          />
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mb-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + Math.max(1, currentPage - 2);
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

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore Other Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.filter(c => c.id !== category.id).map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate(`/games/category/${cat.slug}`)}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left"
              >
                <div className="font-medium text-gray-900">{cat.name}</div>
                <div className="text-sm text-gray-500 mt-1">{cat.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;