import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeaturedGamesSection from './FeaturedGamesSection';
import { Game } from '../../types/game';
import { getCategoryById } from '../../data/categories';

// Mock games data for testing
const mockGames: Game[] = [
  {
    id: 'game-1',
    name: 'Test Game 1',
    description: 'Test description 1',
    image: 'test-image-1.png',
    url: 'test-url-1.html',
    category: getCategoryById('geometry-dash')!,
    tags: ['test', 'game'],
    featured: true,
    popularity: 90,
    dateAdded: new Date('2024-01-01')
  },
  {
    id: 'game-2',
    name: 'Test Game 2',
    description: 'Test description 2',
    image: 'test-image-2.png',
    url: 'test-url-2.html',
    category: getCategoryById('geometry-dash')!,
    tags: ['test', 'game'],
    featured: true,
    popularity: 85,
    dateAdded: new Date('2024-01-02')
  },
  {
    id: 'game-3',
    name: 'Test Game 3',
    description: 'Test description 3',
    image: 'test-image-3.png',
    url: 'test-url-3.html',
    category: getCategoryById('geometry-dash')!,
    tags: ['test', 'game'],
    featured: true,
    popularity: 80,
    dateAdded: new Date('2024-01-03')
  },
  {
    id: 'game-4',
    name: 'Test Game 4',
    description: 'Test description 4',
    image: 'test-image-4.png',
    url: 'test-url-4.html',
    category: getCategoryById('geometry-dash')!,
    tags: ['test', 'game'],
    featured: true,
    popularity: 75,
    dateAdded: new Date('2024-01-04')
  },
  {
    id: 'game-5',
    name: 'Test Game 5',
    description: 'Test description 5',
    image: 'test-image-5.png',
    url: 'test-url-5.html',
    category: getCategoryById('geometry-dash')!,
    tags: ['test', 'game'],
    featured: true,
    popularity: 70,
    dateAdded: new Date('2024-01-05')
  }
];

describe('FeaturedGamesSection', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders with default props', () => {
    render(<FeaturedGamesSection games={mockGames.slice(0, 3)} />);
    
    expect(screen.getByText('Featured Games')).toBeInTheDocument();
    expect(screen.getByText('Handpicked games for the best experience')).toBeInTheDocument();
    expect(screen.getByText('3 featured games available')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(
      <FeaturedGamesSection 
        games={mockGames.slice(0, 3)} 
        title="Custom Featured Games" 
      />
    );
    
    expect(screen.getByText('Custom Featured Games')).toBeInTheDocument();
  });

  it('displays games in carousel mode', () => {
    render(
      <FeaturedGamesSection 
        games={mockGames} 
        displayMode="carousel"
        maxVisible={3}
      />
    );
    
    // Should show navigation buttons when there are more games than maxVisible
    expect(screen.getByLabelText('Previous games')).toBeInTheDocument();
    expect(screen.getByLabelText('Next games')).toBeInTheDocument();
    
    // Should show carousel indicators
    const indicators = screen.getAllByRole('button').filter(button => 
      button.getAttribute('aria-label')?.includes('Go to slide')
    );
    expect(indicators.length).toBeGreaterThan(0);
  });

  it('displays games in grid mode', () => {
    render(
      <FeaturedGamesSection 
        games={mockGames} 
        displayMode="grid"
        maxVisible={4}
      />
    );
    
    // Should not show navigation buttons in grid mode
    expect(screen.queryByLabelText('Previous games')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next games')).not.toBeInTheDocument();
  });

  it('handles navigation in carousel mode', () => {
    render(
      <FeaturedGamesSection 
        games={mockGames} 
        displayMode="carousel"
        maxVisible={2}
        autoRotate={false}
      />
    );
    
    const nextButton = screen.getByLabelText('Next games');
    const prevButton = screen.getByLabelText('Previous games');
    
    // Click next button
    fireEvent.click(nextButton);
    
    // Click previous button
    fireEvent.click(prevButton);
    
    // Should not throw errors
    expect(nextButton).toBeInTheDocument();
    expect(prevButton).toBeInTheDocument();
  });

  it('auto-rotates when enabled', async () => {
    render(
      <FeaturedGamesSection 
        games={mockGames} 
        displayMode="carousel"
        maxVisible={2}
        autoRotate={true}
        rotationInterval={1000}
      />
    );
    
    // Fast-forward time to trigger auto-rotation
    jest.advanceTimersByTime(1000);
    
    // Should still be rendered (rotation should work without errors)
    expect(screen.getByText('Featured Games')).toBeInTheDocument();
  });

  it('pauses auto-rotation on hover', async () => {
    render(
      <FeaturedGamesSection 
        games={mockGames} 
        displayMode="carousel"
        maxVisible={2}
        autoRotate={true}
        rotationInterval={1000}
      />
    );
    
    const container = screen.getByText('Featured Games').closest('.featured-games-section');
    
    // Hover over the container
    if (container) {
      fireEvent.mouseEnter(container);
      
      // Fast-forward time - rotation should be paused
      jest.advanceTimersByTime(2000);
      
      // Mouse leave to resume rotation
      fireEvent.mouseLeave(container);
    }
    
    expect(screen.getByText('Featured Games')).toBeInTheDocument();
  });

  it('calls onGameClick when game is clicked', () => {
    const mockOnGameClick = jest.fn();
    
    render(
      <FeaturedGamesSection 
        games={mockGames.slice(0, 2)} 
        onGameClick={mockOnGameClick}
      />
    );
    
    // Find and click a game card
    const gameCards = screen.getAllByText(/Test Game/);
    fireEvent.click(gameCards[0]);
    
    expect(mockOnGameClick).toHaveBeenCalledWith(mockGames[0]);
  });

  it('shows featured badges on game cards', () => {
    render(<FeaturedGamesSection games={mockGames.slice(0, 2)} />);
    
    const featuredBadges = screen.getAllByText('Featured');
    expect(featuredBadges.length).toBe(2);
  });

  it('shows auto-rotating indicator when enabled', () => {
    render(
      <FeaturedGamesSection 
        games={mockGames} 
        displayMode="carousel"
        autoRotate={true}
        maxVisible={2}
      />
    );
    
    expect(screen.getByText('Auto-rotating')).toBeInTheDocument();
  });

  it('does not show navigation when games fit in maxVisible', () => {
    render(
      <FeaturedGamesSection 
        games={mockGames.slice(0, 2)} 
        displayMode="carousel"
        maxVisible={4}
      />
    );
    
    // Should not show navigation buttons when all games fit
    expect(screen.queryByLabelText('Previous games')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next games')).not.toBeInTheDocument();
  });

  it('renders nothing when no games provided', () => {
    const { container } = render(<FeaturedGamesSection games={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies custom className', () => {
    const { container } = render(
      <FeaturedGamesSection 
        games={mockGames.slice(0, 2)} 
        className="custom-class"
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('limits games to maxVisible in grid mode', () => {
    render(
      <FeaturedGamesSection 
        games={mockGames} 
        displayMode="grid"
        maxVisible={3}
      />
    );
    
    // Should only show 3 games even though 5 are provided
    const gameCards = screen.getAllByText(/Test Game/);
    expect(gameCards.length).toBe(3);
  });
});