import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import FavoritesPage from './pages/FavoritesPage';
import PopularGames from './pages/PopularGames';
import Trending from './pages/Trending';
import SpaceWaves from './pages/SpaceWaves';
import GeometryDashUnblocked from './pages/GeometryDashUnblocked.fixed';
import UnblockedGames from './pages/UnblockedGames';
import CategoryPage from './pages/CategoryPage';
import AllGamesPage from './pages/AllGamesPage';
import SearchResultsPage from './pages/SearchResultsPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/ErrorBoundary';
import RouteGuard from './components/RouteGuard';
import { GameProvider } from './context/GameContext';
import { SEOProvider } from './components/SEO';
import RouteMetadataProvider from './components/RouteMetadataProvider';

/**
 * CategoryRedirect component to handle legacy category routes
 */
const CategoryRedirect: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  return <Navigate to={`/games/category/${categorySlug}`} replace />;
};

function App() {
  return (
    <SEOProvider>
      <GameProvider>
        <Router>
          <ErrorBoundary>
            <RouteMetadataProvider>
              <div className="flex flex-col min-h-screen bg-gray-100">
                <Header />
                <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
                  <Routes>
                    {/* Primary Routes */}
                    <Route path="/" element={<HomePage />} />

                    {/* Game Routes with Route Guards */}
                    <Route path="/games" element={<AllGamesPage />} />
                    <Route
                      path="/games/category/:categorySlug"
                      element={
                        <RouteGuard type="category">
                          <CategoryPage />
                        </RouteGuard>
                      }
                    />
                    <Route
                      path="/game/:gameName"
                      element={
                        <RouteGuard type="game">
                          <GamePage />
                        </RouteGuard>
                      }
                    />

                    {/* Search Routes */}
                    <Route path="/search" element={<SearchResultsPage />} />

                    {/* User Routes */}
                    <Route path="/favorites" element={<FavoritesPage />} />

                    {/* Legacy Routes - Maintain backward compatibility */}
                    <Route path="/popular" element={<PopularGames />} />
                    <Route path="/trending" element={<Trending />} />
                    <Route path="/space-waves" element={<SpaceWaves />} />
                    <Route path="/geometry-dash" element={<GeometryDashUnblocked />} />
                    <Route path="/unblocked-games" element={<UnblockedGames />} />

                    {/* Route Redirects for SEO compatibility */}
                    <Route
                      path="/category/:categorySlug"
                      element={<CategoryRedirect />}
                    />
                    <Route path="/all-games" element={<Navigate to="/games" replace />} />

                    {/* Explicit 404 route */}
                    <Route path="/404" element={<NotFoundPage />} />

                    {/* Catch-all 404 Route */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </RouteMetadataProvider>
          </ErrorBoundary>
        </Router>
      </GameProvider>
    </SEOProvider>
  );
}

export default App;