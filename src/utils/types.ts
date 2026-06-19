export interface Anime {
  mal_id: number
  title: string
  title_english: string | null
  title_japanese: string | null
  images: { jpg: { image_url: string; large_image_url: string } }
  type: string
  episodes: number | null
  status: string
  score: number | null
  rank: number | null
  popularity: number | null
  synopsis: string | null
  background: string | null
  season: string | null
  year: number | null
  aired: { from: string | null; to: string | null }
  genres: { name: string }[]
  themes: { name: string }[]
  studios: { name: string }[]
}

export interface Character {
  mal_id: number
  name: string
  name_kanji: string | null
  nicknames: string[]
  favorites: number
  about: string | null
  images: { jpg: { image_url: string; large_image_url?: string }; webp?: { image_url: string } }
  anime: { role: string; anime: { mal_id: number; title: string; images: { jpg: { image_url: string } } } }[]
  voices: { person: { name: string; images: { jpg: { image_url: string } } }; language: string }[]
  animeography: { anime: { mal_id: number; title: string; images: { jpg: { image_url: string } } } }[]
}

export interface AnimeCharacter {
  character: {
    mal_id: number
    name: string
    images: { jpg: { image_url: string } }
  }
  role: string
  voice_actors: {
    person: { name: string; images: { jpg: { image_url: string } } }
    language: string
  }[]
}

export interface Recommendation {
  entry: {
    mal_id: number
    title: string
    images: { jpg: { image_url: string } }
  }
}

export interface Picture {
  jpg: { image_url: string; large_image_url: string }
}

export type View = 'home' | 'search' | 'anime' | 'character'
