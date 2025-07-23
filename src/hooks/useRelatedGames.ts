import { useState, useEffect } from 'react';
import { Game } from '../types/game';
import { gameService } from '../services';

/**
 * Hook for managing related games functionality
 */
export const useRelatedGames = (gameId: string, limit: number = 4) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) {
      setGames([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const relatedGames = gameService.getRelatedGames(gameId, limit);
      setGames(relatedGames);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load related games');
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, [gameId, limit]);

  return {
    games,
    loading,
    error,
    refetch: () => {
      if (gameId) {
        const relatedGames = gameService.getRelatedGames(gameId, limit);
        setGames(relatedGames);
      }
    }
  };
};

export default useRelatedGames;