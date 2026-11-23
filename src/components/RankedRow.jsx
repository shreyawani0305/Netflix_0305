import React, { useRef, useState, useEffect } from 'react';
import RankedCard from './RankedCard';

/**
 * Ranked Row for Top 10 Shows and Top 10 Movies in India Today.
 * Features:
 * - 28px bold white header + decorative page dashes on the right
 * - Horizontal scroll with scroll-snap and arrow buttons
 * - Items with giant rank numbers and 2:3 portrait posters
 */
export default function RankedRow({ title, items = [], rowId }) {
  const listRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const updateScroll = () => {
    const el = listRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);

    const pages = Math.max(1, Math.ceil(el.scrollWidth / Math.max(1, el.clientWidth)));
    setTotalPages(pages);
    const page = Math.min(pages - 1, Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    setCurrentPage(page);
  };

  useEffect(() => {
    updateScroll();
    const el = listRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    return () => {
      el.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [items]);

  const handleScroll = (dir) => {
    const el = listRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="netflix-row ranked-row-section" aria-labelledby={`ranked-heading-${rowId}`}>
      <div className="row-header">
        <h2 id={`ranked-heading-${rowId}`} className="row-title">
          {title}
        </h2>

        {totalPages > 1 && (
          <div className="row-page-dashes" aria-hidden="true">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <span
                key={idx}
                className={`row-page-dash ${idx === currentPage ? 'dash-active' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="row-slider-wrapper">
        <button
          type="button"
          className={`row-nav-btn row-nav-left ${!canScrollLeft ? 'hidden-btn' : ''}`}
          onClick={() => handleScroll('left')}
          aria-label={`Scroll ${title} left`}
          tabIndex={canScrollLeft ? 0 : -1}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          ref={listRef}
          className="ranked-cards-container"
          role="region"
          aria-label={`${title} carousel`}
          tabIndex={0}
        >
          {items.map((item) => (
            <div key={item.id} className="ranked-card-item">
              <RankedCard item={item} />
            </div>
          ))}
        </div>

        <button
          type="button"
          className={`row-nav-btn row-nav-right ${!canScrollRight ? 'hidden-btn' : ''}`}
          onClick={() => handleScroll('right')}
          aria-label={`Scroll ${title} right`}
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

