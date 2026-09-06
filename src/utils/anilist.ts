import type { Anime, AnimeCharacter, Picture } from './types'

const ANILIST_URL = 'https://graphql.anilist.co'

interface AniListMedia {
  id: number
  idMal: number | null
  title: { romaji: string | null; english: string | null; native: string | null }
  coverImage: { extraLarge: string | null; large: string | null }
  bannerImage?: string | null
  averageScore: number | null
  popularity: number | null
  episodes: number | null
  seasonYear: number | null
  format: string | null
  status: string | null
  description: string | null
  genres: string[]
  studios: { nodes: { name: string }[] }
  rank?: number | null
}

export interface AniListResponse {
  data: { Page?: { media: AniListMedia[] }; Media?: AniListMedia }
  errors?: { message: string }[]
}

async function anilistQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query, variables: variables ?? {} }),
  })
  if (!res.ok) {
    throw new Error(`AniList API error: ${res.status}`)
  }
  const json = (await res.json()) as AniListResponse
  if (json.errors && json.errors.length > 0) {
    throw new Error(`AniList API error: ${json.errors[0].message}`)
  }
  return json.data as T
}

const STATUS_MAP: Record<string, string> = {
  FINISHED: 'Finished Airing',
  RELEASING: 'Currently Airing',
  NOT_YET_RELEASED: 'Not yet aired',
  CANCELLED: 'Cancelled',
}

function toAnime(m: AniListMedia): Anime {
  const img = m.coverImage?.extraLarge || m.coverImage?.large || ''
  return {
    mal_id: m.idMal ?? m.id,
    title: m.title?.romaji || m.title?.english || m.title?.native || 'Unknown',
    title_english: m.title?.english || null,
    title_japanese: m.title?.native || null,
    images: {
      jpg: {
        image_url: img,
        large_image_url: m.coverImage?.extraLarge || img,
      },
    },
    type: m.format || 'Unknown',
    episodes: m.episodes,
    status: STATUS_MAP[m.status ?? ''] || m.status || 'Unknown',
    score: m.averageScore ? m.averageScore / 10 : null,
    rank: m.rank ?? null,
    popularity: m.popularity ?? null,
    synopsis: m.description ? m.description.replace(/<br\s*\/?>/gi, '\n') : null,
    background: null,
    season: null,
    year: m.seasonYear,
    aired: { from: null, to: null },
    genres: (m.genres || []).map(g => ({ name: g })),
    themes: [],
    studios: (m.studios?.nodes || []).map(s => ({ name: s.name })),
  }
}

export interface SearchMediaArgs {
  query: string
  limit?: number
}

export async function anilistSearchAnime({ query, limit = 20 }: SearchMediaArgs): Promise<Anime[]> {
  const data = await anilistQuery<{ Page: { media: AniListMedia[] } }>(
    `query ($search: String, $perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(type: ANIME, search: $search, sort: POPULARITY_DESC) {
          id idMal title { romaji english native } coverImage { extraLarge large }
          averageScore popularity episodes seasonYear format status description genres studios { nodes { name } }
        }
      }
    }`,
    { search: query, perPage: limit },
  )
  return (data.Page?.media || []).map(toAnime)
}

export async function anilistTrending(limit = 12): Promise<Anime[]> {
  const data = await anilistQuery<{ Page: { media: AniListMedia[] } }>(
    `query ($perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(type: ANIME, sort: TRENDING_DESC, status_in: [RELEASING]) {
          id idMal title { romaji english native } coverImage { extraLarge large }
          averageScore popularity episodes seasonYear format status description genres studios { nodes { name } }
        }
      }
    }`,
    { perPage: limit },
  )
  return (data.Page?.media || []).map(toAnime)
}

export async function anilistGetAnime(id: number): Promise<Anime | null> {
  const data = await anilistQuery<{ Media: AniListMedia }>(
    `query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id idMal title { romaji english native } coverImage { extraLarge large }
        averageScore popularity episodes seasonYear format status description genres studios { nodes { name } }
      }
    }`,
    { id },
  )
  if (!data.Media) return null
  return toAnime(data.Media)
}

export interface AniListCharacterRef {
  id: number
  node: {
    id: number
    name: { full: string }
    image: { large: string | null }
  }
  role: string
}

interface AnimeCharactersResult {
  Media: {
    characters: { edges: AniListCharacterRef[] }
  }
}

export async function anilistGetAnimeCharacters(id: number, limit = 30): Promise<AnimeCharacter[]> {
  const data = await anilistQuery<AnimeCharactersResult>(
    `query ($id: Int, $perPage: Int) {
      Media(id: $id, type: ANIME) {
        characters(perPage: $perPage, sort: ROLE) {
          edges {
            role
            node {
              id name { full } image { large }
            }
          }
        }
      }
    }`,
    { id, perPage: limit },
  )
  const edges = data.Media?.characters?.edges || []
  return edges.map(e => ({
    character: {
      mal_id: e.node?.id ?? 0,
      name: e.node?.name?.full || 'Unknown',
      images: { jpg: { image_url: e.node?.image?.large || '' } },
    },
    role: e.role,
    voice_actors: [],
  }))
}

async function anilistFindByMalId(malId: number): Promise<number | null> {
  const data = await anilistQuery<{ Media: { id: number } }>(
    `query ($idMal: Int) { Media(idMal: $idMal, type: ANIME) { id } }`,
    { idMal: malId },
  )
  return data.Media?.id ?? null
}

export async function anilistSearchByMalId(malId: number): Promise<Anime | null> {
  const data = await anilistQuery<{ Media: AniListMedia }>(
    `query ($idMal: Int) {
      Media(idMal: $idMal, type: ANIME) {
        id idMal title { romaji english native } coverImage { extraLarge large }
        averageScore popularity episodes seasonYear format status description genres studios { nodes { name } }
      }
    }`,
    { idMal: malId },
  )
  if (!data.Media) return null
  return toAnime(data.Media)
}

export async function anilistGetPictures(id: number): Promise<Picture[]> {
  const alId = await anilistFindByMalId(id)
  if (alId == null) return []
  const data = await anilistQuery<{ Media: { bannerImage: string | null } }>(
    `query ($id: Int) { Media(id: $id, type: ANIME) { bannerImage } }`,
    { id: alId },
  )
  if (!data.Media?.bannerImage) return []
  return [{ jpg: { image_url: data.Media.bannerImage, large_image_url: data.Media.bannerImage } }]
}

// Secondary data not provided by AniList
export const anilistRecommendations = async (): Promise<{ entry: { mal_id: number; title: string; images: { jpg: { image_url: string } } } }[]> => []
