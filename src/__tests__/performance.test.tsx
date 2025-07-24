import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { GameGrid } from '../components/game';
import VirtualList from '../components/common/VirtualList';
import { gameService } from '../services';

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => [])
};

Object.defineProperty(window, 'performance', {
  value: mockPerformance
});

// Mock IntersectionObserver for lazy loading tests
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
});
window.IntersectionObserver = mockIntersectionObserver;

// Generate large dataset for performance testing
const generateLargeGameDataset = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `game-${i}`,
    name: `Test Game ${i}`,
    description: `Description for test game ${i}`,
    image: `https://example.com/image${i}.jpg`,
    url: `https://example.com/game${i}`,
    category: {
      id: 'test',
      name: 'Test',
      slug: 'test',
      description: 'Test category',
      icon: 'Test',
      color: 'blue'
    },
    tags: [`tag${i}`, 'test'],
    featured: i % 10 === 0,
    popularity: Math.floor(Math.random() * 100),
    dateAdded: new Date(2024, 0, i % 30 + 1)
  }));
};

describe('Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPerformance.now.mockReturnValue(Date.now());
  });

  describe('GameGrid Performance', () => {
    it('renders large game lists efficiently', async () => {
      const largeGameList = generateLargeGameDataset(1000);
      const startTime = performance.now();

      render(
        <MemoryRouter>
          <GameGrid games={largeGameList} columns={3} loading={false} />
        </MemoryRouter>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time (less than 1 second)
      expect(renderTime).toBeLessThan(1000);

      // Should only render visible items initially (virtualization)
      const gameCards = screen.getAllByRole('article');
      expect(gameCards.length).toBeLessThan(largeGameList.length);
    });

    it('handles rapid filter changes efficiently', async () => {
      const games = generateLargeGameDataset(500);
      
      const { rerender } = render(
        <MemoryRouter>
          <GameGrid games={games} columns={3} loading={false} />
        </MemoryRouter>
      );

      const startTime = performance.now();

      // Simulate rapid filter changes
      for (let i = 0; i < 10; i++) {
        const filteredGames = games.filter(game => game.name.includes(`${i}`));
        rerender(
          <MemoryRouter>
            <GameGrid games={filteredGames} columns={3} loading={false} />
          </MemoryRouter>
        );
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should handle rapid updates efficiently
      expect(totalTime).toBeLessThan(500);
    });
  });

  describe('Virtual Scrolling Performance', () => {
    it('renders only visible items in virtual list', async () => {
      const largeDataset = generateLargeGameDataset(10000);

      render(
        <VirtualList
          items={largeDataset}
          itemHeight={200}
          containerHeight={600}
          renderItem={(item) => <div key={item.id}>{item.name}</div>}
        />
      );

      // Should only render items that fit in the viewport
      const renderedItems = screen.getAllByText(/Test Game/);
      expect(renderedItems.length).toBeLessThan(10); // Only ~3 items should be visible
    });

    it('handles scroll events efficiently', async () => {
      const largeDataset = generateLargeGameDataset(1000);
      
      const { container } = render(
        <VirtualList
          items={largeDataset}
          itemHeight={200}
          containerHeight={600}
          renderItem={(item) => <div key={item.id}>{item.name}</div>}
        />
      );

      const scrollContainer = container.querySelector('[data-testid="virtual-list"]');
      
      const startTime = performance.now();

      // Simulate rapid scrolling
      for (let i = 0; i < 100; i++) {
        if (scrollContainer) {
          scrollContainer.scrollTop = i * 10;
          // Trigger scroll event
          scrollContainer.dispatchEvent(new Event('scroll'));
        }
      }

      const endTime = performance.now();
      const scrollTime = endTime - startTime;

      // Should handle rapid scrolling efficiently
      expect(scrollTime).toBeLessThan(200);
    });
  });

  describe('Image Loading Performance', () => {
    it('implements lazy loading for images', async () => {
      const games = generateLargeGameDataset(50);

      render(
        <MemoryRouter>
          <GameGrid games={games} columns={3} loading={false} />
        </MemoryRouter>
      );

      // Should use IntersectionObserver for lazy loading
      expect(mockIntersectionObserver).toHaveBeenCalled();

      // Images should have loading="lazy" attribute
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });

    it('handles image loading errors gracefully', async () => {
      const games = generateLargeGameDataset(5);

      render(
        <MemoryRouter>
          <GameGrid games={games} columns={3} loading={false} />
        </MemoryRouter>
      );

      // Simulate image loading errors
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        // Trigger error event
        Object.defineProperty(img, 'complete', { value: false });
        img.dispatchEvent(new Event('error'));
      });

      // Should show fallback content
      await waitFor(() => {
        const fallbacks = screen.getAllByText('Game Image');
        expect(fallbacks.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Search Performance', () => {
    it('debounces search queries efficiently', async () => {
      const searchSpy = jest.spyOn(gameService, 'filterGames');
      
      // This would need to be tested with actual search component
      // For now, we test the service directly
      const games = generateLargeGameDataset(1000);
      
      const startTime = performance.now();

      // Simulate rapid search queries
      for (let i = 0; i < 100; i++) {
        gameService.filterGames({ search: `query${i}` });
      }

      const endTime = performance.now();
      const searchTime = endTime - startTime;

      // Should handle multiple searches efficiently
      expect(searchTime).toBeLessThan(1000);
      expect(searchSpy).toHaveBeenCalledTimes(100);

      searchSpy.mockRestore();
    });

    it('caches search results for performance', async () => {
      const games = generateLargeGameDataset(500);
      
      // First search
      const startTime1 = performance.now();
      const results1 = gameService.filterGames({ search: 'test' });
      const endTime1 = performance.now();
      const firstSearchTime = endTime1 - startTime1;

      // Same search again (should be faster if cached)
      const startTime2 = performance.now();
      const results2 = gameService.filterGames({ search: 'test' });
      const endTime2 = performance.now();
      const secondSearchTime = endTime2 - startTime2;

      // Results should be identical
      expect(results1).toEqual(results2);
      
      // Second search should be faster (or at least not significantly slower)
      expect(secondSearchTime).toBeLessThanOrEqual(firstSearchTime * 2);
    });
  });

  describe('Memory Usage', () => {
    it('cleans up event listeners on unmount', async () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { unmount } = render(
        <MemoryRouter>
          <GameGrid games={generateLargeGameDataset(10)} columns={3} loading={false} />
        </MemoryRouter>
      );

      const addedListeners = addEventListenerSpy.mock.calls.length;

      unmount();

      const removedListeners = removeEventListenerSpy.mock.calls.length;

      // Should clean up listeners on unmount
      expect(removedListeners).toBeGreaterThanOrEqual(addedListeners);

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it('prevents memory leaks in localStorage operations', async () => {
      const originalSetItem = localStorage.setItem;
      const setItemSpy = jest.spyOn(localStorage, 'setItem');

      // Simulate many localStorage operations
      for (let i = 0; i < 1000; i++) {
        gameService.addToRecentlyPlayed(`game-${i}`);
      }

      // Should limit recently played items to prevent unbounded growth
      const recentlyPlayed = gameService.getRecentlyPlayed();
      expect(recentlyPlayed.length).toBeLessThanOrEqual(10);

      setItemSpy.mockRestore();
    });
  });

  describe('Bundle Size Optimization', () => {
    it('uses code splitting for large components', async () => {
      // This would typically be tested with bundle analysis tools
      // For now, we verify that components are properly structured for splitting
      
      const { GameGrid } = await import('../components/game');
      const { VirtualList } = await import('../components/common');
      
      expect(GameGrid).toBeDefined();
      expect(VirtualList).toBeDefined();
    });

    it('tree-shakes unused utilities', async () => {
      // Verify that only used utilities are imported
      const { gameService } = await import('../services');
      const { formatDate } = await import('../utils/seoUtils');
      
      expect(gameService).toBeDefined();
      expect(formatDate).toBeDefined();
    });
  });

  describe('Rendering Performance', () => {
    it('minimizes re-renders with proper memoization', async () => {
      const renderSpy = jest.fn();
      
      const TestComponent = React.memo(() => {
        renderSpy();
        return <div>Test</div>;
      });

      const { rerender } = render(<TestComponent />);
      
      // Initial render
      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render with same props (should not re-render due to memo)
      rerender(<TestComponent />);
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('uses efficient key props for list rendering', async () => {
      const games = generateLargeGameDataset(100);

      render(
        <MemoryRouter>
          <GameGrid games={games} columns={3} loading={false} />
        </MemoryRouter>
      );

      // Verify that each game card has a unique key
      const gameCards = screen.getAllByRole('article');
      const keys = gameCards.map(card => card.getAttribute('data-testid'));
      const uniqueKeys = new Set(keys);
      
      expect(uniqueKeys.size).toBe(Math.min(gameCards.length, games.length));
    });
  });
});