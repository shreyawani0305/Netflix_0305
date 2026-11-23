import React from 'react';
import Row from '../components/Row';
import RankedRow from '../components/RankedRow';
import { newPopularTitles } from '../data/newPopular';

/**
 * Section F: New & Popular Page (/latest).
 * Features:
 * - Active pill on "New & Popular" tab in Navbar.
 * - Solid black Navbar on this page.
 * - ~150px of top padding, same side margins.
 * - Rows in exact order:
 *   1. "New on Netflix" (landscape, top10 true on all)
 *   2. "Coming This Week" (landscape)
 *   3. "Top 10 Shows in India Today" (ranked 1 to 7)
 *   4. "Top 10 Movies in India Today" (ranked 1 to 7)
 *   5. "Coming Next Week" (landscape)
 *   6. "Worth the Wait" (landscape, live date on Gameday)
 * - Row header has heading on left & page indicator dashes on right.
 */
export default function NewPopular() {
  // 1. New on Netflix
  const newOnNetflix = newPopularTitles.filter((i) =>
    ['np-bathitha', 'np-the-paradise', 'np-mandaadi', 'np-dorothy', 'np-least-eligible-bachelor', 'np-dhoomakethu', 'np-gajaana'].includes(i.id)
  );

  // 2. Coming This Week
  const comingThisWeek = newPopularTitles.filter((i) =>
    ['np-kauri-buri', 'np-bajirao-mastani', 'np-dilwali-diwali', 'np-taken-natalee-holloway', 'np-a-dogs-perfect-christmas', 'np-bass-x-machina', 'np-ramayana'].includes(i.id)
  );

  // 3. Top 10 Shows in India Today (ranked)
  const top10Shows = newPopularTitles
    .filter((i) => i.id.endsWith('-show') || i.id === 'np-akka' || i.id === 'np-the-great-indian-kapil' || i.id === 'np-dead-end-job' || i.id === 'np-roadies-rebirth')
    .sort((a, b) => a.rank - b.rank);

  // 4. Top 10 Movies in India Today (ranked)
  const top10Movies = newPopularTitles
    .filter((i) => i.id.endsWith('-ranked'))
    .sort((a, b) => a.rank - b.rank);

  // 5. Coming Next Week
  const comingNextWeek = newPopularTitles.filter((i) =>
    ['np-the-body', 'np-kijsada-paradise', 'np-cunk-on-cinema', 'np-alien', 'np-alans-universe', 'np-doozies-doghouse', 'np-sirens'].includes(i.id)
  );

  // 6. Worth the Wait
  const worthTheWait = newPopularTitles.filter((i) =>
    ['np-from', 'np-gameday-thanksgiving', 'np-chiranjeevi-megaverse', 'np-urban-legends-bloody-mary', 'np-dhindora-wait', 'np-chasing-shadows', 'np-pride-and-prejudice'].includes(i.id)
  );

  return (
    <main className="netflix-new-popular-page page-fade-in" id="main-content">
      <div className="new-popular-rows-stack">
        {/* 1. New on Netflix */}
        <Row
          key="np-new-on-netflix"
          rowId="new-on-netflix"
          title="New on Netflix"
          items={newOnNetflix}
          showDashes={true}
        />

        {/* 2. Coming This Week */}
        <Row
          key="np-coming-this-week"
          rowId="coming-this-week"
          title="Coming This Week"
          items={comingThisWeek}
          showDashes={true}
        />

        {/* 3. Top 10 Shows in India Today (Ranked) */}
        <RankedRow
          key="np-top-10-shows"
          rowId="top-10-shows-india"
          title="Top 10 Shows in India Today"
          items={top10Shows}
        />

        {/* 4. Top 10 Movies in India Today (Ranked) */}
        <RankedRow
          key="np-top-10-movies"
          rowId="top-10-movies-india"
          title="Top 10 Movies in India Today"
          items={top10Movies}
        />

        {/* 5. Coming Next Week */}
        <Row
          key="np-coming-next-week"
          rowId="coming-next-week"
          title="Coming Next Week"
          items={comingNextWeek}
          showDashes={true}
        />

        {/* 6. Worth the Wait */}
        <Row
          key="np-worth-the-wait"
          rowId="worth-the-wait"
          title="Worth the Wait"
          items={worthTheWait}
          showDashes={true}
        />
      </div>
    </main>
  );
}

