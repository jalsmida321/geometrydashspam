import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GameProvider, useGameContext } from './GameContext';

// Mock the services
jest.mock('../services', () => ({
  gameService: {
    getAllGames: jest.fn(() => [
      {
        id: 'test-game-1',
        name: 'Test Game 1',
        description: 'A test game',
        image: 'test-image-1.jpg',
        url: 'test-url-1',
        category: { id: 'action', name: 'Action', slug: 'action', description: 'Action games', icon: 'Zap', color: 'red' },
        tags: ['test', 'action'],
        featured: true,
        popularity: 85,
        dateAdded: new Date('2024-01-01')
      },
      {
        id: 'test-game-2',
        name: 'Test Game 2',
        description: 'Another test game',
        image: 'test-image-2.jpg',
        url: 'test-url-2',
        category: { id: 'puzzle', name: 'Puzzle', slug: 'puzzle', description: 'Puzzle games', icon: 'Puzzle', color: 'green' },
        tags: ['test', 'puzzle'],
        featured: false,
        popularity: 70,
        dateAdded: new Date('2024-01-02')
      }
    ]),
    filterGames: jest.fn((filter) => {
      const games = [
        {
          id: 'test-game-1',
          name: 'Test Game 1',
          description: 'A test game',
          image: 'test-image-1.jpg',
          url: 'test-url-1',
          category: { id: 'action', name: 'Action', slug: 'action', description: 'Action games', icon: 'Zap', color: 'red' },
          tags: ['test', 'action'],
          featured: true,
          popularity: 85,
          dateAdded: new Date('2024-01-01')
        },
        {
          id: 'test-game-2',
          name: 'Test Game 2',
          description: 'Another test game',
          image: 'test-image-2.jpg',
          url: 'test-url-2',
          category: { id: 'puzzle', name: 'Puzzle', slug: 'puzzle', description: 'Puzzle games', icon: 'Puzzle', color: 'green' },
          tags: ['test', 'puzzle'],
          featured: false,
          popularity: 70,
          dateAdded: new Date('2024-01-02')
        }
      ];
      
      if (filter.category) {
        return games.filter(game => game.category.id === filter.category);
      }
      if (filter.search) {
        return games.filter(game => 
          game.name.toLowerCase().includes(filter.search.toLowerCase())
        );
      }
      return games;
    }),
    getGamesByCategory: jest.fn((categoryId) => {
      const games = [
        {
          id: 'test-game-1',
          name: 'Test Game 1',
          description: 'A test game',
          image: 'test-image-1.jpg',
          url: 'test-url-1',
          category: { id: 'action', name: 'Action', slug: 'action', description: 'Action games', icon: 'Zap', color: 'red' },
          tags: ['test', 'action'],
          featured: true,
          popularity: 85,
          dateAdded: new Date('2024-01-01')
        }
      ];
      return categoryId === 'action' ? games : [];
    }),
    getFeaturedGames: jest.fn(() => [
      {
        id: 'test-game-1',
        name: 'Test Game 1',
        description: 'A test game',
        image: 'test-image-1.jpg',
        url: 'test-url-1',
        category: { id: 'action', name: 'Action', slug: 'action', description: 'Action games', icon: 'Zap', color: 'red' },
        tags: ['test', 'action'],
        featured: true,
        popularity: 85,
        dateAdded: new Date('2024-01-01')
      }
    ]),
    getRelatedGames: jest.fn(() => []),
    getRecentlyPlayed: jest.fn(() => []),
    addToRecentlyPlayed: jest.fn(),
    getFavorites: jest.fn(() => []),
    toggleFavorite: jest.fn(),
    isFavorite: jest.fn(() => false),
    clearRecentlyPlayed: jest.fn(),
    clearFavorites: jest.fn()
  },
  categoryService: {
    getAllCategories: jest.fn(() => [
      { id: 'action', name: 'Action', slug: 'action', description: 'Action games', icon: 'Zap', color: 'red' },
      { id: 'puzzle', name: 'Puzzle', slug: 'puzzle', description: 'Puzzle games', icon: 'Puzzle', color: 'green' }
    ])
  },
  searchService: {
    searchGames: jest.fn(() => [])
  }
}));

const TestComponent: React.FC = () => {
  const context = useGameContext();
  return (
    <div>
      <div data-testid="games-count">{context.games.length}</div>
      <div data-testid="categories-count">{context.categories.length}</div>
      <div data-testid="filtered-games-count">{context.filteredGames.length}</div>
    </div>
  );
};

