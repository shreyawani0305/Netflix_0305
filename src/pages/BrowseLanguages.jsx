import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import { titles } from '../data/titles';

/**
 * Section C: Browse by Languages page (/browse/original-audio).
 * Features:
 * - Active pill on "Browse by Languages"
 * - Header row: "Browse by Languages" (large, about 40px, regular-to-medium weight)
 *   Right: "Select Your Preferences" + 2 dropdowns:
 *   1) Original Language / Dubbing / Subtitles (default "Original Language")
 *   2) Language list (default "English", exact requested order):
 *      Indonesian, Malay, Turkish, English, Japanese, Spanish, French, Hindi, Korean,
 *      German, Mandarin, Italian, Portuguese, Cantonese, Dutch, Filipino, Polish,
 *      Swedish, Arabic, Tamil, Danish, Thai, Telugu, Malayalam, Flemish
 * - ~150px of space between header and grid
 * - Grid of 16:9 cards (TMDB images): 5 desktop, 3 tablet, 2 mobile.
 *   8px horizontal gap, 80px vertical gap, 12px rounded corners.
 * - Filter logic:
 *   "Original Language": item.language === lang
 *   "Dubbing": item.dubbing.includes(lang)
 *   "Subtitles": item.subtitles.includes(lang)
 * - Empty state message if nothing matches + aria-live announcement.
 */

const PREFERENCE_OPTIONS = ['Original Language', 'Dubbing', 'Subtitles'];

const LANGUAGE_OPTIONS = [
  'Indonesian',
  'Malay',
  'Turkish',
  'English',
  'Japanese',
  'Spanish',
  'French',
  'Hindi',
  'Korean',
  'German',
  'Mandarin',
  'Italian',
  'Portuguese',
  'Cantonese',
  'Dutch',
  'Filipino',
  'Polish',
  'Swedish',
  'Arabic',
  'Tamil',
  'Danish',
  'Thai',
  'Telugu',
  'Malayalam',
  'Flemish',
];

export default function BrowseLanguages() {
  const [preferenceType, setPreferenceType] = useState('Original Language');
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Filter 50 titles according to preference and language
  const filteredTitles = useMemo(() => {
    return titles.filter((item) => {
      if (preferenceType === 'Original Language') {
        return item.language?.toLowerCase() === selectedLanguage.toLowerCase();
      }
      if (preferenceType === 'Dubbing') {
        return (
          item.dubbing &&
          item.dubbing.some((lang) => lang.toLowerCase() === selectedLanguage.toLowerCase())
        );
      }
      if (preferenceType === 'Subtitles') {
        return (
          item.subtitles &&
          item.subtitles.some((lang) => lang.toLowerCase() === selectedLanguage.toLowerCase())
        );
      }
      return true;
    });
  }, [preferenceType, selectedLanguage]);

  return (
    <main className="netflix-browse-languages-page page-fade-in" id="main-content">
      {/* Header Row: Title & Preferences Dropdowns */}
      <section className="browse-header-section" aria-label="Language selection and filters">
        <div className="browse-header-row">
          <h1 className="browse-page-title-40">Browse by Languages</h1>

          <div className="browse-preferences-wrapper">
            <span className="browse-preferences-label" id="preferences-heading">
              Select Your Preferences
            </span>

            <div
              className="browse-dropdowns-group"
              role="group"
              aria-labelledby="preferences-heading"
            >
              {/* Dropdown 1: Preference Type */}
              <div className="custom-select-container">
                <label htmlFor="preference-type-select" className="sr-only">
                  Preference Type
                </label>
                <select
                  id="preference-type-select"
                  className="netflix-native-select-bordered"
                  value={preferenceType}
                  onChange={(e) => setPreferenceType(e.target.value)}
                  aria-label="Preference Type"
                >
                  {PREFERENCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <span className="select-caret-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </span>
              </div>

              {/* Dropdown 2: Language List */}
              <div className="custom-select-container">
                <label htmlFor="language-select" className="sr-only">
                  Language
                </label>
                <select
                  id="language-select"
                  className="netflix-native-select-bordered"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  aria-label="Language"
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <span className="select-caret-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Screen Reader Live Region */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {filteredTitles.length === 0
            ? `No titles found for ${selectedLanguage} in ${preferenceType}.`
            : `Showing ${filteredTitles.length} titles in ${selectedLanguage} for ${preferenceType}.`}
        </div>
      </section>

      {/* Grid of Landscape 16:9 Cards (about 150px space below header) */}
      <section className="browse-cards-container-150" aria-label="Browse results">
        {filteredTitles.length > 0 ? (
          <div
            className="browse-cards-grid-80"
            role="region"
            aria-label={`${selectedLanguage} titles grid`}
          >
            {filteredTitles.map((titleItem, index) => (
              <div key={titleItem.id} className="browse-grid-item">
                <Card titleItem={titleItem} index={index} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State Message */
          <div className="browse-empty-state" role="status">
            <div className="empty-state-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <h2 className="empty-state-heading">No titles found</h2>
            <p className="empty-state-text">
              We couldn't find any titles with <strong>{selectedLanguage}</strong> {preferenceType.toLowerCase()}.
            </p>
            <button
              type="button"
              className="empty-state-reset-btn"
              onClick={() => {
                setPreferenceType('Original Language');
                setSelectedLanguage('English');
              }}
            >
              Reset to English (Original Language)
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
