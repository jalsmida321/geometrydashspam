import { useState, useEffect, useMemo } from 'react';
import { Game, GameFilter } from '../types/game';
import { useGameContext } from '../context/GameContext';
import { gameService } from '../services';

/**
 * Hook for managing games data and operations
 */
export const useGames = (initialFilter?: Partial<GameFilter>) => {
  const context = useGameContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Merge initial filter with context filter
  const filter = useMemo(() => ({
    ...context.currentFilter,
    ...initialFilter
  }), [context.currentFilter, initialFilter]);

  // Get filtered games based on current filter
  const games = useMemo(() => {
    try {
      setError(null);
      return gameService.filterGames(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
      return [];
    }
  }, [filter]);

  /**
   * Update filter
   */
  const updateFilter = (newFilter: Partial<GameFilter>) => {
    context.setFilter({ ...filter, ...newFilter });
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    context.setFilter({
      sortBy: 'popularity',
      sortOrder: 'desc'
    });
  };

  /**
   * Search games
   */
  const search = (query: string) => {
    context.searchGames(query);
  };

  return {
    games,
    loading,
    error,
    filter,
    updateFilter,
    clearFilters,
    search,
    totalGames: context.games.length,
    filteredCount: games.length
  };
};

/**
 * Hook for getting games by category
 */
export const useGamesByCategory = (categoryId: string) => {
  const context = useGameContext();
  
  const games = useMemo(() => {
    return context.getGamesByCategory(categoryId);
  }, [context, categoryId]);

  return {
    games,
    count: games.length
  };
};

/**
 * Hook for getting featured games
 */
export const useFeaturedGames = (limit?: number) => {
  const context = useGameContext();
  
  const games = useMemo(() => {
    const featured = context.getFeaturedGames();
    return limit ? featured.slice(0, limit) : featured;
  }, [context, limit]);

  return {
    games,
    count: games.length
  };
};

/**
 * Hook for getting related games
 */
export const useRelatedGames = (gameId: string, limit: number = 4) => {
  const context = useGameContext();
  
  const games = useMemo(() => {
    return context.getRelatedGames(gameId).slice(0, limit);
  }, [context, gameId, limit]);

  return {
    games,
    count: games.length
  };
};

/**
 * Hook for getting popular games
 */
export const usePopularGames = (limit?: number) => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const popularGames = gameService.getPopularGames(limit);
    setGames(popularGames);
  }, [limit]);

  return {
    games,
    count: games.length
  };
};

/**
 * Hook for getting trending games
 */
export const useTrendingGames = (limit: number = 6) => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const trendingGames = gameService.getTrendingGames(limit);
    setGames(trendingGames);
  }, [limit]);

  return {
    games,
    count: games.length
  };
};