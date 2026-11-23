/**
 * TMDB API client with in-memory & localStorage caching
 * and max 8 concurrent requests queue.
 */

const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE_780 = 'https://image.tmdb.org/t/p/w780';
const IMAGE_BASE_500 = 'https://image.tmdb.org/t/p/w500';
const IMAGE_BASE_ORIGINAL = 'https://image.tmdb.org/t/p/original';
const WIKIMEDIA_SUMMARY_BASE = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

const STORAGE_CACHE_KEY = 'streambox-tmdb-cache';

// Load cache from localStorage
function loadCache() {
  try {
    const raw = localStorage.getItem(STORAGE_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
}

function saveCache(cache) {
  try {
    localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(cache));
  } catch (err) {
    // quota exceeded or private mode, ignore safely
  }
}

const memoryCache = loadCache();
const publicImageCache = new Map();
const publicImageRequests = new Map();

async function fetchPublicThumbnail({ title, searchQuery, year }) {
  const query = (searchQuery || title || '').trim();
  const cacheKey = `${query.toLowerCase()}:${year || ''}`;
  if (publicImageCache.has(cacheKey)) return publicImageCache.get(cacheKey);
  if (publicImageRequests.has(cacheKey)) return publicImageRequests.get(cacheKey);

  const pageName = encodeURIComponent(query.replace(/\s+/g, '_'));
  const request = fetch(`${WIKIMEDIA_SUMMARY_BASE}${pageName}`)
    .then((response) => response.ok ? response.json() : null)
    .then(async (page) => {
      if (page?.type !== 'disambiguation' && page?.thumbnail?.source) return page.thumbnail.source;

      const searchUrl = new URL('https://en.wikipedia.org/w/api.php');
      searchUrl.search = new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrsearch: query,
        gsrlimit: '1',
        prop: 'pageimages',
        piprop: 'thumbnail',
        pithumbsize: '780',
        format: 'json',
        origin: '*',
      });
      const searchResponse = await fetch(searchUrl);
      if (!searchResponse.ok) return null;
      const searchData = await searchResponse.json();
      return Object.values(searchData.query?.pages || {})[0]?.thumbnail?.source || null;
    })
    .catch(() => null)
    .then((imageUrl) => {
      publicImageCache.set(cacheKey, imageUrl);
      publicImageRequests.delete(cacheKey);
      return imageUrl;
    });

  publicImageRequests.set(cacheKey, request);
  return request;
}

async function addPublicImageFallback(result, params) {
  if (result?.backdropUrl || result?.posterUrl) return result;
  const imageUrl = await fetchPublicThumbnail(params);
  return imageUrl ? { ...result, backdropUrl: imageUrl, heroBackdropUrl: imageUrl, posterUrl: imageUrl } : result;
}

// Max 8 concurrent requests queue
class ConcurrencyQueue {
  constructor(maxConcurrent = 8) {
    this.maxConcurrent = maxConcurrent;
    this.current = 0;
    this.queue = [];
  }

  add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }

  process() {
    if (this.current >= this.maxConcurrent || this.queue.length === 0) return;

    const { fn, resolve, reject } = this.queue.shift();
    this.current++;

    fn()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.current--;
        this.process();
      });
  }
}

const tmdbQueue = new ConcurrencyQueue(8);

/**
 * Fetch TMDB metadata for a title.
 * @param {object} param
 * @param {string} param.title
 * @param {string} [param.searchQuery]
 * @param {string} [param.tmdbType='movie'] 'movie' | 'tv'
 * @param {number} [param.year]
 * @returns {Promise<{
 *   backdropUrl: string|null,
 *   heroBackdropUrl: string|null,
 *   posterUrl: string|null,
 *   tmdbId: number|null,
 *   overview: string|null
 * }>}
 */
