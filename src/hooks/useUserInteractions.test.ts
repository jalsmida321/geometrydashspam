import { renderHook, act } from '@testing-library/react';
import { useUserInteractions, useGamePlay, useUserPreferences } from './useUserInteractions';
import { useGameContext } from '../context/GameContext';
import { Game } from '../types/game';

// Mock the GameContext
jest.mock('../context/GameContext', () => ({
  useGameContext: jest.fn()
}));

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

const mockGame: Game = {
  id: 'test-game-1',
  name: 'Test Game',
  description: 'A test game',
  image: 'https://example.com/test.jpg',
  url: 'https://example.com/play/test',
  category: {
    id: 'action',
    name: 'Action',
    slug: 'action',
    description: 'Action games',
    icon: 'Zap',
    color: 'red'
  },
  tags: ['test'],
  featured: false,
  popularity: 80,
  dateAdded: new Date('2024-01-01')
};

const mockGameContext = {
  getRecentlyPlayed: jest.fn(),
  getFavorites: jest.fn(),
  addToRecentlyPlayed: jest.fn(),
  toggleFavorite: jest.fn(),
  isFavorite: jest.fn(),
  clearRecentlyPlayed: jest.fn(),
  clearFavorites: jest.fn()
};

describe('useUserInteractions', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    (useGameContext as jest.Mock).mockReturnValue(mockGameContext);
    
    // Set up default mock returns
    mockGameContext.getRecentlyPlayed.mockReturnValue([]);
    mockGameContext.getFavorites.mockReturnValue([]);
    mockGameContext.isFavorite.mockReturnValue(false);
  });

  describe('Recently Played Functionality', () => {
    it('initializes with empty recently played list', () => {
      const { result } = renderHook(() => useUserInteractions());

      expect(result.current.recentlyPlayed).toEqual([]);
      expect(result.current.hasRecentlyPlayed).toBe(false);
      expect(result.current.recentlyPlayedCount).toBe(0);
    });

    it('loads recently played games from context', () => {
      mockGameContext.getRecentlyPlayed.mockReturnValue([mockGame]);

      const { result } = renderHook(() => useUserInteractions());

      expect(result.current.recentlyPlayed).toEqual([mockGame]);
      expect(result.current.hasRecentlyPlayed).toBe(true);
      expect(result.current.recentlyPlayedCount).toBe(1);
    });

    it('adds game to recently played', () => {
      const { result } = renderHook(() => useUserInteractions());

      act(() => {
        result.current.addToRecentlyPlayed('test-game-1');
      });

      expect(mockGameContext.addToRecentlyPlayed).toHaveBeenCalledWith('test-game-1');
      expect(mockGameContext.getRecentlyPlayed).toHaveBeenCalled();
    });

    it('checks if game is recently played', () => {
      mockGameContext.getRecentlyPlayed.mockReturnValue([mockGame]);

      const { result } = renderHook(() => useUserInteractions());

      const isRecentlyPlayed = result.current.isRecentlyPlayed('test-game-1');
      expect(isRecentlyPlayed).toBe(true);

      const isNotRecentlyPlayed = result.current.isRecentlyPlayed('other-game');
      expect(isNotRecentlyPlayed).toBe(false);
    });

    it('gets recently played games with limit', () => {
      const games = [mockGame, { ...mockGame, id: 'game-2' }, { ...mockGame, id: 'game-3' }];
      mockGameContext.getRecentlyPlayed.mockReturnValue(games);

      const { result } = renderHook(() => useUserInteractions());

      const limitedGames = result.current.getRecentlyPlayed(2);
      expect(limitedGames).toHaveLength(2);
      expect(limitedGames[0].id).toBe('test-game-1');
      expect(limitedGames[1].id).toBe('game-2');
    });

    it('clears recently played history', () => {
      const { result } = renderHook(() => useUserInteractions());

      act(() => {
        result.current.clearRecentlyPlayed();
      });

      expect(mockGameContext.clearRecentlyPlayed).toHaveBeenCalled();
    });
  });

  describe('Favorites Functionality', () => {
    it('initializes with empty favorites list', () => {
      const { result } = renderHook(() => useUserInteractions());

      expect(result.current.favorites).toEqual([]);
      expect(result.current.hasFavorites).toBe(false);
      expect(result.current.favoritesCount).toBe(0);
    });

    it('loads favorites from context', () => {
      mockGameContext.getFavorites.mockReturnValue([mockGame]);

      const { result } = renderHook(() => useUserInteractions());

      expect(result.current.favorites).toEqual([mockGame]);
      expect(result.current.hasFavorites).toBe(true);
      expect(result.current.favoritesCount).toBe(1);
    });

    it('toggles favorite status', () => {
      const { result } = renderHook(() => useUserInteractions());

      act(() => {
        result.current.toggleFavorite('test-game-1');
      });

      expect(mockGameContext.toggleFavorite).toHaveBeenCalledWith('test-game-1');
      expect(mockGameContext.getFavorites).toHaveBeenCalled();
    });

    it('checks if game is favorite', () => {
      mockGameContext.isFavorite.mockReturnValue(true);

      const { result } = renderHook(() => useUserInteractions());

      const isFavorite = result.current.isFavorite('test-game-1');
      expect(isFavorite).toBe(true);
      expect(mockGameContext.isFavorite).toHaveBeenCalledWith('test-game-1');
    });

    it('gets favorite games with limit', () => {
      const games = [mockGame, { ...mockGame, id: 'game-2' }, { ...mockGame, id: 'game-3' }];
      mockGameContext.getFavorites.mockReturnValue(games);

      const { result } = renderHook(() => useUserInteractions());

      const limitedFavorites = result.current.getFavorites(2);
      expect(limitedFavorites).toHaveLength(2);
    });

    it('clears favorites', () => {
      const { result } = renderHook(() => useUserInteractions());

      act(() => {
        result.current.clearFavorites();
      });

      expect(mockGameContext.clearFavorites).toHaveBeenCalled();
    });
  });
});

