/**
 * Comprehensive routing configuration with metadata and guards
 */

import { RouteObject } from 'react-router-dom';

export interface RouteMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  requiresAuth?: boolean;
  isLegacy?: boolean;
  canonical?: string;
  breadcrumbLabel?: string;
}

export interface ExtendedRouteObject extends Omit<RouteObject, 'children'> {
  path: string;
  metadata?: RouteMetadata;
  children?: ExtendedRouteObject[];
}

/**
 * Route configuration with metadata for SEO and navigation
 */
export const routeConfig: ExtendedRouteObject[] = [
  {
    path: '/',
    metadata: {
      title: 'Geometry Dash Spam - Free Online Games',
      description: 'Play Geometry Dash and other exciting online games for free. No downloads required!',
      keywords: ['geometry dash', 'online games', 'free games', 'browser games'],
      breadcrumbLabel: 'Home'
    }
  },
  {
    path: '/games',
    metadata: {
      title: 'All Games - Browse Our Complete Game Collection',
      description: 'Discover our complete collection of free online games. Find your next favorite game!',
      keywords: ['online games', 'free games', 'game collection', 'browser games'],
      breadcrumbLabel: 'Games'
    }
  },
  {
    path: '/games/category/:categorySlug',
    metadata: {
      title: 'Category Games - {categoryName}',
      description: 'Play the best {categoryName} games online for free. No downloads required!',
      keywords: ['{categoryName}', 'online games', 'free games'],
      breadcrumbLabel: '{categoryName}'
    }
  },
  {
    path: '/game/:gameName',
    metadata: {
      title: '{gameName} - Play Free Online',
      description: 'Play {gameName} online for free. No downloads or registration required!',
      keywords: ['{gameName}', 'online game', 'free game', 'browser game'],
      breadcrumbLabel: '{gameName}'
    }
  },
  {
    path: '/search',
    metadata: {
      title: 'Search Games - Find Your Perfect Game',
      description: 'Search through our collection of free online games. Find exactly what you\'re looking for!',
      keywords: ['search games', 'find games', 'game search'],
      breadcrumbLabel: 'Search'
    }
  },
  // Legacy routes
  {
    path: '/popular',
    metadata: {
      title: 'Popular Games - Most Played Online Games',
      description: 'Play the most popular online games. Join millions of players worldwide!',
      keywords: ['popular games', 'trending games', 'most played'],
      isLegacy: true,
      canonical: '/games?sort=popularity',
      breadcrumbLabel: 'Popular'
    }
  },
  {
    path: '/trending',
    metadata: {
      title: 'Trending Games - What\'s Hot Right Now',
      description: 'Discover the hottest trending games. Play what everyone is talking about!',
      keywords: ['trending games', 'hot games', 'new games'],
      isLegacy: true,
      canonical: '/games?sort=trending',
      breadcrumbLabel: 'Trending'
    }
  },
  {
    path: '/geometry-dash',
    metadata: {
      title: 'Geometry Dash Unblocked - Play Free Online',
      description: 'Play Geometry Dash unblocked online for free. No downloads required!',
      keywords: ['geometry dash', 'unblocked', 'online game'],
      isLegacy: true,
      canonical: '/games/category/geometry-dash',
      breadcrumbLabel: 'Geometry Dash'
    }
  },
  {
    path: '/space-waves',
    metadata: {
      title: 'Space Waves - Play Free Online',
      description: 'Play Space Waves online for free. Navigate through space in this exciting game!',
      keywords: ['space waves', 'space game', 'online game'],
      isLegacy: true,
      breadcrumbLabel: 'Space Waves'
    }
  },
  {
    path: '/unblocked-games',
    metadata: {
      title: 'Unblocked Games - Play Free at School',
      description: 'Play unblocked games at school or work. Free online games that work anywhere!',
      keywords: ['unblocked games', 'school games', 'work games'],
      isLegacy: true,
      canonical: '/games',
      breadcrumbLabel: 'Unblocked Games'
    }
  },
  {
    path: '/404',
    metadata: {
      title: 'Page Not Found - 404 Error',
      description: 'The page you\'re looking for doesn\'t exist. Browse our games instead!',
      breadcrumbLabel: '404'
    }
  }
];

/**
 * Get route metadata by path
 */
export const getRouteMetadata = (path: string): RouteMetadata | undefined => {
  // Handle dynamic routes
  const route = routeConfig.find(route => {
    if (route.path.includes(':')) {
      const pattern = route.path.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(path);
    }
    return route.path === path;
  });

  return route?.metadata;
};

/**
 * Generate dynamic metadata for parameterized routes
 */
export const generateDynamicMetadata = (
  path: string,
  params: Record<string, string>,
  data?: Record<string, any>
): RouteMetadata | undefined => {
  const metadata = getRouteMetadata(path);
  if (!metadata) return undefined;

  const dynamicMetadata = { ...metadata };

  // Replace placeholders in title
  if (dynamicMetadata.title) {
    Object.entries(params).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      dynamicMetadata.title = dynamicMetadata.title?.replace(
        placeholder,
        value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      );
    });

    // Replace with actual data if available
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        dynamicMetadata.title = dynamicMetadata.title?.replace(placeholder, String(value));
      });
    }
  }

  // Replace placeholders in description
  if (dynamicMetadata.description) {
    Object.entries(params).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      dynamicMetadata.description = dynamicMetadata.description?.replace(
        placeholder,
        value.replace(/-/g, ' ')
      );
    });

    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        dynamicMetadata.description = dynamicMetadata.description?.replace(placeholder, String(value));
      });
    }
  }

  // Replace placeholders in keywords
  if (dynamicMetadata.keywords) {
    dynamicMetadata.keywords = dynamicMetadata.keywords.map(keyword => {
      let processedKeyword = keyword;
      Object.entries(params).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        processedKeyword = processedKeyword.replace(placeholder, value.replace(/-/g, ' '));
      });

      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          const placeholder = `{${key}}`;
          processedKeyword = processedKeyword.replace(placeholder, String(value));
        });
      }

      return processedKeyword;
    });
  }

  return dynamicMetadata;
};

/**
 * Get canonical URL for a route
 */
export const getCanonicalUrl = (path: string): string | undefined => {
  const route = routeConfig.find(route => {
    if (route.path.includes(':')) {
      const pattern = route.path.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(path);
    }
    return route.path === path;
  });

  return route?.metadata?.canonical;
};

/**
 * Check if a route is legacy
 */
export const isLegacyRoute = (path: string): boolean => {
  const metadata = getRouteMetadata(path);
  return metadata?.isLegacy === true;
};

/**
 * Get all legacy routes
 */
export const getLegacyRoutes = (): ExtendedRouteObject[] => {
  return routeConfig.filter(route => route.metadata?.isLegacy === true);
};

/**
 * Get route hierarchy for breadcrumbs
 */
export const getRouteHierarchy = (path: string): Array<{ label: string; path: string }> => {
  const segments = path.split('/').filter(Boolean);
  const hierarchy: Array<{ label: string; path: string }> = [
    { label: 'Home', path: '/' }
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Skip parameter segments in hierarchy
    if (segment.startsWith(':')) return;

    const metadata = getRouteMetadata(currentPath);
    const label = metadata?.breadcrumbLabel || 
                 segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    hierarchy.push({
      label,
      path: currentPath
    });
  });

  return hierarchy;
};