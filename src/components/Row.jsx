import React, { useRef, useState, useEffect } from 'react';
import Card from './Card';

/**
 * Reusable Row component for Netflix carousels.
 * Supports:
 * - 28px bold title
 * - Optional page indicator dashes on the right
 * - Horizontal scroll with snap
 * - Arrow navigation buttons appearing on hover/focus
 * - Smooth scrolling left and right
 */
export default function Row({ title, items = [], rowId, showProgress = false, showDashes = false }) {
  const rowListRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Compute pagination dashes and scroll bounds
  const updateScrollState = () => {
    const el = rowListRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    const pages = Math.max(1, Math.ceil(scrollWidth / Math.max(1, clientWidth)));
    setTotalPages(pages);

    const page = Math.min(pages - 1, Math.round(scrollLeft / Math.max(1, clientWidth)));
    setCurrentPage(page);
  };

  useEffect(() => {
    updateScrollState();
    const el = rowListRef.current;
    if (!el) return;

    const handleScroll = () => {
      updateScrollState();
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [items]);

  const handleScroll = (direction) => {
    const el = rowListRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="netflix-row" aria-labelledby={`heading-${rowId}`}>
      <div className="row-header">
        <h2 id={`heading-${rowId}`} className="row-title">
          {title}
        </h2>

        {/* Decorative Page-Indicator Dashes for New & Popular rows */}
        {showDashes && totalPages > 1 && (
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
        {/* Left Arrow Button */}
        <button
          type="button"
          className={`row-nav-btn row-nav-left ${!canScrollLeft ? 'hidden-btn' : ''}`}
          onClick={() => handleScroll('left')}
          aria-label={`Scroll ${title} left`}
          tabIndex={canScrollLeft ? 0 : -1}
          aria-hidden={!canScrollLeft}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Carousel Items Container */}
        <div
          ref={rowListRef}
          className="row-cards-container"
          role="region"
          aria-label={`${title} carousel`}
          tabIndex={0}
        >
          {items.map((item, idx) => (
            <div key={item.id} className="row-card-item">
              <Card titleItem={item} index={idx} showProgress={showProgress} />
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          className={`row-nav-btn row-nav-right ${!canScrollRight ? 'hidden-btn' : ''}`}
          onClick={() => handleScroll('right')}
          aria-label={`Scroll ${title} right`}
          tabIndex={canScrollRight ? 0 : -1}
          aria-hidden={!canScrollRight}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
