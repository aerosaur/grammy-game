export type Category = {
  id: string
  name: string
  emoji: string
  nominees: Nominee[]
}

export type Nominee = {
  id: string
  artist: string
  work?: string
}

export const categories: Category[] = [
  // === GENERAL FIELD ===
  {
    id: 'record-of-the-year',
    name: 'Record of the Year',
    emoji: '🎤',
    nominees: [
      { id: 'badbunny-dtmf', artist: 'Bad Bunny', work: 'DtMF' },
      { id: 'sabrina-manchild', artist: 'Sabrina Carpenter', work: 'Manchild' },
      { id: 'doechii-anxiety', artist: 'Doechii', work: 'Anxiety' },
      { id: 'billie-wildflower', artist: 'Billie Eilish', work: 'Wildflower' },
      { id: 'gaga-abracadabra', artist: 'Lady Gaga', work: 'Abracadabra' },
      { id: 'kendrick-luther', artist: 'Kendrick Lamar with SZA', work: 'Luther' },
      { id: 'chappell-subway', artist: 'Chappell Roan', work: 'The Subway' },
      { id: 'rose-apt', artist: 'Rosé & Bruno Mars', work: 'APT.' },
    ],
  },
  {
    id: 'album-of-the-year',
    name: 'Album of the Year',
    emoji: '💿',
    nominees: [
      { id: 'badbunny-debi', artist: 'Bad Bunny', work: 'DeBÍ TiRAR MáS FOToS' },
      { id: 'bieber-swag', artist: 'Justin Bieber', work: 'Swag' },
      { id: 'sabrina-mans', artist: 'Sabrina Carpenter', work: "Man's Best Friend" },
      { id: 'clipse-god', artist: 'Clipse', work: 'Let God Sort Em Out' },
      { id: 'gaga-mayhem', artist: 'Lady Gaga', work: 'Mayhem' },
      { id: 'kendrick-gnx', artist: 'Kendrick Lamar', work: 'GNX' },
      { id: 'leon-mutt', artist: 'Leon Thomas', work: 'Mutt' },
      { id: 'tyler-chromakopia', artist: 'Tyler, the Creator', work: 'Chromakopia' },
    ],
  },
  {
    id: 'song-of-the-year',
    name: 'Song of the Year',
    emoji: '✍️',
    nominees: [
      { id: 'gaga-abracadabra-song', artist: 'Lady Gaga', work: 'Abracadabra' },
      { id: 'doechii-anxiety-song', artist: 'Doechii', work: 'Anxiety' },
      { id: 'rose-apt-song', artist: 'Rosé & Bruno Mars', work: 'APT.' },
      { id: 'badbunny-dtmf-song', artist: 'Bad Bunny', work: 'DtMF' },
      { id: 'huntrx-golden', artist: 'HUNTR/X', work: 'Golden' },
      { id: 'kendrick-luther-song', artist: 'Kendrick Lamar with SZA', work: 'Luther' },
      { id: 'sabrina-manchild-song', artist: 'Sabrina Carpenter', work: 'Manchild' },
      { id: 'billie-wildflower-song', artist: 'Billie Eilish', work: 'Wildflower' },
    ],
  },
  {
    id: 'best-new-artist',
    name: 'Best New Artist',
    emoji: '⭐',
    nominees: [
      { id: 'olivia-dean', artist: 'Olivia Dean' },
      { id: 'katseye', artist: 'KATSEYE' },
      { id: 'the-marias', artist: 'The Marías' },
      { id: 'addison-rae', artist: 'Addison Rae' },
      { id: 'sombr', artist: 'sombr' },
      { id: 'leon-thomas-new', artist: 'Leon Thomas' },
      { id: 'alex-warren', artist: 'Alex Warren' },
      { id: 'lola-young', artist: 'Lola Young' },
    ],
  },

  // === POP ===
  {
    id: 'best-pop-solo',
    name: 'Best Pop Solo Performance',
    emoji: '🎵',
    nominees: [
      { id: 'bieber-daisies', artist: 'Justin Bieber', work: 'Daisies' },
      { id: 'sabrina-manchild-pop', artist: 'Sabrina Carpenter', work: 'Manchild' },
      { id: 'gaga-disease', artist: 'Lady Gaga', work: 'Disease' },
      { id: 'chappell-subway-pop', artist: 'Chappell Roan', work: 'The Subway' },
      { id: 'lola-messy', artist: 'Lola Young', work: 'Messy' },
    ],
  },
  {
    id: 'best-pop-duo',
    name: 'Best Pop Duo/Group Performance',
    emoji: '👯',
    nominees: [
      { id: 'wicked-defying', artist: 'Cynthia Erivo & Ariana Grande', work: 'Defying Gravity' },
      { id: 'huntrx-golden-pop', artist: 'HUNTR/X', work: 'Golden' },
      { id: 'katseye-gabriela', artist: 'KATSEYE', work: 'Gabriela' },
      { id: 'rose-apt-pop', artist: 'Rosé & Bruno Mars', work: 'APT.' },
      { id: 'sza-kendrick-30', artist: 'SZA ft. Kendrick Lamar', work: '30 for 30' },
    ],
  },
  {
    id: 'best-pop-vocal-album',
    name: 'Best Pop Vocal Album',
    emoji: '💜',
    nominees: [
      { id: 'bieber-swag-pop', artist: 'Justin Bieber', work: 'Swag' },
      { id: 'sabrina-mans-pop', artist: 'Sabrina Carpenter', work: "Man's Best Friend" },
      { id: 'miley-beautiful', artist: 'Miley Cyrus', work: 'Something Beautiful' },
      { id: 'gaga-mayhem-pop', artist: 'Lady Gaga', work: 'Mayhem' },
      { id: 'teddy-therapy', artist: 'Teddy Swims', work: "I've Tried Everything But Therapy [Part 2]" },
    ],
  },

  // === RAP ===
  {
    id: 'best-rap-performance',
    name: 'Best Rap Performance',
    emoji: '🔥',
    nominees: [
      { id: 'cardi-outside', artist: 'Cardi B', work: 'Outside' },
      { id: 'clipse-chains', artist: 'Clipse ft. Kendrick Lamar & Pharrell', work: 'Chains & Whips' },
      { id: 'doechii-anxiety-rap', artist: 'Doechii', work: 'Anxiety' },
      { id: 'kendrick-tvoff', artist: 'Kendrick Lamar ft. Lefty Gunplay', work: 'tv off' },
      { id: 'tyler-darling', artist: 'Tyler, the Creator ft. Teezo Touchdown', work: 'Darling, I' },
    ],
  },
  {
    id: 'best-rap-album',
    name: 'Best Rap Album',
    emoji: '💿',
    nominees: [
      { id: 'clipse-god-rap', artist: 'Clipse', work: 'Let God Sort Em Out' },
      { id: 'glorilla-glorious', artist: 'GloRilla', work: 'Glorious' },
      { id: 'jid-ugly', artist: 'JID', work: 'God Does Like Ugly' },
      { id: 'kendrick-gnx-rap', artist: 'Kendrick Lamar', work: 'GNX' },
      { id: 'tyler-chromakopia-rap', artist: 'Tyler, the Creator', work: 'Chromakopia' },
    ],
  },

  // === ROCK ===
  {
    id: 'best-rock-album',
    name: 'Best Rock Album',
    emoji: '🤘',
    nominees: [
      { id: 'deftones-private', artist: 'Deftones', work: 'Private Music' },
      { id: 'haim-quit', artist: 'Haim', work: 'I Quit' },
      { id: 'linkin-zero', artist: 'Linkin Park', work: 'From Zero' },
      { id: 'turnstile-enough', artist: 'Turnstile', work: 'Never Enough' },
      { id: 'yungblud-idols', artist: 'Yungblud', work: 'Idols' },
    ],
  },

  // === R&B ===
  {
    id: 'best-rnb-album',
    name: 'Best R&B Album',
    emoji: '🎤',
    nominees: [
      { id: 'giveon-beloved', artist: 'Givéon', work: 'Beloved' },
      { id: 'coco-why', artist: 'Coco Jones', work: 'Why Not More?' },
      { id: 'ledisi-crown', artist: 'Ledisi', work: 'The Crown' },
      { id: 'teyana-escape', artist: 'Teyana Taylor', work: 'Escape Room' },
      { id: 'leon-mutt-rnb', artist: 'Leon Thomas', work: 'Mutt' },
    ],
  },

  // === COUNTRY ===
  {
    id: 'best-country-album',
    name: 'Best Country Album',
    emoji: '🤠',
    nominees: [
      { id: 'kelsea-patterns', artist: 'Kelsea Ballerini', work: 'Patterns' },
      { id: 'tyler-snipe', artist: 'Tyler Childers', work: 'Snipe Hunter' },
      { id: 'eric-evangeline', artist: 'Eric Church', work: 'Evangeline vs. The Machine' },
      { id: 'jelly-broken', artist: 'Jelly Roll', work: 'Beautifully Broken' },
      { id: 'miranda-postcards', artist: 'Miranda Lambert', work: 'Postcards from Texas' },
    ],
  },
]

// Get total number of categories
export const totalCategories = categories.length
