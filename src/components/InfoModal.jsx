import React, { useEffect, useRef, useState } from 'react';
import { fetchTmdbTrailer } from '../api/tmdb';
import { useUserData } from '../context/UserDataContext';

/**
 * Accessible More Info Modal
 * Displays backdrop, overview, genres, trailer embed, action buttons
 */
export default function InfoModal({ titleItem, tmdbData, isOpen, onClose, onPlay }) {
  const modalRef = useRef(null);
  const previouslyFocusedElement = useRef(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const { toggleMyList, isInMyList, toggleLike, isLiked, markTrailerWatched } = useUserData();

  const id = titleItem?.id;
  const inList = isInMyList(id);
  const liked = isLiked(id);

  // Trap focus and close on Escape
  useEffect(() => {
    if (!isOpen) return;
    previouslyFocusedElement.current = document.activeElement;

    // Focus the modal container
    if (modalRef.current) {
      modalRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), iframe'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedElement.current && previouslyFocusedElement.current.focus) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Fetch YouTube trailer
  useEffect(() => {
    let active = true;
    if (isOpen && tmdbData?.tmdbId) {
      setLoadingTrailer(true);
      fetchTmdbTrailer(tmdbData.tmdbId, titleItem?.tmdbType || 'movie')
        .then((key) => {
          if (!active) return;
          setTrailerKey(key);
          if (key && id) {
            markTrailerWatched(id);
          }
        })
        .catch(() => {
          if (active) setTrailerKey(null);
        })
        .finally(() => {
          if (active) setLoadingTrailer(false);
        });
    } else {
      setTrailerKey(null);
    }
    return () => {
      active = false;
    };
  }, [isOpen, tmdbData?.tmdbId, titleItem?.tmdbType, id]);

  if (!isOpen || !titleItem) return null;

  const backdrop = tmdbData?.heroBackdropUrl || tmdbData?.backdropUrl || titleItem.image;
  const overview = tmdbData?.overview || titleItem.synopsis || 'No description available for this title.';

  return (
    <div
      className="modal-backdrop-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="netflix-info-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close details"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Backdrop Banner */}
        <div
          className="modal-hero-banner"
          style={{
            backgroundImage: backdrop ? `url(${backdrop})` : titleItem.gradient || 'linear-gradient(135deg, #222, #111)',
          }}
        >
          <div className="modal-hero-vignette" />
          <div className="modal-hero-content">
            <h2 id="modal-title" className="modal-title-text">
              {titleItem.title}
            </h2>

            {/* Action Bar */}
            <div className="modal-action-bar">
              <button
                type="button"
                className="modal-play-btn"
                onClick={() => {
                  onClose();
                  onPlay?.(titleItem);
                }}
                aria-label={`Play ${titleItem.title}`}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Play</span>
              </button>

              <button
                type="button"
                className="modal-circle-btn"
                onClick={() => toggleMyList(id)}
                aria-label={inList ? 'Remove from My List' : 'Add to My List'}
                aria-pressed={inList}
              >
                {inList ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                className="modal-circle-btn"
                onClick={() => toggleLike(id)}
                aria-label={liked ? 'Unlike' : 'Like'}
                aria-pressed={liked}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill={liked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body-container">
          <div className="modal-meta-row">
            <span className="modal-rating-badge">{titleItem.rating || 'U/A 16+'}</span>
            {titleItem.year && <span className="modal-meta-item">{titleItem.year}</span>}
            <span className="modal-meta-item">{titleItem.runtime || titleItem.duration || '2h'}</span>
            <span className="modal-hd-badge">HD</span>
            {titleItem.language && (
              <span className="modal-lang-badge">Original: {titleItem.language}</span>
            )}
          </div>

          <p className="modal-overview-text">{overview}</p>

          {titleItem.genres && titleItem.genres.length > 0 && (
            <div className="modal-genres-row">
              <span className="modal-field-label">Genres:</span>
              <span className="modal-field-val">{titleItem.genres.join(', ')}</span>
            </div>
          )}

          {titleItem.dubbing && titleItem.dubbing.length > 0 && (
            <div className="modal-genres-row">
              <span className="modal-field-label">Audio:</span>
              <span className="modal-field-val">{titleItem.dubbing.join(', ')}</span>
            </div>
          )}

          {titleItem.subtitles && titleItem.subtitles.length > 0 && (
            <div className="modal-genres-row">
              <span className="modal-field-label">Subtitles:</span>
              <span className="modal-field-val">{titleItem.subtitles.join(', ')}</span>
            </div>
          )}

          {/* Trailer Section */}
          <div className="modal-trailer-section">
            <h3 className="modal-section-title">Trailer</h3>
            {loadingTrailer ? (
              <div className="trailer-skeleton" aria-label="Loading trailer...">
                <div className="skeleton-shimmer" />
              </div>
            ) : trailerKey ? (
              <div className="trailer-video-wrapper">
                <iframe
                  title={`${titleItem.title} Official Trailer`}
                  src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=0&rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="trailer-fallback-text">
                No official video trailer available for this title.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

