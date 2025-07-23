import { Game, GameFilter } from '../types/game';
import { games, getGameById, getGamesByCategory, getFeaturedGames, getRelatedGames } from '../data/games';

/**
 * GameService - Core service for game data management and filtering
 * Handles all game-related operations including filtering, sorting, and recommendations
 */
export class GameService {
  private static instance: GameService;
  private gameData: Game[] = games;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  /**
   * Get all games
   */
  public getAllGames(): Game[] {
    return [...this.gameData];
  }

  /**
   * Get game by ID
   */
  public getGameById(id: string): Game | undefined {
    return getGameById(id);
  }

  /**
   * Get games by category
   */
  public getGamesByCategory(categoryId: string): Game[] {
    return getGamesByCategory(categoryId);
  }

  /**
   * Get featured games
   */
  public getFeaturedGames(): Game[] {
    return getFeaturedGames();
  }

  /**
   * Filter games based on provided criteria
   */
  public filterGames(filter: GameFilter): Game[] {
    let filteredGames = [...this.gameData];

    // Filter by category
    if (filter.category) {
      filteredGames = filteredGames.filter(game => game.category.id === filter.category);
    }

    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      filteredGames = filteredGames.filter(game =>
        filter.tags!.some(tag => game.tags.includes(tag))
      );
    }

    // Filter by search query
    if (filter.search) {
      const searchQuery = filter.search.toLowerCase();
      filteredGames = filteredGames.filter(game =>
        game.name.toLowerCase().includes(searchQuery) ||
        game.description.toLowerCase().includes(searchQuery) ||
        game.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
        (game.metadata?.developer && game.metadata.developer.toLowerCase().includes(searchQuery))
      );
    }

    // Sort games
    if (filter.sortBy) {
      filteredGames = this.sortGames(filteredGames, filter.sortBy, filter.sortOrder || 'desc');
    }

