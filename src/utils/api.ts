import { getProvider, reportApiError } from './providers'
import type { Anime, Character, AnimeCharacter, Recommendation, Picture } from './types'
import { anilistSearchAnime, anilistTrending, anilistGetAnime, anilistGetAnimeCharacters, anilistSearchByMalId, anilistGetPictures, anilistRecommendations } from './anilist'
import { kitsuSearchAnime, kitsuTrending, kitsuGetAnime } from './kitsu'

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
    // Preserve the Jikan error message exactly (e.g. "Jikan API error: 504")
    throw new Error(`Jikan API error: ${res.status}`)
  }
  throw new Error('Rate limit exceeded')
}

let randomCharCache: { data: Character; ts: number } | null = null

export interface TopAnimeResponse { data: Anime[] }
export interface RandomCharacterResponse { data: Character }
export interface AnimeSearchResponse { data: Anime[] }
export interface CharacterSearchResponse { data: Character[] }
export interface AnimeFullResponse { data: Anime }
export interface AnimeCharactersResponse { data: AnimeCharacter[] }
export interface AnimeRecommendationsResponse { data: Recommendation[] }
export interface PicturesResponse { data: Picture[] }

function fail(msg: string): never {
  reportApiError(getProvider(), msg, true)
  throw new Error(msg)
}

export async function getTopAnime(): Promise<TopAnimeResponse> {
  const provider = getProvider()
  try {
    if (provider === 'jikan') {
      return await jikan<TopAnimeResponse>('/top/anime?filter=airing&limit=12')
    }
    if (provider === 'anilist') {
      const data = await anilistTrending(12)
      return { data }
    }
    if (provider === 'kitsu') {
      const data = await kitsuTrending(12)
      return { data }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load trending anime.'
    return fail(msg)
  }
  return fail('Unknown provider')
}

export async function getRandomCharacter(): Promise<RandomCharacterResponse> {
  const provider = getProvider()
  if (provider !== 'jikan') {
    // Random characters are only supported by Jikan; this is optional content,
    // so the caller decides how to surface it (HomeView treats it silently).
    throw new Error('Random characters are only available via the Jikan API.')
  }
  return await jikan<RandomCharacterResponse>('/random/characters')
}

export function getRandomCharacterCached() {
  if (randomCharCache && Date.now() - randomCharCache.ts < 60000) {
    return Promise.resolve(randomCharCache)
  }
  const provider = getProvider()
  if (provider !== 'jikan') {
    if (randomCharCache) {
      return Promise.resolve(randomCharCache)
    }
    return getRandomCharacter().catch(err => {
      throw err
    })
  }
  return getRandomCharacter().then(res => {
    randomCharCache = { data: res.data, ts: Date.now() }
    return res
  }).catch(err => {
    if (randomCharCache) return randomCharCache
    throw err
  })
}

export async function searchAnime(q: string): Promise<AnimeSearchResponse> {
  const provider = getProvider()
  try {
    if (provider === 'jikan') {
      return await jikan<AnimeSearchResponse>(`/anime?q=${encodeURIComponent(q)}&limit=20&sfw`)
    }
    if (provider === 'anilist') {
      const data = await anilistSearchAnime({ query: q, limit: 20 })
      return { data }
    }
    if (provider === 'kitsu') {
      const data = await kitsuSearchAnime({ query: q, limit: 20 })
      return { data }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Search failed.'
    return fail(msg)
  }
  return fail('Unknown provider')
}

export async function searchCharacters(q: string): Promise<CharacterSearchResponse> {
  const provider = getProvider()
  if (provider !== 'jikan') {
    reportApiError(provider, 'Character search is only available via the Jikan API.', false)
    return { data: [] }
  }
  try {
    return await jikan<CharacterSearchResponse>(`/characters?q=${encodeURIComponent(q)}&limit=20&order_by=favorites&sort=desc`)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Search failed.'
    return fail(msg)
  }
}

export async function getAnimeFull(id: number): Promise<AnimeFullResponse> {
  const provider = getProvider()
  try {
    if (provider === 'jikan') {
      return await jikan<AnimeFullResponse>(`/anime/${id}/full`)
    }
    if (provider === 'anilist') {
      const anime = await anilistSearchByMalId(id) ?? await anilistGetAnime(id)
      if (!anime) return fail('AniList API: anime not found')
      return { data: anime }
    }
    if (provider === 'kitsu') {
      const anime = await kitsuGetAnime(id)
      if (!anime) return fail('Kitsu API: anime not found')
      return { data: anime }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load anime details.'
    return fail(msg)
  }
  return fail('Unknown provider')
}

export async function getAnimeCharacters(id: number): Promise<AnimeCharactersResponse> {
  const provider = getProvider()
  try {
    if (provider === 'jikan') {
      return await jikan<AnimeCharactersResponse>(`/anime/${id}/characters`)
    }
    if (provider === 'anilist') {
      const data = await anilistGetAnimeCharacters(id, 30)
      return { data }
    }
    if (provider === 'kitsu') {
      return { data: [] }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load characters.'
    return fail(msg)
  }
  return fail('Unknown provider')
}

export async function getAnimeRecommendations(id: number): Promise<AnimeRecommendationsResponse> {
  const provider = getProvider()
  try {
    if (provider === 'jikan') {
      return await jikan<AnimeRecommendationsResponse>(`/anime/${id}/recommendations`)
    }
    if (provider === 'anilist') {
      return { data: await anilistRecommendations() }
    }
    if (provider === 'kitsu') {
      return { data: [] }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load recommendations.'
    return fail(msg)
  }
  return fail('Unknown provider')
}

export async function getAnimePictures(id: number): Promise<PicturesResponse> {
  const provider = getProvider()
  try {
    if (provider === 'jikan') {
      return await jikan<PicturesResponse>(`/anime/${id}/pictures`)
    }
    if (provider === 'anilist') {
      return { data: await anilistGetPictures(id) }
    }
    if (provider === 'kitsu') {
      return { data: [] }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load pictures.'
    return fail(msg)
  }
  return fail('Unknown provider')
}

export async function getCharacter(id: number): Promise<{ data: Character }> {
  const provider = getProvider()
  if (provider !== 'jikan') {
    reportApiError(provider, 'Character details are only available via the Jikan API. Switch API to use this feature.', false)
    throw new Error('Character details are only available via the Jikan API.')
  }
  try {
    return await jikan<{ data: Character }>(`/characters/${id}`)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load character details.'
    return fail(msg)
  }
}

export async function getCharacterAnime(id: number): Promise<{ data: { role: string; anime: Anime }[] }> {
  const provider = getProvider()
  if (provider !== 'jikan') return { data: [] }
  try {
    return await jikan<{ data: { role: string; anime: Anime }[] }>(`/characters/${id}/anime`)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load character anime.'
    return fail(msg)
  }
}

export async function getCharacterVoices(id: number): Promise<{ data: AnimeCharacter['voice_actors'] }> {
  const provider = getProvider()
  if (provider !== 'jikan') return { data: [] }
  try {
    return await jikan<{ data: AnimeCharacter['voice_actors'] }>(`/characters/${id}/voices`)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load voices.'
    return fail(msg)
  }
}

export async function getCharacterPictures(id: number): Promise<PicturesResponse> {
  const provider = getProvider()
  if (provider !== 'jikan') return { data: [] }
  try {
    return await jikan<PicturesResponse>(`/characters/${id}/pictures`)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load pictures.'
    return fail(msg)
  }
}