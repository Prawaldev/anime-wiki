const BASE = 'https://api.jikan.moe/v4'
const MIN_INTERVAL = 1100
let lastRequest = 0

async function throttle() {
  const now = Date.now()
  const wait = Math.max(0, MIN_INTERVAL - (now - lastRequest))
  await new Promise(r => setTimeout(r, wait))
  lastRequest = Date.now()
}

async function jikan<T>(endpoint: string): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt++) {
    await throttle()
    const res = await fetch(`${BASE}${endpoint}`)
    if (res.ok) return res.json()
    if (res.status === 429 && attempt < 2) {
      await new Promise(r => setTimeout(r, 3000 * (attempt + 1)))
      continue
    }
    throw new Error(`Jikan API error: ${res.status}`)
  }
  throw new Error('Rate limit exceeded')
}

let randomCharCache: { data: import('./types').Character; ts: number } | null = null

export function getRandomCharacterCached() {
  if (randomCharCache && Date.now() - randomCharCache.ts < 60000) {
    return Promise.resolve(randomCharCache)
  }
  return getRandomCharacter().then(res => {
    randomCharCache = { data: res.data, ts: Date.now() }
    return res
  }).catch(err => {
    if (randomCharCache) return randomCharCache
    throw err
  })
}

export interface TopAnimeResponse {
  data: import('./types').Anime[]
}
export const getTopAnime = () =>
  jikan<TopAnimeResponse>('/top/anime?filter=airing&limit=12')

export interface RandomCharacterResponse {
  data: import('./types').Character
}
export const getRandomCharacter = () =>
  jikan<RandomCharacterResponse>('/random/characters')

export interface AnimeSearchResponse {
  data: import('./types').Anime[]
}
export const searchAnime = (q: string) =>
  jikan<AnimeSearchResponse>(`/anime?q=${encodeURIComponent(q)}&limit=20&sfw`)

export interface CharacterSearchResponse {
  data: import('./types').Character[]
}
export const searchCharacters = (q: string) =>
  jikan<CharacterSearchResponse>(`/characters?q=${encodeURIComponent(q)}&limit=20&order_by=favorites&sort=desc`)

export interface AnimeFullResponse {
  data: import('./types').Anime
}
export const getAnimeFull = (id: number) =>
  jikan<AnimeFullResponse>(`/anime/${id}/full`)

export interface AnimeCharactersResponse {
  data: import('./types').AnimeCharacter[]
}
export const getAnimeCharacters = (id: number) =>
  jikan<AnimeCharactersResponse>(`/anime/${id}/characters`)

export interface AnimeRecommendationsResponse {
  data: import('./types').Recommendation[]
}
export const getAnimeRecommendations = (id: number) =>
  jikan<AnimeRecommendationsResponse>(`/anime/${id}/recommendations`)

export interface PicturesResponse {
  data: import('./types').Picture[]
}
export const getAnimePictures = (id: number) =>
  jikan<PicturesResponse>(`/anime/${id}/pictures`)

export const getCharacter = (id: number) =>
  jikan<{ data: import('./types').Character }>(`/characters/${id}`)

export const getCharacterAnime = (id: number) =>
  jikan<{ data: { role: string; anime: import('./types').Anime }[] }>(`/characters/${id}/anime`)

export const getCharacterVoices = (id: number) =>
  jikan<{ data: import('./types').AnimeCharacter['voice_actors'] }>(`/characters/${id}/voices`)

export const getCharacterPictures = (id: number) =>
  jikan<PicturesResponse>(`/characters/${id}/pictures`)
