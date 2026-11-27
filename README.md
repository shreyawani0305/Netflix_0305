# Netflix Web UI Clone — Advanced Class Project

A high-fidelity lookalike of the modern Netflix web user interface built with **React + Vite (JavaScript)**, **React Router**, and **plain CSS with CSS variables**.

Includes dynamic catalog generation, TMDB image integration, YouTube trailer modal playback, interactive fullscreen video player, local storage persistence for Continue Watching / My List / Likes / Trailers, and dedicated pages for **Home**, **Browse by Languages**, **Games**, **My Netflix**, and **New & Popular**.

## Interactive Walkthrough

The app opens on an interactive product tutorial at `/`. Select **Start walkthrough** for concise guidance beside the live prototype. A subtle pointer highlights each real control; adjust all Mood DJ sliders, choose a Surprise Me style, and try a genre collision to advance through the existing features.

The original Netflix-style home screen remains available at `/home` (and from the Home navigation tab). Tutorial guidance is only enabled in its embedded walkthrough routes.

---

## 🔑 How to Get a TMDB API Key & Setup `.env`

1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/) and create a free account.
2. Navigate to **Settings > API** ([https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)).
3. Request an API Key (Developer / Personal use).
4. In the root of the project, create or edit the `.env` file:
   ```env
   VITE_TMDB_KEY=your_tmdb_api_key_here
   ```
5. Restart or start the dev server (`npm run dev`). The app will automatically fetch official high-resolution backdrops, posters, overviews, and YouTube trailers for all catalog titles!
> **Note:** If `VITE_TMDB_KEY` is omitted, the app gracefully falls back to high-contrast cinematic typography on custom colored gradients with shimmer skeleton loading. Nothing breaks.

---

## 🎮 How to Add Game Images

- Game images are loaded from the `public/games/` directory based on the game's ID (e.g. `red-dead-redemption.jpg`, `hades.jpg`, `squid-game-unleashed.jpg`).
- If an image file exists in `public/games/{id}.jpg`, it will be displayed automatically on the 1:1 square tile.
- If an image is not present or fails to load, the tile renders a colorful gradient with the game's bold monogram initials.

---

## 💾 How My List, Continue Watching, Likes, & Trailers Work

- All user interactions are synchronized into a single unified `localStorage` key: `"streambox-user"`.
- **Data Shape**:
  ```json
  {
    "myList": ["title-id-1", "title-id-2"],
    "liked": ["title-id-3"],
    "progress": {
      "bird-box": 35,
      "the-haunting-of-hill-house": 62
    },
    "trailers": ["title-id-1"]
  }
  ```
- **Seeded Demo State**:
  - On first visit, progress is pre-seeded for *"Bird Box"* (35%) and *"The Haunting of Hill House"* (62%) so Continue Watching showcases live progress bars immediately.
- **Continue Watching Threshold**:
  - A title appears in **Continue Watching** whenever its progress is **> 0% and < 95%**.
  - Reaching **95% or higher** marks the title as finished and automatically removes it from Continue Watching.
- **Cross-Page Synchronization**:
  - Adding or removing a title to **My List** or **Likes** from any card action bar (on Home, Browse by Languages, New & Popular, or My Netflix) updates immediately across the whole app.
  - Clicking **Play** on any card opens the fullscreen mock video player; seeking and closing records the updated position to the title.
- **Reset Button**:
  - At the bottom of the **My Netflix** page (`/browse/my-list`), clicking *"Reset my data"* restores the initial seeded demo state.

---

## 🚀 Running the Project Locally

```bash
# 1. Install dependencies
npm install

# 2. Run Vite development server
npm run dev

# 3. Open in browser
http://localhost:5173/

# 4. Production build & preview
npm run build
npm run preview
```

---

## 📱 Pages Overview

### 1. Home (`/home`)
- Inset spotlight Hero featuring **Maharaja** with TMDB backdrop, synopsis, meta line, and Play/More Info buttons wired directly to the fullscreen player and trailer modal.
- Dynamically generated rows in order:
  - *Continue Watching* (with red-and-gray 4px progress bars)
  - *My List* (live synchronized)
  - *Today's Top Picks for You* (10 mixed titles with TOP 10 badges)
  - *Trending Now*
  - Category rows: *Movies*, *TV Shows*, *Anime*, *Documentaries*, *Kids & Family*, *Stand-up Comedy*, *Reality TV*
  - Genre rows (≥ 3 titles): *Action & Adventure*, *Crime*, *Sci-Fi & Fantasy*, *Horror & Thriller*, *Comedy*, *Romance*, *Drama*, *History & War*, *Mystery*, *Sports*, *Animation*.

### 2. Browse by Languages (`/browse/original-audio`)
- Solid black fixed navbar with active `"Browse by Languages"` pill tab.
- Page title (`~40px`, medium weight) alongside `"Select Your Preferences"` with two dropdowns:
  1. *Preference Type*: Original Language, Dubbing, Subtitles.
  2. *Language List*: 25 languages in order (English default).
- 150px spacing between header and grid, 80px row gap, 5-column landscape cards (3 tablet, 2 mobile).
- Client-side filtering logic with accessible `aria-live` count announcements and empty state handling.

### 3. Games (`/games`)
- Solid black navbar with active `"Games"` pill tab.
- Hero spotlight card for **Red Dead Redemption** on a dark radial gradient with Get Game and More Info actions.
- 1:1 square tiles with 20px rounded corners, 12px gap, Leaving Soon red tags, and bold titles displayed below each tile.

### 4. My Netflix (`/browse/my-list`)
- Solid black navbar with active `"My Netflix"` pill tab.
- 120px top padding, 32px bold section headers with 40px spacing.
- 4 Sections:
  1. *Continue Watching*: 4px progress bar under cards; clicking resumes playback from stored position.
  2. *My List*: Newest first; checkmark button removes title live.
  3. *Trailers You Have Watched*: Tracks trailers watched via Info Modal.
  4. *Shows & Movies You have Liked*: Displays cards if any are liked, otherwise shows the 220px `#2a2a2a` panel with the red-to-orange gradient thumbs-up icon.
- *"Reset my data"* button at the bottom.

### 5. New & Popular (`/latest`)
- Solid black navbar with active `"New & Popular"` pill tab.
- 150px top padding with decorative page indicator dashes on row headers.
- 6 Rows in order:
  1. *New on Netflix* (TOP 10 badge on all)
  2. *Coming This Week*
  3. *Top 10 Shows in India Today* (Ranked 1 to 7 with 220px outlined Bebas Neue numbers and 2:3 portrait posters)
  4. *Top 10 Movies in India Today* (Ranked 1 to 7)
  5. *Coming Next Week*
  6. *Worth the Wait* (Live date chip `"Live | 26/11"`)

---

## ♿ Accessibility & Quality

- Semantic HTML5 landmarks (`<nav>`, `<header>`, `<main>`, `<section>`, `<footer>`).
- Screen reader announcements (`aria-live="polite"`), `aria-pressed`, `aria-valuenow`, and `role="progressbar"`.
- Keyboard navigation (Space for play/pause, Esc to close modals and players, focus traps).
- High contrast `:focus-visible` indicators and 44px minimum tap targets.
- Responsive breakpoints tested at 480px, 768px, 1024px, and 1200px+.
- `prefers-reduced-motion` compliance.
- TMDB API attribution and copyright line in Footer.
