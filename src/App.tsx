import { useState, useCallback } from 'react'
import type { View } from './utils/types'
import Header from './components/Header'
import HomeView from './components/HomeView'
import SearchView from './components/SearchView'
import AnimeView from './components/AnimeView'
import CharacterView from './components/CharacterView'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [animeId, setAnimeId] = useState(0)
  const [characterId, setCharacterId] = useState(0)
  const [history, setHistory] = useState<Array<{ view: View; query?: string; animeId?: number; characterId?: number }>>([])

  const navigate = useCallback((v: View, opts?: { query?: string; animeId?: number; characterId?: number }) => {
    setHistory(prev => [...prev, { view, query: searchQuery, animeId, characterId }])
    setView(v)
    if (opts?.query !== undefined) setSearchQuery(opts.query)
    if (opts?.animeId !== undefined) setAnimeId(opts.animeId)
    if (opts?.characterId !== undefined) setCharacterId(opts.characterId)
  }, [view, searchQuery, animeId, characterId])

  const goHome = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault()
    setHistory([])
    setView('home')
  }, [])

  const goBack = useCallback(() => {
    const prev = history[history.length - 1]
    if (!prev) { setView('home'); return }
    setHistory(prev => prev.slice(0, -1))
    setView(prev.view)
    if (prev.query !== undefined) setSearchQuery(prev.query)
    if (prev.animeId !== undefined) setAnimeId(prev.animeId)
    if (prev.characterId !== undefined) setCharacterId(prev.characterId)
  }, [history])

  const doSearch = useCallback((q: string) => {
    navigate('search', { query: q })
  }, [navigate])

  const openAnime = useCallback((id: number) => {
    navigate('anime', { animeId: id })
  }, [navigate])

  const openCharacter = useCallback((id: number) => {
    navigate('character', { characterId: id })
  }, [navigate])

  return (
    <>
      <Header onSearch={doSearch} onHome={goHome} />
      <main>
        <div className={`view${view === 'home' ? ' active' : ''}`}>
          {view === 'home' && <HomeView onAnimeClick={openAnime} onCharacterClick={openCharacter} />}
        </div>
        <div className={`view${view === 'search' ? ' active' : ''}`}>
          {view === 'search' && <SearchView query={searchQuery} onAnimeClick={openAnime} onCharacterClick={openCharacter} />}
        </div>
        <div className={`view${view === 'anime' ? ' active' : ''}`}>
          {view === 'anime' && <AnimeView id={animeId} onBack={goBack} onCharacterClick={openCharacter} onAnimeClick={openAnime} />}
        </div>
        <div className={`view${view === 'character' ? ' active' : ''}`}>
          {view === 'character' && <CharacterView id={characterId} onBack={goBack} onAnimeClick={openAnime} />}
        </div>
      </main>
    </>
  )
}
