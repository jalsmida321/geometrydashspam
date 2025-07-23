import { 
  generateMetaDescription, 
  extractGameKeywords, 
  generateStructuredData,
  optimizeTitle 
} from '../seoUtils';
import { Game } from '../../types/game';

const mockGame: Game = {
  id: 'test-game',
  name: 'Test Game',
  description: 'A fun test game for everyone',
  image: 'https://example.com/test-game.jpg',
  url: 'https://example.com/test-game.html',
  category: {
    id: 'action',
    name: 'Action',
    slug: 'action',
    description: 'Action games',
    icon: 'Zap',
    color: 'red'
  },
  tags: ['test', 'action', 'fun'],
  featured: true,
  popularity: 85,
  dateAdded: new Date('2024-01-01'),
  metadata: {
    developer: 'Test Developer',
    controls: 'Click to jump',
    instructions: 'Navigate through obstacles'
  }
};

describe('SEO Utils', () => {
  describe('generateMetaDescription', () => {
    it('generates description for game page', () => {
      const description = generateMetaDescription('game', { game: mockGame });
      
      expect(description).toContain('Test Game');
      expect(description).toContain('A fun test game for everyone');
      expect(description.length).toBeLessThanOrEqual(160);
    });

    it('generates description for category page', () => {
      const description = generateMetaDescription('category', { 
        category: mockGame.category,
        gameCount: 5 
      });
      
      expect(description).toContain('Action');
      expect(description).toContain('5 games');
      expect(description.length).toBeLessThanOrEqual(160);
    });

    it('generates description for search results', () => {
      const description = generateMetaDescription('search', { 
        query: 'test games',
        resultCount: 3 
      });
      
      expect(description).toContain('test games');
      expect(description).toContain('3 results');
      expect(description.length).toBeLessThanOrEqual(160);
    });

    it('generates default description for homepage', () => {
      const description = generateMetaDescription('homepage');
      
      expect(description).toContain('Geometry Dash');
      expect(description.length).toBeLessThanOrEqual(160);
    });
  });

  describe('extractGameKeywords', () => {
    it('extracts keywords from game data', () => {
      const keywords = extractGameKeywords(mockGame);
      
      expect(keywords).toContain('Test Game');
      expect(keywords).toContain('action');
      expect(keywords).toContain('test');
      expect(keywords).toContain('fun');
      expect(keywords).toContain('Action');
    });

    it('handles game without tags', () => {
      const gameWithoutTags = { ...mockGame, tags: [] };
      const keywords = extractGameKeywords(gameWithoutTags);
      
      expect(keywords).toContain('Test Game');
      expect(keywords).toContain('Action');
      expect(keywords.length).toBeGreaterThan(0);
    });

    it('removes duplicate keywords', () => {
      const gameWithDuplicates = { 
        ...mockGame, 
        tags: ['action', 'Action', 'test', 'TEST'] 
      };
      const keywords = extractGameKeywords(gameWithDuplicates);
      
      const uniqueKeywords = [...new Set(keywords.map(k => k.toLowerCase()))];
      expect(keywords.length).toBe(uniqueKeywords.length);
    });
  });

  describe('generateStructuredData', () => {
    it('generates structured data for game', () => {
      const structuredData = generateStructuredData('game', { 
        game: mockGame,
        url: 'https://example.com/game/test-game'
      });
      
      expect(structuredData['@type']).toBe('VideoGame');
      expect(structuredData.name).toBe('Test Game');
      expect(structuredData.description).toBe('A fun test game for everyone');
      expect(structuredData.url).toBe('https://example.com/game/test-game');
      expect(structuredData.image).toBe('https://example.com/test-game.jpg');
    });

    it('generates structured data for game collection', () => {
      const structuredData = generateStructuredData('gameCollection', { 
        games: [mockGame],
        title: 'Action Games'
      });
      
      expect(structuredData['@type']).toBe('CollectionPage');
      expect(structuredData.name).toBe('Action Games');
      expect(structuredData.mainEntity).toHaveLength(1);
    });

    it('generates structured data for website', () => {
      const structuredData = generateStructuredData('website', {
        url: 'https://example.com'
      });
      
      expect(structuredData['@type']).toBe('WebSite');
      expect(structuredData.url).toBe('https://example.com');
      expect(structuredData.potentialAction).toBeDefined();
    });
  });

  describe('optimizeTitle', () => {
    it('optimizes title for SEO', () => {
      const title = optimizeTitle('Test Game', 'game');
      
      expect(title).toContain('Test Game');
      expect(title).toContain('Play Online');
      expect(title.length).toBeLessThanOrEqual(60);
    });

    it('optimizes category title', () => {
      const title = optimizeTitle('Action Games', 'category');
      
      expect(title).toContain('Action Games');
      expect(title.length).toBeLessThanOrEqual(60);
    });

    it('handles long titles by truncating', () => {
      const longTitle = 'This is a very long game title that exceeds the recommended length';
      const title = optimizeTitle(longTitle, 'game');
      
      expect(title.length).toBeLessThanOrEqual(60);
      expect(title).toContain('...');
    });

    it('preserves short titles', () => {
      const shortTitle = 'Short Game';
      const title = optimizeTitle(shortTitle, 'game');
      
      expect(title).toContain(shortTitle);
      expect(title.length).toBeLessThanOrEqual(60);
    });
  });
});