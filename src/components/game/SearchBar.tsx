import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Filter, SortAsc, SortDesc } from 'lucide-react';
import { SearchBarProps, GameFilter } from '../../types/game';
import { useSearchSuggestions, useCategories } from '../../hooks';

/**
 * SearchBar component with suggestions, history, filters and sorting
 */
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search games...',
  suggestions = [],
  showFilters = true,
  showSorting = true,
  initialFilter = {}
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentFilter, setCurrentFilter] = useState<GameFilter>(initialFilter);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Get categories for filter options
  const { categories } = useCategories();
  
  // Get dynamic suggestions based on query
  const { suggestions: dynamicSuggestions, loading: suggestionsLoading } = useSearchSuggestions(query);

  // Load search history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('searchHistory');
      if (stored) {
        setSearchHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, []);

  // Handle click outside to close suggestions and filters
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
      
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setShowFiltersDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handle search submission
   */
  const handleSearch = (searchQuery: string, filter?: GameFilter) => {
    const searchFilter = filter || currentFilter;
    
    if (!searchQuery.trim() && !searchFilter.category && !searchFilter.tags?.length) return;

    // Add to search history if there's a query
    if (searchQuery.trim()) {
      const updatedHistory = [searchQuery, ...searchHistory.filter((item: string) => item !== searchQuery)].slice(0, 10);
      setSearchHistory(updatedHistory);
      
      try {
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Failed to save search history:', error);
      }
    }

    // Perform search with filters
    const finalFilter = { ...searchFilter, search: searchQuery };
    
    // Call onSearch with both parameters - the function signature allows for optional filter
    onSearch(searchQuery, finalFilter);
    
    setShowSuggestions(false);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0 || searchHistory.length > 0);
  };

  /**
   * Handle input focus
   */
  const handleInputFocus = () => {
    setShowSuggestions(query.length > 0 || searchHistory.length > 0);
  };

  /**
   * Handle suggestion click
   */
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  /**
   * Clear search
   */
  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    onSearch('');
    inputRef.current?.focus();
  };

  /**
   * Clear search history
   */
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  /**
   * Handle filter change
   */
  const handleFilterChange = (newFilter: Partial<GameFilter>) => {
    const updatedFilter = { ...currentFilter, ...newFilter };
    setCurrentFilter(updatedFilter);
    handleSearch(query, updatedFilter);
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    const clearedFilter: GameFilter = {};
    setCurrentFilter(clearedFilter);
    handleSearch(query, clearedFilter);
  };

  /**
   * Toggle filters dropdown
   */
  const toggleFilters = () => {
    setShowFiltersDropdown(!showFiltersDropdown);
    setShowSuggestions(false);
  };

  /**
   * Get active filter count
   */
  const getActiveFilterCount = () => {
    let count = 0;
    if (currentFilter.category) count++;
    if (currentFilter.tags && currentFilter.tags.length > 0) count++;
    if (currentFilter.sortBy) count++;
    return count;
  };

  // Combine all suggestions
  const allSuggestions = [
    ...dynamicSuggestions,
    ...suggestions.filter(s => !dynamicSuggestions.includes(s))
  ].slice(0, 8);

  // Popular tags for filter options
  const popularTags = ['spam', 'challenge', 'wave', 'master', 'rhythm', 'platformer', 'arcade'];

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Form with Filters */}
      <div className="flex gap-2">
        <form onSubmit={handleSubmit} className="relative flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder={placeholder}
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </form>

        {/* Filter Button */}
        {showFilters && (
          <button
            type="button"
            onClick={toggleFilters}
            className={`relative px-4 py-3 border rounded-lg flex items-center gap-2 transition-colors duration-200 ${
              showFiltersDropdown ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-5 w-5" />
            <span className="hidden sm:inline">Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {/* Search History */}
          {query.length === 0 && searchHistory.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4 mr-1" />
                  Recent Searches
                </div>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {searchHistory.slice(0, 5).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Suggestions */}
          {query.length > 0 && (
            <div className="p-3">
              <div className="flex items-center mb-2 text-sm font-medium text-gray-700">
                <TrendingUp className="w-4 h-4 mr-1" />
                Suggestions
              </div>
              {suggestionsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-8 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : allSuggestions.length > 0 ? (
                <div className="space-y-1">
                  {allSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded flex items-center"
                    >
                      <Search className="w-3 h-3 mr-2 text-gray-400" />
                      <span>
                        {suggestion.toLowerCase().includes(query.toLowerCase()) ? (
                          <>
                            {suggestion.substring(0, suggestion.toLowerCase().indexOf(query.toLowerCase()))}
                            <span className="font-semibold bg-yellow-200">
                              {suggestion.substring(
                                suggestion.toLowerCase().indexOf(query.toLowerCase()),
                                suggestion.toLowerCase().indexOf(query.toLowerCase()) + query.length
                              )}
                            </span>
                            {suggestion.substring(suggestion.toLowerCase().indexOf(query.toLowerCase()) + query.length)}
                          </>
                        ) : (
                          suggestion
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 py-2">
                  No suggestions found
                </div>
              )}
            </div>
          )}

          {/* Popular Searches */}
          {query.length === 0 && searchHistory.length === 0 && (
            <div className="p-3">
              <div className="flex items-center mb-2 text-sm font-medium text-gray-700">
                <TrendingUp className="w-4 h-4 mr-1" />
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {['geometry dash', 'spam', 'challenge', 'wave', 'master'].map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(term)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters Dropdown */}
      {showFiltersDropdown && (
        <div
          ref={filtersRef}
          className="absolute z-40 right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Search Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={currentFilter.category || ''}
                onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      const currentTags = currentFilter.tags || [];
                      const newTags = currentTags.includes(tag)
                        ? currentTags.filter(t => t !== tag)
                        : [...currentTags, tag];
                      handleFilterChange({ tags: newTags.length > 0 ? newTags : undefined });
                    }}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors duration-200 ${
                      currentFilter.tags?.includes(tag)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting Options */}
            {showSorting && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <select
                    value={currentFilter.sortBy || 'popularity'}
                    onChange={(e) => handleFilterChange({ 
                      sortBy: e.target.value as 'popularity' | 'name' | 'dateAdded' 
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="name">Name</option>
                    <option value="dateAdded">Date Added</option>
                  </select>
                  <button
                    onClick={() => handleFilterChange({ 
                      sortOrder: currentFilter.sortOrder === 'asc' ? 'desc' : 'asc' 
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    title={`Sort ${currentFilter.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                  >
                    {currentFilter.sortOrder === 'asc' ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Active Filters Summary */}
            {getActiveFilterCount() > 0 && (
              <div className="pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Active Filters:</div>
                <div className="flex flex-wrap gap-2">
                  {currentFilter.category && (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Category: {categories.find(c => c.id === currentFilter.category)?.name}
                      <button
                        onClick={() => handleFilterChange({ category: undefined })}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {currentFilter.tags?.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      {tag}
                      <button
                        onClick={() => {
                          const newTags = currentFilter.tags!.filter(t => t !== tag);
                          handleFilterChange({ tags: newTags.length > 0 ? newTags : undefined });
                        }}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {currentFilter.sortBy && currentFilter.sortBy !== 'popularity' && (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                      Sort: {currentFilter.sortBy} ({currentFilter.sortOrder || 'desc'})
                      <button
                        onClick={() => handleFilterChange({ sortBy: undefined, sortOrder: undefined })}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;