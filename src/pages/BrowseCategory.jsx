import React, { useEffect, useMemo, useRef, useState } from 'react';
import Card from '../components/Card';
import { titles } from '../data/titles';
import './BrowseCategory.css';

const PAGE_DETAILS = {
  movie: {
    title: 'Movies',
    description: 'Explore movies picked for every kind of night.',
    rows: [
      ['Popular Movies', ['Action', 'Comedy', 'Crime', 'Drama', 'Thriller']],
      ['Action Movies', ['Action', 'Adventure']],
      ['Comedies', ['Comedy']],
      ['Thrillers & Crime Movies', ['Thriller', 'Crime', 'Mystery']],
      ['Fantasy & Adventure Movies', ['Fantasy', 'Adventure', 'Sci-Fi']],
      ['Indian Movies', ['Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada']],
      ['Documentaries', ['Documentary']],
      ['Family Movies', ['Family', 'Animation', 'Kids']],
      ['Award-Winning Dramas', ['Drama', 'Biography', 'History']],
    ],
  },
  tv: {
    title: 'TV Shows',
    description: 'Discover series, anime, documentaries, and more.',
    rows: [
      ['Popular TV Shows', ['Crime', 'Drama', 'Mystery', 'Thriller', 'Sci-Fi']],
      ['Anime', ['Anime']],
      ['Familiar Favourite Series', ['Crime', 'Comedy', 'Drama']],
      ['Romantic TV Shows', ['Romance']],
      ['Crime & Mystery Series', ['Crime', 'Mystery']],
      ['Fantasy & Sci-Fi Series', ['Fantasy', 'Sci-Fi']],
      ['Comedies', ['Comedy']],
      ['Documentaries', ['Documentary']],
      ['Family & Kids', ['Kids', 'Animation', 'Family']],
      ['Reality TV', ['Reality']],
    ],
  },
};

const GENRE_ALIASES = {
  Anime: ['attack-on-titan', 'death-note', 'demon-slayer', 'cyberpunk-edgerunners', 'violet-evergarden', 'haikyu'],
  Tamil: ['maharaja'],
  Hindi: ['crew', 'jamtara', 'sacred-games'],
  Telugu: [],
  Malayalam: [],
  Kannada: [],
  Kids: ['ninjago', 'miraculous'],
};

export default function BrowseCategory({ type = 'movie' }) {
  const page = PAGE_DETAILS[type] || PAGE_DETAILS.movie;
  const [selectedGenre, setSelectedGenre] = useState('');
  const [isGenreMenuOpen, setIsGenreMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const categoryTitles = useMemo(() => titles
    .filter((title) => title.tmdbType === type)
    .sort((a, b) => (b.year || 0) - (a.year || 0)), [type]);

  const genres = useMemo(() => [...new Set(page.rows.flatMap(([, rowGenres]) => rowGenres))]
    .filter((genre) => !['Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'].includes(genre))
    .sort((a, b) => a.localeCompare(b)), [page.rows]);

  const rows = useMemo(() => {
    if (selectedGenre) {
      const ids = GENRE_ALIASES[selectedGenre];
      const matches = categoryTitles.filter((title) => (ids
        ? ids.includes(title.id)
        : title.genres?.some((genre) => genre.toLowerCase() === selectedGenre.toLowerCase())
          || title.language?.toLowerCase() === selectedGenre.toLowerCase()));
      return matches.length ? [[`${selectedGenre} ${type === 'movie' ? 'Movies' : 'TV Shows'}`, matches]] : [];
    }

    return page.rows.map(([label, rowGenres]) => {
      const matches = categoryTitles.filter((title) => title.genres?.some((genre) => rowGenres.includes(genre))
        || rowGenres.includes(title.language)
        || (GENRE_ALIASES.Anime && rowGenres.includes('Anime') && GENRE_ALIASES.Anime.includes(title.id)));
      return [label, matches];
    }).filter(([, matches]) => matches.length > 0);
  }, [categoryTitles, page.rows, selectedGenre, type]);

  useEffect(() => {
    if (!isGenreMenuOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setIsGenreMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsGenreMenuOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isGenreMenuOpen]);

  return (
    <main className="browse-category-page page-fade-in" id="main-content">
      <header className="browse-category-heading">
        <h1>{page.title}</h1>
        <div className="browse-category-controls" ref={menuRef}>
          <button
            type="button"
            className={`browse-category-genre-button ${isGenreMenuOpen ? 'is-open' : ''}`}
            aria-expanded={isGenreMenuOpen}
            aria-haspopup="listbox"
            onClick={() => setIsGenreMenuOpen((open) => !open)}
          >
            {selectedGenre || 'Genres'}
            <svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true"><path d="m1 1 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
          </button>
          {isGenreMenuOpen && (
            <div className="browse-category-genre-menu" role="listbox" aria-label={`${page.title} genres`}>
              <button type="button" role="option" aria-selected={!selectedGenre} onClick={() => { setSelectedGenre(''); setIsGenreMenuOpen(false); }}>All genres</button>
              {genres.map((genre) => (
                <button type="button" role="option" aria-selected={selectedGenre === genre} key={genre} onClick={() => { setSelectedGenre(genre); setIsGenreMenuOpen(false); }}>{genre}</button>
              ))}
            </div>
          )}
        </div>
      </header>

      {rows.length ? (
        <div className="browse-category-rows">
          {rows.map(([label, items]) => (
            <section className="browse-title-row" aria-label={label} key={label}>
              <h2>{label}</h2>
              <div className="browse-title-row-track">
                {items.map((title, index) => <Card titleItem={title} index={index} key={title.id} />)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="browse-category-empty">No {selectedGenre} {type === 'movie' ? 'movies' : 'shows'} are in the catalog yet.</p>
      )}
    </main>
  );
}
