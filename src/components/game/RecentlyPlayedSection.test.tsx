import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecentlyPlayedSection, { EmptyRecentlyPlayedSection } from './RecentlyPlayedSection';
import { Game } from '../../types/game';

// Mock data
const mockGames: Game[] = [
  {
    id: 'game-1',
    name: 'Test Game 1',
    description: 'A test game',
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
    tags: ['test', 'action'],
    featured: false,
    popularity: 80,
    dateAdded: new Date('2024-01-01')
  },
  {
    id: 'game-2',
    name: 'Test Game 2',
    description: 'Another test game',
    image: 'https://example.com/image2.jpg',
    url: 'https://example.com/game2',
    category: {
      id: 'puzzle',
      name: 'Puzzle',
      slug: 'puzzle',
      description: 'Puzzle games',
      icon: 'Puzzle',
      color: 'green'
    },
    tags: ['test', 'puzzle'],
    featured: true,
    popularity: 90,
    dateAdded: new Date('2024-01-02')
  }
];

describe('RecentlyPlayedSection', () => {
  it('renders recently played games correctly', () => {
    render(
      <RecentlyPlayedSection
        games={mockGames}
        title="Recently Played"
        maxVisible={4}
      />
    );

    expect(screen.getByText('Recently Played')).toBeInTheDocument();
    expect(screen.getByText('Continue where you left off')).toBeInTheDocument();
    expect(screen.getByText('Test Game 1')).toBeInTheDocument();
    expect(screen.getByText('Test Game 2')).toBeInTheDocument();
  });

  it('shows correct game count', () => {
    render(
      <RecentlyPlayedSection
        games={mockGames}
        maxVisible={4}
      />
    );

    expect(screen.getByText('2 games played recently')).toBeInTheDocument();
  });

  it('limits visible games based on maxVisible prop', () => {
    const manyGames = Array.from({ length: 10 }, (_, i) => ({
      ...mockGames[0],
      id: `game-${i}`,
      name: `Test Game ${i}`
    }));

    render(
      <RecentlyPlayedSection
        games={manyGames}
        maxVisible={3}
      />
    );

    expect(screen.getByText('Showing 3 of 10')).toBeInTheDocument();
  });

  it('calls onGameClick when a game is clicked', () => {
    const mockOnGameClick = jest.fn();
    
    render(
      <RecentlyPlayedSection
        games={mockGames}
        onGameClick={mockOnGameClick}
      />
    );

    // Click on the first game card container
    const gameCards = screen.getAllByText('Test Game 1');
    fireEvent.click(gameCards[0].closest('div')!);

    expect(mockOnGameClick).toHaveBeenCalledWith(mockGames[0]);
  });

  it('calls onClearHistory when clear button is clicked', () => {
    const mockOnClearHistory = jest.fn();
    
    render(
      <RecentlyPlayedSection
        games={mockGames}
        onClearHistory={mockOnClearHistory}
        showClearButton={true}
      />
    );

    const clearButton = screen.getByText('Clear History');
    fireEvent.click(clearButton);

    expect(mockOnClearHistory).toHaveBeenCalled();
  });

  it('hides clear button when showClearButton is false', () => {
    render(
      <RecentlyPlayedSection
        games={mockGames}
        showClearButton={false}
      />
    );

    expect(screen.queryByText('Clear History')).not.toBeInTheDocument();
  });

  it('does not render when games array is empty', () => {
    const { container } = render(
      <RecentlyPlayedSection
        games={[]}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows play order badges for first 3 games', () => {
    render(
      <RecentlyPlayedSection
        games={mockGames}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows "Recent" badge on all games', () => {
    render(
      <RecentlyPlayedSection
        games={mockGames}
      />
    );

    const recentBadges = screen.getAllByText('Recent');
    expect(recentBadges).toHaveLength(2);
  });
});

describe('EmptyRecentlyPlayedSection', () => {
  it('renders empty state correctly', () => {
    render(<EmptyRecentlyPlayedSection />);

    expect(screen.getByText('No Recently Played Games')).toBeInTheDocument();
    expect(screen.getByText(/Start playing some games and they'll appear here/)).toBeInTheDocument();
  });

  it('calls onBrowseGames when browse button is clicked', () => {
    const mockOnBrowseGames = jest.fn();
    
    render(<EmptyRecentlyPlayedSection onBrowseGames={mockOnBrowseGames} />);

    const browseButton = screen.getByText('Browse Games');
    fireEvent.click(browseButton);

    expect(mockOnBrowseGames).toHaveBeenCalled();
  });

  it('does not show browse button when onBrowseGames is not provided', () => {
    render(<EmptyRecentlyPlayedSection />);

    expect(screen.queryByText('Browse Games')).not.toBeInTheDocument();
  });

  it('shows feature indicators', () => {
    render(<EmptyRecentlyPlayedSection />);

    expect(screen.getByText('Auto-tracked')).toBeInTheDocument();
    expect(screen.getByText('Private to you')).toBeInTheDocument();
    expect(screen.getByText('Quick access')).toBeInTheDocument();
  });
});