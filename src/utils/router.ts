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

  const path = pathname.startsWith(BASE) ? '/' + pathname.slice(BASE.length) : pathname

  if (path.startsWith('/anime/')) {
    const id = parseInt(path.split('/')[2], 10)
    return { view: 'anime', animeId: isNaN(id) ? undefined : id }
  }

  if (path.startsWith('/character/')) {
    const id = parseInt(path.split('/')[2], 10)
    return { view: 'character', characterId: isNaN(id) ? undefined : id }
  }

  if (path.startsWith('/search')) {
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