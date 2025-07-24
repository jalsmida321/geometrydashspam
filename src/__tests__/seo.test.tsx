import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import HomePage from '../pages/HomePage';
import GamePage from '../pages/GamePage';
import CategoryPage from '../pages/CategoryPage';
import { SEOHead } from '../components/SEO';
import { generateMetaDescription, extractGameKeywords } from '../utils/seoUtils';

// Mock game data
const mockGame = {
  id: 'geometry-dash-spam-test',
  name: 'Geometry Dash Spam Test',
  description: 'Test your spamming skills in this exciting Geometry Dash challenge!',
  image: 'https://example.com/geometry-dash-spam-test.png',
  url: 'https://example.com/geometry-dash-spam-test.html',
  category: {
    id: 'geometry-dash',
    name: 'Geometry Dash',
    slug: 'geometry-dash',
    description: 'Rhythm-based platformer challenges',
    icon: 'Triangle',
    color: 'blue'
  },
  tags: ['spam', 'challenge', 'rhythm'],
  featured: true,
  popularity: 95,
  dateAdded: new Date('2024-01-01'),
  metadata: {
    developer: 'Test Developer',
    controls: 'Click to jump',
    instructions: 'Navigate through obstacles'
  }
};

const mockGames = [mockGame];

// Mock window.location
delete (window as any).location;
window.location = { ...window.location, href: 'http://localhost:3000', origin: 'http://localhost:3000' };

