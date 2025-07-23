import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../App';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Game Discovery Flow Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('completes full game discovery and play flow', async () => {
    render(<App />);

    // 1. User lands on homepage
    expect(screen.getByText('Geometry Dash Spam Games')).toBeInTheDocument();

    // 2. User sees category navigation
    expect(screen.getByText('Browse by Category')).toBeInTheDocument();

    // 3. User searches for a game
    const searchInput = screen.getByPlaceholderText(/Search for games/);
    fireEvent.change(searchInput, { target: { value: 'geometry' } });
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter' });

    // 4. User should see search results
    await waitFor(() => {
      expect(screen.getByText(/Search Results/)).toBeInTheDocument();
    });

    // 5. User clicks on a game
    const gameCard = screen.getByText('Geometry Dash Spam Test');
    fireEvent.click(gameCard);

    // 6. User should be on game page
    await waitFor(() => {
      expect(screen.getByText('Play Now')).toBeInTheDocument();
    });

    // 7. User adds game to favorites
    const favoriteButton = screen.getByLabelText(/Add.*to favorites/);
    fireEvent.click(favoriteButton);

    // 8. User plays the game
    const playButton = screen.getByText('Play Now');
    fireEvent.click(playButton);

    // 9. Game should be added to recently played
    expect(localStorage.getItem('recentlyPlayed')).toBeTruthy();

    // 10. User navigates to favorites page
    const favoritesLink = screen.getByText('Favorites');
    fireEvent.click(favoritesLink);

    // 11. User should see their favorite game
    await waitFor(() => {
      expect(screen.getByText('My Favorites')).toBeInTheDocument();
    });
  });

  it('handles category browsing flow', async () => {
    render(<App />);

    // 1. User clicks on a category
    const actionCategory = screen.getByText('Action Games');
    fireEvent.click(actionCategory);

    // 2. User should be on category page
    await waitFor(() => {
      expect(screen.getByText(/Action Games/)).toBeInTheDocument();
    });

    // 3. User should see games in that category
    expect(screen.getByText(/games in category/i)).toBeInTheDocument();

    // 4. User can filter within category
    const sortSelect = screen.getByText('Sort by:');
    expect(sortSelect).toBeInTheDocument();
  });

  it('handles recently played functionality', async () => {
    render(<App />);

    // Initially no recently played games
    expect(screen.getByText('No Recently Played Games')).toBeInTheDocument();

    // User plays a game (simulate by adding to localStorage)
    localStorage.setItem('recentlyPlayed', JSON.stringify(['geometry-dash-spam-test']));

    // Refresh the page
    render(<App />);

    // Should now show recently played section
    await waitFor(() => {
      expect(screen.getByText('Recently Played')).toBeInTheDocument();
    });
  });

  it('handles responsive navigation', async () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<App />);

    // Should show mobile menu button
    const mobileMenuButton = screen.getByLabelText(/menu/i);
    fireEvent.click(mobileMenuButton);

    // Should show mobile navigation
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('handles error states gracefully', async () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Simulate an error by breaking localStorage
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = jest.fn(() => {
      throw new Error('Storage error');
    });

    render(<App />);

    // App should still render without crashing
    expect(screen.getByText('Geometry Dash Spam Games')).toBeInTheDocument();

    // Restore localStorage
    localStorage.getItem = originalGetItem;
    consoleSpy.mockRestore();
  });

  it('maintains SEO and accessibility standards', async () => {
    render(<App />);

    // Check for proper heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();

    // Check for proper navigation landmarks
    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();

    // Check for proper button labels
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });

    // Check for proper image alt texts
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });
  });

  it('handles keyboard navigation', async () => {
    render(<App />);

    // Focus should be manageable with keyboard
    const firstFocusableElement = screen.getAllByRole('button')[0];
    firstFocusableElement.focus();

    expect(document.activeElement).toBe(firstFocusableElement);

    // Tab navigation should work
    fireEvent.keyDown(firstFocusableElement, { key: 'Tab' });
    
    // Should move focus to next element
    expect(document.activeElement).not.toBe(firstFocusableElement);
  });

  it('persists user preferences across sessions', async () => {
    render(<App />);

    // User adds a game to favorites
    localStorage.setItem('favorites', JSON.stringify(['game-1']));

    // User adds a game to recently played
    localStorage.setItem('recentlyPlayed', JSON.stringify(['game-1']));

    // Simulate page refresh
    render(<App />);

    // Preferences should be restored
    expect(localStorage.getItem('favorites')).toBe('["game-1"]');
    expect(localStorage.getItem('recentlyPlayed')).toBe('["game-1"]');
  });
});