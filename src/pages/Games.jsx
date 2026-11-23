import React, { useRef, useState, useEffect } from 'react';
import { gamesData } from '../data/games';
import { fetchPublicThumbnail } from '../api/tmdb';

/**
 * Section D: Games Page (/games).
 * Features:
 * - Active pill on "Games" in Navbar, Navbar solid black.
 * - Top hero: Red Dead Redemption on a dark gradient with 20px radius card,
 *   title, short description, and Play / More Info buttons.
 * - Rows: 28px bold white heading.
 * - Square 1:1 tiles with 20px rounded corners, 12px gap, ~6-7 tiles visible + partial peeking.
 * - Game title shown BELOW each tile in bold white (up to 2 lines).
 * - Horizontal scroll with snap and arrow buttons on hover/focus.
 * - Tiles: public/games/{id}.jpg if exists, otherwise colorful gradient with game's initials in large bold type.
 * - Red "Leaving Soon" tag at the bottom of the tile where tag is set.
 * - Hover/focus scale ~1.05; each tile is a button with aria-label of the game title.
 * - Games do not use the card action bar.
 */
export default function Games() {
  const { heroGame, rows } = gamesData;
  const [playingGame, setPlayingGame] = useState(null);
  const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    let active = true;
    fetchPublicThumbnail({ title: heroGame.title }).then((imageUrl) => {
      if (active) setHeroImage(imageUrl);
    });
    return () => { active = false; };
  }, [heroGame.title]);

  return (
    <main className="netflix-games-page page-fade-in" id="main-content">
      {/* Games Hero Spotlight: Red Dead Redemption */}
      <section className="games-hero-wrapper" aria-label="Featured game spotlight">
        <div className="games-hero-card">
          <div
            className="games-hero-backdrop"
            style={{
              background: heroImage
                ? `linear-gradient(90deg, ${heroGame.color2}dd, ${heroGame.color1}55), url("${heroImage}") center 30% / cover`
                : `radial-gradient(circle at 75% 30%, ${heroGame.color1} 0%, ${heroGame.color2} 60%, #0d0d0d 100%)`,
            }}
          >
            <div className="games-hero-vignette-left" />
            <div className="games-hero-vignette-bottom" />
          </div>

          <div className="games-hero-content">
            <span className="games-hero-badge">NETFLIX GAMES</span>
            <h1 className="games-hero-title">{heroGame.title}</h1>
            <p className="games-hero-description">{heroGame.description}</p>

            <div className="hero-buttons">
              <button
                type="button"
                className="hero-btn hero-btn-play"
                onClick={() => setPlayingGame(heroGame.title)}
                aria-label={`Get Game ${heroGame.title}`}
              >
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Get Game</span>
              </button>

              <button
                type="button"
                className="hero-btn hero-btn-info"
                onClick={() => alert(`${heroGame.title} - Included with your Netflix membership. No ads, extra fees, or in-app purchases.`)}
                aria-label={`More Info about ${heroGame.title}`}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.3">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Game Rows */}
      <div className="games-rows-stack">
        {rows.map((row) => (
          <GameRow key={row.id} row={row} onSelectGame={(title) => setPlayingGame(title)} />
        ))}
      </div>

      {/* Simple Game Launch Feedback Toast */}
      {playingGame && (
        <div className="game-toast-modal" role="dialog" aria-label="Game ready">
          <div className="game-toast-panel">
            <h3>{playingGame}</h3>
            <p>Ready to install or launch on your mobile device via Netflix Games.</p>
            <button
              type="button"
              className="game-toast-close"
              onClick={() => setPlayingGame(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function GameRow({ row, onSelectGame }) {
  const listRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = listRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = listRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const handleScroll = (dir) => {
    const el = listRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="netflix-game-row" aria-labelledby={`game-heading-${row.id}`}>
      <div className="game-row-header">
        <h2 id={`game-heading-${row.id}`} className="game-row-title">
          {row.title}
        </h2>
      </div>

      <div className="game-slider-wrapper">
        <button
          type="button"
          className={`row-nav-btn row-nav-left ${!canScrollLeft ? 'hidden-btn' : ''}`}
          onClick={() => handleScroll('left')}
          aria-label={`Scroll ${row.title} left`}
          tabIndex={canScrollLeft ? 0 : -1}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          ref={listRef}
          className="game-tiles-container"
          role="region"
          aria-label={`${row.title} carousel`}
          tabIndex={0}
        >
          {row.items.map((game) => (
            <GameTile key={game.id} game={game} onSelect={onSelectGame} />
          ))}
        </div>

        <button
          type="button"
          className={`row-nav-btn row-nav-right ${!canScrollRight ? 'hidden-btn' : ''}`}
          onClick={() => handleScroll('right')}
          aria-label={`Scroll ${row.title} right`}
          tabIndex={canScrollRight ? 0 : -1}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

function GameTile({ game, onSelect }) {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    let active = true;
    fetchPublicThumbnail({ title: game.title }).then((url) => {
      if (!active) return;
      setImageUrl(game.image || url);
      if (!game.image && !url) setImageError(true);
    });
    return () => { active = false; };
  }, [game.title, game.image]);

  // Compute initials (e.g. "Red Dead Redemption" -> "RDR")
  const initials = game.title
    .split(' ')
    .filter((w) => !['for', 'the', 'and', 'of', 'in', 'x'].includes(w.toLowerCase()))
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <div className="game-tile-item">
      <button
        type="button"
        className="game-square-tile"
        aria-label={game.title}
        onClick={() => onSelect(game.title)}
        style={{
          background: `linear-gradient(135deg, ${game.color1} 0%, ${game.color2} 100%)`,
        }}
      >
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={game.title}
            className="game-tile-img"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : null}

        {imageError && (
          <div className="game-initials-fallback">
            <span className="game-initials-text">{initials}</span>
          </div>
        )}

        {/* Leaving Soon Tag */}
        {game.tag === 'Leaving Soon' && (
          <div className="game-leaving-tag" aria-label="Leaving Soon">
            <span>Leaving Soon</span>
          </div>
        )}

        {/* Netflix N brand tag */}
        <div className="game-n-logo" aria-hidden="true">
          <svg viewBox="0 0 24 36" width="12" height="18">
            <path fill="#E50914" d="M0 0h5l9.5 24h.5V0h5v36h-5L5.5 12h-.5v24H0z" />
          </svg>
        </div>
      </button>

      {/* Game title BELOW each tile in bold white (up to 2 lines) */}
      <h3 className="game-tile-title">{game.title}</h3>
    </div>
  );
}

