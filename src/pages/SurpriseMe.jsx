import React, { useEffect, useMemo, useRef, useState } from 'react';
import Card from '../components/Card';
import { titles } from '../data/catalog';
import { useUserData } from '../context/UserDataContext';
import './SurpriseMe.css';

const MODES = [
  { id: 'different', icon: '⤨', title: 'Completely different', description: 'Break your routine with wild genres, foreign masterpieces, and unheard classics outside your scope.' },
  { id: 'adjacent', icon: '◈', title: 'Adjacent genre', description: 'Explore titles that branch off your favorite categories with subtle twists and fresh perspective stories.' },
];

const NEIGHBORS = {
  action: ['adventure', 'crime', 'thriller', 'sci-fi'], adventure: ['action', 'fantasy', 'family', 'sci-fi'],
  comedy: ['romance', 'family', 'drama', 'animation'], crime: ['thriller', 'drama', 'action', 'mystery'],
  drama: ['romance', 'crime', 'history', 'thriller'], fantasy: ['adventure', 'sci-fi', 'family', 'action'],
  horror: ['thriller', 'mystery', 'fantasy', 'sci-fi'], romance: ['comedy', 'drama', 'music', 'family'],
  'sci-fi': ['action', 'fantasy', 'thriller', 'adventure'], thriller: ['crime', 'mystery', 'horror', 'action'],
};

const WILD_MIXES = [
  { id: 'food-sci-fi', name: 'Food + Sci-Fi', genres: ['food', 'sci-fi'] },
  { id: 'western-animation', name: 'Western + Animation', genres: ['western', 'animation'] },
  { id: 'nature-crime', name: 'Nature + Crime', genres: ['nature', 'crime'] },
  { id: 'musical-mystery', name: 'Musical + Mystery', genres: ['musical', 'mystery'] },
  { id: 'sports-fantasy', name: 'Sports + Fantasy', genres: ['sports', 'fantasy'] },
  { id: 'design-romance', name: 'Design + Romance', genres: ['design', 'romance'] },
  { id: 'reality-horror', name: 'Reality + Horror', genres: ['reality', 'horror'] },
  { id: 'technology-family', name: 'Technology + Family', genres: ['technology', 'family'] },
].map((mix) => ({ ...mix, mode: 'different' }));

const ADJACENT_MIXES = [
  { id: 'mystery-thriller', name: 'Mystery + Thriller', genres: ['mystery', 'thriller'] },
  { id: 'crime-drama', name: 'Crime + Drama', genres: ['crime', 'drama'] },
  { id: 'adventure-fantasy', name: 'Adventure + Fantasy', genres: ['adventure', 'fantasy'] },
  { id: 'romance-comedy', name: 'Romance + Comedy', genres: ['romance', 'comedy'] },
  { id: 'sci-fi-mystery', name: 'Sci-Fi + Mystery', genres: ['sci-fi', 'mystery'] },
  { id: 'action-adventure', name: 'Action + Adventure', genres: ['action', 'adventure'] },
  { id: 'horror-thriller', name: 'Horror + Thriller', genres: ['horror', 'thriller'] },
  { id: 'animation-family', name: 'Animation + Family', genres: ['animation', 'family'] },
].map((mix) => ({ ...mix, mode: 'adjacent' }));

const MIXES_BY_MODE = { different: WILD_MIXES, adjacent: ADJACENT_MIXES };

const genresOf = (title) => (title.genres || []).map((genre) => genre.toLowerCase());