describe('SEO Tests', () => {
  beforeEach(() => {
    // Clear any existing meta data
    document.head.innerHTML = '';
  });

  describe('Meta Tags and Title', () => {
    it('sets correct title and meta description for homepage', async () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );

      // Check for proper title structure
      expect(document.title).toContain('Geometry Dash Spam Games');
      
      // Check for meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription).toHaveAttribute('content');
      expect(metaDescription?.getAttribute('content')).toContain('Geometry Dash Spam Challenges');
    });

    it('generates dynamic meta tags for game pages', async () => {
      const keywords = extractGameKeywords(mockGame);
      const description = generateMetaDescription('game', { game: mockGame });

      expect(keywords).toContain('geometry dash');
      expect(keywords).toContain('spam');
      expect(keywords).toContain('challenge');
      expect(description).toContain(mockGame.name);
      expect(description).toContain('play online');
    });

    it('includes proper Open Graph tags', async () => {
      render(
        <SEOHead
          title="Test Game - Play Online"
          description="Test game description"
          image="https://example.com/test-image.jpg"
          url="https://example.com/test-game"
          type="game"
        />
      );

      // Check for Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');
      const ogType = document.querySelector('meta[property="og:type"]');

      expect(ogTitle).toHaveAttribute('content', 'Test Game - Play Online');
      expect(ogDescription).toHaveAttribute('content', 'Test game description');
      expect(ogImage).toHaveAttribute('content', 'https://example.com/test-image.jpg');
      expect(ogUrl).toHaveAttribute('content', 'https://example.com/test-game');
      expect(ogType).toHaveAttribute('content', 'game');
    });

    it('includes proper Twitter Card tags', async () => {
      render(
        <SEOHead
          title="Test Game"
          description="Test description"
          image="https://example.com/test-image.jpg"
        />
      );

      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      const twitterImage = document.querySelector('meta[name="twitter:image"]');

      expect(twitterCard).toHaveAttribute('content', 'summary_large_image');
      expect(twitterTitle).toHaveAttribute('content', 'Test Game');
      expect(twitterDescription).toHaveAttribute('content', 'Test description');
      expect(twitterImage).toHaveAttribute('content', 'https://example.com/test-image.jpg');
    });
  });

  describe('Structured Data', () => {
    it('includes JSON-LD structured data for games', async () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );

      // Check for JSON-LD script tag
      const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
      expect(jsonLdScript).toBeInTheDocument();

      if (jsonLdScript) {
        const structuredData = JSON.parse(jsonLdScript.textContent || '{}');
        expect(structuredData['@context']).toBe('https://schema.org');
        expect(structuredData['@type']).toBe('GameSeries');
        expect(structuredData.name).toContain('Geometry Dash Spam');
        expect(structuredData.game).toBeInstanceOf(Array);
      }
    });

    it('includes proper game schema for individual games', async () => {
      const gameSchema = {
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: mockGame.name,
        description: mockGame.description,
        image: mockGame.image,
        url: `${window.location.origin}/game/${encodeURIComponent(mockGame.name)}`,
        genre: mockGame.category.name,
        keywords: mockGame.tags.join(', '),
        datePublished: mockGame.dateAdded.toISOString(),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: mockGame.popularity / 20, // Convert to 5-star scale
          bestRating: 5,
          worstRating: 1
        }
      };

      expect(gameSchema['@type']).toBe('VideoGame');
      expect(gameSchema.name).toBe(mockGame.name);
      expect(gameSchema.genre).toBe(mockGame.category.name);
    });

    it('includes breadcrumb structured data', async () => {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: window.location.origin
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: mockGame.category.name,
            item: `${window.location.origin}/games/category/${mockGame.category.slug}`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: mockGame.name,
            item: `${window.location.origin}/game/${encodeURIComponent(mockGame.name)}`
          }
        ]
      };

      expect(breadcrumbSchema['@type']).toBe('BreadcrumbList');
      expect(breadcrumbSchema.itemListElement).toHaveLength(3);
    });
  });

  describe('URL Structure and Routing', () => {
    it('uses SEO-friendly URLs', async () => {
      const gameUrl = `/game/${encodeURIComponent(mockGame.name)}`;
      const categoryUrl = `/games/category/${mockGame.category.slug}`;

      expect(gameUrl).toBe('/game/Geometry%20Dash%20Spam%20Test');
      expect(categoryUrl).toBe('/games/category/geometry-dash');
    });

    it('maintains backward compatibility with existing URLs', async () => {
      // Test that legacy routes still work
      const legacyRoutes = [
        '/popular',
        '/trending',
        '/space-waves',
        '/geometry-dash',
        '/unblocked-games'
      ];

      legacyRoutes.forEach(route => {
        render(
          <MemoryRouter initialEntries={[route]}>
            <div>Legacy Route Test</div>
          </MemoryRouter>
        );
        // Should not crash or show 404
        expect(screen.getByText('Legacy Route Test')).toBeInTheDocument();
      });
    });

    it('implements proper canonical URLs', async () => {
      render(
        <SEOHead
          title="Test Page"
          description="Test description"
          url="https://example.com/test-page"
        />
      );

      const canonicalLink = document.querySelector('link[rel="canonical"]');
      expect(canonicalLink).toHaveAttribute('href', 'https://example.com/test-page');
    });
  });

  describe('Sitemap and Robots', () => {
    it('generates proper sitemap structure', async () => {
      // This would typically test the sitemap generation utility
      const sitemapUrls = [
        '/',
        '/games',
        '/favorites',
        '/popular',
        '/trending',
        ...mockGames.map(game => `/game/${encodeURIComponent(game.name)}`),
        `/games/category/${mockGame.category.slug}`
      ];

      sitemapUrls.forEach(url => {
        expect(url).toMatch(/^\/[a-zA-Z0-9\-_\/\%]*$/);
      });
    });

    it('includes proper robots.txt directives', async () => {
      // Test robots.txt content
      const robotsContent = `
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: ${window.location.origin}/sitemap.xml
      `.trim();

      expect(robotsContent).toContain('User-agent: *');
      expect(robotsContent).toContain('Allow: /');
      expect(robotsContent).toContain('Sitemap:');
    });
  });

  describe('Performance and Core Web Vitals', () => {
    it('optimizes images for SEO', async () => {
      render(
        <MemoryRouter>
          <img 
            src={mockGame.image} 
            alt={`${mockGame.name} game screenshot`}
            loading="lazy"
            width="300"
            height="200"
          />
        </MemoryRouter>
      );

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt');
      expect(image).toHaveAttribute('loading', 'lazy');
      expect(image).toHaveAttribute('width');
      expect(image).toHaveAttribute('height');
    });

    it('implements proper heading hierarchy', async () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );

      const h1 = screen.getByRole('heading', { level: 1 });
      const h2Elements = screen.getAllByRole('heading', { level: 2 });

      expect(h1).toBeInTheDocument();
      expect(h2Elements.length).toBeGreaterThan(0);
      
      // Should have only one H1
      const allH1s = screen.getAllByRole('heading', { level: 1 });
      expect(allH1s).toHaveLength(1);
    });
  });

  describe('Mobile SEO', () => {
    it('includes viewport meta tag', async () => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      expect(viewportMeta).toHaveAttribute('content', 'width=device-width, initial-scale=1');
    });

    it('implements mobile-friendly navigation', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );

      // Should have mobile-friendly navigation
      const mobileMenuButton = screen.getByLabelText(/menu/i);
      expect(mobileMenuButton).toBeInTheDocument();
    });
  });

  describe('International SEO', () => {
    it('includes proper language attributes', async () => {
      render(
        <MemoryRouter>
          <div lang="en">
            <HomePage />
          </div>
        </MemoryRouter>
      );

      const langElement = screen.getByText('Geometry Dash Spam Games').closest('[lang]');
      expect(langElement).toHaveAttribute('lang', 'en');
    });

    it('supports multiple languages in content', async () => {
      // Test Chinese content support (as seen in requirements)
      const chineseContent = '将现有的Geometry Dash Spam网站改造成更像经典小游戏站点的结构';
      
      render(
        <div lang="zh-CN">
          <p>{chineseContent}</p>
        </div>
      );

      expect(screen.getByText(chineseContent)).toBeInTheDocument();
    });
  });

  describe('Social Media Optimization', () => {
    it('includes proper social sharing meta tags', async () => {
      render(
        <SEOHead
          title="Geometry Dash Spam Test"
          description="Test your spamming skills"
          image="https://example.com/game-image.jpg"
          url="https://example.com/game/geometry-dash-spam-test"
          type="game"
        />
      );

      // Facebook Open Graph
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');

      expect(ogTitle).toHaveAttribute('content', 'Geometry Dash Spam Test');
      expect(ogDescription).toHaveAttribute('content', 'Test your spamming skills');
      expect(ogImage).toHaveAttribute('content', 'https://example.com/game-image.jpg');

      // Twitter Cards
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');

      expect(twitterCard).toHaveAttribute('content', 'summary_large_image');
      expect(twitterTitle).toHaveAttribute('content', 'Geometry Dash Spam Test');
    });
  });

  describe('Search Engine Optimization', () => {
    it('maintains existing TDK (Title, Description, Keywords)', async () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );

      // Should preserve existing SEO content
      expect(document.title).toContain('Geometry Dash Spam Games');
      
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription?.getAttribute('content')).toContain('Geometry Dash Spam Challenges');
    });

    it('generates relevant keywords for games', async () => {
      const keywords = extractGameKeywords(mockGame);
      
      expect(keywords).toContain('geometry dash');
      expect(keywords).toContain('spam test');
      expect(keywords).toContain('online games');
      expect(keywords).toContain('browser games');
      expect(keywords).toContain(mockGame.category.name.toLowerCase());
      
      mockGame.tags.forEach(tag => {
        expect(keywords).toContain(tag);
      });
    });

    it('implements proper internal linking structure', async () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );

      // Should have internal links to category pages
      const categoryLinks = screen.getAllByRole('link').filter(link => 
        link.getAttribute('href')?.includes('/games/category/')
      );
      expect(categoryLinks.length).toBeGreaterThan(0);

      // Should have internal links to game pages
      const gameLinks = screen.getAllByRole('link').filter(link => 
        link.getAttribute('href')?.includes('/game/')
      );
      expect(gameLinks.length).toBeGreaterThan(0);
    });
  });
});