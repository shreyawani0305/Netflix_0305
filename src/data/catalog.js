import titles from './titles';
import newPopularTitles from './newPopular';

// Merged map of all catalog titles indexed by id (excluding games)
const catalogMap = new Map();

titles.forEach((item) => {
  catalogMap.set(item.id, item);
});

newPopularTitles.forEach((item) => {
  catalogMap.set(item.id, item);
});

/**
 * Resolve any catalog item by its id.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getTitleById(id) {
  return catalogMap.get(id);
}

export { titles, newPopularTitles };
export default catalogMap;

