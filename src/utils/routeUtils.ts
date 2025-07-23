/**
 * Route utility functions for handling navigation and URL generation
 */

/**
 * Generate game URL from game name or ID
 */
export const generateGameUrl = (gameNameOrId: string): string => {
  const slug = gameNameOrId.toLowerCase().replace(/\s+/g, '-');
  return `/game/${slug}`;
};

/**
 * Generate category URL from category slug
 */
export const generateCategoryUrl = (categorySlug: string): string => {
  return `/games/category/${categorySlug}`;
};

/**
 * Generate search URL with query parameters
 */
export const generateSearchUrl = (query: string, category?: string): string => {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (category) params.set('category', category);
  
  return `/search${params.toString() ? `?${params.toString()}` : ''}`;
};

/**
 * Parse game name from URL parameter
 */
export const parseGameNameFromUrl = (urlParam: string): string => {
  return urlParam.replace(/-/g, ' ');
};

/**
 * Validate route parameters
 */
export const validateRouteParams = {
  /**
   * Check if category slug is valid format
   */
  categorySlug: (slug: string): boolean => {
    return /^[a-z0-9-]+$/.test(slug) && slug.length > 0;
  },

  /**
   * Check if game name parameter is valid format
   */
  gameName: (name: string): boolean => {
    return /^[a-z0-9-\s]+$/i.test(name.replace(/-/g, ' ')) && name.length > 0;
  },

  /**
   * Check if search query is valid
   */
  searchQuery: (query: string): boolean => {
    return query.trim().length > 0 && query.length <= 100;
  }
};

/**
 * Route constants for consistent navigation
 */
export const ROUTES = {
  HOME: '/',
  GAMES: '/games',
  SEARCH: '/search',
  CATEGORY: (slug: string) => `/games/category/${slug}`,
  GAME: (nameOrId: string) => generateGameUrl(nameOrId),
  NOT_FOUND: '/404',
  
  // Legacy routes for backward compatibility
  POPULAR: '/popular',
  TRENDING: '/trending',
  SPACE_WAVES: '/space-waves',
  GEOMETRY_DASH: '/geometry-dash',
  UNBLOCKED_GAMES: '/unblocked-games'
} as const;

/**
 * Check if a route is a legacy route that should be preserved
 */
export const isLegacyRoute = (pathname: string): boolean => {
  const legacyRoutes = [
    '/popular',
    '/trending', 
    '/space-waves',
    '/geometry-dash',
    '/unblocked-games'
  ];
  
  return legacyRoutes.includes(pathname);
};

/**
 * Get breadcrumb data for current route
 */
export const getBreadcrumbs = (pathname: string, searchParams?: URLSearchParams) => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Home', path: '/' }];

  if (segments[0] === 'games') {
    breadcrumbs.push({ label: 'Games', path: '/games' });
    
    if (segments[1] === 'category' && segments[2]) {
      const categoryName = segments[2].replace(/-/g, ' ');
      breadcrumbs.push({ 
        label: categoryName.charAt(0).toUpperCase() + categoryName.slice(1), 
        path: `/games/category/${segments[2]}` 
      });
    }
  } else if (segments[0] === 'game' && segments[1]) {
    const gameName = segments[1].replace(/-/g, ' ');
    breadcrumbs.push({ 
      label: gameName.charAt(0).toUpperCase() + gameName.slice(1), 
      path: `/game/${segments[1]}` 
    });
  } else if (segments[0] === 'search') {
    const query = searchParams?.get('q');
    breadcrumbs.push({ 
      label: query ? `Search: ${query}` : 'Search', 
      path: pathname 
    });
  }

  return breadcrumbs;
};