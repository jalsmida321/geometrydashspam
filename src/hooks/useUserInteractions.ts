import { useState, useEffect, useCallback } from 'react';
import { Game } from '../types/game';
import { useGameContext } from '../context/GameContext';

/**
 * Hook for managing user interactions (favorites, recently played)
 */
export const useUserInteractions = () => {
  const context = useGameContext();
  const [recentlyPlayed, setRecentlyPlayed] = useState<Game[]>([]);
  const [favorites, setFavorites] = useState<Game[]>([]);

  // Load user data on mount and context changes
  useEffect(() => {
    setRecentlyPlayed(context.getRecentlyPlayed());
    setFavorites(context.getFavorites());
  }, [context]);

  /**
   * Add game to recently played
   */
  const addToRecentlyPlayed = useCallback((gameId: string) => {
    context.addToRecentlyPlayed(gameId);
    setRecentlyPlayed(context.getRecentlyPlayed());
  }, [context]);

  /**
   * Toggle favorite status
   */
  const toggleFavorite = useCallback((gameId: string) => {
    context.toggleFavorite(gameId);
    setFavorites(context.getFavorites());
  }, [context]);

  /**
   * Check if game is favorite
   */
  const isFavorite = useCallback((gameId: string): boolean => {
    return context.isFavorite(gameId);
  }, [context]);

  /**
   * Check if game was recently played
   */
  const isRecentlyPlayed = useCallback((gameId: string): boolean => {
    return recentlyPlayed.some(game => game.id === gameId);
  }, [recentlyPlayed]);

  /**
   * Get recently played games with limit
   */
  const getRecentlyPlayed = useCallback((limit?: number): Game[] => {
    return limit ? recentlyPlayed.slice(0, limit) : recentlyPlayed;
  }, [recentlyPlayed]);

  /**
   * Get favorite games with limit
   */
  const getFavorites = useCallback((limit?: number): Game[] => {
    return limit ? favorites.slice(0, limit) : favorites;
  }, [favorites]);

  /**
   * Clear recently played history
   */
  const clearRecentlyPlayed = useCallback(() => {
    context.clearRecentlyPlayed();
    setRecentlyPlayed([]);
  }, [context]);

  /**
   * Clear favorites
   */
  const clearFavorites = useCallback(() => {
    context.clearFavorites();
    setFavorites([]);
  }, [context]);

  return {
    recentlyPlayed,
    favorites,
    addToRecentlyPlayed,
    toggleFavorite,
    isFavorite,
    isRecentlyPlayed,
    getRecentlyPlayed,
    getFavorites,
    clearRecentlyPlayed,
    clearFavorites,
    hasRecentlyPlayed: recentlyPlayed.length > 0,
    hasFavorites: favorites.length > 0,
    recentlyPlayedCount: recentlyPlayed.length,
    favoritesCount: favorites.length
  };
};

/**
 * Hook for managing game play tracking
 */
export const useGamePlay = () => {
  const { addToRecentlyPlayed } = useUserInteractions();
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  /**
   * Start playing a game
   */
  const startGame = useCallback((game: Game) => {
    setCurrentGame(game);
    setIsPlaying(true);
    addToRecentlyPlayed(game.id);
  }, [addToRecentlyPlayed]);

  /**
   * Stop playing current game
   */
  const stopGame = useCallback(() => {
    setCurrentGame(null);
    setIsPlaying(false);
  }, []);

  /**
   * Pause/resume game
   */
  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return {
    currentGame,
    isPlaying,
    startGame,
    stopGame,
    togglePlayPause,
    hasCurrentGame: currentGame !== null
  };
};

/**
 * Hook for user preferences and settings
 */
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState({
    gridColumns: 3,
    showDescriptions: true,
    showCategories: true,
    defaultSort: 'popularity' as const,
    theme: 'light' as const
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        const parsedPreferences = JSON.parse(stored);
        setPreferences(prev => ({ ...prev, ...parsedPreferences }));
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  }, []);

  /**
   * Update preferences
   */
  const updatePreferences = useCallback((newPreferences: Partial<typeof preferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPreferences };
      
      try {
        localStorage.setItem('userPreferences', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save user preferences:', error);
      }
      
      return updated;
    });
  }, []);

  /**
   * Reset preferences to defaults
   */
  const resetPreferences = useCallback(() => {
    const defaultPreferences = {
      gridColumns: 3,
      showDescriptions: true,
      showCategories: true,
      defaultSort: 'popularity' as const,
      theme: 'light' as const
    };
    
    setPreferences(defaultPreferences);
    
    try {
      localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
    } catch (error) {
      console.error('Failed to reset user preferences:', error);
    }
  }, []);

  return {
    preferences,
    updatePreferences,
    resetPreferences
  };
};