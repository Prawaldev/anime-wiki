import type { Anime } from './types'

const KITSU_URL = 'https://kitsu.io/api/edge'

interface KitsuAnime {
  id: string
  attributes: {
    canonicalTitle: string
    titles: { en?: string | null; en_jp?: string | null; ja_jp?: string | null }
    synopsis: string | null
    averageRating: string | null
    popularityRank: number | null
    ratingRank: number | null
    episodeCount: number | null
    subtype: string | null
    status: string | null
    startDate: string | null
    endDate: string | null
    posterImage: { tiny: string | null; small: string | null; medium: string | null; large: string | null; original: string | null }
  }
  relationships?: Record<string, unknown>
}

interface KitsuResponse {
  data: KitsuAnime[]
  links?: { next: string | null; last: string | null }
}

async function kitsuGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${KITSU_URL}${endpoint}`, {
    headers: { 'Accept': 'application/vnd.api+json' },
  })
  if (!res.ok) {
    throw new Error(`Kitsu API error: ${res.status}`)
  }
  return res.json() as Promise<T>
}

const STATUS_MAP: Record<string, string> = {
  finished: 'Finished Airing',
  current: 'Currently Airing',
  upcoming: 'Not yet aired',
  unreleased: 'Not yet aired',
}

function toAnime(a: KitsuAnime): Anime {
  const at = a.attributes
  const img = at.posterImage?.medium || at.posterImage?.large || at.posterImage?.original || ''
  return {
    mal_id: parseInt(a.id, 10),
    title: at.canonicalTitle || at.titles?.en || at.titles?.en_jp || 'Unknown',
    title_english: at.titles?.en || at.canonicalTitle || null,
    title_japanese: at.titles?.ja_jp || at.titles?.en_jp || null,
    images: {
      jpg: {
        image_url: img,
        large_image_url: at.posterImage?.large || at.posterImage?.original || img,
      },
    },
    type: at.subtype || 'Unknown',
    episodes: at.episodeCount,
    status: STATUS_MAP[at.status ?? ''] || at.status || 'Unknown',
    score: at.averageRating ? parseFloat(at.averageRating) / 10 : null,
    rank: at.ratingRank,
    popularity: at.popularityRank,
    synopsis: at.synopsis,
    background: null,
    season: null,
    year: at.startDate ? new Date(at.startDate).getFullYear() : null,
    aired: { from: at.startDate, to: at.endDate },
    genres: [],
    themes: [],
    studios: [],
  }
}

export interface KitsuSearchArgs {
  query: string
  limit?: number
}

export async function kitsuSearchAnime({ query, limit = 20 }: KitsuSearchArgs): Promise<Anime[]> {
  const res = await kitsuGet<KitsuResponse>(
    `/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=${limit}&sort=-user_count`,
  )
  return (res.data || []).map(toAnime)
}

export async function kitsuTrending(limit = 12): Promise<Anime[]> {
  const res = await kitsuGet<KitsuResponse>(`/trending/anime?page[limit]=${limit}`)
  return (res.data || []).map(toAnime)
}

export async function kitsuGetAnime(id: number): Promise<Anime | null> {
  const res = await kitsuGet<KitsuResponse>(`/anime/${id}`)
  const item = res.data?.[0]
  if (!item) return null
  return toAnime(item)
}

// Secondary data not provided by this adapter
export const kitsuRecommendations = async (): Promise<{ entry: { mal_id: number; title: string; images: { jpg: { image_url: string } } } }[]> => []
export const kitsuAnimePictures = async (): Promise<{ jpg: { image_url: string; large_image_url: string } }[]> => []
export const kitsuAnimeCharacters = async (): Promise<{ character: { mal_id: number; name: string; images: { jpg: { image_url: string } } }; role: string; voice_actors: never[] }[]> => []
