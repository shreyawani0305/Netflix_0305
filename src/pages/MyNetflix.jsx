import React, { useMemo } from 'react';
import Card from '../components/Card';
import { useUserData } from '../context/UserDataContext';
import { getTitleById } from '../data/catalog';

/**
 * Section E: My Netflix Page (/browse/my-list).
 * Features:
 * - Active pill on "My Netflix" tab in Navbar (#4a4a4a fill, bold white). Navbar solid black.
 * - ~120px top padding. Page side margin same as other pages.
 * - Section headings bold white, ~32px, ~40px space above card rows.
 * - 4 sections in exact order:
 *   1. "Continue Watching": progress > 0 and < 95, most recently updated first,
 *      thin 4px progress bar under card (red watched portion, light gray remainder).
 *      Clicking card resumes in mock player. Empty: "Titles you start watching will appear here."
 *   2. "My List": cards for every id in myList, newest first. Action bar allows removal.
 *      Empty: "Titles you add to My List will appear here."
 *   3. "Trailers You Have Watched": cards for every id in trailers, newest first.
 *      Empty: "Trailers you watch will appear here."
 *   4. "Shows & Movies You have Liked":
 *      If nothing liked: large rounded panel (~24px radius, #2a2a2a, ~220px tall)
 *      with red-to-orange gradient thumbs-up icon centered and line
 *      "The titles you give a thumbs up to, will appear here."
 *      Once liked: shows those cards in a row.
 * - Bottom: "Reset my data" button calling resetAll() and restoring seeded demo state.
 */
export default function MyNetflix() {
  const { progress, myList, trailers, liked, resetAll } = useUserData();

  // 1. Continue watching: progress > 0 and < 95
  const continueWatchingItems = useMemo(() => {
    return Object.entries(progress)
      .filter(([id, val]) => val > 0 && val < 95)
      .map(([id]) => getTitleById(id))
      .filter(Boolean);
  }, [progress]);

  // 2. My List (newest first)
  const myListItems = useMemo(() => {
    return myList.map((id) => getTitleById(id)).filter(Boolean);
  }, [myList]);

  // 3. Trailers (newest first)
  const trailerItems = useMemo(() => {
    return trailers.map((id) => getTitleById(id)).filter(Boolean);
  }, [trailers]);

  // 4. Liked (newest first)
  const likedItems = useMemo(() => {
    return liked.map((id) => getTitleById(id)).filter(Boolean);
  }, [liked]);

  return (
    <main className="netflix-my-page page-fade-in" id="main-content">
      <div className="my-netflix-container">
        {/* 1. Continue Watching */}
        <section className="my-netflix-section" aria-labelledby="heading-continue-watching">
          <h2 id="heading-continue-watching" className="my-section-heading">
            Continue Watching
          </h2>
          {continueWatchingItems.length > 0 ? (
            <div className="my-cards-grid">
              {continueWatchingItems.map((item, idx) => (
                <div key={item.id} className="my-grid-card-wrap">
                  <Card titleItem={item} index={idx} showProgress={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="my-empty-panel">
              <p>Titles you start watching will appear here.</p>
            </div>
          )}
        </section>

        {/* 2. My List */}
        <section className="my-netflix-section" aria-labelledby="heading-my-list">
          <h2 id="heading-my-list" className="my-section-heading">
            My List
          </h2>
          {myListItems.length > 0 ? (
            <div className="my-cards-grid">
              {myListItems.map((item, idx) => (
                <div key={item.id} className="my-grid-card-wrap">
                  <Card titleItem={item} index={idx} />
                </div>
              ))}
            </div>
          ) : (
            <div className="my-empty-panel">
              <p>Titles you add to My List will appear here.</p>
            </div>
          )}
        </section>

        {/* 3. Trailers You Have Watched */}
        <section className="my-netflix-section" aria-labelledby="heading-trailers">
          <h2 id="heading-trailers" className="my-section-heading">
            Trailers You Have Watched
          </h2>
          {trailerItems.length > 0 ? (
            <div className="my-cards-grid">
              {trailerItems.map((item, idx) => (
                <div key={item.id} className="my-grid-card-wrap">
                  <Card titleItem={item} index={idx} />
                </div>
              ))}
            </div>
          ) : (
            <div className="my-empty-panel">
              <p>Trailers you watch will appear here.</p>
            </div>
          )}
        </section>

        {/* 4. Shows & Movies You have Liked */}
        <section className="my-netflix-section" aria-labelledby="heading-liked">
          <h2 id="heading-liked" className="my-section-heading">
            Shows &amp; Movies You have Liked
          </h2>
          {likedItems.length > 0 ? (
            <div className="my-cards-grid">
              {likedItems.map((item, idx) => (
                <div key={item.id} className="my-grid-card-wrap">
                  <Card titleItem={item} index={idx} />
                </div>
              ))}
            </div>
          ) : (
            /* Large rounded panel (#2a2a2a, ~220px tall, red-to-orange gradient thumbs-up) */
            <div className="my-liked-empty-hero">
              <div className="my-liked-gradient-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="44" height="44">
                  <defs>
                    <linearGradient id="thumbsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e50914" />
                      <stop offset="100%" stopColor="#ff7a00" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#thumbsGradient)"
                    d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
                  />
                </svg>
              </div>
              <p className="my-liked-empty-text">
                The titles you give a thumbs up to, will appear here.
              </p>
            </div>
          )}
        </section>

        {/* Reset Demo Data */}
        <div className="my-reset-container">
          <button
            type="button"
            className="my-reset-text-btn"
            onClick={() => {
              if (window.confirm('Reset all demo user data to default seeded state?')) {
                resetAll();
              }
            }}
          >
            Reset my data
          </button>
        </div>
      </div>
    </main>
  );
}

