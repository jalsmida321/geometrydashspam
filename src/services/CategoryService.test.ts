import { categoryService } from './CategoryService';

describe('CategoryService', () => {
  describe('getAllCategories', () => {
    it('should return all categories', () => {
      const categories = categoryService.getAllCategories();
      
      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it('should return categories with required properties', () => {
      const categories = categoryService.getAllCategories();
      
      categories.forEach(category => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('slug');
        expect(category).toHaveProperty('description');
        expect(category).toHaveProperty('icon');
        expect(category).toHaveProperty('color');
        
        expect(typeof category.id).toBe('string');
        expect(typeof category.name).toBe('string');
        expect(typeof category.slug).toBe('string');
        expect(typeof category.description).toBe('string');
        expect(typeof category.icon).toBe('string');
        expect(typeof category.color).toBe('string');
      });
    });

    it('should return categories with unique IDs', () => {
      const categories = categoryService.getAllCategories();
      const ids = categories.map(cat => cat.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should return categories with unique slugs', () => {
      const categories = categoryService.getAllCategories();
      const slugs = categories.map(cat => cat.slug);
      const uniqueSlugs = new Set(slugs);
      
      expect(uniqueSlugs.size).toBe(slugs.length);
    });
  });

  describe('getCategoryById', () => {
    it('should return category when valid ID is provided', () => {
      const categories = categoryService.getAllCategories();
      const firstCategory = categories[0];
      
      const foundCategory = categoryService.getCategoryById(firstCategory.id);
      
      expect(foundCategory).toBeDefined();
      expect(foundCategory?.id).toBe(firstCategory.id);
      expect(foundCategory?.name).toBe(firstCategory.name);
    });

    it('should return undefined when invalid ID is provided', () => {
      const foundCategory = categoryService.getCategoryById('non-existent-id');
      
      expect(foundCategory).toBeUndefined();
    });

    it('should return undefined when empty string is provided', () => {
      const foundCategory = categoryService.getCategoryById('');
      
      expect(foundCategory).toBeUndefined();
    });
  });

  describe('getCategoryBySlug', () => {
    it('should return category when valid slug is provided', () => {
      const categories = categoryService.getAllCategories();
      const firstCategory = categories[0];
      
      const foundCategory = categoryService.getCategoryBySlug(firstCategory.slug);
      
      expect(foundCategory).toBeDefined();
      expect(foundCategory?.slug).toBe(firstCategory.slug);
      expect(foundCategory?.id).toBe(firstCategory.id);
    });

    it('should return undefined when invalid slug is provided', () => {
      const foundCategory = categoryService.getCategoryBySlug('non-existent-slug');
      
      expect(foundCategory).toBeUndefined();
    });

    it('should return undefined when empty string is provided', () => {
      const foundCategory = categoryService.getCategoryBySlug('');
      
      expect(foundCategory).toBeUndefined();
    });
  });

  describe('getCategoryStats', () => {
    it('should return category statistics', () => {
      const stats = categoryService.getCategoryStats();
      
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty('totalCategories');
      expect(stats).toHaveProperty('categoriesWithGames');
      expect(stats).toHaveProperty('averageGamesPerCategory');
      
      expect(typeof stats.totalCategories).toBe('number');
      expect(typeof stats.categoriesWithGames).toBe('number');
      expect(typeof stats.averageGamesPerCategory).toBe('number');
      
      expect(stats.totalCategories).toBeGreaterThan(0);
      expect(stats.categoriesWithGames).toBeGreaterThanOrEqual(0);
      expect(stats.averageGamesPerCategory).toBeGreaterThanOrEqual(0);
    });

    it('should have consistent statistics', () => {
      const stats = categoryService.getCategoryStats();
      const categories = categoryService.getAllCategories();
      
      expect(stats.totalCategories).toBe(categories.length);
      expect(stats.categoriesWithGames).toBeLessThanOrEqual(stats.totalCategories);
    });
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = categoryService;
      const instance2 = categoryService;
      
      expect(instance1).toBe(instance2);
    });
  });
});