/**
 * New & Popular catalog titles (Section F).
 * Each item has id (prefix "np-"), title, tmdbType ("movie" or "tv"),
 * and optional fields: tag, watchNow, top10, live.
 */

export const newPopularTitles = [
  // 1. "New on Netflix" (all top10: true)
  { id: 'np-bathitha', title: 'Bathitha', tmdbType: 'movie', top10: true },
  { id: 'np-the-paradise', title: 'The Paradise', tmdbType: 'movie', top10: true },
  { id: 'np-mandaadi', title: 'Mandaadi', tmdbType: 'movie', top10: true },
  { id: 'np-dorothy', title: 'Dorothy', tmdbType: 'movie', top10: true },
  { id: 'np-least-eligible-bachelor', title: 'Least Eligible Bachelor', tmdbType: 'movie', top10: true },
  { id: 'np-dhoomakethu', title: 'Dhoomakethu', tmdbType: 'movie', top10: true },
  { id: 'np-gajaana', title: 'Gajaana', tmdbType: 'movie', top10: true },

  // 2. "Coming This Week"
  { id: 'np-kauri-buri', title: 'Kauri Buri: The Cursed Temple', tmdbType: 'movie' },
  { id: 'np-bajirao-mastani', title: 'Bajirao Mastani', tmdbType: 'movie' },
  { id: 'np-dilwali-diwali', title: 'Dilwali Diwali', tmdbType: 'movie' },
  { id: 'np-taken-natalee-holloway', title: 'Taken: Natalee Holloway', tmdbType: 'movie' },
  { id: 'np-a-dogs-perfect-christmas', title: "A Dog's Perfect Christmas", tmdbType: 'movie' },
  { id: 'np-bass-x-machina', title: 'Bass x Machina', tmdbType: 'movie' },
  { id: 'np-ramayana', title: 'Ramayana', tmdbType: 'movie' },

  // 3. "Top 10 Shows in India Today" (Ranked 1 to 7)
  { id: 'np-akka', title: 'Akka', tmdbType: 'tv', rank: 1, tag: 'Recently added' },
  { id: 'np-the-great-indian-kapil', title: 'The Great Indian Kapil', searchQuery: 'The Great Indian Kapil Show', tmdbType: 'tv', rank: 2, tag: 'New Episode', watchNow: true },
  { id: 'np-dead-end-job', title: 'Dead-End Job', tmdbType: 'tv', rank: 3, tag: 'Recently added' },
  { id: 'np-roadies-rebirth', title: 'Roadies: Rebirth', searchQuery: 'MTV Roadies', tmdbType: 'tv', rank: 4, tag: 'New Episode', watchNow: true },
  { id: 'np-dhindora-show', title: 'Dhindora', tmdbType: 'tv', rank: 5, tag: 'Recently added' },
  { id: 'np-lupin-show', title: 'Lupin', tmdbType: 'tv', rank: 6, tag: 'New Episodes' },
  { id: 'np-delhi-crime-show', title: 'Delhi Crime', tmdbType: 'tv', rank: 7 },

  // 4. "Top 10 Movies in India Today" (Ranked 1 to 7)
  { id: 'np-bathitha-ranked', title: 'Bathitha', tmdbType: 'movie', rank: 1, tag: 'Recently added' },
  { id: 'np-the-paradise-ranked', title: 'The Paradise', tmdbType: 'movie', rank: 2, tag: 'Recently added' },
  { id: 'np-gajaana-ranked', title: 'Gajaana', tmdbType: 'movie', rank: 3, tag: 'Recently added' },
  { id: 'np-sigma-ranked', title: 'Sigma', tmdbType: 'movie', rank: 4, tag: 'Recently added' },
  { id: 'np-avaraachan-sons-ranked', title: 'Avaraachan Sons', tmdbType: 'movie', rank: 5, tag: 'Recently added' },
  { id: 'np-dorothy-ranked', title: 'Dorothy', tmdbType: 'movie', rank: 6, tag: 'Recently added' },
  { id: 'np-mandaadi-ranked', title: 'Mandaadi', tmdbType: 'movie', rank: 7, tag: 'Recently added' },

  // 5. "Coming Next Week"
  { id: 'np-the-body', title: 'The Body', tmdbType: 'movie' },
  { id: 'np-kijsada-paradise', title: 'Kijsada Paradise', tmdbType: 'movie' },
  { id: 'np-cunk-on-cinema', title: 'Cunk on Cinema', tmdbType: 'movie' },
  { id: 'np-alien', title: 'Alien', tmdbType: 'movie' },
  { id: 'np-alans-universe', title: "Alan's Universe", tmdbType: 'tv' },
  { id: 'np-doozies-doghouse', title: "Doozie's Doghouse", tmdbType: 'tv' },
  { id: 'np-sirens', title: 'Sirens', tmdbType: 'tv' },

  // 6. "Worth the Wait"
  { id: 'np-from', title: 'From', tmdbType: 'tv' },
  { id: 'np-gameday-thanksgiving', title: 'Netflix Gameday: Thanksgiving Eve', tmdbType: 'tv', live: '26/11' },
  { id: 'np-chiranjeevi-megaverse', title: "Chiranjeevi's Megaverse", tmdbType: 'movie' },
  { id: 'np-urban-legends-bloody-mary', title: 'Urban Legends: Bloody Mary', tmdbType: 'movie' },
  { id: 'np-dhindora-wait', title: 'Dhindora', tmdbType: 'tv' },
  { id: 'np-chasing-shadows', title: 'Chasing Shadows', tmdbType: 'tv' },
  { id: 'np-pride-and-prejudice', title: 'Pride and Prejudice', tmdbType: 'movie' },
];

export default newPopularTitles;

