import React, { useMemo } from 'react';
import Hero from '../components/Hero';
import Row from '../components/Row';
import { titles } from '../data/titles';
import { useUserData } from '../context/UserDataContext';
import { getTitleById } from '../data/catalog';

/**
 * Home page ("/") generated dynamically from titles.js:
 * 1. Hero: Maharaja (with real TMDB backdrop and wired Player/Modal)
 * 2. Continue Watching (progress > 0 && < 95)
 * 3. My List (if any)
 * 4. Today's Top Picks for You (10 mixed titles with top10 badges)
 * 5. Trending Now
 * 6. Category rows: Movies, TV Shows, Anime, Documentaries, Kids & Family, Stand-up Comedy, Reality TV
 * 7. Genre rows (>= 3 titles): Action & Adventure, Crime, Sci-Fi & Fantasy, Horror & Thriller,
 *    Comedy, Romance, Drama, History & War, Mystery, Sports, Animation.
 */
export default function Home() {
  const { progress, myList } = useUserData();

  // 1. Hero item: Maharaja
  const maharaja = useMemo(() => {
    return titles.find((t) => t.id === 'maharaja') || titles[0];
  }, []);

  // 2. Continue Watching items (progress > 0 and < 95)
  const continueWatchingItems = useMemo(() => {
    return Object.entries(progress)
      .filter(([id, val]) => val > 0 && val < 95)
      .map(([id]) => getTitleById(id))
      .filter(Boolean);
  }, [progress]);

  // 3. My List items
  const myListItems = useMemo(() => {
    return myList.map((id) => getTitleById(id)).filter(Boolean);
  }, [myList]);

  // 4. Today's Top Picks for You (10 mixed titles)
  const topPicks = useMemo(() => {
    return [
      titles.find((t) => t.id === 'stranger-things'),
      titles.find((t) => t.id === 'extraction'),
      titles.find((t) => t.id === 'squid-game'),
      titles.find((t) => t.id === 'wednesday'),
      titles.find((t) => t.id === 'money-heist'),
      titles.find((t) => t.id === 'attack-on-titan'),
      titles.find((t) => t.id === 'bird-box'),
      titles.find((t) => t.id === 'crew'),
      titles.find((t) => t.id === 'our-planet'),
      titles.find((t) => t.id === 'enola-holmes'),
    ].filter(Boolean);
  }, []);

  // 5. Trending Now
  const trendingNow = useMemo(() => {
    return titles.slice(8, 18);
  }, []);

  // 6. Category rows
  const categories = [
    { title: 'Movies', filter: (t) => t.category === 'Movie' },
    { title: 'TV Shows', filter: (t) => t.category === 'TV Show' },
    { title: 'Anime', filter: (t) => t.category === 'Anime' },
    { title: 'Documentaries', filter: (t) => t.category === 'Documentary' },
    { title: 'Kids & Family', filter: (t) => t.category === 'Kids & Family' },
    { title: 'Stand-up Comedy', filter: (t) => t.category === 'Stand-up Comedy' },
    { title: 'Reality TV', filter: (t) => t.category === 'Reality TV' },
  ];

  // 7. Genre rows (>= 3 titles)
  const genreDefinitions = [
    { title: 'Action & Adventure', filter: (t) => t.genres.some((g) => ['Action', 'Adventure', 'Fantasy'].includes(g)) },
    { title: 'Crime', filter: (t) => t.genres.includes('Crime') },
    { title: 'Sci-Fi & Fantasy', filter: (t) => t.genres.some((g) => ['Sci-Fi', 'Fantasy'].includes(g)) },
    { title: 'Horror & Thriller', filter: (t) => t.genres.some((g) => ['Horror', 'Thriller'].includes(g)) },
    { title: 'Comedy', filter: (t) => t.genres.includes('Comedy') },
    { title: 'Romance', filter: (t) => t.genres.includes('Romance') },
    { title: 'Drama', filter: (t) => t.genres.includes('Drama') },
    { title: 'History & War', filter: (t) => t.genres.some((g) => ['History', 'War', 'Biography'].includes(g)) },
    { title: 'Mystery', filter: (t) => t.genres.includes('Mystery') },
    { title: 'Sports', filter: (t) => t.genres.includes('Sports') },
    { title: 'Animation', filter: (t) => t.genres.includes('Animation') },
  ];

  return (
    <main className="netflix-home-page page-fade-in" id="main-content">
      {/* Hero Spotlight (Maharaja) */}
      <Hero titleItem={maharaja} />

      {/* Rows Showcase */}
      <div className="netflix-rows-stack">
        {/* Continue Watching (only if any) */}
        {continueWatchingItems.length > 0 && (
          <Row
            key="row-continue-watching"
            rowId="continue-watching"
            title="Continue Watching"
            items={continueWatchingItems}
            showProgress={true}
          />
        )}

        {/* My List (only if any) */}
        {myListItems.length > 0 && (
          <Row
            key="row-my-list"
            rowId="my-list"
            title="My List"
            items={myListItems}
          />
        )}

        {/* Today's Top Picks for You */}
        <Row
          key="row-top-picks"
          rowId="top-picks"
          title="Today's Top Picks for You"
          items={topPicks}
        />

        {/* Trending Now */}
        <Row
          key="row-trending"
          rowId="trending-now"
          title="Trending Now"
          items={trendingNow}
        />

        {/* Category Rows */}
        {categories.map((cat) => {
          const matched = titles.filter(cat.filter);
          if (matched.length < 3) return null;
          return (
            <Row
              key={`cat-${cat.title}`}
              rowId={`cat-${cat.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              title={cat.title}
              items={matched}
            />
          );
        })}

        {/* Genre Rows */}
        {genreDefinitions.map((genre) => {
          const matched = titles.filter(genre.filter);
          if (matched.length < 3) return null;
          return (
            <Row
              key={`genre-${genre.title}`}
              rowId={`genre-${genre.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              title={genre.title}
              items={matched}
            />
          );
        })}
      </div>
    </main>
  );
}
