import { useState, useEffect, useMemo, useCallback } from 'react';
import { Game, GameFilter } from '../types/game';
import { searchService } from '../services';
import { useGameContext } from '../context/GameContext';

/**
 * Hook for managing search functionality
 */
export const useSearch = () => {
  const context = useGameContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Game[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search history
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history on mount
  useEffect(() => {
    setSearchHistory(searchService.getSearchHistory());
  }, []);

  /**
   * Perform search
   */
  const search = useCallback(async (searchQuery: string, filter?: Partial<GameFilter>) => {
    try {
      setLoading(true);
      setError(null);
      
      const searchResults = searchService.search(searchQuery, filter);
      setResults(searchResults);
      setQuery(searchQuery);
      
      // Update search history
      setSearchHistory(searchService.getSearchHistory());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get search suggestions
   */
  const getSuggestions = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const searchSuggestions = searchService.getSearchSuggestions(searchQuery);
      setSuggestions(searchSuggestions);
    } catch (err) {
      console.error('Failed to get suggestions:', err);
      setSuggestions([]);
    }
  }, []);

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setError(null);
  }, []);

  /**
   * Clear search history
   */
  const clearHistory = useCallback(() => {
    searchService.clearSearchHistory();
    setSearchHistory([]);
  }, []);

  /**
   * Get popular search terms
   */
  const popularTerms = useMemo(() => {
    return searchService.getPopularSearchTerms();
  }, []);

  return {
    query,
    results,
    suggestions,
    searchHistory,
    popularTerms,
    loading,
    error,
    search,
    getSuggestions,
    clearSearch,
    clearHistory,
    hasResults: results.length > 0,
    resultCount: results.length
  };
};

/**
 * Hook for advanced search functionality
 */
export const useAdvancedSearch = () => {
  const [results, setResults] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Perform advanced search
   */
  const advancedSearch = useCallback(async (criteria: {
    query?: string;
    category?: string;
    tags?: string[];
    minPopularity?: number;
    maxPopularity?: number;
    featured?: boolean;
    sortBy?: 'popularity' | 'name' | 'dateAdded';
    sortOrder?: 'asc' | 'desc';
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const searchResults = searchService.advancedSearch(criteria);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Advanced search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear results
   */
  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    advancedSearch,
    clearResults,
    hasResults: results.length > 0,
    resultCount: results.length
  };
};

/**
 * Hook for search suggestions with debouncing
 */
export const useSearchSuggestions = (query: string, delay: number = 300) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    
    const timeoutId = setTimeout(() => {
      try {
        const searchSuggestions = searchService.getSearchSuggestions(query);
        setSuggestions(searchSuggestions);
      } catch (err) {
        console.error('Failed to get suggestions:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      setLoading(false);
    };
  }, [query, delay]);

  return {
    suggestions,
    loading
  };
};