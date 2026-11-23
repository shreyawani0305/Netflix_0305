import React, { useState, useEffect } from 'react';
import { fetchTmdbDetails } from '../api/tmdb';
import { useUserData } from '../context/UserDataContext';
import InfoModal from './InfoModal';
import MockPlayer from './MockPlayer';

/**
 * Enhanced Reusable Card component for Netflix title rows & grids.
 * Features:
 * - 16:9 landscape aspect ratio with 12px rounded corners
 * - TMDB backdrop with poster fallback & shimmer loading skeleton
 * - Graceful fallback to text-art gradient when offline/no image
 * - Top-left badges: TOP 10, NEW SEASON, RECENTLY ADDED
 * - Optional bottomTag ("New Season", "Recently added", etc.)
 * - Optional bottom live badge (e.g. "Live | 26/11")
 * - Optional progress bar for Continue Watching
 * - Desktop hover action bar: Play, Add to My List, Thumbs up, More Info
 * - Touch screens: tapping card opens More Info modal
 * - Integrated More Info modal & fullscreen MockPlayer
 */
export default function Card({ titleItem, index, showProgress = false, imageOverride }) {
  const [tmdbData, setTmdbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const { toggleMyList, isInMyList, toggleLike, isLiked, getProgress } = useUserData();

  if (!titleItem) return null;

  const {
    id,
    title,
    gradient,
    badge,
    top10Rank,
    bottomTag,
    tag,
    live,
    rating = 'U/A 16+',
    runtime,
    duration,
    genres = [],
  } = titleItem;

  const inList = isInMyList(id);
  const liked = isLiked(id);
  const progressPercent = getProgress(id);

  // Fetch TMDB backdrop/poster
  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchTmdbDetails({
      title,
      searchQuery: titleItem.searchQuery,
      tmdbType: titleItem.tmdbType || 'movie',
      year: titleItem.year,
    })
      .then((data) => {
        if (!active) return;
        setTmdbData(data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [title, titleItem.searchQuery, titleItem.tmdbType, titleItem.year]);

  // Image resolution priority: TMDB backdrop -> TMDB poster -> titleItem.image -> gradient fallback
  const resolvedImage = !imageError
    ? imageOverride || tmdbData?.backdropUrl || tmdbData?.posterUrl || titleItem.image
    : null;

  const effectiveTag = bottomTag || tag;
  const timeDisplay = runtime || duration || (genres.length > 0 ? genres[0] : '2h');

  // Handle touch tap on card (open modal on touch devices)
  const handleCardClick = (e) => {
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) {
      e.preventDefault();
      setIsInfoModalOpen(true);
    }
  };

  return (
    <>
      <article
        className="netflix-card"
        tabIndex={0}
        role="button"
        aria-label={`${title}, rated ${rating}, ${timeDisplay}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={handleCardClick}
        id={`card-${id}`}
      >
        <div
          className="netflix-card-inner"
          style={{ background: gradient || 'linear-gradient(135deg, #2b1f48, #070410)' }}
        >
          {/* Shimmer Skeleton while TMDB is loading */}
          {loading && !resolvedImage && (
            <div className="card-skeleton" aria-hidden="true">
              <div className="skeleton-shimmer" />
            </div>
          )}

          {/* Real TMDB Image or Poster */}
          {resolvedImage ? (
            <img
              src={resolvedImage}
              alt={`Poster for ${title}`}
              className="netflix-card-poster"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            /* Text-Art Cinematic Title Display */
            <div className="netflix-card-textart">
              <div className="card-backdrop-overlay" />
              <span className="card-studio-brand">NETFLIX</span>
              <h3 className="card-title-text">{title}</h3>
            </div>
          )}

          {/* Top-Left Badges */}
          {(badge === 'top10' || titleItem.top10) && (
            <div
              className="badge-top10"
              aria-label={`Top 10 Title${top10Rank ? ` Rank ${top10Rank}` : ''}`}
            >
              <span className="badge-top-text">TOP</span>
              <span className="badge-10-text">{top10Rank ? top10Rank : '10'}</span>
            </div>
          )}

          {badge === 'newSeason' && (
            <div className="badge-pill badge-new-season">
              <span>NEW SEASON</span>
            </div>
          )}

          {badge === 'recentlyAdded' && (
            <div className="badge-pill badge-recently-added">
              <span>RECENTLY ADDED</span>
            </div>
          )}

          {/* Bottom Small Tag (e.g. "New Season", "Recently added") */}
          {effectiveTag && (
            <div className="card-bottom-tag" aria-label={`Tag: ${effectiveTag}`}>
              <span>{effectiveTag}</span>
            </div>
          )}

          {/* Bottom Live badge with date chip */}
          {live && (
            <div className="card-live-badge" aria-label={`Live on ${live}`}>
              <span className="live-red-tag">Live</span>
              <span className="live-date-chip">{live}</span>
            </div>
          )}

          {/* Netflix N watermark */}
          <div className="card-n-watermark" aria-hidden="true">
            <svg viewBox="0 0 24 36" width="14" height="20">
              <path fill="#E50914" d="M0 0h5l9.5 24h.5V0h5v36h-5L5.5 12h-.5v24H0z" />
            </svg>
          </div>

          {/* Hover / Focus Details Overlay (Action Bar) */}
          <div className="card-hover-overlay" aria-hidden={!isFocused}>
            <div className="overlay-actions">
              {/* Play Button */}
              <button
                type="button"
                className="action-btn play-circle-btn"
                aria-label={`Play ${title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlayerOpen(true);
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>

              {/* My List Toggle Button */}
              <button
                type="button"
                className="action-btn secondary-circle-btn"
                aria-label={inList ? `Remove ${title} from My List` : `Add ${title} to My List`}
                aria-pressed={inList}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMyList(id);
                }}
              >
                {inList ? (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                )}
              </button>

              {/* Thumbs Up Like Button */}
              <button
                type="button"
                className="action-btn secondary-circle-btn"
                aria-label={liked ? `Unlike ${title}` : `Like ${title}`}
                aria-pressed={liked}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(id);
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                  fill={liked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              </button>

              {/* More Info Button */}
              <button
                type="button"
                className="action-btn secondary-circle-btn more-info-action-btn"
                aria-label={`More info about ${title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsInfoModalOpen(true);
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>

            <div className="overlay-meta">
              <span className="overlay-match">97% Match</span>
              <span className="overlay-rating">{rating}</span>
              <span className="overlay-duration">{timeDisplay}</span>
            </div>

            {genres && genres.length > 0 && (
              <div className="overlay-genres">
                {genres.slice(0, 3).map((genre, i) => (
                  <span key={genre} className="genre-item">
                    {genre}
                    {i < Math.min(genres.length, 3) - 1 && <span className="genre-dot">•</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Continue Watching Thin 4px Progress Bar */}
        {showProgress && progressPercent > 0 && progressPercent < 95 && (
          <div
            className="card-progress-bar-container"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`${title} playback progress: ${progressPercent}%`}
          >
            <div className="card-progress-filled" style={{ width: `${progressPercent}%` }} />
          </div>
        )}
      </article>

      {/* More Info Modal */}
      <InfoModal
        titleItem={titleItem}
        tmdbData={tmdbData}
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        onPlay={() => setIsPlayerOpen(true)}
      />

      {/* Mock Fullscreen Player */}
      <MockPlayer
        titleItem={titleItem}
        tmdbData={tmdbData}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
      />
    </>
  );
}
