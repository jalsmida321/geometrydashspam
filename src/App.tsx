import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import PopularGames from './pages/PopularGames';
import Trending from './pages/Trending';
import SpaceWaves from './pages/SpaceWaves';
import GeometryDashUnblocked from './pages/GeometryDashUnblocked';
import UnblockedGames from './pages/UnblockedGames';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game/:gameName" element={<GamePage />} />
            <Route path="/popular" element={<PopularGames />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/space-waves" element={<SpaceWaves />} />
            <Route path="/games/geometry-dash-unblocked" element={<GeometryDashUnblocked />} />
            <Route path="/unblocked-games" element={<UnblockedGames />} />
            // 确保没有重复的路由配置
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;