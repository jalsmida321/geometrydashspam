import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Game, GameCategory, GameFilter, GameContextType } from '../types/game';
import { gameService, categoryService, searchService } from '../services';

/**
 * Game Context for managing global game state
 */
const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // Core data state
  const [games] = useState<Game[]>(() => gameService.getAllGames());
  const [categories] = useState<GameCategory[]>(() => categoryService.getAllCategories());
  
  // Filter and search state
  const [currentFilter, setCurrentFilter] = useState<GameFilter>({
    sortBy: 'popularity',
    sortOrder: 'desc'
  });
  const [filteredGames, setFilteredGames] = useState<Game[]>(games);

  // User interaction state
  const [recentlyPlayed, setRecentlyPlayed] = useState<Game[]>([]);
  const [favorites, setFavorites] = useState<Game[]>([]);

  // Load user data on mount
  useEffect(() => {
    setRecentlyPlayed(gameService.getRecentlyPlayed());
    setFavorites(gameService.getFavorites());
  }, []);

  // Update filtered games when filter changes
  useEffect(() => {
    const filtered = gameService.filterGames(currentFilter);
    setFilteredGames(filtered);
  }, [currentFilter]);

  /**
   * Set filter and update filtered games
   */
  const setFilter = (filter: GameFilter) => {
    setCurrentFilter(filter);
  };

  /**
   * Search games and update filter
   */
  const searchGames = (query: string) => {
    const newFilter: GameFilter = {
      ...currentFilter,
      search: query
    };
    setCurrentFilter(newFilter);
  };

  /**
   * Get games by category
   */
  const getGamesByCategory = (categoryId: string): Game[] => {
    return gameService.getGamesByCategory(categoryId);
  };

  /**
   * Get featured games
   */
  const getFeaturedGames = (): Game[] => {
    return gameService.getFeaturedGames();
  };

  /**
   * Get related games
   */
  const getRelatedGames = (gameId: string): Game[] => {
    return gameService.getRelatedGames(gameId);
  };

  /**
   * Get recently played games
   */
  const getRecentlyPlayed = (): Game[] => {
    return recentlyPlayed;
  };

  /**
   * Add game to recently played
   */
  const addToRecentlyPlayed = (gameId: string) => {
    gameService.addToRecentlyPlayed(gameId);
    setRecentlyPlayed(gameService.getRecentlyPlayed());
  };

  /**
   * Toggle favorite status
   */
  const toggleFavorite = (gameId: string) => {
    gameService.toggleFavorite(gameId);
    setFavorites(gameService.getFavorites());
  };

  /**
   * Get favorite games
   */
  const getFavorites = (): Game[] => {
    return favorites;
  };

  /**
   * Check if game is favorite
   */
  const isFavorite = (gameId: string): boolean => {
    return gameService.isFavorite(gameId);
  };

  /**
   * Clear recently played history
   */
  const clearRecentlyPlayed = () => {
    gameService.clearRecentlyPlayed();
    setRecentlyPlayed([]);
  };

  /**
   * Clear favorites
   */
  const clearFavorites = () => {
    gameService.clearFavorites();
    setFavorites([]);
  };

  const contextValue: GameContextType = {
    games,
    categories,
    filteredGames,
    currentFilter,
    setFilter,
    searchGames,
    getGamesByCategory,
    getFeaturedGames,
    getRelatedGames,
    getRecentlyPlayed,
    addToRecentlyPlayed,
    toggleFavorite,
    getFavorites,
    isFavorite,
    clearRecentlyPlayed,
    clearFavorites
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

/**
 * Hook to use game context
 */
export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export default GameContext;