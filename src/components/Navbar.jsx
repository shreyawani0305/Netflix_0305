import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';

/**
 * Navbar component fixed at 90px tall.
 * Features:
 * - Red Bebas Neue "NETFLIX" wordmark
 * - Pill-style navigation tabs (Home, Shows, Movies, Games, New & Popular, My Netflix, Browse by Languages)
 * - Active pill with #4a4a4a fill and bold white text
 * - Transparent with dark top-down gradient over hero, transition to solid black after 20px scroll
 * - Right actions: Search icon, Bell icon, "Children" profile chip, and main yellow smiley avatar with caret
 * - Profile dropdown toggleable via click or hover on desktop, with flipped caret
 * - Mobile responsive drawer/collapse for small screens
 */
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();
  const profileAnchorRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Monitor scroll for solid background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle desktop hover on avatar
  const handleAvatarMouseEnter = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setIsProfileOpen(true);
    }
  };

  const handleAvatarMouseLeave = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsProfileOpen(false);
      }, 300);
    }
  };

  // Toggle profile on click
  const handleAvatarClick = () => {
    setIsProfileOpen((prev) => !prev);
  };

  // Active tab helper
  const isTabActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path;
  };

  // Navbar is solid black after scrolling > 20px, and always solid black on non-home pages
  const isSolid = isScrolled || location.pathname !== '/';

  return (
    <header className={`netflix-navbar ${isSolid ? 'nav-scrolled' : 'nav-transparent'}`}>
      <div className="nav-container">
        {/* Left Side: Brand Wordmark + Navigation Tabs */}
        <div className="nav-left">
          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          {/* Red Bebas Neue Wordmark */}
          <Link to="/" className="nav-brand-wordmark" aria-label="Netflix Home">
            NETFLIX
          </Link>

          {/* Desktop Navigation Tabs */}
          <nav className="nav-tabs" aria-label="Main Navigation">
            <Link
              to="/"
              className={`nav-tab-pill ${isTabActive('/') ? 'tab-active' : ''}`}
              aria-current={isTabActive('/') ? 'page' : undefined}
            >
              Home
            </Link>
            <Link
              to="/browse/shows"
              className={`nav-tab-pill ${isTabActive('/browse/shows') ? 'tab-active' : ''}`}
              aria-current={isTabActive('/browse/shows') ? 'page' : undefined}
            >
              Shows
            </Link>
            <Link
              to="/browse/movies"
              className={`nav-tab-pill ${isTabActive('/browse/movies') ? 'tab-active' : ''}`}
              aria-current={isTabActive('/browse/movies') ? 'page' : undefined}
            >
              Movies
            </Link>
            <Link
              to="/games"
              className={`nav-tab-pill ${isTabActive('/games') ? 'tab-active' : ''}`}
              aria-current={isTabActive('/games') ? 'page' : undefined}
            >
              Games
            </Link>
            <Link
              to="/latest"
              className={`nav-tab-pill ${isTabActive('/latest') ? 'tab-active' : ''}`}
              aria-current={isTabActive('/latest') ? 'page' : undefined}
            >
              New &amp; Popular
            </Link>
            <Link
              to="/mood"
              className={`nav-tab-pill ${isTabActive('/mood') ? 'tab-active' : ''}`}
              aria-current={isTabActive('/mood') ? 'page' : undefined}
            >
              Mood DJ
            </Link>
            <Link
              to="/surprise-me"
              className={`nav-tab-pill ${isTabActive('/surprise-me') ? 'tab-active' : ''}`}
              aria-current={isTabActive('/surprise-me') ? 'page' : undefined}
            >
              Surprise Me
            </Link>
            <Link
              to="/browse/my-list"
              className={`nav-tab-pill ${isTabActive('/browse/my-list') ? 'tab-active' : ''}`}
              aria-current={isTabActive('/browse/my-list') ? 'page' : undefined}
            >
              My Netflix
            </Link>
            <Link
              to="/browse/original-audio"
              className={`nav-tab-pill ${isTabActive('/browse/original-audio') ? 'tab-active' : ''}`}
              aria-current={isTabActive('/browse/original-audio') ? 'page' : undefined}
            >
              Browse by Languages
            </Link>
          </nav>
        </div>

        {/* Right Side: Search, Bell, Children Chip, Profile Avatar */}
        <div className="nav-right">
          {/* Search Icon / Expandable Search Bar */}
          <div className={`nav-search-container ${isSearchOpen ? 'search-open' : ''}`}>
            <button
              type="button"
              className="nav-icon-btn search-toggle-btn"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              aria-label="Search titles, people, genres"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            {isSearchOpen && (
              <input
                type="text"
                className="nav-search-input"
                placeholder="Titles, people, genres"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                aria-label="Search titles, people, genres"
              />
            )}
          </div>

          {/* Notifications Bell Icon */}
          <button
            type="button"
            className="nav-icon-btn nav-bell-btn"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="bell-badge-dot" aria-hidden="true" />
          </button>

          {/* "Children" Profile Chip with rainbow icon */}
          <button
            type="button"
            className="nav-children-chip"
            aria-label="Switch to Children profile"
          >
            <div className="kids-chip-icon" aria-hidden="true">
              <span className="kids-rainbow-text">KIDS</span>
            </div>
            <span className="kids-chip-label">Children</span>
          </button>

          {/* Main Profile Avatar & Caret with hover & click handlers */}
          <div
            className="profile-trigger-wrapper"
            onMouseEnter={handleAvatarMouseEnter}
            onMouseLeave={handleAvatarMouseLeave}
          >
            <button
              ref={profileAnchorRef}
              type="button"
              className="profile-trigger-btn"
              onClick={handleAvatarClick}
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
              aria-label="User Profile and Account Menu"
            >
              {/* Main Yellow Smiley Avatar */}
              <div className="main-avatar-yellow" aria-hidden="true">
                <svg viewBox="0 0 32 32" width="22" height="22" fill="#141414">
                  <circle cx="10" cy="11" r="2.5" />
                  <circle cx="22" cy="11" r="2.5" />
                  <path d="M9 19c2.5 4 11.5 4 14 0" stroke="#141414" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              {/* Caret that flips 180deg when open */}
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="currentColor"
                className={`nav-caret-icon ${isProfileOpen ? 'caret-flipped' : ''}`}
                aria-hidden="true"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>

            {/* Profile Dropdown Panel */}
            <ProfileMenu
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              anchorRef={profileAnchorRef}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-label="Mobile Navigation">
          <div className="mobile-nav-links">
            <Link
              to="/"
              className={`mobile-tab-item ${isTabActive('/') ? 'tab-active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/browse/shows"
              className={`mobile-tab-item ${isTabActive('/browse/shows') ? 'tab-active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shows
            </Link>
            <Link
              to="/browse/movies"
              className={`mobile-tab-item ${isTabActive('/browse/movies') ? 'tab-active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Movies
            </Link>
            <Link
              to="/games"
              className={`mobile-tab-item ${isTabActive('/games') ? 'tab-active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Games
            </Link>
            <Link
              to="/latest"
              className={`mobile-tab-item ${isTabActive('/latest') ? 'tab-active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              New &amp; Popular
            </Link>
            <Link
              to="/mood"
              className={`mobile-tab-item ${isTabActive('/mood') ? 'tab-active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mood DJ
            </Link>
            <Link
              to="/surprise-me"
              className={`mobile-tab-item ${isTabActive('/surprise-me') ? 'tab-active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Surprise Me
            </Link>
            <Link
              to="/browse/my-list"
              className={`mobile-tab-item ${isTabActive('/browse/my-list') ? 'tab-active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Netflix
            </Link>
            <Link
              to="/browse/original-audio"
              className={`mobile-tab-item ${isTabActive('/browse/original-audio') ? 'tab-active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse by Languages
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
