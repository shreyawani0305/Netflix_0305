import React, { useEffect, useMemo, useRef, useState } from 'react';
import Card from '../components/Card';
import { titles } from '../data/catalog';
import './Mood.css';

const SLIDERS = [
  { key: 'energy', label: 'Energy', initial: 90 },
  { key: 'suspense', label: 'Suspense', initial: 28 },
  { key: 'humour', label: 'Humour', initial: 52 },
  { key: 'familiarity', label: 'Familiarity', initial: 85 },
];
const DOCUMENTARY_POSTERS = [
  ['Man with a Movie Camera', '01_Man_with_a_Movie_Camera.png'],
  ['Night and Fog', '02_Night_and_Fog.png'],
  ['The Thin Blue Line', '03_The_Thin_Blue_Line.png'],
  ['Shoah', '04_Shoah.png'],
  ['Hoop Dreams', '05_Hoop_Dreams.png'],
  ['Grizzly Man', '06_Grizzly_Man.png'],
  ['Bowling for Columbine', '07_Bowling_for_Columbine.png'],
  ['Fahrenheit 9/11', '08_Fahrenheit_9_11.png'],
  ['An Inconvenient Truth', '09_An_Inconvenient_Truth.png'],
  ['March of the Penguins', '10_March_of_the_Penguins.png'],
  ['The Act of Killing', '11_The_Act_of_Killing.png'],
  ['Searching for Sugar Man', '12_Searching_for_Sugar_Man.png'],
  ['Man on Wire', '13_Man_on_Wire.png'],
  ['Free Solo', '14_Free_Solo.png'],
  ['Blackfish', '15_Blackfish.png'],
  ['Citizenfour', '16_Citizenfour.png'],
  ['Amy', '17_Amy.png'],
  ['I Am Not Your Negro', '18_I_Am_Not_Your_Negro.png'],
  ['13th', '19_13th.png'],
  ['Inside Job', '20_Inside_Job.png'],
  ['The Cove', '21_The_Cove.png'],
  ['Food, Inc.', '22_Food_Inc.png'],
  ['Super Size Me', '23_Super_Size_Me.png'],
  ['The Social Dilemma', '24_The_Social_Dilemma.png'],
  ['The Great Hack', '25_The_Great_Hack.png'],
  ["Inside Bill's Brain", '26_Inside_Bills_Brain.png'],
  ["Won't You Be My Neighbor?", '27_Wont_You_Be_My_Neighbor.png'],
  ['Jiro Dreams of Sushi', '28_Jiro_Dreams_of_Sushi.png'],
  ['Helvetica', '29_Helvetica.png'],
  ['Objectified', '30_Objectified.png'],
].map(([title, file]) => ({
  title,
  image: `/images/mood-documentaries/${file}`,
  category: 'Documentary',
  genres: ['Documentary'],
  rating: 'NR',
  runtime: 'Documentary',
  gradient: 'linear-gradient(135deg, #302543, #0c0812)',
}));

const MOOD_TITLES = [
  ...titles.map((title) => {
    const poster = DOCUMENTARY_POSTERS.find((item) => item.title.toLowerCase() === title.title.toLowerCase());
    return poster ? { ...title, moodPoster: poster.image } : title;
  }),
  ...DOCUMENTARY_POSTERS.filter((poster) => !titles.some((title) => title.title.toLowerCase() === poster.title.toLowerCase()))
    .map((poster, index) => ({ ...poster, id: `mood-documentary-${index + 1}`, moodPoster: poster.image })),
];

function intensity(title) {
  const genres = (title.genres || []).map((genre) => genre.toLowerCase());
  const has = (...terms) => terms.some((term) => genres.some((genre) => genre.includes(term)));
  return [
    has('action', 'adventure', 'sport', 'sci-fi', 'fantasy') ? 82 : has('comedy', 'crime') ? 60 : 35,
    has('thriller', 'horror', 'mystery', 'crime') ? 84 : has('action', 'sci-fi') ? 58 : 20,
    has('comedy', 'animation', 'family') ? 86 : has('romance') ? 55 : 18,
    title.badge === 'top10' || title.top10 || title.badge === 'recentlyAdded' ? 78 : 48,
  ];
}

