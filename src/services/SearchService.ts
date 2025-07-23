import { Game, GameCategory } from '../types/game';
import { gameService } from './GameService';
import { categoryService } from './CategoryService';
import { MemoryCache, memoize } from '../utils/performanceUtils';

/**
 * Search result interface
 */
export interface SearchResult {
  games: Game[];
  categories: GameCategory[];
  suggestions: string[];
  totalResults: number;
  searchTime: number;
}

/**
 * Search options interface
 */
export interface SearchOptions {
  includeCategories?: boolean;
  includeSuggestions?: boolean;
  maxResults?: number;
  fuzzySearch?: boolean;
  searchInTags?: boolean;
  searchInMetadata?: boolean;
}

/**
 * SearchService - Core service for game search functionality
 * Handles all search-related operations including fuzzy search, suggestions, and filtering
 */
export class SearchService {
  private static instance: SearchService;
  private searchHistory: string[] = [];
  private popularSearches: Map<string, number> = new Map();
  private searchCache: MemoryCache = new MemoryCache();

  private constructor() {
    this.loadSearchHistory();
    this.loadPopularSearches();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  /**
   * Main search function with caching
   */
  public search(query: string, options: SearchOptions = {}): SearchResult {
    const startTime = performance.now();
    
    const {
      includeCategories = true,
      includeSuggestions = true,
      maxResults = 50,
      fuzzySearch = true,
      searchInTags = true,
      searchInMetadata = true
    } = options;

    // Normalize query
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery === '') {
      return {
        games: [],
        categories: [],
        suggestions: [],
        totalResults: 0,
        searchTime: 0
      };
    }

    // Record search
    this.recordSearch(normalizedQuery);

    // Create cache key based on query and options
    const cacheKey = `search_${normalizedQuery}_${JSON.stringify({
      includeCategories,
      maxResults,
      fuzzySearch,
      searchInTags,
      searchInMetadata
    })}`;

    // Check if we have cached results
    const cachedResult = this.searchCache.get<SearchResult>(cacheKey);
    if (cachedResult) {
      return {
        ...cachedResult,
        searchTime: 0 // Mark as cached result
      };
    }

    // Search games
    const games = this.searchGames(normalizedQuery, {
      fuzzySearch,
      searchInTags,
      searchInMetadata,
      maxResults
    });

    // Search categories
    const categories = includeCategories 
      ? this.searchCategories(normalizedQuery)
      : [];

    // Generate suggestions
    const suggestions = includeSuggestions 
      ? this.generateSuggestions(normalizedQuery)
      : [];

    const endTime = performance.now();
    const searchTime = Math.round(endTime - startTime);
    
    // Cache the result for 5 minutes
    const result = {
      games,
      categories,
      suggestions,
      totalResults: games.length + categories.length,
      searchTime
    };
    
    this.searchCache.set(cacheKey, result, 5 * 60 * 1000); // 5 minutes TTL

    return {
      games,
      categories,
      suggestions,
      totalResults: games.length + categories.length,
      searchTime
    };
  }

