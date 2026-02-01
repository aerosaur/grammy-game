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
      { id: 'kendrick-luther', artist: 'Kendrick Lamar & SZA', work: 'Luther' },
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
      { id: 'huntrx-golden', artist: 'Huntr/x', work: 'Golden' },
      { id: 'kendrick-luther-song', artist: 'Kendrick Lamar & SZA', work: 'Luther' },
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
      { id: 'katseye', artist: 'Katseye' },
      { id: 'the-marias', artist: 'The Marías' },
      { id: 'addison-rae', artist: 'Addison Rae' },
      { id: 'sombr', artist: 'Sombr' },
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
      { id: 'beyonce-bodyguard', artist: 'Beyoncé', work: 'Bodyguard' },
      { id: 'sabrina-espresso', artist: 'Sabrina Carpenter', work: 'Espresso' },
      { id: 'charli-360', artist: 'Charli XCX', work: '360' },
      { id: 'billie-birds', artist: 'Billie Eilish', work: 'Birds of a Feather' },
      { id: 'chappell-good', artist: 'Chappell Roan', work: 'Good Luck, Babe!' },
    ],
  },
  {
    id: 'best-pop-duo',
    name: 'Best Pop Duo/Group Performance',
    emoji: '👯',
    nominees: [
      { id: 'beyonce-levii', artist: 'Beyoncé & Post Malone', work: "Levii's Jeans" },
      { id: 'charli-lorde', artist: 'Charli XCX & Lorde', work: 'Girl, So Confusing' },
      { id: 'gracie-sabrina', artist: 'Gracie Abrams & Taylor Swift', work: 'Us.' },
      { id: 'gaga-bruno', artist: 'Lady Gaga & Bruno Mars', work: 'Die With A Smile' },
      { id: 'rose-bruno', artist: 'Rosé & Bruno Mars', work: 'APT.' },
    ],
  },
  {
    id: 'best-pop-vocal-album',
    name: 'Best Pop Vocal Album',
    emoji: '💜',
    nominees: [
      { id: 'sabrina-short', artist: 'Sabrina Carpenter', work: 'Short n\' Sweet' },
      { id: 'charli-brat', artist: 'Charli XCX', work: 'Brat' },
      { id: 'billie-hit', artist: 'Billie Eilish', work: 'Hit Me Hard and Soft' },
      { id: 'ariana-eternal', artist: 'Ariana Grande', work: 'Eternal Sunshine' },
      { id: 'chappell-rise', artist: 'Chappell Roan', work: 'The Rise and Fall of a Midwest Princess' },
      { id: 'gaga-mayhem-pop', artist: 'Lady Gaga', work: 'Mayhem' },
    ],
  },

  // === ROCK ===
  {
    id: 'best-rock-performance',
    name: 'Best Rock Performance',
    emoji: '🎸',
    nominees: [
      { id: 'beatles-now', artist: 'The Beatles', work: 'Now and Then' },
      { id: 'black-keys', artist: 'The Black Keys', work: 'Beautiful People' },
      { id: 'green-day', artist: 'Green Day', work: 'Dilemma' },
      { id: 'idles', artist: 'Idles', work: 'Gift Horse' },
      { id: 'pearl-jam', artist: 'Pearl Jam', work: 'Dark Matter' },
      { id: 'st-vincent', artist: 'St. Vincent', work: 'Broken Man' },
    ],
  },
  {
    id: 'best-rock-song',
    name: 'Best Rock Song',
    emoji: '🎶',
    nominees: [
      { id: 'beatles-now-song', artist: 'The Beatles', work: 'Now and Then' },
      { id: 'black-keys-song', artist: 'The Black Keys', work: 'Beautiful People' },
      { id: 'green-day-song', artist: 'Green Day', work: 'Dilemma' },
      { id: 'pearl-jam-song', artist: 'Pearl Jam', work: 'Dark Matter' },
      { id: 'st-vincent-song', artist: 'St. Vincent', work: 'Broken Man' },
    ],
  },
  {
    id: 'best-rock-album',
    name: 'Best Rock Album',
    emoji: '🤘',
    nominees: [
      { id: 'black-keys-album', artist: 'The Black Keys', work: 'Ohio Players' },
      { id: 'fontaines', artist: 'Fontaines D.C.', work: 'Romance' },
      { id: 'green-day-album', artist: 'Green Day', work: 'Saviors' },
      { id: 'idles-album', artist: 'Idles', work: 'Tangk' },
      { id: 'pearl-jam-album', artist: 'Pearl Jam', work: 'Dark Matter' },
      { id: 'st-vincent-album', artist: 'St. Vincent', work: 'All Born Screaming' },
    ],
  },

  // === R&B ===
  {
    id: 'best-rnb-performance',
    name: 'Best R&B Performance',
    emoji: '🎙️',
    nominees: [
      { id: 'jhene-guidance', artist: 'Jhené Aiko', work: 'Guidance' },
      { id: 'coco-angel', artist: 'Coco Jones', work: 'Here We Go' },
      { id: 'kehlani-after', artist: 'Kehlani', work: 'After Hours' },
      { id: 'sza-saturn', artist: 'SZA', work: 'Saturn' },
      { id: 'tyla-water', artist: 'Tyla', work: 'Water' },
    ],
  },
  {
    id: 'best-rnb-song',
    name: 'Best R&B Song',
    emoji: '💫',
    nominees: [
      { id: 'jhene-guidance-song', artist: 'Jhené Aiko', work: 'Guidance' },
      { id: 'coco-angel-song', artist: 'Coco Jones', work: 'Here We Go' },
      { id: 'kehlani-after-song', artist: 'Kehlani', work: 'After Hours' },
      { id: 'sza-saturn-song', artist: 'SZA', work: 'Saturn' },
      { id: 'tyla-water-song', artist: 'Tyla', work: 'Water' },
    ],
  },
  {
    id: 'best-rnb-album',
    name: 'Best R&B Album',
    emoji: '🎤',
    nominees: [
      { id: 'chris-brown-album', artist: 'Chris Brown', work: '11:11' },
      { id: 'kehlani-album', artist: 'Kehlani', work: 'Crash' },
      { id: 'lucky-daye', artist: 'Lucky Daye', work: 'Algorithm' },
      { id: 'muni-long', artist: 'Muni Long', work: 'Revenge' },
      { id: 'usher-album', artist: 'Usher', work: 'Coming Home' },
    ],
  },

  // === RAP ===
  {
    id: 'best-rap-performance',
    name: 'Best Rap Performance',
    emoji: '🔥',
    nominees: [
      { id: 'cardi-enough', artist: 'Cardi B', work: 'Enough (Miami)' },
      { id: 'common-when', artist: 'Common & Pete Rock', work: 'When the Sun Shines Again' },
      { id: 'doechii-nissan', artist: 'Doechii', work: 'Nissan Altima' },
      { id: 'eminem-houdini', artist: 'Eminem', work: 'Houdini' },
      { id: 'future-like', artist: 'Future, Metro Boomin & Kendrick Lamar', work: 'Like That' },
      { id: 'glorilla-yeah', artist: 'GloRilla', work: 'Yeah Glo!' },
      { id: 'kendrick-not', artist: 'Kendrick Lamar', work: 'Not Like Us' },
    ],
  },
  {
    id: 'best-rap-song',
    name: 'Best Rap Song',
    emoji: '📝',
    nominees: [
      { id: 'future-like-song', artist: 'Future, Metro Boomin & Kendrick Lamar', work: 'Like That' },
      { id: 'glorilla-yeah-song', artist: 'GloRilla', work: 'Yeah Glo!' },
      { id: 'kendrick-not-song', artist: 'Kendrick Lamar', work: 'Not Like Us' },
      { id: 'kendrick-luther-rap', artist: 'Kendrick Lamar & SZA', work: 'Luther' },
      { id: 'sexxy-pound', artist: 'Sexxy Red', work: 'Pound Town' },
    ],
  },
  {
    id: 'best-rap-album',
    name: 'Best Rap Album',
    emoji: '💿',
    nominees: [
      { id: 'common-album', artist: 'Common & Pete Rock', work: 'The Auditorium Vol. 1' },
      { id: 'doechii-album', artist: 'Doechii', work: 'Alligator Bites Never Heal' },
      { id: 'eminem-album', artist: 'Eminem', work: 'The Death of Slim Shady' },
      { id: 'future-album', artist: 'Future & Metro Boomin', work: 'We Don\'t Trust You' },
      { id: 'kendrick-gnx-rap', artist: 'Kendrick Lamar', work: 'GNX' },
    ],
  },

  // === COUNTRY ===
  {
    id: 'best-country-solo',
    name: 'Best Country Solo Performance',
    emoji: '🤠',
    nominees: [
      { id: 'beyonce-texas', artist: 'Beyoncé', work: 'Texas Hold \'Em' },
      { id: 'chris-burn', artist: 'Chris Stapleton', work: 'It Takes a Woman' },
      { id: 'jelly-need', artist: 'Jelly Roll', work: 'I Am Not Okay' },
      { id: 'kacey-deeper', artist: 'Kacey Musgraves', work: 'Deeper Well' },
      { id: 'shaboozey-bar', artist: 'Shaboozey', work: 'A Bar Song (Tipsy)' },
    ],
  },
  {
    id: 'best-country-duo',
    name: 'Best Country Duo/Group Performance',
    emoji: '🎻',
    nominees: [
      { id: 'brothers-osborne', artist: 'Brothers Osborne', work: 'Break Mine' },
      { id: 'dan-shay', artist: 'Dan + Shay', work: 'Bigger Houses' },
      { id: 'kacey-willie', artist: 'Kacey Musgraves & Willie Nelson', work: 'Vamonos' },
      { id: 'lainey-wilson', artist: 'Lainey Wilson & HARDY', work: 'Wait in the Truck' },
      { id: 'post-morgan', artist: 'Post Malone & Morgan Wallen', work: 'I Had Some Help' },
    ],
  },
  {
    id: 'best-country-song',
    name: 'Best Country Song',
    emoji: '🪕',
    nominees: [
      { id: 'shaboozey-bar-song', artist: 'Shaboozey', work: 'A Bar Song (Tipsy)' },
      { id: 'beyonce-texas-song', artist: 'Beyoncé', work: 'Texas Hold \'Em' },
      { id: 'kacey-deeper-song', artist: 'Kacey Musgraves', work: 'Deeper Well' },
      { id: 'post-morgan-song', artist: 'Post Malone & Morgan Wallen', work: 'I Had Some Help' },
      { id: 'stapleton-white', artist: 'Chris Stapleton', work: 'White Horse' },
    ],
  },
  {
    id: 'best-country-album',
    name: 'Best Country Album',
    emoji: '🏜️',
    nominees: [
      { id: 'beyonce-cowboy', artist: 'Beyoncé', work: 'Cowboy Carter' },
      { id: 'chris-stapleton-album', artist: 'Chris Stapleton', work: 'Higher' },
      { id: 'kacey-album', artist: 'Kacey Musgraves', work: 'Deeper Well' },
      { id: 'lainey-album', artist: 'Lainey Wilson', work: 'Whirlwind' },
      { id: 'post-album', artist: 'Post Malone', work: 'F-1 Trillion' },
    ],
  },

  // === DANCE/ELECTRONIC ===
  {
    id: 'best-dance-pop',
    name: 'Best Dance Pop Recording',
    emoji: '💃',
    nominees: [
      { id: 'ariana-yes', artist: 'Ariana Grande', work: 'Yes, And?' },
      { id: 'billie-lunch', artist: 'Billie Eilish', work: 'Lunch' },
      { id: 'charli-von', artist: 'Charli XCX', work: 'Von Dutch' },
      { id: 'dua-illusion', artist: 'Dua Lipa', work: 'Illusion' },
      { id: 'madison-unwell', artist: 'Madison Beer', work: 'Make You Mine' },
    ],
  },
  {
    id: 'best-dance-album',
    name: 'Best Dance/Electronic Album',
    emoji: '🎧',
    nominees: [
      { id: 'charli-brat-dance', artist: 'Charli XCX', work: 'Brat' },
      { id: 'disclosure-alchemy', artist: 'Disclosure', work: 'Alchemy' },
      { id: 'four-tet', artist: 'Four Tet', work: 'Three' },
      { id: 'justice-hyperdrama', artist: 'Justice', work: 'Hyperdrama' },
      { id: 'zedd-telos', artist: 'Zedd', work: 'Telos' },
    ],
  },

  // === LATIN ===
  {
    id: 'best-latin-pop',
    name: 'Best Latin Pop Album',
    emoji: '🌴',
    nominees: [
      { id: 'anitta-funk', artist: 'Anitta', work: 'Funk Generation' },
      { id: 'kali-manana', artist: 'Kali Uchis', work: 'Orquídeas' },
      { id: 'luis-miguel', artist: 'Luis Miguel', work: 'México Por Siempre!' },
      { id: 'shakira-mujeres', artist: 'Shakira', work: 'Las Mujeres Ya No Lloran' },
    ],
  },
  {
    id: 'best-latin-urban',
    name: 'Best Música Urbana Album',
    emoji: '🔊',
    nominees: [
      { id: 'badbunny-debi-latin', artist: 'Bad Bunny', work: 'DeBÍ TiRAR MáS FOToS' },
      { id: 'feid-ferxxocalipsis', artist: 'Feid', work: 'Ferxxocalipsis' },
      { id: 'jbalvin-rayo', artist: 'J Balvin', work: 'Rayo' },
      { id: 'rauw-playa', artist: 'Rauw Alejandro', work: 'Playa Saturno' },
      { id: 'young-miko', artist: 'Young Miko', work: 'att.' },
    ],
  },

  // === ALTERNATIVE ===
  {
    id: 'best-alternative-album',
    name: 'Best Alternative Music Album',
    emoji: '🌀',
    nominees: [
      { id: 'brittany-please', artist: 'Brittany Howard', work: 'What Now' },
      { id: 'clairo-charm', artist: 'Clairo', work: 'Charm' },
      { id: 'kim-gordon', artist: 'Kim Gordon', work: 'The Collective' },
      { id: 'nick-cave', artist: 'Nick Cave & The Bad Seeds', work: 'Wild God' },
      { id: 'st-vincent-alt', artist: 'St. Vincent', work: 'All Born Screaming' },
    ],
  },

  // === PRODUCER/SONGWRITER ===
  {
    id: 'producer-of-the-year',
    name: 'Producer of the Year, Non-Classical',
    emoji: '🎚️',
    nominees: [
      { id: 'alissia', artist: 'Alissia' },
      { id: 'dernst-emile', artist: 'Dernst "D\'Mile" Emile II' },
      { id: 'ian-fitchuk', artist: 'Ian Fitchuk' },
      { id: 'mustard', artist: 'Mustard' },
      { id: 'daniel-nigro', artist: 'Daniel Nigro' },
    ],
  },
  {
    id: 'songwriter-of-the-year',
    name: 'Songwriter of the Year, Non-Classical',
    emoji: '🖊️',
    nominees: [
      { id: 'amy-allen', artist: 'Amy Allen' },
      { id: 'edgar-barrera', artist: 'Edgar Barrera' },
      { id: 'jessi-jo', artist: 'Jessi Jo Dillon' },
      { id: 'raye', artist: 'Raye' },
      { id: 'ross-golan', artist: 'Ross Golan' },
    ],
  },
]

// Get total number of categories
export const totalCategories = categories.length
