import React, { useState, useEffect } from 'react';
import { fetchTmdbDetails } from '../api/tmdb';
import InfoModal from './InfoModal';
import MockPlayer from './MockPlayer';

/**
 * Hero Spotlight component featuring "Maharaja" with real TMDB backdrop,
 * Play and More Info buttons wired to the player and modal, and meta line from data.
 */
export default function Hero({ titleItem }) {
  const [isMuted, setIsMuted] = useState(true);
  const [tmdbData, setTmdbData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const hero = titleItem || {
    id: 'maharaja',
    title: 'Maharaja',
    category: 'Movie',
    genres: ['Crime', 'Thriller'],
    language: 'Tamil',
    year: 2024,
    tmdbType: 'movie',
    rating: 'A',
    runtime: '2h 21m',
    badge: 'top10',
    dubbing: ['Tamil', 'Telugu', 'Hindi', 'Malayalam', 'Kannada'],
    gradient: 'radial-gradient(ellipse at 80% 20%, rgba(229, 9, 20, 0.45) 0%, rgba(20, 10, 15, 0.95) 50%, #0d0d0d 100%)',
    synopsis: 'A quiet barber seeks vengeance after a burglary takes place in his home, cryptically telling the police that his "Lakshmi" has been taken.',
  };

  useEffect(() => {
    let active = true;
    fetchTmdbDetails({
      title: hero.title,
      searchQuery: hero.searchQuery,
      tmdbType: hero.tmdbType || 'movie',
      year: hero.year,
    }).then((data) => {
      if (active) setTmdbData(data);
    });
    return () => {
      active = false;
    };
  }, [hero.title, hero.searchQuery, hero.tmdbType, hero.year]);

  const fallbackBackdrop = '/images/home-hero-fallback.jpg';
  const backdrop = tmdbData?.heroBackdropUrl || tmdbData?.backdropUrl;
  const synopsis = tmdbData?.overview || hero.synopsis || 'A gripping saga of vengeance, mystery, and relentless justice.';

  return (
    <>
      <section className="netflix-hero-wrapper" aria-label="Featured spotlight">
        <div className="netflix-hero-card">
          {/* Keep a local image behind the title image so the spotlight never appears blank. */}
          <div
            className="hero-backdrop-image"
            style={{ backgroundImage: backdrop
              ? `url("${backdrop}"), url("${fallbackBackdrop}")`
              : `url("${fallbackBackdrop}")` }}
            aria-hidden="true"
          >
            <div className="hero-atmosphere-light" />
            <div className="hero-dramatic-flares" />
            <div className="hero-left-vignette" />
            <div className="hero-bottom-vignette" />
          </div>

          {/* Top-Right: Circular Translucent Mute/Unmute Button */}
          <div className="hero-top-controls">
            <button
              type="button"
              className="hero-mute-btn"
              onClick={() => setIsMuted((p) => !p)}
              aria-label={isMuted ? 'Unmute preview audio' : 'Mute preview audio'}
            >
              {isMuted ? (
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          </div>

          {/* Hero Main Content */}
          <div className="hero-content-container">
            {/* Bottom-Left: Title Art, Meta Line, Buttons */}
            <div className="hero-bottom-left">
              <div className="hero-title-art">
                <span className="hero-title-prefix">NETFLIX FILM</span>
                <h1 className="hero-title-main">{hero.title}</h1>
              </div>

              {/* Meta Line from data */}
              <p className="hero-meta-line">
                <span className="meta-item">{hero.category || 'Film'}</span>
                <span className="meta-dot">•</span>
                <span className="meta-item">{hero.genres?.[0] || 'Crime'}</span>
                <span className="meta-dot">•</span>
                <span className="meta-item">{hero.year || '2024'}</span>
                <span className="meta-dot">•</span>
                <span className="meta-item">{hero.runtime || hero.duration || '2h 21m'}</span>
                <span className="meta-dot">•</span>
                <span className="meta-badge-a">{hero.rating || 'A'}</span>
              </p>

              <p className="hero-synopsis">{synopsis}</p>

              {/* Action Buttons wired to Player and Modal */}
              <div className="hero-buttons">
                <button
                  type="button"
                  className="hero-btn hero-btn-play"
                  onClick={() => setIsPlayerOpen(true)}
                  aria-label={`Play ${hero.title}`}
                >
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Play</span>
                </button>

                <button
                  type="button"
                  className="hero-btn hero-btn-info"
                  onClick={() => setIsModalOpen(true)}
                  aria-label={`More Info about ${hero.title}`}
                >
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>More Info</span>
                </button>
              </div>
            </div>

            {/* Bottom-Right: Info Chips */}
            <div className="hero-bottom-right">
              {hero.dubbing && hero.dubbing.length > 0 && (
                <div className="hero-chip audio-languages-chip" title="Audio languages">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 6L8 9H4v6h4l4 3V6z" />
                    <path d="M16 8a5 5 0 0 1 0 8" />
                    <path d="M19 5a9 9 0 0 1 0 14" />
                  </svg>
                  <span>In {hero.dubbing.slice(0, 5).join(', ')}</span>
                </div>
              )}

              <div className="hero-chip ranking-chip" title="Trending Rank">
                <div className="chip-top10-icon" aria-hidden="true">
                  <span className="chip-top-text">TOP</span>
                  <span className="chip-10-text">10</span>
                </div>
                <span className="ranking-text">#1 in Movies Today</span>
              </div>

              <div className="hero-age-badge" aria-label={`Rated ${hero.rating || 'A'}`}>
                <span>{hero.rating || 'A'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero More Info Modal */}
      <InfoModal
        titleItem={hero}
        tmdbData={tmdbData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPlay={() => setIsPlayerOpen(true)}
      />

      {/* Hero Mock Player */}
      <MockPlayer
        titleItem={hero}
        tmdbData={tmdbData}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
      />
    </>
  );
}
