export type ApiProviderId = 'jikan' | 'anilist' | 'kitsu'

const STORAGE_KEY = 'aniwiki.apiProvider'

function loadSavedProvider(): ApiProviderId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'jikan' || saved === 'anilist' || saved === 'kitsu') return saved
  } catch {
    // localStorage unavailable — fall through to default
  }
  return 'jikan'
}

export interface ApiProviderMeta {
  id: ApiProviderId
  label: string
  description: string
}

export const API_PROVIDERS: ApiProviderMeta[] = [
  { id: 'jikan', label: 'Jikan (MyAnimeList)', description: 'Full Jikan v4 — anime, characters, voice actors, recommendations & pictures. Currently may be down (504).' },
  { id: 'anilist', label: 'AniList', description: 'AniList GraphQL — anime search, trending & details via MAL ids.' },
  { id: 'kitsu', label: 'Kitsu', description: 'Kitsu API — anime search, trending & details.' },
]

let currentProvider: ApiProviderId = loadSavedProvider()

const providerListeners = new Set<(id: ApiProviderId) => void>()
const errorListeners = new Set<(provider: ApiProviderId, message: string, retry: boolean) => void>()

// A counter that increments every time the active provider changes.
// Views can depend on it (via onProviderVersionChange) to re-fetch data.
let providerVersion = 0

export function getProvider(): ApiProviderId {
  return currentProvider
}

export function getProviderMeta(id: ApiProviderId): ApiProviderMeta {
  return API_PROVIDERS.find(p => p.id === id) ?? API_PROVIDERS[0]
}

export function setProvider(id: ApiProviderId) {
  if (id === currentProvider) return
  currentProvider = id
  providerVersion++
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // ignore storage failures
  }
  providerListeners.forEach(l => l(id))
}

export function getProviderVersion(): number {
  return providerVersion
}

export function onProviderChange(listener: (id: ApiProviderId) => void): () => void {
  providerListeners.add(listener)
  return () => { providerListeners.delete(listener) }
}

export function onProviderVersionChange(listener: (version: number) => void): () => void {
  const wrapped: (id: ApiProviderId) => void = () => listener(providerVersion)
  providerListeners.add(wrapped)
  return () => { providerListeners.delete(wrapped) }
}

export interface ApiErrorInfo {
  provider: ApiProviderId
  message: string
  retry: boolean
}

export function reportApiError(provider: ApiProviderId, message: string, retry: boolean) {
  errorListeners.forEach(l => l(provider, message, retry))
}

export function onApiError(listener: (info: ApiErrorInfo) => void): () => void {
  const wrapped: (provider: ApiProviderId, message: string, retry: boolean) => void =
    (provider, message, retry) => listener({ provider, message, retry })
  errorListeners.add(wrapped)
  return () => { errorListeners.delete(wrapped) }
}