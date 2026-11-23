import React, { useEffect, useState, useRef } from 'react';
import { useUserData } from '../context/UserDataContext';

/**
 * Fullscreen mock video player.
 * - Shows title backdrop
 * - Play/Pause button
 * - Seek slider (0 to 100)
 * - Close button
 * - Progress increases 1% per second while playing
 * - Keyboard accessible (Space = play/pause, Esc = close)
 * - Calls setProgress(id, position) on Close
 */
export default function MockPlayer({ titleItem, tmdbData, isOpen, onClose }) {
  const { getProgress, setProgress } = useUserData();
  const [isPlaying, setIsPlaying] = useState(true);
  const [position, setPosition] = useState(0);
  const closeBtnRef = useRef(null);

  const id = titleItem?.id;

  // Initialize position from saved user progress
  useEffect(() => {
    if (isOpen && id) {
      const saved = getProgress(id);
      setPosition(saved >= 95 ? 0 : saved);
      setIsPlaying(true);
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    }
  }, [isOpen, id]);

  // Timer: while playing, increase position 1% per second
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.code === 'Space') {
        // Prevent default spacebar scroll
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, position, id]);

  const handleClose = () => {
    if (id) {
      setProgress(id, position);
    }
    onClose();
  };

  if (!isOpen || !titleItem) return null;

  const backdrop = tmdbData?.heroBackdropUrl || tmdbData?.backdropUrl || titleItem.image;

  return (
    <div
      className="mock-player-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Playing ${titleItem.title}`}
    >
      {/* Background Poster / Backdrop */}
      <div
        className="player-backdrop"
        style={{
          backgroundImage: backdrop ? `url(${backdrop})` : titleItem.gradient || 'linear-gradient(135deg, #111, #000)',
        }}
      />

      <div className="player-gradient-mask" />

      {/* Top Header Controls */}
      <div className="player-header">
        <button
          ref={closeBtnRef}
          type="button"
          className="player-back-btn"
          onClick={handleClose}
          aria-label="Back to browse"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <h2 className="player-title-display">{titleItem.title}</h2>
      </div>

      {/* Center Big Play/Pause indicator */}
      <div className="player-center-stage">
        <button
          type="button"
          className="player-large-toggle-btn"
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Bottom Control Bar */}
      <div className="player-controls-bottom">
        <div className="player-slider-row">
          <label htmlFor="player-seek-slider" className="sr-only">
            Playback position
          </label>
          <input
            id="player-seek-slider"
            type="range"
            min="0"
            max="100"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="player-seek-slider"
            style={{
              background: `linear-gradient(to right, #e50914 ${position}%, rgba(255,255,255,0.3) ${position}%)`,
            }}
          />
        </div>

        <div className="player-actions-row">
          <div className="player-left-actions">
            <button
              type="button"
              className="player-ctrl-btn"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <span className="player-time-readout">
              {Math.floor(position)}% / 100%
            </span>
          </div>

          <div className="player-right-actions">
            <button
              type="button"
              className="player-exit-btn"
              onClick={handleClose}
              aria-label="Close and save progress"
            >
              Exit Player
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

