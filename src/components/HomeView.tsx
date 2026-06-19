import { useState, useEffect } from 'react'
import type { Anime, Character } from '../utils/types'
import { getTopAnime, getRandomCharacterCached } from '../utils/api'
import AnimeCard from './AnimeCard'
import Loader from './Loader'

interface Props {
  onAnimeClick: (id: number) => void
  onCharacterClick: (id: number) => void
}

export default function HomeView({ onAnimeClick, onCharacterClick }: Props) {
  const [trending, setTrending] = useState<Anime[]>([])
  const [featured, setFeatured] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const topRes = await getTopAnime()
        if (cancelled) return
        setTrending(topRes.data)

        const charRes = await getRandomCharacterCached()
        if (cancelled) return
        setFeatured(charRes.data)
      } catch {
        if (!cancelled) setTrending([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) return <Loader />

  return (
    <>
      <div className="hero">
        <h1>AniWiki</h1>
        <p>The open anime encyclopedia</p>
      </div>

      <section>
        <h2>Trending Anime</h2>
        <div className="card-grid">
          {trending.map(a => (
            <AnimeCard key={a.mal_id} anime={a} onClick={onAnimeClick} />
          ))}
        </div>
      </section>

      <section>
        <h2>Featured Character</h2>
        {featured && (
          <div className="featured-card" onClick={() => onCharacterClick(featured.mal_id)}>
            <img
              src={featured.images.jpg.image_url}
              alt={featured.name}
            />
            <div className="featured-card-body">
              <h3>{featured.name}</h3>
              {featured.name_kanji && <p>{featured.name_kanji}</p>}
              {featured.about && (
                <p>{featured.about.slice(0, 300)}...</p>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  )
}