export default function SurpriseMe() {
  const [mode, setMode] = useState('different');
  const [generatedMode, setGeneratedMode] = useState(null);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [activeMix, setActiveMix] = useState(null);
  const [mixes, setMixes] = useState(() => Object.fromEntries(
    Object.entries(MIXES_BY_MODE).map(([key, items]) => [key, items.map(({ id }) => id)]),
  ));
  const [resultFilter, setResultFilter] = useState('All');
  const [transitioning, setTransitioning] = useState(false);
  const transitionTimer = useRef(null);
  const resultsRef = useRef(null);
  const { myList, liked } = useUserData();

  useEffect(() => () => window.clearTimeout(transitionTimer.current), []);

  useEffect(() => {
    if (!generatedMode || transitioning || !resultsRef.current) return undefined;

    const frame = window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.parent !== window && new URLSearchParams(window.location.search).get('walkthrough') === '1') {
        window.parent.postMessage({ type: 'netflix-walkthrough-surprise-results' }, window.location.origin);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [generatedMode, transitioning]);

  const recommendations = useMemo(() => {
    const favorites = [...myList, ...liked].map((id) => titles.find((title) => title.id === id)).filter(Boolean);
    const preferredGenres = new Set(favorites.flatMap(genresOf));
    const known = preferredGenres.size ? preferredGenres : new Set(['action', 'thriller', 'drama']);
    const adjacent = new Set([...known].flatMap((genre) => NEIGHBORS[genre] || []));

    return titles.map((title) => {
      const genres = genresOf(title);
      const familiarCount = genres.filter((genre) => known.has(genre)).length;
      const adjacentCount = genres.filter((genre) => adjacent.has(genre) && !known.has(genre)).length;
      const noise = Math.abs(Math.sin(title.title.length * 12.9898 + title.id.length * 78.233 + shuffleKey * 37.719)) % 1;
      const varied = noise * (activeMix ? 40 : generatedMode === 'different' ? 8 : 0.99);
      const mixMatches = activeMix ? genres.filter((genre) => activeMix.genres.includes(genre)).length : 0;
      const score = activeMix
        ? mixMatches * 100 + varied
        : generatedMode === 'adjacent'
        ? adjacentCount * 10 - familiarCount * 4 + varied
        : (familiarCount ? -familiarCount * 9 : 6) + varied;
      return { title, score };
    }).sort((a, b) => b.score - a.score);
  }, [activeMix, generatedMode, liked, myList, shuffleKey]);

  const generate = () => {
    setActiveMix(null);
    setGeneratedMode(mode);
    setResultFilter('All');
    setShuffleKey(Math.random() * 1000);
    setTransitioning(true);
    window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(() => setTransitioning(false), 1700);
  };

  const openMix = (mix) => {
    setMode(mix.mode);
    setActiveMix(mix);
    setGeneratedMode(mix.mode);
    setResultFilter('All');
    setShuffleKey(Math.random() * 1000);
    setTransitioning(true);
    window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(() => setTransitioning(false), 1700);
  };

  const tryRandomMix = () => {
    const allMixes = MIXES_BY_MODE[mode];
    const availableMixes = allMixes.filter(({ id }) => mixes[mode].includes(id));
    if (!availableMixes.length) {
      setMixes((current) => ({ ...current, [mode]: allMixes.map(({ id }) => id) }));
    }
    const pool = availableMixes.length ? availableMixes : allMixes;
    openMix(pool[Math.floor(Math.random() * pool.length)]);
  };

  const visibleMixes = MIXES_BY_MODE[mode];
  const remainingMixes = mixes[mode];

  const resultMode = MODES.find((item) => item.id === generatedMode);
  const filteredRecommendations = recommendations.filter(({ title }) => {
    const isMovie = title.tmdbType === 'movie' || title.category === 'Movie';
    return resultFilter === 'All' || (resultFilter === 'Movies' ? isMovie : !isMovie);
  });
  const primaryIds = new Set(recommendations.slice(0, 12).map(({ title }) => title.id));
  const genreWeights = new Map();
  recommendations.slice(0, 12).forEach(({ title }) => genresOf(title).forEach((genre) => {
    genreWeights.set(genre, (genreWeights.get(genre) || 0) + 1);
  }));
  const similarRecommendations = generatedMode ? titles
    .filter((title) => !primaryIds.has(title.id))
    .map((title) => ({ title, score: genresOf(title).reduce((sum, genre) => sum + (genreWeights.get(genre) || 0), 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4) : [];
  return (
    <main className="surprise-page page-fade-in" id="main-content" data-mode={mode}>
      <div className="surprise-container">
        <header className="surprise-heading">
          <span className="surprise-version">DISCOVERY ALGORITHM V2.4</span>
          <h1>Feeling adventurous</h1>
          <p>Let’s find something outside your usual taste</p>
        </header>

        <section className="surprise-options" role="radiogroup" aria-label="Choose a discovery style">
          {MODES.map((item) => (
            <label className={`surprise-option ${mode === item.id ? 'is-selected' : ''}`} key={item.id}>
              <input type="radio" name="surprise-mode" value={item.id} checked={mode === item.id}
                onChange={() => { setMode(item.id); setActiveMix(null); setGeneratedMode(null); }} />
              <span className={`surprise-icon surprise-icon-${item.id}`} aria-hidden="true">{item.icon}</span>
              <span className="surprise-title">{item.title}</span>
              <span className="surprise-description">{item.description}</span>
              <span className="surprise-radio" aria-hidden="true" />
            </label>
          ))}
        </section>

        <div className="surprise-cta-wrap">
          <button className="surprise-cta" type="button" onClick={generate}><span aria-hidden="true">✣</span> Surprise Me</button>
        </div>

        <section className="surprise-mix-panel" aria-label={`${mode === 'different' ? 'Unexpected' : 'Adjacent'} genre mixes`}>
          <h2>Try a mix</h2>
          <p>{mode === 'different' ? 'Pair distant genres for an unexpected pick.' : 'Blend neighboring genres for a fresh familiar vibe.'}</p>
          <div className="surprise-mix-row">
            <div className="surprise-mix-chips">
              {visibleMixes.filter(({ id }) => remainingMixes.includes(id)).map((mix) => (
                <span className="surprise-mix-chip" key={mix.id}>
                  <button type="button" onClick={() => openMix(mix)} aria-label={`Explore ${mix.name}`}>{mix.name}</button>
                  <button type="button" className="surprise-mix-remove" onClick={() => setMixes((current) => ({ ...current, [mode]: current[mode].filter((id) => id !== mix.id) }))}
                    aria-label={`Remove ${mix.name}`}>×</button>
                </span>
              ))}
              {!remainingMixes.length && <span className="surprise-mix-empty">No mixes left.</span>}
            </div>
            <button className="surprise-mix-go" type="button" onClick={tryRandomMix}
              aria-label={remainingMixes.length ? 'Try a random genre mix' : 'Reset genre mixes and try one'}>
              <span aria-hidden="true">{remainingMixes.length ? '↗' : '↻'}</span>
            </button>
            {!remainingMixes.length && <button className="surprise-mix-reset" type="button"
              onClick={() => setMixes((current) => ({ ...current, [mode]: visibleMixes.map(({ id }) => id) }))}>Reset mixes</button>}
          </div>
        </section>

        {generatedMode && <section ref={resultsRef} className="surprise-results" aria-live="polite" aria-labelledby="surprise-results-title">
          <div className="surprise-results-heading">
            <div><p className="surprise-eyebrow">{activeMix ? 'UNEXPECTED GENRE COLLISION' : 'YOUR NEXT OBSESSION'}</p>
              <h2 id="surprise-results-title">{activeMix ? `${activeMix.name} picks` : `${resultMode.title} picks`}</h2></div>
            <button type="button" className="surprise-again" onClick={activeMix ? tryRandomMix : generate}>Try another mix</button>
          </div>
          <div className="surprise-result-controls" role="group" aria-label="Filter recommendations by type">
            {['All', 'Movies', 'TV Series'].map((filter) => <button type="button" key={filter}
              aria-pressed={resultFilter === filter} onClick={() => setResultFilter(filter)}>{filter}</button>)}
          </div>
          <div className="surprise-card-grid">
            {filteredRecommendations.slice(0, 12).map(({ title }, index) => (
              <div className="surprise-card-wrap" key={title.id}><Card titleItem={title} index={index} />
                <span>{title.genres?.slice(0, 2).join(' · ') || title.category}</span></div>
            ))}
          </div>
          {!filteredRecommendations.length && <p className="surprise-no-results">No titles in this category for the current mix.</p>}
          {similarRecommendations.length > 0 && <div className="surprise-similar">
            <h3>You might also like</h3>
            <p>More picks related to the genres you just explored.</p>
            <div className="surprise-card-grid">
              {similarRecommendations.map(({ title }, index) => <div className="surprise-card-wrap" key={`similar-${title.id}`}>
                <Card titleItem={title} index={index + 12} />
                <span>{title.genres?.slice(0, 2).join(' / ') || title.category}</span>
              </div>)}
            </div>
          </div>}
        </section>}
      </div>
      <div className={`surprise-transition-veil${transitioning ? ' is-active' : ''}`} data-mode={mode}
        aria-hidden={!transitioning} role="status" aria-live="polite">
        <div className="surprise-transition-bloom" />
        <div className="surprise-transition-flare" />
        <div className="surprise-transition-streaks" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => <i key={index} style={{
            left: `${8 + index * 10.5}%`, top: `${(index * 7) % 12 - 5}%`, height: `${70 + (index * 13) % 40}%`,
            animationDelay: `${.45 + index * .07}s`, '--surprise-dx': `${(index % 2 ? 1 : -1) * (60 + index * 14)}px`,
          }} />)}
        </div>
        <span className="surprise-transition-label">{activeMix ? `Blending ${activeMix.name}` : 'Finding your next surprise'}</span>
      </div>
    </main>
  );
}