function SliderIcon({ type }) {
  const common = { viewBox: '0 0 24 24', 'aria-hidden': true };
  if (type === 'energy') return <svg {...common}><path d="m13 2-8 12h6l-1 8 9-13h-6z" /></svg>;
  if (type === 'suspense') return <svg {...common}><path d="M2 12c3-6 5 6 8 0s5 6 8 0 3 3 4 0" /></svg>;
  if (type === 'humour') return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M8 14c2 3 6 3 8 0M9 9h.01M15 9h.01" /></svg>;
  return <svg {...common}><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 6-8 11-8 11z" /></svg>;
}

function MoodIllustration() {
  return (
    <div className="mood-art-panel">
      <img className="mood-art-photo"
        src="https://images.unsplash.com/photo-1766844649143-af98d71e346b?auto=format&fit=crop&fm=jpg&q=80&w=1200"
        alt="An empty movie theater with a lit screen" />
      <div className="mood-art-orb mood-art-popcorn">🍿</div>
      <div className="mood-art-orb mood-art-glasses"><svg viewBox="0 0 48 28"><path d="M3 6h42l-3 15H27l-3-6-3 6H6z" /><circle cx="14" cy="13" r="5" /><circle cx="34" cy="13" r="5" /></svg></div>
      <div className="mood-art-orb mood-art-film" aria-hidden="true"><svg viewBox="0 0 36 32"><path d="M5 8h26v20H5zM5 8l4-6h7l-4 6 5-6h7l-4 6 5-6h7" /><path d="M14 15v8l8-4z" /></svg></div>
      <a className="mood-art-credit" href="https://unsplash.com/photos/empty-movie-theater-with-a-lit-screen-dXpJeKIWfGs"
        target="_blank" rel="noreferrer">Photo by Rapha Wilde / Unsplash</a>
    </div>
  );
}

function PopcornTransition() {
  const popcorn = [
    { className: 'popcorn-kernel-one', delay: '0s' },
    { className: 'popcorn-kernel-two', delay: '.3s' },
    { className: 'popcorn-kernel-three', delay: '.6s' },
    { className: 'popcorn-kernel-four', delay: '.9s' },
    { className: 'popcorn-kernel-five', delay: '1.2s' },
    { className: 'popcorn-kernel-six', delay: '1.5s' },
  ];

  return (
    <div className="mood-popcorn-scene" role="img" aria-label="Popcorn popping out of a striped bucket">
      {popcorn.map(({ className, delay }) => (
        <span className={`mood-popcorn-kernel ${className}`} style={{ '--pop-delay': delay }} key={className}>
          <svg viewBox="0 0 36 34" aria-hidden="true">
            <path d="M18 3c3-4 9-1 8 4 6-2 10 5 6 9 5 4 1 11-4 10 0 6-8 9-11 4-5 5-12 1-10-4-7-1-8-9-3-12-3-6 4-11 9-7 0-2 2-4 5-4Z" />
          </svg>
        </span>
      ))}
      <svg className="mood-popcorn-bucket" viewBox="0 0 280 250" aria-hidden="true">
        <defs>
          <clipPath id="mood-popcorn-bucket-clip">
            <path d="M66 103h148l-17 121q-1 9-11 9H94q-10 0-11-9Z" />
          </clipPath>
          <linearGradient id="mood-popcorn-bucket-shade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#b30c16" />
            <stop offset=".23" stopColor="#ed202c" />
            <stop offset=".76" stopColor="#d91320" />
            <stop offset="1" stopColor="#9b0911" />
          </linearGradient>
        </defs>
        <ellipse cx="140" cy="229" rx="76" ry="10" fill="#0008" />
        <path d="M66 103h148l-17 121q-1 9-11 9H94q-10 0-11-9Z" fill="#f3eee4" />
        <g clipPath="url(#mood-popcorn-bucket-clip)">
          <path d="M79 97h35v142H79zm70 0h35v142h-35z" fill="url(#mood-popcorn-bucket-shade)" />
        </g>
        <ellipse cx="140" cy="104" rx="75" ry="14" fill="#fff8e9" />
        <ellipse cx="140" cy="102" rx="68" ry="9" fill="#f4b52f" />
        <path d="M68 104h144" fill="none" stroke="#fff9ed" strokeWidth="5" strokeLinecap="round" />
        <path d="M99 175h82" fill="none" stroke="#fff8ed" strokeWidth="3" opacity=".8" />
        <path d="m105 193 35 7 35-7" fill="none" stroke="#fff8ed" strokeWidth="2" opacity=".65" />
      </svg>
    </div>
  );
}

