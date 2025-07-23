import { renderHook, act } from '@testing-library/react';
import { useGames } from './useGames';
import { GameProvider } from '../context/GameContext';
import React from 'react';

// Mock the GameService
jest.mock('../services/GameService', () => ({
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
        featured: false,
        popularity: 80,
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
        featured: true,
        popularity: 90,
        dateAdded: new Date('2024-01-02')
      }
    ]),
    filterGames: jest.fn((filter) => {
      const allGames = [
        {
          id: 'test-game-1',
          name: 'Test Game 1',
          description: 'A test game',
          image: 'test-image-1.jpg',
          url: 'test-url-1',
          category: { id: 'action', name: 'Action', slug: 'action', description: 'Action games', icon: 'Zap', color: 'red' },
          tags: ['test', 'action'],
          featured: false,
          popularity: 80,
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
          featured: true,
          popularity: 90,
          dateAdded: new Date('2024-01-02')
        }
      ];
      
      if (filter.search) {
        return allGames.filter(game => 
          game.name.toLowerCase().includes(filter.search.toLowerCase())
        );
      }
      
      if (filter.category) {
        return allGames.filter(game => game.category.id === filter.category);
      }
      
      return allGames;
    })
  }
}));

// Mock CategoryService
jest.mock('../services/CategoryService', () => ({
  categoryService: {
    getAllCategories: jest.fn(() => [
      { id: 'action', name: 'Action', slug: 'action', description: 'Action games', icon: 'Zap', color: 'red' },
      { id: 'puzzle', name: 'Puzzle', slug: 'puzzle', description: 'Puzzle games', icon: 'Puzzle', color: 'green' }
    ])
  }
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GameProvider>{children}</GameProvider>
);

describe('useGames', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial games data', () => {
    const { result } = renderHook(() => useGames(), { wrapper });

    expect(result.current.games).toHaveLength(2);
    expect(result.current.games[0].name).toBe('Test Game 1');
    expect(result.current.games[1].name).toBe('Test Game 2');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update filter and filtered games', () => {
    const { result } = renderHook(() => useGames(), { wrapper });

    act(() => {
      result.current.updateFilter({ search: 'Test Game 1' });
    });

    expect(result.current.filter.search).toBe('Test Game 1');
    // The filtered games should be updated based on the mock implementation
    expect(result.current.games).toHaveLength(1);
    expect(result.current.games[0].name).toBe('Test Game 1');
  });

  it('should filter by category', () => {
    const { result } = renderHook(() => useGames(), { wrapper });

    act(() => {
      result.current.updateFilter({ category: 'action' });
    });

    expect(result.current.filter.category).toBe('action');
    expect(result.current.games).toHaveLength(1);
    expect(result.current.games[0].category.id).toBe('action');
  });

  it('should reset filter', () => {
    const { result } = renderHook(() => useGames(), { wrapper });

    // First set a filter
    act(() => {
      result.current.updateFilter({ search: 'Test Game 1' });
    });

    expect(result.current.filter.search).toBe('Test Game 1');

    // Then reset
    act(() => {
      result.current.resetFilter();
    });

    expect(result.current.filter.search).toBeUndefined();
    expect(result.current.games).toHaveLength(2);
  });

  it('should handle loading state', () => {
    const { result } = renderHook(() => useGames(), { wrapper });

    // Initially should not be loading
    expect(result.current.loading).toBe(false);
  });

  it('should provide game count', () => {
    const { result } = renderHook(() => useGames(), { wrapper });

    expect(result.current.count).toBe(2);

    act(() => {
      result.current.updateFilter({ search: 'Test Game 1' });
    });

    expect(result.current.count).toBe(1);
  });
});