import { useState, useEffect } from 'react'
import type { Anime, AnimeCharacter, Recommendation, Picture } from '../utils/types'
import { getAnimeFull, getAnimeCharacters, getAnimeRecommendations, getAnimePictures } from '../utils/api'
import { stripHtml } from '../utils/helpers'
import Loader from './Loader'

interface Props {
  id: number
  onBack: () => void
  onCharacterClick: (id: number) => void
  onAnimeClick: (id: number) => void
}

export default function AnimeView({ id, onBack, onCharacterClick, onAnimeClick }: Props) {
  const [anime, setAnime] = useState<Anime | null>(null)
  const [characters, setCharacters] = useState<AnimeCharacter[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [pictures, setPictures] = useState<Picture[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const animeRes = await getAnimeFull(id)
        if (cancelled) return
        setAnime(animeRes.data)
      } catch {
        if (!cancelled) setAnime(null)
      }

      try {
        const [charRes, recRes, picRes] = await Promise.all([
          getAnimeCharacters(id),
          getAnimeRecommendations(id),
          getAnimePictures(id),
        ])
        if (cancelled) return
        setCharacters(charRes.data.slice(0, 30))
        setRecommendations(recRes.data.slice(0, 12))
        setPictures(picRes.data.slice(0, 12))
      } catch {
        // secondary data is optional
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) return <Loader />
  if (!anime) return <p>Failed to load anime details.</p>

  const {
    title, title_english, title_japanese, images, score, rank, popularity,
    status, episodes, type, aired, season, year, studios, genres, themes,
    synopsis, background,
  } = anime

  return (
    <>
      <button className="back-btn" onClick={onBack}>
        &larr; Back
      </button>

      <div className="detail-layout">
        <div className="detail-poster">
          <img src={images.jpg.large_image_url} alt={title} />
        </div>
        <div className="detail-info">
          <h1>{title_english || title}</h1>
          {title_japanese && <p className="subtitle"><strong>Japanese:</strong> {title_japanese}</p>}
          {title_english && title !== title_english && <p className="subtitle"><strong>Japanese:</strong> {title}</p>}

          <div className="meta-grid">
            {score != null && <div className="meta-box"><strong>Score</strong><span>{score}</span></div>}
            {rank != null && <div className="meta-box"><strong>Rank</strong><span>#{rank}</span></div>}
            {popularity != null && <div className="meta-box"><strong>Popularity</strong><span>#{popularity}</span></div>}
            <div className="meta-box"><strong>Status</strong><span className={`status-badge status-${status?.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span></div>
            {episodes != null && <div className="meta-box"><strong>Episodes</strong><span>{episodes}</span></div>}
            {type && <div className="meta-box"><strong>Type</strong><span>{type}</span></div>}
            {aired?.from && <div className="meta-box"><strong>Aired</strong><span>{new Date(aired.from).getFullYear()}{aired.to ? ` - ${new Date(aired.to).getFullYear()}` : ''}</span></div>}
            {season && <div className="meta-box"><strong>Season</strong><span>{season} {year}</span></div>}
            {studios?.length > 0 && (
              <div className="meta-box"><strong>Studio</strong><span>{studios.map(s => s.name).join(', ')}</span></div>
            )}
          </div>

          {genres?.length > 0 && (
            <div className="tag-list">
              {genres.map(g => <span key={g.name} className="tag">{g.name}</span>)}
            </div>
          )}
          {themes?.length > 0 && (
            <div className="tag-list">
              {themes.map(t => <span key={t.name} className="tag">{t.name}</span>)}
            </div>
          )}
        </div>
      </div>

      {synopsis && (
        <section>
          <h2>Synopsis</h2>
          <p>{stripHtml(synopsis)}</p>
        </section>
      )}

      {background && (
        <section>
          <h2>Background</h2>
          <p>{stripHtml(background)}</p>
        </section>
      )}

      {characters.length > 0 && (
        <section>
          <h2>Characters</h2>
          <div className="card-grid">
            {characters.map(c => (
              <div key={c.character.mal_id} className="card card-sm" onClick={() => onCharacterClick(c.character.mal_id)}>
                <img src={c.character.images.jpg.image_url} alt={c.character.name} />
                <div className="card-body">
                  <h3>{c.character.name}</h3>
                  <p className="subtitle"><strong>Role:</strong> {c.role}</p>
                  {c.voice_actors?.slice(0, 1).map(va => (
                    <p key={va.person.name} className="subtitle"><strong>VA:</strong> {va.person.name} ({va.language})</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {pictures.length > 0 && (
        <section>
          <h2>Pictures</h2>
          <div className="gallery-grid">
            {pictures.map((pic, i) => (
              <img key={i} src={pic.jpg.image_url} alt="" loading="lazy" />
            ))}
          </div>
        </section>
      )}

      {recommendations.length > 0 && (
        <section>
          <h2>Recommendations</h2>
          <div className="card-grid">
            {recommendations.map(r => (
              <div key={r.entry.mal_id} className="card" onClick={() => onAnimeClick(r.entry.mal_id)}>
                <img src={r.entry.images.jpg.image_url} alt={r.entry.title} />
                <div className="card-body">
                  <h3>{r.entry.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