export async function fetchTmdbDetails({ title, searchQuery, tmdbType = 'movie', year }) {
  const query = (searchQuery || title || '').trim();
  const type = tmdbType === 'tv' ? 'tv' : 'movie';
  const cacheKey = `${type}:${query.toLowerCase()}`;

  if (memoryCache[cacheKey]) {
    return addPublicImageFallback(memoryCache[cacheKey], { title, searchQuery, year });
  }

  const apiKey = import.meta.env.VITE_TMDB_KEY;
  if (!apiKey) {
    const emptyResult = {
      backdropUrl: null,
      heroBackdropUrl: null,
      posterUrl: null,
      tmdbId: null,
      overview: null,
    };
    return addPublicImageFallback(emptyResult, { title, searchQuery, year });
  }

  return tmdbQueue.add(async () => {
    try {
      let url = `${TMDB_BASE}/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false`;
      if (year) {
        url += type === 'movie' ? `&year=${year}` : `&first_air_date_year=${year}`;
      }

      let res = await fetch(url);
      if (!res.ok) {
        // Retry without year if failed or empty
        if (year) {
          url = `${TMDB_BASE}/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false`;
          res = await fetch(url);
        }
      }

      if (!res.ok) {
        throw new Error(`TMDB error ${res.status}`);
      }

      const data = await res.json();
      let first = data.results && data.results[0];

      // If no result and had year, try broader search without year
      if (!first && year) {
        const broadUrl = `${TMDB_BASE}/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false`;
        const broadRes = await fetch(broadUrl);
        if (broadRes.ok) {
          const broadData = await broadRes.json();
          first = broadData.results && broadData.results[0];
        }
      }

      if (!first) {
        const emptyResult = {
          backdropUrl: null,
          heroBackdropUrl: null,
          posterUrl: null,
          tmdbId: null,
          overview: null,
        };
        const resultWithImage = await addPublicImageFallback(emptyResult, { title, searchQuery, year });
        memoryCache[cacheKey] = resultWithImage;
        saveCache(memoryCache);
        return resultWithImage;
      }

      const result = {
        backdropUrl: first.backdrop_path ? `${IMAGE_BASE_780}${first.backdrop_path}` : null,
        heroBackdropUrl: first.backdrop_path ? `${IMAGE_BASE_ORIGINAL}${first.backdrop_path}` : null,
        posterUrl: first.poster_path ? `${IMAGE_BASE_500}${first.poster_path}` : null,
        tmdbId: first.id,
        overview: first.overview || null,
      };

      const resultWithImage = await addPublicImageFallback(result, { title, searchQuery, year });
      memoryCache[cacheKey] = resultWithImage;
      saveCache(memoryCache);
      return resultWithImage;
    } catch (err) {
      console.warn(`TMDB lookup failed for "${title}":`, err.message);
      const emptyResult = {
        backdropUrl: null,
        heroBackdropUrl: null,
        posterUrl: null,
        tmdbId: null,
        overview: null,
      };
      return addPublicImageFallback(emptyResult, { title, searchQuery, year });
    }
  });
}

/** Fetch a public Wikipedia thumbnail, used for Netflix Games which aren't on TMDB. */
export { fetchPublicThumbnail };

/**
 * Fetch YouTube trailer for a given TMDB ID.
 * @param {number} tmdbId
 * @param {'movie'|'tv'} tmdbType
 * @returns {Promise<string|null>} YouTube video key
 */
export async function fetchTmdbTrailer(tmdbId, tmdbType = 'movie') {
  if (!tmdbId) return null;
  const apiKey = import.meta.env.VITE_TMDB_KEY;
  if (!apiKey) return null;

  const type = tmdbType === 'tv' ? 'tv' : 'movie';
  const cacheKey = `trailer:${type}:${tmdbId}`;

  if (memoryCache[cacheKey]) {
    return memoryCache[cacheKey];
  }

  return tmdbQueue.add(async () => {
    try {
      const url = `${TMDB_BASE}/${type}/${tmdbId}/videos?api_key=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) return null;

      const data = await res.json();
      const videos = data.results || [];
      // Pick first YouTube "Trailer"
      const trailer = videos.find(
        (v) => v.site === 'YouTube' && v.type === 'Trailer'
      ) || videos.find(
        (v) => v.site === 'YouTube' && (v.type === 'Teaser' || v.type === 'Clip')
      );

      const key = trailer ? trailer.key : null;
      memoryCache[cacheKey] = key;
      saveCache(memoryCache);
      return key;
    } catch (err) {
      return null;
    }
  });
}

