import { useState, useEffect } from 'react'
import type { Anime, Character } from '../utils/types'
import { searchAnime, searchCharacters } from '../utils/api'
import { useProviderVersion } from '../utils/useProvider'
import AnimeCard from './AnimeCard'
import CharacterCard from './CharacterCard'
import Loader from './Loader'

interface Props {
  query: string
  onAnimeClick: (id: number) => void
  onCharacterClick: (id: number) => void
}

type Tab = 'anime' | 'characters'

export default function SearchView({ query, onAnimeClick, onCharacterClick }: Props) {
  const [animeResults, setAnimeResults] = useState<Anime[]>([])
  const [charResults, setCharResults] = useState<Character[]>([])
  const [tab, setTab] = useState<Tab>('anime')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const providerVersion = useProviderVersion()

  useEffect(() => {
    let cancelled = false
    async function search() {
      setLoading(true)
      setError(null)
      setAnimeResults([])
      setCharResults([])
      try {
        const animeRes = await searchAnime(query)
        if (cancelled) return
        setAnimeResults(animeRes.data)

        const charRes = await searchCharacters(query)
        if (cancelled) return
        setCharResults(charRes.data)
      } catch (e) {
        if (!cancelled) {
          setAnimeResults([])
          setCharResults([])
          setError(e instanceof Error ? e.message : 'Search failed.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    search()
    return () => { cancelled = true }
  }, [query, providerVersion])

  return (
    <>
      <h2>
        Search results for "<span>{query}</span>"
      </h2>

      <div className="tabs">
        <button
          className={`tab-btn${tab === 'anime' ? ' active' : ''}`}
          onClick={() => setTab('anime')}
        >
          Anime
        </button>
        <button
          className={`tab-btn${tab === 'characters' ? ' active' : ''}`}
          onClick={() => setTab('characters')}
        >
          Characters
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      ) : tab === 'anime' ? (
        <div className="card-grid">
          {animeResults.map(a => (
            <AnimeCard key={a.mal_id} anime={a} onClick={onAnimeClick} />
          ))}
          {animeResults.length === 0 && <p>No anime found.</p>}
        </div>
      ) : (
        <div className="card-grid">
          {charResults.map(c => (
            <CharacterCard key={c.mal_id} character={c} onClick={onCharacterClick} />
          ))}
          {charResults.length === 0 && <p>No characters found.</p>}
        </div>
      )}
    </>
  )
}
