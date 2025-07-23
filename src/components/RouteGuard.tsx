import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { categoryService, gameService } from '../services';
import { validateRouteParams } from '../utils/routeUtils';

interface RouteGuardProps {
  children: ReactNode;
  type: 'category' | 'game';
}

interface ValidationResult {
  isValid: boolean;
  redirect?: string;
  loading?: boolean;
}

/**
 * Enhanced RouteGuard component for validating route parameters and handling invalid routes
 */
const RouteGuard: React.FC<RouteGuardProps> = ({ children, type }) => {
  const params = useParams();
  const location = useLocation();
  const [validation, setValidation] = useState<ValidationResult>({ isValid: false, loading: true });

  useEffect(() => {
    const validateRoute = async () => {
      setValidation({ isValid: false, loading: true });

      try {
        if (type === 'category') {
          const result = await validateCategoryRoute(params, location);
          setValidation(result);
        } else if (type === 'game') {
          const result = await validateGameRoute(params, location);
          setValidation(result);
        }
      } catch (error) {
        console.error('Route validation error:', error);
        setValidation({ 
          isValid: false, 
          redirect: '/404',
          loading: false 
        });
      }
    };

    validateRoute();
  }, [params, location, type]);

  // Show loading state while validating
  if (validation.loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect if validation failed
  if (!validation.isValid && validation.redirect) {
    return <Navigate to={validation.redirect} replace state={{ from: location.pathname }} />;
  }

  // Render children if validation passed
  if (validation.isValid) {
    return <>{children}</>;
  }

  // Fallback to 404
  return <Navigate to="/404" replace state={{ from: location.pathname }} />;
};

/**
 * Validate category route parameters
 */
const validateCategoryRoute = async (
  params: Record<string, string | undefined>,
  location: Location
): Promise<ValidationResult> => {
  const { categorySlug } = params;
  
  // Check if categorySlug is provided
  if (!categorySlug) {
    return { isValid: false, redirect: '/games' };
  }

  // Validate slug format
  if (!validateRouteParams.categorySlug(categorySlug)) {
    return { 
      isValid: false, 
      redirect: `/search?q=${encodeURIComponent(categorySlug.replace(/-/g, ' '))}` 
    };
  }

  // Check if category exists
  const categories = categoryService.getAllCategories();
  const category = categoryService.getCategoryBySlug(categorySlug);
  
  if (category) {
    return { isValid: true, loading: false };
  }

  // Try to find a similar category
  const similarCategory = categories.find(cat => 
    cat.slug.includes(categorySlug) || 
    categorySlug.includes(cat.slug) ||
    cat.name.toLowerCase().includes(categorySlug.toLowerCase()) ||
    levenshteinDistance(cat.slug, categorySlug) <= 2
  );
  
  if (similarCategory) {
    return { 
      isValid: false, 
      redirect: `/games/category/${similarCategory.slug}`,
      loading: false 
    };
  }
  
  // If no similar category found, redirect to search
  return { 
    isValid: false, 
    redirect: `/search?q=${encodeURIComponent(categorySlug.replace(/-/g, ' '))}`,
    loading: false 
  };
};

/**
 * Validate game route parameters
 */
const validateGameRoute = async (
  params: Record<string, string | undefined>,
  location: Location
): Promise<ValidationResult> => {
  const { gameName } = params;
  
  // Check if gameName is provided
  if (!gameName) {
    return { isValid: false, redirect: '/games' };
  }

  // Validate game name format
  if (!validateRouteParams.gameName(gameName)) {
    return { 
      isValid: false, 
      redirect: `/search?q=${encodeURIComponent(gameName.replace(/-/g, ' '))}` 
    };
  }

  // Check if game exists
  const games = gameService.getAllGames();
  const gameExists = games.some(game => 
    game.name.toLowerCase().replace(/\s+/g, '-') === gameName.toLowerCase() ||
    game.id === gameName
  );
  
  if (gameExists) {
    return { isValid: true, loading: false };
  }

  // Try to find a similar game
  const searchTerm = gameName.replace(/-/g, ' ');
  const similarGames = gameService.filterGames({ search: searchTerm });
  
  if (similarGames.length > 0) {
    // Check if there's an exact match with different formatting
    const exactMatch = similarGames.find(game => 
      game.name.toLowerCase() === searchTerm.toLowerCase()
    );
    
    if (exactMatch) {
      const correctSlug = exactMatch.name.toLowerCase().replace(/\s+/g, '-');
      return { 
        isValid: false, 
        redirect: `/game/${correctSlug}`,
        loading: false 
      };
    }
    
    // Redirect to search results with the game name
    return { 
      isValid: false, 
      redirect: `/search?q=${encodeURIComponent(searchTerm)}`,
      loading: false 
    };
  }
  
  // Try fuzzy matching for typos
  const fuzzyMatches = games.filter(game => {
    const gameSlug = game.name.toLowerCase().replace(/\s+/g, '-');
    return levenshteinDistance(gameSlug, gameName.toLowerCase()) <= 3;
  });

  if (fuzzyMatches.length > 0) {
    return { 
      isValid: false, 
      redirect: `/search?q=${encodeURIComponent(searchTerm)}`,
      loading: false 
    };
  }
  
  // If no similar games found, redirect to 404
  return { 
    isValid: false, 
    redirect: '/404',
    loading: false 
  };
};

/**
 * Calculate Levenshtein distance between two strings
 */
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
};

export default RouteGuard;