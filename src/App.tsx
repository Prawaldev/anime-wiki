import { useState, useCallback, useEffect } from 'react'
import { parseRoute, routeToPath, type RouteState } from './utils/router'
import Header from './components/Header'
import HomeView from './components/HomeView'
import SearchView from './components/SearchView'
import AnimeView from './components/AnimeView'
import CharacterView from './components/CharacterView'

function initialState(): RouteState {
  const route = parseRoute()
  history.replaceState(route, '', routeToPath(route))
  return route
}

export default function App() {
  const [route, setRoute] = useState<RouteState>(initialState)

  useEffect(() => {
    const onPop = () => {
      setRoute(parseRoute())
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const push = useCallback((next: RouteState) => {
    history.pushState(next, '', routeToPath(next))
    setRoute(next)
  }, [])

  const goHome = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault()
    push({ view: 'home' })
  }, [push])

  const goBack = useCallback(() => {
    history.back()
  }, [])

  const doSearch = useCallback((q: string) => {
    push({ view: 'search', query: q })
  }, [push])

  const openAnime = useCallback((id: number) => {
    push({ view: 'anime', animeId: id })
  }, [push])

  const openCharacter = useCallback((id: number) => {
    push({ view: 'character', characterId: id })
  }, [push])

  const { view, query, animeId, characterId } = route

  return (
    <>
      <Header onSearch={doSearch} onHome={goHome} />
      <main>
        <div className={`view${view === 'home' ? ' active' : ''}`}>
          {view === 'home' && <HomeView onAnimeClick={openAnime} onCharacterClick={openCharacter} />}
        </div>
        <div className={`view${view === 'search' ? ' active' : ''}`}>
          {view === 'search' && <SearchView query={query ?? ''} onAnimeClick={openAnime} onCharacterClick={openCharacter} />}
        </div>
        <div className={`view${view === 'anime' ? ' active' : ''}`}>
          {view === 'anime' && <AnimeView id={animeId!} onBack={goBack} onCharacterClick={openCharacter} onAnimeClick={openAnime} />}
        </div>
        <div className={`view${view === 'character' ? ' active' : ''}`}>
          {view === 'character' && <CharacterView id={characterId!} onBack={goBack} onAnimeClick={openAnime} />}
        </div>
      </main>
    </>
  )
}