    return filteredGames;
  }

  /**
   * Sort games by specified criteria
   */
  private sortGames(games: Game[], sortBy: 'popularity' | 'name' | 'dateAdded', sortOrder: 'asc' | 'desc'): Game[] {
    const sortedGames = [...games];
    const multiplier = sortOrder === 'asc' ? 1 : -1;

    sortedGames.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return (a.popularity - b.popularity) * multiplier;
        case 'name':
          return a.name.localeCompare(b.name) * multiplier;
        case 'dateAdded':
          return (a.dateAdded.getTime() - b.dateAdded.getTime()) * multiplier;
        default:
          return 0;
      }
    });

    return sortedGames;
  }

  /**
   * Get related games for a specific game
   */
  public getRelatedGames(gameId: string, limit: number = 4): Game[] {
    return getRelatedGames(gameId, limit);
  }

  /**
   * Get games by multiple categories
   */
  public getGamesByCategories(categoryIds: string[]): Game[] {
    return this.gameData.filter(game =>
      categoryIds.includes(game.category.id)
    );
  }

  /**
   * Get games by tag
   */
  public getGamesByTag(tag: string): Game[] {
    return this.gameData.filter(game =>
      game.tags.includes(tag)
    );
  }

  /**
   * Get popular games (sorted by popularity)
   */
  public getPopularGames(limit?: number): Game[] {
    const sortedGames = [...this.gameData].sort((a, b) => b.popularity - a.popularity);
    return limit ? sortedGames.slice(0, limit) : sortedGames;
  }

  /**
   * Get recently added games
   */
  public getRecentlyAddedGames(limit?: number): Game[] {
    const sortedGames = [...this.gameData].sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());
    return limit ? sortedGames.slice(0, limit) : sortedGames;
  }

  /**
   * Get game statistics
   */
  public getGameStats(): {
    totalGames: number;
    totalCategories: number;
    featuredGames: number;
    averagePopularity: number;
  } {
    const uniqueCategories = new Set(this.gameData.map(game => game.category.id));
    const featuredCount = this.gameData.filter(game => game.featured).length;
    const totalPopularity = this.gameData.reduce((sum, game) => sum + game.popularity, 0);

    return {
      totalGames: this.gameData.length,
      totalCategories: uniqueCategories.size,
      featuredGames: featuredCount,
      averagePopularity: Math.round(totalPopularity / this.gameData.length)
    };
  }

  /**
   * Get all unique tags from games
   */
  public getAllTags(): string[] {
    const allTags = this.gameData.flatMap(game => game.tags);
    return [...new Set(allTags)].sort();
  }

  /**
   * Advanced recommendation algorithm
   * Considers category, tags, popularity, and user preferences
   */
  public getAdvancedRecommendations(
    gameId: string,
    userPreferences?: { categories?: string[]; tags?: string[] },
    limit: number = 6
  ): Game[] {
    const currentGame = this.getGameById(gameId);
    if (!currentGame) return [];

    const candidates = this.gameData.filter(game => game.id !== gameId);

    const scoredGames = candidates.map(game => {
      let score = 0;

      // Category match (high weight)
      if (game.category.id === currentGame.category.id) {
        score += 15;
      }

      // Tag similarity (medium weight)
      const sharedTags = game.tags.filter(tag => currentGame.tags.includes(tag));
      score += sharedTags.length * 3;

      // User preference categories (medium weight)
      if (userPreferences?.categories?.includes(game.category.id)) {
        score += 8;
      }

      // User preference tags (medium weight)
      if (userPreferences?.tags) {
        const userTagMatches = game.tags.filter(tag => userPreferences.tags!.includes(tag));
        score += userTagMatches.length * 2;
      }

      // Popularity boost (low weight)
      score += game.popularity * 0.1;

      // Featured game boost (low weight)
      if (game.featured) {
        score += 2;
      }

      return { game, score };
    });

    return scoredGames
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.game);
  }

  /**
   * User interaction methods for recently played and favorites
   */

  /**
   * Get recently played games from localStorage
   */
  public getRecentlyPlayed(): Game[] {
    try {
      const recentlyPlayedIds = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
      return recentlyPlayedIds
        .map((id: string) => this.getGameById(id))
        .filter((game: Game | undefined): game is Game => game !== undefined);
    } catch {
      return [];
    }
  }

  /**
   * Add game to recently played list
   */
  public addToRecentlyPlayed(gameId: string): void {
    try {
      const recentlyPlayedIds = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
      const updatedIds = [gameId, ...recentlyPlayedIds.filter((id: string) => id !== gameId)].slice(0, 10);
      localStorage.setItem('recentlyPlayed', JSON.stringify(updatedIds));
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Get favorite games from localStorage
   */
  public getFavorites(): Game[] {
    try {
      const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
      return favoriteIds
        .map((id: string) => this.getGameById(id))
        .filter((game: Game | undefined): game is Game => game !== undefined);
    } catch {
      return [];
    }
  }

  /**
   * Toggle favorite status of a game
   */
  public toggleFavorite(gameId: string): void {
    try {
      const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
      const updatedIds = favoriteIds.includes(gameId)
        ? favoriteIds.filter((id: string) => id !== gameId)
        : [...favoriteIds, gameId];
      localStorage.setItem('favorites', JSON.stringify(updatedIds));
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Check if a game is in favorites
   */
  public isFavorite(gameId: string): boolean {
    try {
      const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
      return favoriteIds.includes(gameId);
    } catch {
      return false;
    }
  }

  /**
   * Clear recently played history
   */
  public clearRecentlyPlayed(): void {
    try {
      localStorage.removeItem('recentlyPlayed');
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Clear favorites list
   */
  public clearFavorites(): void {
    try {
      localStorage.removeItem('favorites');
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Get recently played games count
   */
  public getRecentlyPlayedCount(): number {
    try {
      const recentlyPlayedIds = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
      return recentlyPlayedIds.length;
    } catch {
      return 0;
    }
  }

  /**
   * Check if a game is in recently played list
   */
  public isRecentlyPlayed(gameId: string): boolean {
    try {
      const recentlyPlayedIds = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
      return recentlyPlayedIds.includes(gameId);
    } catch {
      return false;
    }
  }

  /**
   * Get trending games (combination of recent popularity and recent plays)
   */
  public getTrendingGames(limit: number = 6): Game[] {
    // For now, return a mix of featured and popular games
    // In a real implementation, this would consider recent play data
    const featured = this.getFeaturedGames();
    const popular = this.getPopularGames();
    
    // Combine and deduplicate
    const combined = [...featured, ...popular];
    const unique = combined.filter((game, index, self) => 
      index === self.findIndex(g => g.id === game.id)
    );
    
    return unique.slice(0, limit);
  }
}

// Export singleton instance
export const gameService = GameService.getInstance();