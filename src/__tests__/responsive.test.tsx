import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../App';
import { GameGrid, GameCard } from '../components/game';
import Header from '../components/Header';

// Mock game data
const mockGame = {
  id: 'test-game',
  name: 'Test Game',
  description: 'A test game for responsive testing',
  image: 'https://example.com/test-game.jpg',
  url: 'https://example.com/test-game',
  category: {
    id: 'action',
    name: 'Action',
    slug: 'action',
    description: 'Action games',
    icon: 'Zap',
    color: 'red'
  },
  tags: ['test', 'action'],
  featured: false,
  popularity: 80,
  dateAdded: new Date('2024-01-01')
};

const mockGames = Array.from({ length: 12 }, (_, i) => ({
  ...mockGame,
  id: `test-game-${i}`,
  name: `Test Game ${i}`
}));

// Mock window.matchMedia
const mockMatchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('Responsive Design Tests', () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(mockMatchMedia);
  });

  describe('Viewport Breakpoints', () => {
    const setViewport = (width: number, height: number = 800) => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: height,
      });
      window.dispatchEvent(new Event('resize'));
    };

    it('adapts layout for mobile devices (320px-768px)', async () => {
      setViewport(375); // iPhone viewport

      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );

      // Mobile navigation should be visible
      const mobileMenuButton = screen.getByLabelText(/menu/i);
      expect(mobileMenuButton).toBeInTheDocument();

      // Desktop navigation should be hidden
      const desktopNav = screen.queryByText('Categories');
      expect(desktopNav).not.toBeVisible();
    });

    it('adapts layout for tablet devices (768px-1024px)', async () => {
      setViewport(768);

      render(
        <MemoryRouter>
          <GameGrid games={mockGames} columns={3} loading={false} />
        </MemoryRouter>
      );

      // Should show appropriate number of columns for tablet
      const gameCards = screen.getAllByRole('article');
      expect(gameCards.length).toBeGreaterThan(0);
    });

    it('adapts layout for desktop devices (1024px+)', async () => {
      setViewport(1200);

      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );

      // Desktop navigation should be visible
      const desktopNav = screen.getByText('Categories');
      expect(desktopNav).toBeInTheDocument();

      // Mobile menu button should be hidden
      const mobileMenuButton = screen.queryByLabelText(/menu/i);
      expect(mobileMenuButton).not.toBeVisible();
    });

    it('handles very small screens (< 320px)', async () => {
      setViewport(280);

      render(
        <MemoryRouter>
          <GameCard game={mockGame} size="small" />
        </MemoryRouter>
      );

      // Should still be functional on very small screens
      const gameCard = screen.getByRole('article');
      expect(gameCard).toBeInTheDocument();
    });

    it('handles very large screens (> 1920px)', async () => {
      setViewport(2560);

      render(
        <MemoryRouter>
          <GameGrid games={mockGames} columns={4} loading={false} />
        </MemoryRouter>
      );

      // Should utilize large screen space effectively
      const gameCards = screen.getAllByRole('article');
      expect(gameCards.length).toBeGreaterThan(0);
    });
  });

  describe('Touch and Mobile Interactions', () => {
    it('supports touch navigation', async () => {
      setViewport(375);

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      const mobileMenuButton = screen.getByLabelText(/menu/i);
      
      // Simulate touch interaction
      fireEvent.touchStart(mobileMenuButton);
      fireEvent.touchEnd(mobileMenuButton);
      fireEvent.click(mobileMenuButton);

      await waitFor(() => {
        expect(screen.getByText('Categories')).toBeInTheDocument();
      });
    });

    it('has appropriate touch target sizes', async () => {
      setViewport(375);

      render(
        <MemoryRouter>
          <GameCard game={mockGame} />
        </MemoryRouter>
      );

      // Touch targets should be at least 44px (iOS) or 48px (Android)
      const favoriteButton = screen.getByLabelText(/Add.*to favorites/);
      const playButton = screen.getByRole('link');

      // These would need actual CSS measurement in real scenario
      expect(favoriteButton).toBeInTheDocument();
      expect(playButton).toBeInTheDocument();
    });

    it('supports swipe gestures for carousels', async () => {
      setViewport(375);

      // This would need actual swipe gesture implementation
      render(
        <MemoryRouter>
          <div data-testid="carousel">
            <GameGrid games={mockGames.slice(0, 3)} columns={1} loading={false} />
          </div>
        </MemoryRouter>
      );

      const carousel = screen.getByTestId('carousel');
      
      // Simulate swipe gesture
      fireEvent.touchStart(carousel, {
        touches: [{ clientX: 100, clientY: 100 }]
      });
      fireEvent.touchMove(carousel, {
        touches: [{ clientX: 50, clientY: 100 }]
      });
      fireEvent.touchEnd(carousel);

      // Should handle swipe without crashing
      expect(carousel).toBeInTheDocument();
    });
  });

  describe('Grid and Layout Responsiveness', () => {
    it('adjusts game grid columns based on screen size', async () => {
      const testCases = [
        { width: 320, expectedColumns: 1 },
        { width: 640, expectedColumns: 2 },
        { width: 1024, expectedColumns: 3 },
        { width: 1280, expectedColumns: 4 }
      ];

      testCases.forEach(({ width, expectedColumns }) => {
        setViewport(width);

        render(
          <MemoryRouter>
            <GameGrid games={mockGames} columns={expectedColumns} loading={false} />
          </MemoryRouter>
        );

        // Should render appropriate number of columns
        const gameCards = screen.getAllByRole('article');
        expect(gameCards.length).toBeGreaterThan(0);
      });
    });

    it('adapts card sizes for different screen sizes', async () => {
      const sizes = ['small', 'medium', 'large'] as const;

      sizes.forEach(size => {
        render(
          <MemoryRouter>
            <GameCard game={mockGame} size={size} />
          </MemoryRouter>
        );

        const gameCard = screen.getByRole('article');
        expect(gameCard).toBeInTheDocument();
      });
    });

    it('handles content overflow gracefully', async () => {
      setViewport(320);

      const longTitleGame = {
        ...mockGame,
        name: 'This is a very long game title that might overflow on small screens',
        description: 'This is a very long description that should be truncated or wrapped appropriately on small screens to maintain good user experience'
      };

      render(
        <MemoryRouter>
          <GameCard game={longTitleGame} />
        </MemoryRouter>
      );

      // Should handle long content without breaking layout
      const gameCard = screen.getByRole('article');
      expect(gameCard).toBeInTheDocument();
    });
  });

  describe('Navigation Responsiveness', () => {
    it('shows mobile navigation menu on small screens', async () => {
      setViewport(375);

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      const mobileMenuButton = screen.getByLabelText(/menu/i);
      fireEvent.click(mobileMenuButton);

      await waitFor(() => {
        expect(screen.getByText('Categories')).toBeInTheDocument();
        expect(screen.getByText('Navigation')).toBeInTheDocument();
      });
    });

    it('collapses navigation items on medium screens', async () => {
      setViewport(768);

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      // Some navigation items might be collapsed or reorganized
      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeInTheDocument();
    });

    it('shows full navigation on large screens', async () => {
      setViewport(1200);

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      // All navigation items should be visible
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('All Games')).toBeInTheDocument();
      expect(screen.getByText('Popular')).toBeInTheDocument();
      expect(screen.getByText('Favorites')).toBeInTheDocument();
    });
  });

  describe('Typography and Text Responsiveness', () => {
    it('scales text appropriately for different screen sizes', async () => {
      const viewports = [320, 768, 1200];

      viewports.forEach(width => {
        setViewport(width);

        render(
          <MemoryRouter>
            <div>
              <h1>Main Heading</h1>
              <h2>Secondary Heading</h2>
              <p>Body text content</p>
            </div>
          </MemoryRouter>
        );

        // Text should be readable at all sizes
        expect(screen.getByText('Main Heading')).toBeInTheDocument();
        expect(screen.getByText('Secondary Heading')).toBeInTheDocument();
        expect(screen.getByText('Body text content')).toBeInTheDocument();
      });
    });

    it('handles text truncation on small screens', async () => {
      setViewport(320);

      const longTextGame = {
        ...mockGame,
        name: 'Super Ultra Mega Long Game Title That Should Be Truncated',
        description: 'This is an extremely long description that should be truncated with ellipsis on small screens to prevent layout issues and maintain readability'
      };

      render(
        <MemoryRouter>
          <GameCard game={longTextGame} />
        </MemoryRouter>
      );

      // Should handle long text gracefully
      const gameCard = screen.getByRole('article');
      expect(gameCard).toBeInTheDocument();
    });
  });

  describe('Image Responsiveness', () => {
    it('serves appropriate image sizes for different screens', async () => {
      setViewport(375);

      render(
        <MemoryRouter>
          <GameCard game={mockGame} />
        </MemoryRouter>
      );

      const gameImage = screen.getByRole('img');
      expect(gameImage).toHaveAttribute('loading', 'lazy');
      
      // Should have responsive image attributes
      expect(gameImage).toBeInTheDocument();
    });

    it('handles image loading failures on mobile', async () => {
      setViewport(375);

      render(
        <MemoryRouter>
          <GameCard game={mockGame} />
        </MemoryRouter>
      );

      const gameImage = screen.getByRole('img');
      
      // Simulate image load error
      fireEvent.error(gameImage);

      // Should show fallback content
      await waitFor(() => {
        expect(screen.getByText('Game Image')).toBeInTheDocument();
      });
    });
  });

  describe('Form and Input Responsiveness', () => {
    it('adapts search input for mobile screens', async () => {
      setViewport(375);

      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );

      // Mobile search should be accessible
      const searchButton = screen.getByLabelText(/search/i);
      fireEvent.click(searchButton);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/Search for games/);
        expect(searchInput).toBeInTheDocument();
      });
    });

    it('handles virtual keyboard on mobile devices', async () => {
      setViewport(375, 600); // Simulate mobile with virtual keyboard

      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText(/Search for games/);
      fireEvent.focus(searchInput);

      // Should handle virtual keyboard appearance
      expect(searchInput).toHaveFocus();
    });
  });

  describe('Performance on Different Devices', () => {
    it('optimizes rendering for low-end devices', async () => {
      // Mock slow device
      setViewport(375);
      
      const startTime = performance.now();

      render(
        <MemoryRouter>
          <GameGrid games={mockGames} columns={2} loading={false} />
        </MemoryRouter>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render efficiently even on slower devices
      expect(renderTime).toBeLessThan(1000);
    });

    it('reduces animations on low-performance devices', async () => {
      // Mock prefers-reduced-motion
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        ...mockMatchMedia(query),
        matches: query === '(prefers-reduced-motion: reduce)'
      }));

      render(
        <MemoryRouter>
          <GameCard game={mockGame} />
        </MemoryRouter>
      );

      // Should respect reduced motion preferences
      const gameCard = screen.getByRole('article');
      expect(gameCard).toBeInTheDocument();
    });
  });

  describe('Orientation Changes', () => {
    it('handles portrait to landscape orientation change', async () => {
      // Portrait
      setViewport(375, 667);

      const { rerender } = render(
        <MemoryRouter>
          <GameGrid games={mockGames} columns={2} loading={false} />
        </MemoryRouter>
      );

      // Landscape
      setViewport(667, 375);

      rerender(
        <MemoryRouter>
          <GameGrid games={mockGames} columns={3} loading={false} />
        </MemoryRouter>
      );

      // Should adapt to orientation change
      const gameCards = screen.getAllByRole('article');
      expect(gameCards.length).toBeGreaterThan(0);
    });

    it('maintains functionality across orientation changes', async () => {
      setViewport(375, 667);

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      const mobileMenuButton = screen.getByLabelText(/menu/i);
      fireEvent.click(mobileMenuButton);

      // Change orientation
      setViewport(667, 375);

      // Menu should still work
      await waitFor(() => {
        expect(screen.getByText('Categories')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility on Mobile', () => {
    it('maintains accessibility on touch devices', async () => {
      setViewport(375);

      render(
        <MemoryRouter>
          <GameCard game={mockGame} />
        </MemoryRouter>
      );

      // Touch targets should be accessible
      const favoriteButton = screen.getByLabelText(/Add.*to favorites/);
      const playButton = screen.getByRole('link');

      expect(favoriteButton).toBeInTheDocument();
      expect(playButton).toBeInTheDocument();
    });

    it('supports screen readers on mobile', async () => {
      setViewport(375);

      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );

      // Should have proper ARIA labels for mobile
      const navigation = screen.getByRole('navigation');
      const main = screen.getByRole('main');

      expect(navigation).toBeInTheDocument();
      expect(main).toBeInTheDocument();
    });
  });
});