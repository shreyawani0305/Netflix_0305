import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BrowseLanguages from './pages/BrowseLanguages';
import BrowseCategory from './pages/BrowseCategory';
import Games from './pages/Games';
import MyNetflix from './pages/MyNetflix';
import NewPopular from './pages/NewPopular';
import Mood from './pages/Mood';
import SurpriseMe from './pages/SurpriseMe';
import DevAdminPanel from './components/DevAdminPanel';
import { UserDataProvider } from './context/UserDataContext';

/**
 * Root Application component.
 * Sets up client-side routing with React Router,
 * persistent fixed Navbar, dynamic main view, global Footer,
 * and unified UserDataProvider context.
 */
export default function App() {
  return (
    <UserDataProvider>
      <BrowserRouter>
        <div className="netflix-app-root">
          {/* Accessible Skip Link */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          {/* Global Fixed Navbar */}
          <Navbar />

          {/* Dynamic Route Pages */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse/movies" element={<BrowseCategory type="movie" />} />
            <Route path="/browse/shows" element={<BrowseCategory type="tv" />} />
            <Route path="/browse/original-audio" element={<BrowseLanguages />} />
            <Route path="/games" element={<Games />} />
            <Route path="/browse/my-list" element={<MyNetflix />} />
            <Route path="/latest" element={<NewPopular />} />
            <Route path="/mood" element={<Mood />} />
            <Route path="/surprise-me" element={<SurpriseMe />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global Footer */}
          <Footer />
          {import.meta.env.DEV && <DevAdminPanel />}
        </div>
      </BrowserRouter>
    </UserDataProvider>
  );
}
