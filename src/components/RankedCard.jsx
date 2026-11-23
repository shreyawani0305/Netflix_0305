import React, { useState, useEffect } from 'react';
import { fetchTmdbDetails } from '../api/tmdb';
import InfoModal from './InfoModal';

/**
 * Ranked Top 10 Card (Section F).
 * - Very large outlined rank number on left (~220px tall, Bebas Neue/Anton, black fill, 4px #595959 outline)
 * - Portrait 2:3 poster (TMDB poster_path) on the right that slightly overlaps the number
 * - 8px rounded corners on poster
 * - Small red tag at the bottom ("Recently added", "New Episode", "New Episodes")
 * - Where watchNow is true, small white chip "Watch Now" directly under red tag
 * - aria-label: "Number {rank}: {title}"
 * - Clicking opens More Info modal
 */
export default function RankedCard({ item }) {
  const [tmdbData, setTmdbData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { rank, title, tag, watchNow } = item;

  useEffect(() => {
    let active = true;
    fetchTmdbDetails({
      title,
      searchQuery: item.searchQuery,
      tmdbType: item.tmdbType || 'tv',
    }).then((data) => {
      if (active) setTmdbData(data);
    });
    return () => {
      active = false;
    };
  }, [title, item.searchQuery, item.tmdbType]);

  const poster = !imageError && (tmdbData?.posterUrl || tmdbData?.backdropUrl);

  return (
    <>
      <div
        className="ranked-item-wrapper"
        role="button"
        tabIndex={0}
        aria-label={`Number ${rank}: ${title}`}
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsModalOpen(true);
          }
        }}
      >
        {/* Large Outlined Rank Number */}
        <div className="ranked-number" aria-hidden="true">
          <svg viewBox="0 0 100 200" className="ranked-number-svg">
            <text
              x="50%"
              y="85%"
              textAnchor="middle"
              className="ranked-number-text"
            >
              {rank}
            </text>
          </svg>
        </div>

        {/* 2:3 Portrait Poster */}
        <div className="ranked-poster-container">
          {poster ? (
            <img
              src={poster}
              alt={`Poster for ${title}`}
              className="ranked-poster-img"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="ranked-poster-fallback">
              <span className="ranked-fallback-title">{title}</span>
            </div>
          )}

          {/* Bottom Tags */}
          <div className="ranked-tags-stack">
            {tag && (
              <span className="ranked-tag-red">{tag}</span>
            )}
            {watchNow && (
              <span className="ranked-chip-watch-now">Watch Now</span>
            )}
          </div>
        </div>
      </div>

      <InfoModal
        titleItem={item}
        tmdbData={tmdbData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

