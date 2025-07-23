import { gameService } from './GameService';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('GameService - Recently Played Functionality', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('addToRecentlyPlayed', () => {
    it('should add a game to recently played list', () => {
      gameService.addToRecentlyPlayed('game-1');
      
      const recentlyPlayed = gameService.getRecentlyPlayed();
      expect(recentlyPlayed).toHaveLength(1);
      expect(recentlyPlayed[0]?.id).toBe('game-1');
    });

    it('should move existing game to front when played again', () => {
      gameService.addToRecentlyPlayed('game-1');
      gameService.addToRecentlyPlayed('game-2');
      gameService.addToRecentlyPlayed('game-1'); // Play game-1 again
      
      const recentlyPlayed = gameService.getRecentlyPlayed();
      expect(recentlyPlayed[0]?.id).toBe('game-1');
      expect(recentlyPlayed[1]?.id).toBe('game-2');
      expect(recentlyPlayed).toHaveLength(2);
    });

    it('should limit recently played list to 10 games', () => {
      // Add 12 games
      for (let i = 1; i <= 12; i++) {
        gameService.addToRecentlyPlayed(`game-${i}`);
      }
      
      const recentlyPlayed = gameService.getRecentlyPlayed();
      expect(recentlyPlayed).toHaveLength(10);
      expect(recentlyPlayed[0]?.id).toBe('game-12'); // Most recent first
      expect(recentlyPlayed[9]?.id).toBe('game-3'); // Oldest kept
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw an error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      // Should not throw an error
      expect(() => {
        gameService.addToRecentlyPlayed('game-1');
      }).not.toThrow();

      // Restore original method
      localStorage.setItem = originalSetItem;
    });
  });

  describe('getRecentlyPlayed', () => {
    it('should return empty array when no games played', () => {
      const recentlyPlayed = gameService.getRecentlyPlayed();
      expect(recentlyPlayed).toEqual([]);
    });

    it('should return games in correct order (most recent first)', () => {
      gameService.addToRecentlyPlayed('game-1');
      gameService.addToRecentlyPlayed('game-2');
      gameService.addToRecentlyPlayed('game-3');
      
      const recentlyPlayed = gameService.getRecentlyPlayed();
      expect(recentlyPlayed[0]?.id).toBe('game-3');
      expect(recentlyPlayed[1]?.id).toBe('game-2');
      expect(recentlyPlayed[2]?.id).toBe('game-1');
    });

    it('should filter out games that no longer exist', () => {
      // Add a game that exists and one that doesn't
      gameService.addToRecentlyPlayed('geometry-dash-spam-test'); // This exists in test data
      gameService.addToRecentlyPlayed('non-existent-game');
      
      const recentlyPlayed = gameService.getRecentlyPlayed();
      expect(recentlyPlayed).toHaveLength(1);
      expect(recentlyPlayed[0]?.id).toBe('geometry-dash-spam-test');
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('recentlyPlayed', 'invalid-json');
      
      const recentlyPlayed = gameService.getRecentlyPlayed();
      expect(recentlyPlayed).toEqual([]);
    });
  });

  describe('clearRecentlyPlayed', () => {
    it('should clear recently played history', () => {
      gameService.addToRecentlyPlayed('game-1');
      gameService.addToRecentlyPlayed('game-2');
      
      expect(gameService.getRecentlyPlayed()).toHaveLength(2);
      
      gameService.clearRecentlyPlayed();
      
      expect(gameService.getRecentlyPlayed()).toHaveLength(0);
      expect(localStorage.getItem('recentlyPlayed')).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      expect(() => {
        gameService.clearRecentlyPlayed();
      }).not.toThrow();

      localStorage.removeItem = originalRemoveItem;
    });
  });

  describe('getRecentlyPlayedCount', () => {
    it('should return correct count of recently played games', () => {
      expect(gameService.getRecentlyPlayedCount()).toBe(0);
      
      gameService.addToRecentlyPlayed('game-1');
      expect(gameService.getRecentlyPlayedCount()).toBe(1);
      
      gameService.addToRecentlyPlayed('game-2');
      expect(gameService.getRecentlyPlayedCount()).toBe(2);
    });

    it('should handle localStorage errors gracefully', () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      expect(gameService.getRecentlyPlayedCount()).toBe(0);

      localStorage.getItem = originalGetItem;
    });
  });

  describe('isRecentlyPlayed', () => {
    it('should return true for recently played games', () => {
      gameService.addToRecentlyPlayed('game-1');
      
      expect(gameService.isRecentlyPlayed('game-1')).toBe(true);
      expect(gameService.isRecentlyPlayed('game-2')).toBe(false);
    });

    it('should handle localStorage errors gracefully', () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      expect(gameService.isRecentlyPlayed('game-1')).toBe(false);

      localStorage.getItem = originalGetItem;
    });
  });
});

describe('GameService - Favorites Functionality', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('clearFavorites', () => {
    it('should clear favorites list', () => {
      gameService.toggleFavorite('game-1');
      gameService.toggleFavorite('game-2');
      
      expect(gameService.getFavorites()).toHaveLength(2);
      
      gameService.clearFavorites();
      
      expect(gameService.getFavorites()).toHaveLength(0);
      expect(localStorage.getItem('favorites')).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      expect(() => {
        gameService.clearFavorites();
      }).not.toThrow();

      localStorage.removeItem = originalRemoveItem;
    });
  });
});