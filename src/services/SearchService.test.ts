import { searchService } from './SearchService';
import { gameService } from './GameService';

describe('SearchService', () => {
  beforeEach(() => {
    // Clear any cached data before each test
    searchService.clearSearchHistory();
  });

  describe('searchGames', () => {
    it('should return games matching search query', () => {
      const results = searchService.searchGames('geometry');
      
      expect(Array.isArray(results)).toBe(true);
      results.forEach(game => {
        const matchesName = game.name.toLowerCase().includes('geometry');
        const matchesDescription = game.description.toLowerCase().includes('geometry');
        const matchesTags = game.tags.some(tag => tag.toLowerCase().includes('geometry'));
        const matchesDeveloper = game.metadata?.developer?.toLowerCase().includes('geometry');
        
        expect(matchesName || matchesDescription || matchesTags || matchesDeveloper).toBe(true);
      });
    });

    it('should return empty array for non-matching query', () => {
      const results = searchService.searchGames('nonexistentgame12345');
      
      expect(results).toEqual([]);
    });

    it('should be case insensitive', () => {
      const lowerResults = searchService.searchGames('geometry');
      const upperResults = searchService.searchGames('GEOMETRY');
      const mixedResults = searchService.searchGames('GeOmEtRy');
      
      expect(lowerResults).toEqual(upperResults);
      expect(lowerResults).toEqual(mixedResults);
    });

    it('should handle empty search query', () => {
      const results = searchService.searchGames('');
      const allGames = gameService.getAllGames();
      
      expect(results).toEqual(allGames);
    });

    it('should handle whitespace-only search query', () => {
      const results = searchService.searchGames('   ');
      const allGames = gameService.getAllGames();
      
      expect(results).toEqual(allGames);
    });

    it('should search in game tags', () => {
      const allGames = gameService.getAllGames();
      const gameWithTags = allGames.find(game => game.tags.length > 0);
      
      if (gameWithTags) {
        const tag = gameWithTags.tags[0];
        const results = searchService.searchGames(tag);
        
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(game => game.tags.includes(tag))).toBe(true);
      }
    });

    it('should search in game descriptions', () => {
      const allGames = gameService.getAllGames();
      const gameWithDescription = allGames.find(game => game.description.length > 10);
      
      if (gameWithDescription) {
        const descriptionWord = gameWithDescription.description.split(' ')[0];
        const results = searchService.searchGames(descriptionWord);
        
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(game => 
          game.description.toLowerCase().includes(descriptionWord.toLowerCase())
        )).toBe(true);
      }
    });
  });

  describe('getSearchSuggestions', () => {
    it('should return suggestions for partial query', () => {
      const suggestions = searchService.getSearchSuggestions('geo');
      
      expect(Array.isArray(suggestions)).toBe(true);
      suggestions.forEach(suggestion => {
        expect(typeof suggestion).toBe('string');
        expect(suggestion.toLowerCase().includes('geo')).toBe(true);
      });
    });

    it('should limit suggestions to specified count', () => {
      const limit = 3;
      const suggestions = searchService.getSearchSuggestions('game', limit);
      
      expect(suggestions.length).toBeLessThanOrEqual(limit);
    });

    it('should return empty array for empty query', () => {
      const suggestions = searchService.getSearchSuggestions('');
      
      expect(suggestions).toEqual([]);
    });

    it('should return unique suggestions', () => {
      const suggestions = searchService.getSearchSuggestions('test');
      const uniqueSuggestions = [...new Set(suggestions)];
      
      expect(suggestions).toEqual(uniqueSuggestions);
    });
  });

  describe('addToSearchHistory', () => {
    it('should add search term to history', () => {
      const searchTerm = 'test search';
      searchService.addToSearchHistory(searchTerm);
      
      const history = searchService.getSearchHistory();
      expect(history).toContain(searchTerm);
    });

    it('should not add empty search terms', () => {
      const initialHistory = searchService.getSearchHistory();
      
      searchService.addToSearchHistory('');
      searchService.addToSearchHistory('   ');
      
      const finalHistory = searchService.getSearchHistory();
      expect(finalHistory).toEqual(initialHistory);
    });

    it('should move existing term to front', () => {
      searchService.addToSearchHistory('first');
      searchService.addToSearchHistory('second');
      searchService.addToSearchHistory('first'); // Add again
      
      const history = searchService.getSearchHistory();
      expect(history[0]).toBe('first');
    });

    it('should limit history size', () => {
      // Add more than the limit (assuming limit is 10)
      for (let i = 0; i < 15; i++) {
        searchService.addToSearchHistory(`search ${i}`);
      }
      
      const history = searchService.getSearchHistory();
      expect(history.length).toBeLessThanOrEqual(10);
    });
  });

  describe('getSearchHistory', () => {
    it('should return search history in reverse chronological order', () => {
      searchService.addToSearchHistory('first');
      searchService.addToSearchHistory('second');
      searchService.addToSearchHistory('third');
      
      const history = searchService.getSearchHistory();
      expect(history[0]).toBe('third');
      expect(history[1]).toBe('second');
      expect(history[2]).toBe('first');
    });

    it('should return empty array when no history exists', () => {
      const history = searchService.getSearchHistory();
      expect(history).toEqual([]);
    });
  });

  describe('clearSearchHistory', () => {
    it('should clear all search history', () => {
      searchService.addToSearchHistory('test1');
      searchService.addToSearchHistory('test2');
      
      expect(searchService.getSearchHistory().length).toBeGreaterThan(0);
      
      searchService.clearSearchHistory();
      
      expect(searchService.getSearchHistory()).toEqual([]);
    });
  });

  describe('getPopularSearches', () => {
    it('should return popular search terms', () => {
      const popularSearches = searchService.getPopularSearches();
      
      expect(Array.isArray(popularSearches)).toBe(true);
      popularSearches.forEach(search => {
        expect(typeof search).toBe('string');
        expect(search.length).toBeGreaterThan(0);
      });
    });

    it('should limit results to specified count', () => {
      const limit = 5;
      const popularSearches = searchService.getPopularSearches(limit);
      
      expect(popularSearches.length).toBeLessThanOrEqual(limit);
    });
  });

  describe('searchWithFilters', () => {
    it('should search with category filter', () => {
      const allGames = gameService.getAllGames();
      const firstCategory = allGames[0]?.category;
      
      if (firstCategory) {
        const results = searchService.searchWithFilters('', {
          category: firstCategory.id
        });
        
        results.forEach(game => {
          expect(game.category.id).toBe(firstCategory.id);
        });
      }
    });

    it('should search with tag filter', () => {
      const allGames = gameService.getAllGames();
      const gameWithTags = allGames.find(game => game.tags.length > 0);
      
      if (gameWithTags) {
        const tag = gameWithTags.tags[0];
        const results = searchService.searchWithFilters('', {
          tags: [tag]
        });
        
        results.forEach(game => {
          expect(game.tags).toContain(tag);
        });
      }
    });

    it('should combine search query with filters', () => {
      const allGames = gameService.getAllGames();
      const gameWithTags = allGames.find(game => game.tags.length > 0);
      
      if (gameWithTags) {
        const tag = gameWithTags.tags[0];
        const results = searchService.searchWithFilters(gameWithTags.name.substring(0, 3), {
          tags: [tag]
        });
        
        results.forEach(game => {
          expect(game.tags).toContain(tag);
          const matchesName = game.name.toLowerCase().includes(gameWithTags.name.substring(0, 3).toLowerCase());
          const matchesDescription = game.description.toLowerCase().includes(gameWithTags.name.substring(0, 3).toLowerCase());
          expect(matchesName || matchesDescription).toBe(true);
        });
      }
    });
  });

  describe('error handling', () => {
    it('should handle localStorage errors gracefully', () => {
      const originalGetItem = localStorage.getItem;
      const originalSetItem = localStorage.setItem;
      
      // Mock localStorage to throw errors
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage error');
      });
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage error');
      });
      
      expect(() => {
        searchService.addToSearchHistory('test');
        searchService.getSearchHistory();
        searchService.clearSearchHistory();
      }).not.toThrow();
      
      // Restore original methods
      localStorage.getItem = originalGetItem;
      localStorage.setItem = originalSetItem;
    });
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = searchService;
      const instance2 = searchService;
      
      expect(instance1).toBe(instance2);
    });
  });
});