import type { View } from './types'

const BASE = import.meta.env.BASE_URL
export interface RouteState {
  view: View
  query?: string
  animeId?: number
  characterId?: number
}

export function parseRoute(): RouteState {
  const { pathname, search } = window.location

  if (pathname.startsWith('/anime/')) {
    const id = parseInt(pathname.split('/')[2], 10)
    return { view: 'anime', animeId: isNaN(id) ? undefined : id }
  }

  if (pathname.startsWith('/character/')) {
    const id = parseInt(pathname.split('/')[2], 10)
    return { view: 'character', characterId: isNaN(id) ? undefined : id }
  }

  if (pathname.startsWith('/search')) {
    const q = new URLSearchParams(search).get('q')
    return { view: 'search', query: q || undefined }
  }

  return { view: 'home' }
}

export function routeToPath(state: RouteState): string {
  switch (state.view) {
    case 'home':
      return BASE
    case 'search':
      return `${BASE}search?q=${encodeURIComponent(state.query || '')}`
    case 'anime':
      return `${BASE}anime/${state.animeId}`
    case 'character':
      return `${BASE}character/${state.characterId}`

      default:
        return `${BASE}`
  }
}