  /**
   * Search games with advanced options
   */
  private searchGames(
    query: string, 
    options: {
      fuzzySearch: boolean;
      searchInTags: boolean;
      searchInMetadata: boolean;
      maxResults: number;
    }
  ): Game[] {
    const allGames = gameService.getAllGames();
    const results: Array<{ game: Game; score: number }> = [];

    allGames.forEach(game => {
      let score = 0;

      // Exact name match (highest score)
      if (game.name.toLowerCase() === query) {
        score += 100;
      }
      // Name contains query (high score)
      else if (game.name.toLowerCase().includes(query)) {
        score += 50;
        // Bonus for starting with query
        if (game.name.toLowerCase().startsWith(query)) {
          score += 20;
        }
      }
      // Fuzzy name match
      else if (options.fuzzySearch && this.fuzzyMatch(game.name.toLowerCase(), query)) {
        score += 25;
      }

      // Description match (medium score)
      if (game.description.toLowerCase().includes(query)) {
        score += 30;
      }
      // Fuzzy description match
      else if (options.fuzzySearch && this.fuzzyMatch(game.description.toLowerCase(), query)) {
        score += 15;
      }

      // Tag matches (medium score)
      if (options.searchInTags) {
        game.tags.forEach(tag => {
          if (tag.toLowerCase() === query) {
            score += 40;
          } else if (tag.toLowerCase().includes(query)) {
            score += 20;
          } else if (options.fuzzySearch && this.fuzzyMatch(tag.toLowerCase(), query)) {
            score += 10;
          }
        });
      }

      // Metadata matches (low score)
      if (options.searchInMetadata && game.metadata) {
        const { developer, controls, instructions } = game.metadata;
        
        if (developer && developer.toLowerCase().includes(query)) {
          score += 15;
        }
        if (controls && controls.toLowerCase().includes(query)) {
          score += 10;
        }
        if (instructions && instructions.toLowerCase().includes(query)) {
          score += 10;
        }
      }

      // Category name match (low score)
      if (game.category.name.toLowerCase().includes(query)) {
        score += 15;
      }

      // Popularity boost (very low score)
      score += game.popularity * 0.1;

      // Featured game boost
      if (game.featured) {
        score += 5;
      }

      if (score > 0) {
        results.push({ game, score });
      }
    });

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, options.maxResults)
      .map(result => result.game);
  }

  /**
   * Search categories
   */
  private searchCategories(query: string): GameCategory[] {
    return categoryService.searchCategories(query);
  }

  /**
   * Generate search suggestions with memoization
   */
  public generateSuggestions = memoize((query: string, limit: number = 5): string[] => {
    const suggestions = new Set<string>();
    const normalizedQuery = query.toLowerCase();

    // Get suggestions from game names
    const allGames = gameService.getAllGames();
    allGames.forEach(game => {
      const words = game.name.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.startsWith(normalizedQuery) && word !== normalizedQuery) {
          suggestions.add(word);
        }
      });

      // Add full game name if it starts with query
      if (game.name.toLowerCase().startsWith(normalizedQuery) && 
          game.name.toLowerCase() !== normalizedQuery) {
        suggestions.add(game.name);
      }
    });

    // Get suggestions from tags
    const allTags = gameService.getAllTags();
    allTags.forEach(tag => {
      if (tag.toLowerCase().startsWith(normalizedQuery) && 
          tag.toLowerCase() !== normalizedQuery) {
        suggestions.add(tag);
      }
    });

    // Get suggestions from categories
    const allCategories = categoryService.getAllCategories();
    allCategories.forEach(category => {
      if (category.name.toLowerCase().startsWith(normalizedQuery) && 
          category.name.toLowerCase() !== normalizedQuery) {
        suggestions.add(category.name);
      }
    });

    // Add popular searches that match
    Array.from(this.popularSearches.keys()).forEach(search => {
      if (search.startsWith(normalizedQuery) && search !== normalizedQuery) {
        suggestions.add(search);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Get search suggestions for autocomplete
   */
  public getAutocompleteSuggestions(query: string, limit: number = 8): string[] {
    if (query.length < 2) return [];
    return this.generateSuggestions(query, limit);
  }

  /**
   * Get search suggestions (alias for getAutocompleteSuggestions)
   */
  public getSearchSuggestions(query: string, limit: number = 8): string[] {
    return this.getAutocompleteSuggestions(query, limit);
  }

  /**
   * Get popular searches
   */
  public getPopularSearches(limit: number = 10): string[] {
    return Array.from(this.popularSearches.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([search]) => search);
  }

  /**
   * Get popular search terms (alias for getPopularSearches)
   */
  public getPopularSearchTerms(limit: number = 10): string[] {
    return this.getPopularSearches(limit);
  }

  /**
   * Get search history
   */
  public getSearchHistory(limit: number = 10): string[] {
    return this.searchHistory.slice(-limit).reverse();
  }

  /**
   * Clear search history
   */
  public clearSearchHistory(): void {
    this.searchHistory = [];
    this.saveSearchHistory();
  }

  /**
   * Record a search query
   */
  private recordSearch(query: string): void {
    // Add to history
    if (!this.searchHistory.includes(query)) {
      this.searchHistory.push(query);
      // Keep only last 50 searches
      if (this.searchHistory.length > 50) {
        this.searchHistory = this.searchHistory.slice(-50);
      }
      this.saveSearchHistory();
    }

    // Update popular searches
    const currentCount = this.popularSearches.get(query) || 0;
    this.popularSearches.set(query, currentCount + 1);
    this.savePopularSearches();
  }

  /**
   * Fuzzy string matching
   */
  private fuzzyMatch(text: string, pattern: string): boolean {
    const textLen = text.length;
    const patternLen = pattern.length;
    
    if (patternLen === 0) return true;
    if (textLen === 0) return false;

    let textIndex = 0;
    let patternIndex = 0;

    while (textIndex < textLen && patternIndex < patternLen) {
      if (text[textIndex] === pattern[patternIndex]) {
        patternIndex++;
      }
      textIndex++;
    }

    return patternIndex === patternLen;
  }

  /**
   * Advanced search with filters
   */
  public advancedSearch(
    query: string,
    filters: {
      categories?: string[];
      tags?: string[];
      minPopularity?: number;
      maxPopularity?: number;
      featuredOnly?: boolean;
      dateRange?: { start: Date; end: Date };
    }
  ): Game[] {
    let results = this.searchGames(query, {
      fuzzySearch: true,
      searchInTags: true,
      searchInMetadata: true,
      maxResults: 100
    });

    // Apply filters
    if (filters.categories && filters.categories.length > 0) {
      results = results.filter(game => 
        filters.categories!.includes(game.category.id)
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(game =>
        filters.tags!.some(tag => game.tags.includes(tag))
      );
    }

    if (filters.minPopularity !== undefined) {
      results = results.filter(game => game.popularity >= filters.minPopularity!);
    }

    if (filters.maxPopularity !== undefined) {
      results = results.filter(game => game.popularity <= filters.maxPopularity!);
    }

    if (filters.featuredOnly) {
      results = results.filter(game => game.featured);
    }

    if (filters.dateRange) {
      results = results.filter(game =>
        game.dateAdded >= filters.dateRange!.start &&
        game.dateAdded <= filters.dateRange!.end
      );
    }

    return results;
  }

  /**
   * Get search analytics
   */
  public getSearchAnalytics(): {
    totalSearches: number;
    uniqueSearches: number;
    topSearches: Array<{ query: string; count: number }>;
    averageResultsPerSearch: number;
  } {
    const totalSearches = Array.from(this.popularSearches.values())
      .reduce((sum, count) => sum + count, 0);
    
    const uniqueSearches = this.popularSearches.size;
    
    const topSearches = Array.from(this.popularSearches.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));

    return {
      totalSearches,
      uniqueSearches,
      topSearches,
      averageResultsPerSearch: totalSearches > 0 ? Math.round(totalSearches / uniqueSearches) : 0
    };
  }

  /**
   * Load search history from localStorage
   */
  private loadSearchHistory(): void {
    try {
      const stored = localStorage.getItem('gamesite_search_history');
      if (stored) {
        this.searchHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load search history:', error);
    }
  }

  /**
   * Save search history to localStorage
   */
  private saveSearchHistory(): void {
    try {
      localStorage.setItem('gamesite_search_history', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.warn('Failed to save search history:', error);
    }
  }

  /**
   * Load popular searches from localStorage
   */
  private loadPopularSearches(): void {
    try {
      const stored = localStorage.getItem('gamesite_popular_searches');
      if (stored) {
        const data = JSON.parse(stored);
        this.popularSearches = new Map(data);
      }
    } catch (error) {
      console.warn('Failed to load popular searches:', error);
    }
  }

  /**
   * Save popular searches to localStorage
   */
  private savePopularSearches(): void {
    try {
      const data = Array.from(this.popularSearches.entries());
      localStorage.setItem('gamesite_popular_searches', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save popular searches:', error);
    }
  }
}

// Export singleton instance
export const searchService = SearchService.getInstance();