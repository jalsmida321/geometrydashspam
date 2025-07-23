import { useState, useEffect, useCallback } from 'react';
import { Game } from '../types/game';
import { gameService } from '../services/GameService';

interface FeaturedGamesConfig {
  maxFeatured: number;
  rotationEnabled: boolean;
  rotationInterval: number;
  adminMode: boolean;
}

interface UseFeaturedGamesReturn {
  featuredGames: Game[];
  allGames: Game[];
  config: FeaturedGamesConfig;
  isLoading: boolean;
  error: string | null;
  toggleFeatured: (gameId: string) => void;
  updateConfig: (newConfig: Partial<FeaturedGamesConfig>) => void;
  refreshFeaturedGames: () => void;
  getFeaturedGameIds: () => string[];
  canFeatureMore: boolean;
}

/**
 * Custom hook for managing featured games with admin controls
 */
export const useFeaturedGames = (initialConfig?: Partial<FeaturedGamesConfig>): UseFeaturedGamesReturn => {
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [config, setConfig] = useState<FeaturedGamesConfig>({
    maxFeatured: 8,
    rotationEnabled: true,
    rotationInterval: 5000,
    adminMode: false,
    ...initialConfig
  });

  // Load featured games configuration from localStorage
  const loadFeaturedConfig = useCallback(() => {
    try {
      const savedConfig = localStorage.getItem('featuredGamesConfig');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(prev => ({ ...prev, ...parsedConfig }));
      }
    } catch (err) {
      console.warn('Failed to load featured games config:', err);
    }
  }, []);

  // Save featured games configuration to localStorage
  const saveFeaturedConfig = useCallback((newConfig: FeaturedGamesConfig) => {
    try {
      localStorage.setItem('featuredGamesConfig', JSON.stringify(newConfig));
    } catch (err) {
      console.warn('Failed to save featured games config:', err);
    }
  }, []);

  // Load custom featured games from localStorage
  const loadCustomFeaturedGames = useCallback(() => {
    try {
      const customFeatured = localStorage.getItem('customFeaturedGames');
      return customFeatured ? JSON.parse(customFeatured) : [];
    } catch (err) {
      console.warn('Failed to load custom featured games:', err);
      return [];
    }
  }, []);

  // Save custom featured games to localStorage
  const saveCustomFeaturedGames = useCallback((gameIds: string[]) => {
    try {
      localStorage.setItem('customFeaturedGames', JSON.stringify(gameIds));
    } catch (err) {
      console.warn('Failed to save custom featured games:', err);
    }
  }, []);

  // Get featured game IDs (combination of default and custom)
  const getFeaturedGameIds = useCallback(() => {
    const defaultFeatured = gameService.getFeaturedGames().map(game => game.id);
    const customFeatured = loadCustomFeaturedGames();
    
    // Combine and deduplicate, prioritizing custom featured games
    const combined = [...new Set([...customFeatured, ...defaultFeatured])];
    return combined.slice(0, config.maxFeatured);
  }, [config.maxFeatured, loadCustomFeaturedGames]);

  // Refresh featured games data
  const refreshFeaturedGames = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      // Get all games
      const games = gameService.getAllGames();
      setAllGames(games);

      // Get featured game IDs
      const featuredIds = getFeaturedGameIds();
      
      // Get featured games in the correct order
      const featured = featuredIds
        .map(id => gameService.getGameById(id))
        .filter((game): game is Game => game !== undefined);

      setFeaturedGames(featured);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load featured games');
    } finally {
      setIsLoading(false);
    }
  }, [getFeaturedGameIds]);

  // Toggle featured status of a game
  const toggleFeatured = useCallback((gameId: string) => {
    const customFeatured = loadCustomFeaturedGames();
    const isCurrentlyFeatured = customFeatured.includes(gameId);

    let updatedFeatured: string[];
    
    if (isCurrentlyFeatured) {
      // Remove from featured
      updatedFeatured = customFeatured.filter(id => id !== gameId);
    } else {
      // Add to featured (respect max limit)
      if (customFeatured.length >= config.maxFeatured) {
        // Remove oldest featured game to make room
        updatedFeatured = [gameId, ...customFeatured.slice(0, config.maxFeatured - 1)];
      } else {
        updatedFeatured = [gameId, ...customFeatured];
      }
    }

    saveCustomFeaturedGames(updatedFeatured);
    refreshFeaturedGames();
  }, [config.maxFeatured, loadCustomFeaturedGames, saveCustomFeaturedGames, refreshFeaturedGames]);

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<FeaturedGamesConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    saveFeaturedConfig(updatedConfig);
    
    // Refresh featured games if maxFeatured changed
    if (newConfig.maxFeatured !== undefined) {
      refreshFeaturedGames();
    }
  }, [config, saveFeaturedConfig, refreshFeaturedGames]);

  // Check if more games can be featured
  const canFeatureMore = getFeaturedGameIds().length < config.maxFeatured;

  // Initialize hook
  useEffect(() => {
    loadFeaturedConfig();
  }, [loadFeaturedConfig]);

  // Load featured games when config changes
  useEffect(() => {
    refreshFeaturedGames();
  }, [refreshFeaturedGames]);

  return {
    featuredGames,
    allGames,
    config,
    isLoading,
    error,
    toggleFeatured,
    updateConfig,
    refreshFeaturedGames,
    getFeaturedGameIds,
    canFeatureMore
  };
};

/**
 * Hook for checking if a game is featured
 */
export const useIsFeatured = (gameId: string) => {
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    const checkFeaturedStatus = () => {
      try {
        const customFeatured = JSON.parse(localStorage.getItem('customFeaturedGames') || '[]');
        const defaultFeatured = gameService.getFeaturedGames().map(game => game.id);
        const allFeatured = [...new Set([...customFeatured, ...defaultFeatured])];
        setIsFeatured(allFeatured.includes(gameId));
      } catch {
        // Fallback to default featured status
        const game = gameService.getGameById(gameId);
        setIsFeatured(game?.featured || false);
      }
    };

    checkFeaturedStatus();

    // Listen for storage changes to update featured status
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'customFeaturedGames') {
        checkFeaturedStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [gameId]);

  return isFeatured;
};