describe('useGamePlay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useGameContext as jest.Mock).mockReturnValue(mockGameContext);
    mockGameContext.getRecentlyPlayed.mockReturnValue([]);
    mockGameContext.getFavorites.mockReturnValue([]);
  });

  it('initializes with no current game', () => {
    const { result } = renderHook(() => useGamePlay());

    expect(result.current.currentGame).toBeNull();
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.hasCurrentGame).toBe(false);
  });

  it('starts playing a game', () => {
    const { result } = renderHook(() => useGamePlay());

    act(() => {
      result.current.startGame(mockGame);
    });

    expect(result.current.currentGame).toEqual(mockGame);
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.hasCurrentGame).toBe(true);
    expect(mockGameContext.addToRecentlyPlayed).toHaveBeenCalledWith('test-game-1');
  });

  it('stops playing current game', () => {
    const { result } = renderHook(() => useGamePlay());

    act(() => {
      result.current.startGame(mockGame);
    });

    act(() => {
      result.current.stopGame();
    });

    expect(result.current.currentGame).toBeNull();
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.hasCurrentGame).toBe(false);
  });

  it('toggles play/pause state', () => {
    const { result } = renderHook(() => useGamePlay());

    act(() => {
      result.current.startGame(mockGame);
    });

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.togglePlayPause();
    });

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentGame).toEqual(mockGame); // Game should still be current

    act(() => {
      result.current.togglePlayPause();
    });

    expect(result.current.isPlaying).toBe(true);
  });
});

describe('useUserPreferences', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('initializes with default preferences', () => {
    const { result } = renderHook(() => useUserPreferences());

    expect(result.current.preferences).toEqual({
      gridColumns: 3,
      showDescriptions: true,
      showCategories: true,
      defaultSort: 'popularity',
      theme: 'light'
    });
  });

  it('loads preferences from localStorage', () => {
    const savedPreferences = {
      gridColumns: 4,
      showDescriptions: false,
      theme: 'dark'
    };
    localStorage.setItem('userPreferences', JSON.stringify(savedPreferences));

    const { result } = renderHook(() => useUserPreferences());

    expect(result.current.preferences.gridColumns).toBe(4);
    expect(result.current.preferences.showDescriptions).toBe(false);
    expect(result.current.preferences.theme).toBe('dark');
    // Should maintain defaults for unspecified preferences
    expect(result.current.preferences.showCategories).toBe(true);
  });

  it('updates preferences and saves to localStorage', () => {
    const { result } = renderHook(() => useUserPreferences());

    act(() => {
      result.current.updatePreferences({ gridColumns: 4, theme: 'dark' });
    });

    expect(result.current.preferences.gridColumns).toBe(4);
    expect(result.current.preferences.theme).toBe('dark');
    
    const saved = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    expect(saved.gridColumns).toBe(4);
    expect(saved.theme).toBe('dark');
  });

  it('resets preferences to defaults', () => {
    const { result } = renderHook(() => useUserPreferences());

    // First update preferences
    act(() => {
      result.current.updatePreferences({ gridColumns: 4, theme: 'dark' });
    });

    // Then reset
    act(() => {
      result.current.resetPreferences();
    });

    expect(result.current.preferences).toEqual({
      gridColumns: 3,
      showDescriptions: true,
      showCategories: true,
      defaultSort: 'popularity',
      theme: 'light'
    });

    const saved = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    expect(saved.gridColumns).toBe(3);
    expect(saved.theme).toBe('light');
  });

  it('handles localStorage errors gracefully', () => {
    // Mock localStorage to throw errors
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = jest.fn(() => {
      throw new Error('Storage quota exceeded');
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useUserPreferences());

    // Should not throw error
    act(() => {
      result.current.updatePreferences({ gridColumns: 4 });
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to save user preferences:', expect.any(Error));

    // Restore mocks
    localStorage.setItem = originalSetItem;
    consoleSpy.mockRestore();
  });

  it('handles corrupted localStorage data', () => {
    localStorage.setItem('userPreferences', 'invalid-json');

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useUserPreferences());

    // Should fall back to defaults
    expect(result.current.preferences.gridColumns).toBe(3);

    consoleSpy.mockRestore();
  });
});