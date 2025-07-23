import { useState, useEffect, useMemo } from 'react';
import { GameCategory } from '../types/game';
import { useGameContext } from '../context/GameContext';
import { categoryService } from '../services';

/**
 * Hook for managing categories data and operations
 */
export const useCategories = () => {
  const context = useGameContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(() => {
    try {
      setError(null);
      return context.categories;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
      return [];
    }
  }, [context.categories]);

  /**
   * Get categories with game counts
   */
  const categoriesWithCounts = useMemo(() => {
    return categoryService.getCategoriesWithCounts();
  }, []);

  /**
   * Get popular categories
   */
  const popularCategories = useMemo(() => {
    return categoryService.getPopularCategories();
  }, []);

  return {
    categories,
    categoriesWithCounts,
    popularCategories,
    loading,
    error,
    totalCategories: categories.length
  };
};

/**
 * Hook for getting a specific category
 */
export const useCategory = (categoryId: string) => {
  const [category, setCategory] = useState<GameCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      
      const foundCategory = categoryService.getCategoryById(categoryId);
      if (foundCategory) {
        setCategory(foundCategory);
      } else {
        setError(`Category with ID "${categoryId}" not found`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load category');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  return {
    category,
    loading,
    error
  };
};

/**
 * Hook for getting category by slug
 */
export const useCategoryBySlug = (slug: string) => {
  const [category, setCategory] = useState<GameCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      
      const foundCategory = categoryService.getCategoryBySlug(slug);
      if (foundCategory) {
        setCategory(foundCategory);
      } else {
        setError(`Category with slug "${slug}" not found`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load category');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  return {
    category,
    loading,
    error
  };
};

/**
 * Hook for getting category statistics
 */
export const useCategoryStats = (categoryId: string) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      
      const categoryStats = categoryService.getCategoryStats(categoryId);
      setStats(categoryStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load category stats');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  return {
    stats,
    loading,
    error
  };
};