describe('GameContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GameProvider', () => {
    it('should provide game context to children', () => {
      const { getByTestId } = render(
        <GameProvider>
          <TestComponent />
        </GameProvider>
      );

      expect(getByTestId('games-count')).toHaveTextContent('2');
      expect(getByTestId('categories-count')).toHaveTextContent('2');
      expect(getByTestId('filtered-games-count')).toHaveTextContent('2');
    });

    it('should initialize with default filter', () => {
      const { result } = renderHook(() => useGameContext(), {
        wrapper: GameProvider
      });

      expect(result.current.currentFilter).toEqual({
        sortBy: 'popularity',
        sortOrder: 'desc'
      });
    });

    it('should load games and categories on mount', () => {
      renderHook(() => useGameContext(), {
        wrapper: GameProvider
      });

      const { gameService, categoryService } = require('../services');
      expect(gameService.getAllGames).toHaveBeenCalled();
      expect(categoryService.getAllCategories).toHaveBeenCalled();
    });

    it('should load user data on mount', () => {
      renderHook(() => useGameContext(), {
        wrapper: GameProvider
      });

      const { gameService } = require('../services');
      expect(gameService.getRecentlyPlayed).toHaveBeenCalled();
      expect(gameService.getFavorites).toHaveBeenCalled();
    });
  });

  describe('useGameContext', () => {
    it('should throw error when used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useGameContext());
      }).toThrow('useGameContext must be used within a GameProvider');
      
      consoleSpy.mockRestore();
    });

    it('should provide context methods', () => {
      const { result } = renderHook(() => useGameContext(), {
        wrapper: GameProvider
      });

      expect(result.current).toHaveProperty('games');
      expect(result.current).toHaveProperty('categories');
      expect(result.current).toHaveProperty('filteredGames');
      expect(result.current).toHaveProperty('currentFilter');
      expect(result.current).toHaveProperty('setFilter');
      expect(result.current).toHaveProperty('searchGames');
      expect(result.current).toHaveProperty('getGamesByCategory');
      expect(result.current).toHaveProperty('getFeaturedGames');
      expect(result.current).toHaveProperty('getRelatedGames');
      expect(result.current).toHaveProperty('getRecentlyPlayed');
      expect(result.current).toHaveProperty('addToRecentlyPlayed');
      expect(result.current).toHaveProperty('toggleFavorite');
      expect(result.current).toHaveProperty('getFavorites');
      expect(result.current).toHaveProperty('isFavorite');
      expect(result.current).toHaveProperty('clearRecentlyPlayed');
      expect(result.current).toHaveProperty('clearFavorites');
    });
  });

  describe('context methods', () => {
    it('should update filter and filtered games', () => {
      const { result } = renderHook(() => useGameContext(), {
        wrapper: GameProvider
      });

      act(() => {
        result.current.setFilter({ category: 'action' });
      });

      expect(result.current.currentFilter.category).toBe('action');
      
      const { gameService } = require('../services');
      expect(gameService.filterGames).toHaveBeenCalledWith({ category: 'action' });
    });

    it('should search games and update filter', () => {
      const { result } = renderHook(() => useGameContext(), {
        wrapper: GameProvider
      });

      act(() => {
        result.current.searchGames('test');
      });

      expect(result.current.currentFilter.search).toBe('test');
      
      const { gameService } = require('../services');
      expect(gameService.filterGames).toHaveBeenCalledWith({
        sortBy: 'popularity',
        sortOrder: 'desc',
        search: 'test'
      });
    });

    it('should get games by category', () => {
      const { result } = renderHook(() => useGameContext(), {
        wrapper: GameProvider
      });

      const games = result.current.getGamesByCategory('action');
      
      const { gameService } = require('../services');
      expect(gameService.getGamesByCategory).toHaveBeenCalledWith('action');
      expect(games).toBeDefined();
    });

    it('should get featured games', () => {
      const { result } = renderHook(() => useGameContext(), {
        wrapper: GameProvider
      });

      const games = result.current.getFeaturedGames();
      
      const { gameService } = require('../services');
      expect(gameService.getFeaturedGames).toHaveBeenCalled();
      expect(games).toBeDefined();
    });

    it('should get related games', () => {
      const { result } = renderHook(() => useGameContext(), {
        wrapper: GameProvider
      });

      const games = result.current.getRelatedGames('test-game-1');
      
      const { gameService } = require('../services');
      expect(gameService.getRelatedGames).toHaveBeenCalledWith('test-game-1');
      expect(games).toBeDefined();
    });

    it('should add to recently played', () => {
      const { result } = renderHook(() => useGameContext(), {
        wrapper: GameProvider
      });

      act(() => {
        result.current.addToRecentlyPlayed('test-game-1');
      });
      
      const { gameService } = require('../services');
      expect(gameService.addToRecentlyPlayed).toHaveBeenCalledWith('test-game-1');
      expect(gameService.getRecentlyPlayed).toHaveBeenCalled();
    });

    it('should toggle favorite', () => {
      const { result } = renderHook(() => useGameContext(), {
        wrapper: GameProvider
      });

      act(() => {
        result.current.toggleFavorite('test-game-1');
      });
      
      const { gameService } = require('../services');
      expect(gameService.toggleFavorite).toHaveBeenCalledWith('test-game-1');
      expect(gameService.getFavorites).toHaveBeenCalled();
    });

    it('should check if game is favorite', () => {
      const { result } = renderHook(() => useGameContext(), {
        wrapper: GameProvider
      });

      const isFavorite = result.current.isFavorite('test-game-1');
      
      const { gameService } = require('../services');
      expect(gameService.isFavorite).toHaveBeenCalledWith('test-game-1');
      expect(typeof isFavorite).toBe('boolean');
    });

    it('should clear recently played', () => {
      const { result } = renderHook(() => useGameContext(), {
        wrapper: GameProvider
      });

      act(() => {
        result.current.clearRecentlyPlayed();
      });
      
      const { gameService } = require('../services');
      expect(gameService.clearRecentlyPlayed).toHaveBeenCalled();
    });

    it('should clear favorites', () => {
      const { result } = renderHook(() => useGameContext(), {
        wrapper: GameProvider
      });

      act(() => {
        result.current.clearFavorites();
      });
      
      const { gameService } = require('../services');
      expect(gameService.clearFavorites).toHaveBeenCalled();
    });
  });
});