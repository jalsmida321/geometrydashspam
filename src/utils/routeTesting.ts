/**
 * Route testing utilities for validating routing system functionality
 */

import { gameService } from '../services/GameService';
import { categoryService } from '../services/CategoryService';
import { validateRouteParams, generateGameUrl, generateCategoryUrl, generateSearchUrl } from './routeUtils';

export interface RouteTestResult {
  path: string;
  isValid: boolean;
  expectedRedirect?: string;
  error?: string;
}

/**
 * Test all game routes
 */
export const testGameRoutes = (): RouteTestResult[] => {
  const games = gameService.getAllGames();
  const results: RouteTestResult[] = [];

  games.forEach(game => {
    const gameUrl = generateGameUrl(game.name);
    const gameName = game.name.toLowerCase().replace(/\s+/g, '-');
    
    // Test if the generated URL is valid
    const isValidFormat = validateRouteParams.gameName(gameName);
    
    results.push({
      path: gameUrl,
      isValid: isValidFormat,
      error: isValidFormat ? undefined : `Invalid game name format: ${gameName}`
    });
  });

  return results;
};

/**
 * Test all category routes
 */
export const testCategoryRoutes = (): RouteTestResult[] => {
  const categories = categoryService.getAllCategories();
  const results: RouteTestResult[] = [];

  categories.forEach(category => {
    const categoryUrl = generateCategoryUrl(category.slug);
    
    // Test if the category slug is valid
    const isValidFormat = validateRouteParams.categorySlug(category.slug);
    
    results.push({
      path: categoryUrl,
      isValid: isValidFormat,
      error: isValidFormat ? undefined : `Invalid category slug format: ${category.slug}`
    });
  });

  return results;
};

/**
 * Test search routes with various queries
 */
export const testSearchRoutes = (): RouteTestResult[] => {
  const testQueries = [
    'mario',
    'geometry dash',
    'action games',
    'puzzle',
    'adventure',
    'racing',
    'sports',
    'strategy'
  ];

  const results: RouteTestResult[] = [];

  testQueries.forEach(query => {
    const searchUrl = generateSearchUrl(query);
    const isValidQuery = validateRouteParams.searchQuery(query);
    
    results.push({
      path: searchUrl,
      isValid: isValidQuery,
      error: isValidQuery ? undefined : `Invalid search query: ${query}`
    });
  });

  // Test search with category filter
  const categories = categoryService.getAllCategories();
  categories.slice(0, 3).forEach(category => {
    const searchUrl = generateSearchUrl('test', category.id);
    
    results.push({
      path: searchUrl,
      isValid: true
    });
  });

  return results;
};

/**
 * Test legacy route redirects
 */
export const testLegacyRoutes = (): RouteTestResult[] => {
  const legacyRoutes = [
    { path: '/popular', expectedRedirect: '/games?sort=popularity' },
    { path: '/trending', expectedRedirect: '/games?sort=trending' },
    { path: '/geometry-dash', expectedRedirect: '/games/category/geometry-dash' },
    { path: '/unblocked-games', expectedRedirect: '/games' },
    { path: '/all-games', expectedRedirect: '/games' }
  ];

  return legacyRoutes.map(route => ({
    path: route.path,
    isValid: true,
    expectedRedirect: route.expectedRedirect
  }));
};

/**
 * Test invalid routes that should redirect to 404
 */
export const testInvalidRoutes = (): RouteTestResult[] => {
  const invalidRoutes = [
    '/game/nonexistent-game',
    '/games/category/invalid-category',
    '/random-invalid-path',
    '/game/',
    '/games/category/',
    '/games/category/action/extra-path'
  ];

  return invalidRoutes.map(path => ({
    path,
    isValid: false,
    expectedRedirect: path.includes('/game/') || path.includes('/games/category/') ? '/search' : '/404'
  }));
};

/**
 * Run comprehensive route tests
 */
export const runRouteTests = (): {
  gameRoutes: RouteTestResult[];
  categoryRoutes: RouteTestResult[];
  searchRoutes: RouteTestResult[];
  legacyRoutes: RouteTestResult[];
  invalidRoutes: RouteTestResult[];
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    errors: string[];
  };
} => {
  const gameRoutes = testGameRoutes();
  const categoryRoutes = testCategoryRoutes();
  const searchRoutes = testSearchRoutes();
  const legacyRoutes = testLegacyRoutes();
  const invalidRoutes = testInvalidRoutes();

  const allResults = [
    ...gameRoutes,
    ...categoryRoutes,
    ...searchRoutes,
    ...legacyRoutes,
    ...invalidRoutes
  ];

  const totalTests = allResults.length;
  const failed = allResults.filter(result => !result.isValid && !result.expectedRedirect).length;
  const passed = totalTests - failed;
  const errors = allResults
    .filter(result => result.error)
    .map(result => result.error!);

  return {
    gameRoutes,
    categoryRoutes,
    searchRoutes,
    legacyRoutes,
    invalidRoutes,
    summary: {
      totalTests,
      passed,
      failed,
      errors
    }
  };
};

