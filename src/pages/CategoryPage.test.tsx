import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import CategoryPage from './CategoryPage';
import { GameProvider } from '../context/GameContext';

// Mock the hooks
jest.mock('../hooks', () => ({
  useGames: () => ({
    games: [
      {
        id: 'game-1',
        name: 'Action Game 1',
        description: 'An action game',
        image: 'https://example.com/image1.jpg',
        url: 'https://example.com/game1',
        category: {
          id: 'action',
          name: 'Action',
          slug: 'action',
          description: 'Action games',
          icon: 'Zap',
          color: 'red'
        },
        tags: ['action', 'fast'],
        featured: false,
        popularity: 85,
        dateAdded: new Date('2024-01-01')
      }
    ],
    updateFilter: jest.fn(),
    filter: { category: 'action' },
    loading: false,
    error: null
  }),
  useCategories: () => ({
    categories: [
      {
        id: 'action',
        name: 'Action',
        slug: 'action',
        description: 'Fast-paced action games',
        icon: 'Zap',
        color: 'red'
      }
    ]
  })
}));

// Mock GameContext
jest.mock('../context/GameContext', () => ({
  GameProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useGameContext: () => ({
    games: [],
    categories: [
      {
        id: 'action',
        name: 'Action',
        slug: 'action',
        description: 'Fast-paced action games',
        icon: 'Zap',
        color: 'red'
      }
    ],
    filteredGames: [],
    currentFilter: {},
    setFilter: jest.fn(),
    searchGames: jest.fn(),
    getGamesByCategory: jest.fn(() => [
      {
        id: 'game-1',
        name: 'Action Game 1',
        description: 'An action game',
        image: 'https://example.com/image1.jpg',
        url: 'https://example.com/game1',
        category: {
          id: 'action',
          name: 'Action',
          slug: 'action',
          description: 'Action games',
          icon: 'Zap',
          color: 'red'
        },
        tags: ['action', 'fast'],
        featured: false,
        popularity: 85,
        dateAdded: new Date('2024-01-01')
      }
    ]),
    getFeaturedGames: jest.fn(() => []),
    getRelatedGames: jest.fn(() => [])
  })
}));

const renderWithRouter = (component: React.ReactElement, route = '/games/category/action') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <GameProvider>
        {component}
      </GameProvider>
    </MemoryRouter>
  );
};

describe('CategoryPage', () => {
  it('renders category page with correct title', () => {
    renderWithRouter(<CategoryPage />);
    
    expect(screen.getByText('Action Games')).toBeInTheDocument();
    expect(screen.getByText('Fast-paced action games')).toBeInTheDocument();
  });

  it('displays category statistics', () => {
    renderWithRouter(<CategoryPage />);
    
    expect(screen.getByText('1')).toBeInTheDocument(); // Game count
    expect(screen.getByText('Games in Category')).toBeInTheDocument();
  });

  it('shows games in the category', () => {
    renderWithRouter(<CategoryPage />);
    
    expect(screen.getByText('Action Game 1')).toBeInTheDocument();
  });

  it('displays category icon and color', () => {
    renderWithRouter(<CategoryPage />);
    
    // Check for category icon (⚡ for Zap)
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });

  it('shows search functionality', () => {
    renderWithRouter(<CategoryPage />);
    
    expect(screen.getByPlaceholderText(/Search in Action/)).toBeInTheDocument();
  });

  it('displays sorting options', () => {
    renderWithRouter(<CategoryPage />);
    
    expect(screen.getByText('Sort by:')).toBeInTheDocument();
  });

  it('handles invalid category slug', () => {
    renderWithRouter(<CategoryPage />, '/games/category/nonexistent');
    
    expect(screen.getByText('Category Not Found')).toBeInTheDocument();
  });

  it('shows breadcrumb navigation', () => {
    renderWithRouter(<CategoryPage />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Games')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('displays related categories', () => {
    renderWithRouter(<CategoryPage />);
    
    expect(screen.getByText('Explore Other Categories')).toBeInTheDocument();
  });
});