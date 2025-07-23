import {
  generateGameUrl,
  generateCategoryUrl,
  generateSearchUrl,
  parseGameNameFromUrl,
  validateRouteParams,
  ROUTES,
  isLegacyRoute,
  getBreadcrumbs
} from '../routeUtils';

describe('routeUtils', () => {
  describe('generateGameUrl', () => {
    it('should generate correct game URL from name', () => {
      expect(generateGameUrl('Geometry Dash')).toBe('/game/geometry-dash');
      expect(generateGameUrl('Super Mario Bros')).toBe('/game/super-mario-bros');
    });

    it('should handle special characters', () => {
      expect(generateGameUrl('Game: Special Edition')).toBe('/game/game:-special-edition');
    });
  });

  describe('generateCategoryUrl', () => {
    it('should generate correct category URL', () => {
      expect(generateCategoryUrl('action')).toBe('/games/category/action');
      expect(generateCategoryUrl('puzzle-games')).toBe('/games/category/puzzle-games');
    });
  });

  describe('generateSearchUrl', () => {
    it('should generate search URL with query', () => {
      expect(generateSearchUrl('mario')).toBe('/search?q=mario');
    });

    it('should generate search URL with query and category', () => {
      expect(generateSearchUrl('mario', 'action')).toBe('/search?q=mario&category=action');
    });

    it('should handle empty query', () => {
      expect(generateSearchUrl('')).toBe('/search');
    });
  });

  describe('parseGameNameFromUrl', () => {
    it('should parse game name from URL parameter', () => {
      expect(parseGameNameFromUrl('geometry-dash')).toBe('geometry dash');
      expect(parseGameNameFromUrl('super-mario-bros')).toBe('super mario bros');
    });
  });

  describe('validateRouteParams', () => {
    describe('categorySlug', () => {
      it('should validate correct category slugs', () => {
        expect(validateRouteParams.categorySlug('action')).toBe(true);
        expect(validateRouteParams.categorySlug('puzzle-games')).toBe(true);
        expect(validateRouteParams.categorySlug('geometry-dash')).toBe(true);
      });

      it('should reject invalid category slugs', () => {
        expect(validateRouteParams.categorySlug('')).toBe(false);
        expect(validateRouteParams.categorySlug('Action Games')).toBe(false);
        expect(validateRouteParams.categorySlug('action_games')).toBe(false);
      });
    });

    describe('gameName', () => {
      it('should validate correct game names', () => {
        expect(validateRouteParams.gameName('geometry-dash')).toBe(true);
        expect(validateRouteParams.gameName('super mario bros')).toBe(true);
        expect(validateRouteParams.gameName('Game123')).toBe(true);
      });

      it('should reject invalid game names', () => {
        expect(validateRouteParams.gameName('')).toBe(false);
        expect(validateRouteParams.gameName('game@special')).toBe(false);
      });
    });

    describe('searchQuery', () => {
      it('should validate correct search queries', () => {
        expect(validateRouteParams.searchQuery('mario')).toBe(true);
        expect(validateRouteParams.searchQuery('geometry dash')).toBe(true);
      });

      it('should reject invalid search queries', () => {
        expect(validateRouteParams.searchQuery('')).toBe(false);
        expect(validateRouteParams.searchQuery('   ')).toBe(false);
        expect(validateRouteParams.searchQuery('a'.repeat(101))).toBe(false);
      });
    });
  });

  describe('isLegacyRoute', () => {
    it('should identify legacy routes', () => {
      expect(isLegacyRoute('/popular')).toBe(true);
      expect(isLegacyRoute('/trending')).toBe(true);
      expect(isLegacyRoute('/geometry-dash')).toBe(true);
    });

    it('should not identify new routes as legacy', () => {
      expect(isLegacyRoute('/games')).toBe(false);
      expect(isLegacyRoute('/games/category/action')).toBe(false);
      expect(isLegacyRoute('/search')).toBe(false);
    });
  });

  describe('getBreadcrumbs', () => {
    it('should generate breadcrumbs for home', () => {
      const breadcrumbs = getBreadcrumbs('/');
      expect(breadcrumbs).toEqual([{ label: 'Home', path: '/' }]);
    });

    it('should generate breadcrumbs for games page', () => {
      const breadcrumbs = getBreadcrumbs('/games');
      expect(breadcrumbs).toEqual([
        { label: 'Home', path: '/' },
        { label: 'Games', path: '/games' }
      ]);
    });

    it('should generate breadcrumbs for category page', () => {
      const breadcrumbs = getBreadcrumbs('/games/category/action');
      expect(breadcrumbs).toEqual([
        { label: 'Home', path: '/' },
        { label: 'Games', path: '/games' },
        { label: 'Action', path: '/games/category/action' }
      ]);
    });

    it('should generate breadcrumbs for game page', () => {
      const breadcrumbs = getBreadcrumbs('/game/geometry-dash');
      expect(breadcrumbs).toEqual([
        { label: 'Home', path: '/' },
        { label: 'Geometry Dash', path: '/game/geometry-dash' }
      ]);
    });

    it('should generate breadcrumbs for search page', () => {
      const searchParams = new URLSearchParams('q=mario');
      const breadcrumbs = getBreadcrumbs('/search', searchParams);
      expect(breadcrumbs).toEqual([
        { label: 'Home', path: '/' },
        { label: 'Search: mario', path: '/search' }
      ]);
    });
  });

  describe('ROUTES constants', () => {
    it('should provide correct route constants', () => {
      expect(ROUTES.HOME).toBe('/');
      expect(ROUTES.GAMES).toBe('/games');
      expect(ROUTES.SEARCH).toBe('/search');
      expect(ROUTES.CATEGORY('action')).toBe('/games/category/action');
      expect(ROUTES.GAME('geometry-dash')).toBe('/game/geometry-dash');
      expect(ROUTES.NOT_FOUND).toBe('/404');
    });
  });
});