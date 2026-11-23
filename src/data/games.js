/**
 * Netflix Games Catalog (Section D)
 * Separate from the 50 titles.
 * Fields: id, title, color1, color2, tag (optional: "Leaving Soon"), image
 */

export const gamesData = {
  heroGame: {
    id: 'red-dead-redemption',
    title: 'Red Dead Redemption',
    color1: '#8b0000',
    color2: '#2b0000',
    description: 'Experience the epic Western adventures that defined a generation. When federal agents threaten his family, former outlaw John Marston is forced to hunt down the gang of criminals he once called friends.',
    tag: null,
  },
  rows: [
    {
      id: 'popular-mobile-games',
      title: 'Popular mobile games for you',
      items: [
        { id: 'red-dead-redemption', title: 'Red Dead Redemption', color1: '#8b0000', color2: '#2b0000' },
        { id: 'wwe-2k25', title: 'WWE 2K25: Netflix Edition', color1: '#b81d24', color2: '#0b1222' },
        { id: 'netflix-puzzled', title: 'Netflix Puzzled', color1: '#e50914', color2: '#5b1847' },
        { id: 'farming-simulator-23', title: 'Farming Simulator 23', color1: '#2e7d32', color2: '#0d3810', tag: 'Leaving Soon' },
        { id: 'football-manager-26', title: 'Football Manager 26 Mobile', color1: '#0071eb', color2: '#0a2540' },
        { id: 'world-of-peppa-pig', title: 'World of Peppa Pig', color1: '#ff4081', color2: '#7928ca' },
        { id: 'netflix-playground', title: 'Netflix Playground', color1: '#f5c518', color2: '#e50914' },
        { id: 'into-the-dead-unleashed', title: 'Into the Dead: Unleashed', color1: '#37474f', color2: '#10171a' },
      ],
    },
    {
      id: 'pick-up-and-play',
      title: 'Pick Up and Play Mobile Games',
      items: [
        { id: 'squid-game-unleashed', title: 'Squid Game: Unleashed', color1: '#e50914', color2: '#030303' },
        { id: 'heads-up', title: 'Heads Up!', color1: '#ff9800', color2: '#e65100' },
        { id: 'sonic-prime-dash', title: 'Sonic Prime Dash', color1: '#0055ff', color2: '#001a4d' },
        { id: 'cut-the-rope-daily', title: 'Cut the Rope Daily', color1: '#7cb342', color2: '#33691e' },
        { id: 'word-trails', title: 'Word Trails', color1: '#9c27b0', color2: '#4a148c' },
        { id: 'nailed-it-baking-bash', title: 'Nailed It! Baking Bash', color1: '#ec407a', color2: '#880e4f' },
        { id: 'solitaire', title: 'Solitaire', color1: '#00897b', color2: '#004d40' },
        { id: 'pinball-classic', title: 'Pinball Classic', color1: '#d81b60', color2: '#4a0072' },
      ],
    },
    {
      id: 'award-winning-games',
      title: 'Award-winning games',
      items: [
        { id: 'hades', title: 'Hades', color1: '#c62828', color2: '#212121' },
        { id: 'dead-cells', title: 'Dead Cells', color1: '#6a1b9a', color2: '#1a0033' },
        { id: 'oxenfree', title: 'Oxenfree', color1: '#00838f', color2: '#00363a' },
        { id: 'monument-valley', title: 'Monument Valley', color1: '#ad1457', color2: '#283593' },
        { id: 'spiritfarer', title: 'Spiritfarer', color1: '#ef6c00', color2: '#4e342e' },
      ],
    },
  ],
};

export default gamesData;

