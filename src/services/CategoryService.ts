import { GameCategory } from '../types/game';
import { gameCategories, getCategoryById, getCategoryBySlug } from '../data/categories';
import { gameService } from './GameService';

/**
 * CategoryService - Core service for category management
 * Handles all category-related operations including filtering and statistics
 */
export class CategoryService {
  private static instance: CategoryService;
  private categoryData: GameCategory[] = gameCategories;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  /**
   * Get all categories
   */
  public getAllCategories(): GameCategory[] {
    return [...this.categoryData];
  }

  /**
   * Get category by ID
   */
  public getCategoryById(id: string): GameCategory | undefined {
    return getCategoryById(id);
  }

  /**
   * Get category by slug
   */
  public getCategoryBySlug(slug: string): GameCategory | undefined {
    return getCategoryBySlug(slug);
  }

  /**
   * Get categories with game counts
   */
  public getCategoriesWithCounts(): Array<GameCategory & { gameCount: number }> {
    return this.categoryData.map(category => {
      const games = gameService.getGamesByCategory(category.id);
      return {
        ...category,
        gameCount: games.length
      };
    });
  }

  /**
   * Get categories sorted by game count
   */
  public getCategoriesByPopularity(): Array<GameCategory & { gameCount: number }> {
    return this.getCategoriesWithCounts()
      .sort((a, b) => b.gameCount - a.gameCount);
  }

  /**
   * Get popular categories (top 3 by game count)
   */
  public getPopularCategories(): GameCategory[] {
    return this.getCategoriesByPopularity()
      .slice(0, 3)
      .map(({ gameCount, ...category }) => category);
  }

  /**
   * Get categories that have games
   */
  public getActiveCategories(): GameCategory[] {
    return this.categoryData.filter(category => {
      const games = gameService.getGamesByCategory(category.id);
      return games.length > 0;
    });
  }

  /**
   * Get category statistics
   */
  public getCategoryStats(categoryId: string): {
    totalGames: number;
    featuredGames: number;
    averagePopularity: number;
    topTags: string[];
  } | null {
    const category = this.getCategoryById(categoryId);
    if (!category) return null;

    const games = gameService.getGamesByCategory(categoryId);
    if (games.length === 0) {
      return {
        totalGames: 0,
        featuredGames: 0,
        averagePopularity: 0,
        topTags: []
      };
    }

    const featuredCount = games.filter(game => game.featured).length;
    const totalPopularity = games.reduce((sum, game) => sum + game.popularity, 0);
    
    // Get top tags for this category
    const tagCounts = new Map<string, number>();
    games.forEach(game => {
      game.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const topTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    return {
      totalGames: games.length,
      featuredGames: featuredCount,
      averagePopularity: Math.round(totalPopularity / games.length),
      topTags
    };
  }

  /**
   * Search categories by name or description
   */
  public searchCategories(query: string): GameCategory[] {
    const lowercaseQuery = query.toLowerCase();
    return this.categoryData.filter(category =>
      category.name.toLowerCase().includes(lowercaseQuery) ||
      category.description.toLowerCase().includes(lowercaseQuery) ||
      category.slug.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get related categories based on shared games or tags
   */
  public getRelatedCategories(categoryId: string, limit: number = 3): GameCategory[] {
    const currentCategory = this.getCategoryById(categoryId);
    if (!currentCategory) return [];

    const currentGames = gameService.getGamesByCategory(categoryId);
    const currentTags = new Set(currentGames.flatMap(game => game.tags));

    const otherCategories = this.categoryData.filter(cat => cat.id !== categoryId);

    const scoredCategories = otherCategories.map(category => {
      const categoryGames = gameService.getGamesByCategory(category.id);
      const categoryTags = new Set(categoryGames.flatMap(game => game.tags));

      // Calculate tag overlap
      const sharedTags = [...currentTags].filter(tag => categoryTags.has(tag));
      const score = sharedTags.length;

      return { category, score };
    });

    return scoredCategories
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.category);
  }

  /**
   * Get category color scheme
   */
  public getCategoryColorScheme(categoryId: string): {
    primary: string;
    secondary: string;
    accent: string;
  } | null {
    const category = this.getCategoryById(categoryId);
    if (!category) return null;

    // Define color schemes based on category color
    const colorSchemes: Record<string, { primary: string; secondary: string; accent: string }> = {
      blue: {
        primary: 'bg-blue-500',
        secondary: 'bg-blue-100',
        accent: 'text-blue-600'
      },
      red: {
        primary: 'bg-red-500',
        secondary: 'bg-red-100',
        accent: 'text-red-600'
      },
      green: {
        primary: 'bg-green-500',
        secondary: 'bg-green-100',
        accent: 'text-green-600'
      },
      purple: {
        primary: 'bg-purple-500',
        secondary: 'bg-purple-100',
        accent: 'text-purple-600'
      },
      orange: {
        primary: 'bg-orange-500',
        secondary: 'bg-orange-100',
        accent: 'text-orange-600'
      },
      indigo: {
        primary: 'bg-indigo-500',
        secondary: 'bg-indigo-100',
        accent: 'text-indigo-600'
      }
    };

    return colorSchemes[category.color] || colorSchemes.blue;
  }

  /**
   * Get category navigation data for UI
   */
  public getCategoryNavigation(): Array<{
    category: GameCategory;
    gameCount: number;
    isActive: boolean;
  }> {
    return this.getCategoriesWithCounts().map(category => ({
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        color: category.color
      },
      gameCount: category.gameCount,
      isActive: category.gameCount > 0
    }));
  }

  /**
   * Validate category data
   */
  public validateCategory(category: Partial<GameCategory>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!category.id || category.id.trim() === '') {
      errors.push('Category ID is required');
    }

    if (!category.name || category.name.trim() === '') {
      errors.push('Category name is required');
    }

    if (!category.slug || category.slug.trim() === '') {
      errors.push('Category slug is required');
    }

    if (!category.description || category.description.trim() === '') {
      errors.push('Category description is required');
    }

    if (!category.icon || category.icon.trim() === '') {
      errors.push('Category icon is required');
    }

    if (!category.color || category.color.trim() === '') {
      errors.push('Category color is required');
    }

    // Check for duplicate IDs or slugs
    if (category.id && this.categoryData.some(cat => cat.id === category.id)) {
      errors.push('Category ID already exists');
    }

    if (category.slug && this.categoryData.some(cat => cat.slug === category.slug)) {
      errors.push('Category slug already exists');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const categoryService = CategoryService.getInstance();