export default function Mood() {
  const [mood, setMood] = useState(() => Object.fromEntries(SLIDERS.map(({ key, initial }) => [key, initial])));
  const [familiarityLabel, setFamiliarityLabel] = useState('Familiarity');
  const [resultMood, setResultMood] = useState(null);
  const [resultGenre, setResultGenre] = useState('');
  const [generated, setGenerated] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const processingTimer = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => () => window.clearTimeout(processingTimer.current), []);

  useEffect(() => {
    if (!generated || processing || !resultsRef.current) return undefined;

    const frame = window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.parent !== window && new URLSearchParams(window.location.search).get('walkthrough') === '1') {
        window.parent.postMessage({ type: 'netflix-walkthrough-mood-results' }, window.location.origin);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [generated, processing]);

  const recommendations = useMemo(() => MOOD_TITLES.map((title) => {
    const values = intensity(title);
    const desired = SLIDERS.map(({ key }) => (resultMood || mood)[key]);
    const distance = values.reduce((sum, value, index) => sum + Math.abs(value - desired[index]), 0);
    const requestedGenre = resultGenre.trim().toLowerCase();
    const titleGenres = [...(title.genres || []), title.category].filter(Boolean).map((genre) => genre.toLowerCase());
    const genreMatch = requestedGenre && requestedGenre !== 'familiarity'
      && titleGenres.some((genre) => genre.includes(requestedGenre) || requestedGenre.includes(genre));
    const genreBoost = genreMatch ? 24 : 0;
    return { title, match: resultMood ? Math.min(100, Math.max(1, Math.round(100 - distance / values.length + genreBoost))) : 0 };
  }).filter(({ title }) => !query || title.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => resultMood ? b.match - a.match : 0), [mood, query, resultGenre, resultMood]);

  const generate = () => {
    const moodSnapshot = { ...mood };
    window.clearTimeout(processingTimer.current);
    setResultMood(null);
    setResultGenre('');
    setGenerated(false);
    setShowAll(false);
    setProcessing(true);
    setNotice('The Mood DJ is mixing your picks…');
    processingTimer.current = window.setTimeout(() => {
      setResultMood(moodSnapshot);
      setResultGenre(familiarityLabel.trim());
      setGenerated(true);
      setProcessing(false);
      setNotice('Mix ready.');
    }, 5000);
  };
  const bestPick = recommendations[0];
  const visibleRecommendations = showAll ? recommendations : recommendations.slice(0, 8);
  const topPickIds = new Set(recommendations.slice(0, 5).map(({ title }) => title.id));
  const similarRecommendations = generated && bestPick && !query
    ? recommendations
      .filter(({ title }) => !topPickIds.has(title.id))
      .map((item) => {
        const bestValues = intensity(bestPick.title);
        const itemValues = intensity(item.title);
        const distance = itemValues.reduce((sum, value, index) => sum + Math.abs(value - bestValues[index]), 0);
        return { ...item, similarity: Math.max(40, Math.round(100 - distance / 4)) };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
    : [];
  return (
    <main className="mood-page page-fade-in" id="main-content">
      <div className="mood-container">
        <section className="mood-panel" aria-labelledby="mood-panel-title">
          <div className="mood-panel-heading">
            <svg viewBox="0 0 40 24" aria-hidden="true"><path d="M2 12h4M10 5v14M16 9v6M22 2v20M28 7v10M34 10v4M38 12h0" /></svg>
            <div><h1 id="mood-panel-title">The Mood DJ</h1><p>Set the vibe. We’ll take care of the rest. ✦</p></div>
          </div>
          <div className="mood-sliders">
            {SLIDERS.map(({ key, label }) => {
              const value = mood[key];
              return (
                <div className={`mood-slider-card${key === 'familiarity' ? ' is-editable' : ''}`} key={key}>
                  <SliderIcon type={key} />
                  <span className="mood-slider-visual">
                    <span className="mood-bubbles" aria-hidden="true">
                      {Array.from({ length: 12 }, (_, index) => {
                        const active = index < Math.ceil(value / (100 / 12));
                        return <i key={index} className={active ? 'is-active' : ''} style={{ '--bubble-delay': `${index * 18}ms` }} />;
                      })}
                    </span>
                    <input type="range" min="0" max="100" value={value}
                      disabled={processing}
                      style={{ '--mood-progress': `${value}%` }}
                      onChange={(event) => setMood((current) => ({ ...current, [key]: Number(event.target.value) }))}
                      aria-label={key === 'familiarity' ? familiarityLabel || 'Familiarity' : label} />
                    <span className="mood-ticks" aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <i key={index} />)}</span>
                  </span>
                  <output>{value < 34 ? 'Low' : value < 67 ? 'Medium' : 'High'}</output>
                  {key === 'familiarity' ? (
                    <input className="mood-slider-label-editor" type="text" value={familiarityLabel}
                      onChange={(event) => setFamiliarityLabel(event.target.value)}
                      aria-label="Edit Familiarity slider label"
                      title="Rename this slider to a genre to guide your recommendations" />
                  ) : <span className="mood-slider-label">{label}</span>}
                </div>
              );
            })}
            <MoodIllustration />
          </div>
          <div className="mood-actions">
            <button type="button" className="mood-generate" onClick={generate} disabled={processing} aria-busy={processing}>
              <span aria-hidden="true">✦</span> {processing ? 'Mixing your mood…' : 'Generate for Me'}
            </button>
          </div>
          <p className="mood-status mood-panel-status" role="status" aria-live="polite">
            {processing ? notice : `${notice}${generated && !query && bestPick ? ` Best match: ${bestPick.title.title} (${bestPick.match}%).` : ''}`}
          </p>
        </section>
        <section ref={resultsRef} className="mood-results" aria-labelledby="mood-results-title">
          <div className="mood-results-heading">
            <div><p className="mood-eyebrow">{generated ? 'MADE FOR YOUR MOMENT' : 'BASED ON YOUR VIBE'}</p>
              <h2 id="mood-results-title">{generated ? 'Your mood mix' : 'Popular picks for you'}</h2></div>
            <label className="mood-search"><span className="sr-only">Filter recommendations</span><span aria-hidden="true">⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a title" /></label>
            {!query && recommendations.length > 8 && <button type="button" className="mood-see-all"
              onClick={() => setShowAll((current) => !current)} aria-expanded={showAll}>
              {showAll ? 'Show less' : 'See all'} <span aria-hidden="true">→</span>
            </button>}
          </div>
          {processing ? (
            <div className="mood-processing" role="status" aria-live="polite" aria-label="Generating recommendations">
              <span className="mood-spinner" aria-hidden="true" />
              <div><strong>Finding your perfect mix</strong><p>Matching your sliders with titles in the catalog…</p></div>
              <span className="mood-processing-equalizer" aria-hidden="true"><i /><i /><i /><i /><i /></span>
            </div>
          ) : recommendations.length ? <div className="mood-card-grid">
            {visibleRecommendations.map(({ title, match }, index) => (
              <div className="mood-card-wrap" key={title.id}><Card titleItem={title} index={index} imageOverride={title.moodPoster} />{generated && <span className="mood-match">{match}% mood match</span>}</div>
            ))}
          </div> : <p className="mood-empty">No titles match that search. Try another title.</p>}
          {similarRecommendations.length > 0 && <div className="mood-similar">
            <div className="mood-results-heading mood-similar-heading">
              <div><p className="mood-eyebrow">A LITTLE MORE LIKE YOUR TOP PICK</p><h2>Similar suggestions</h2></div>
            </div>
            <p className="mood-similar-caption">More like “{bestPick.title.title}”, your best match</p>
            <div className="mood-card-grid">
              {similarRecommendations.map(({ title, similarity }, index) => (
                <div className="mood-card-wrap" key={`similar-${title.id}`}><Card titleItem={title} index={index + 8} imageOverride={title.moodPoster} />
                  <span className="mood-match">{similarity}% similar</span></div>
              ))}
            </div>
          </div>}
        </section>
        <div className={`mood-veil${processing ? ' is-visible' : ''}`} role="status" aria-live="polite"
          aria-hidden={!processing}>
          <div className="mood-veil-content">
            <PopcornTransition />
            <p>Mixing your vibe…</p>
            <div className="mood-veil-progress" aria-hidden="true"><i /></div>
            <span>Finding the right titles for your mood</span>
          </div>
        </div>
      </div>
    </main>
  );
}