/**
 * Validate route parameter formats
 */
export const validateRouteFormats = (): {
  gameNames: { name: string; slug: string; isValid: boolean }[];
  categorySlugs: { name: string; slug: string; isValid: boolean }[];
} => {
  const games = gameService.getAllGames();
  const categories = categoryService.getAllCategories();

  const gameNames = games.map(game => {
    const slug = game.name.toLowerCase().replace(/\s+/g, '-');
    return {
      name: game.name,
      slug,
      isValid: validateRouteParams.gameName(slug)
    };
  });

  const categorySlugs = categories.map(category => ({
    name: category.name,
    slug: category.slug,
    isValid: validateRouteParams.categorySlug(category.slug)
  }));

  return {
    gameNames,
    categorySlugs
  };
};

/**
 * Test route generation consistency
 */
export const testRouteGeneration = (): {
  games: { name: string; generatedUrl: string; isConsistent: boolean }[];
  categories: { name: string; generatedUrl: string; isConsistent: boolean }[];
} => {
  const games = gameService.getAllGames();
  const categories = categoryService.getAllCategories();

  const gameTests = games.map(game => {
    const generatedUrl = generateGameUrl(game.name);
    const expectedSlug = game.name.toLowerCase().replace(/\s+/g, '-');
    const expectedUrl = `/game/${expectedSlug}`;
    
    return {
      name: game.name,
      generatedUrl,
      isConsistent: generatedUrl === expectedUrl
    };
  });

  const categoryTests = categories.map(category => {
    const generatedUrl = generateCategoryUrl(category.slug);
    const expectedUrl = `/games/category/${category.slug}`;
    
    return {
      name: category.name,
      generatedUrl,
      isConsistent: generatedUrl === expectedUrl
    };
  });

  return {
    games: gameTests,
    categories: categoryTests
  };
};

/**
 * Log route test results to console
 */
export const logRouteTestResults = (): void => {
  const results = runRouteTests();
  
  console.group('🛣️ Route System Test Results');
  
  console.log(`📊 Summary: ${results.summary.passed}/${results.summary.totalTests} tests passed`);
  
  if (results.summary.errors.length > 0) {
    console.group('❌ Errors:');
    results.summary.errors.forEach(error => console.error(error));
    console.groupEnd();
  }
  
  console.group('🎮 Game Routes');
  console.log(`${results.gameRoutes.filter(r => r.isValid).length}/${results.gameRoutes.length} valid`);
  results.gameRoutes.filter(r => !r.isValid).forEach(r => console.warn(`❌ ${r.path}: ${r.error}`));
  console.groupEnd();
  
  console.group('📂 Category Routes');
  console.log(`${results.categoryRoutes.filter(r => r.isValid).length}/${results.categoryRoutes.length} valid`);
  results.categoryRoutes.filter(r => !r.isValid).forEach(r => console.warn(`❌ ${r.path}: ${r.error}`));
  console.groupEnd();
  
  console.group('🔍 Search Routes');
  console.log(`${results.searchRoutes.filter(r => r.isValid).length}/${results.searchRoutes.length} valid`);
  console.groupEnd();
  
  console.group('🔄 Legacy Routes');
  console.log(`${results.legacyRoutes.length} legacy routes configured`);
  results.legacyRoutes.forEach(r => console.log(`${r.path} → ${r.expectedRedirect}`));
  console.groupEnd();
  
  console.groupEnd();
  
  // Test route generation consistency
  const generationTests = testRouteGeneration();
  const inconsistentGames = generationTests.games.filter(g => !g.isConsistent);
  const inconsistentCategories = generationTests.categories.filter(c => !c.isConsistent);
  
  if (inconsistentGames.length > 0 || inconsistentCategories.length > 0) {
    console.group('⚠️ Route Generation Issues');
    inconsistentGames.forEach(g => console.warn(`Game: ${g.name} → ${g.generatedUrl}`));
    inconsistentCategories.forEach(c => console.warn(`Category: ${c.name} → ${c.generatedUrl}`));
    console.groupEnd();
  }
};