import { useState, useEffect } from 'react'
import type { Character, Picture } from '../utils/types'
import { getCharacter, getCharacterAnime, getCharacterVoices, getCharacterPictures } from '../utils/api'
import { getWikipediaSummary } from '../utils/wikipedia'
import { stripHtml } from '../utils/helpers'
import Loader from './Loader'

interface VAWiki {
  name: string
  language: string
  img: string
  wikiTitle: string | null
  wikiExtract: string | null
  wikiUrl: string | null
  loading: boolean
}

interface Props {
  id: number
  onBack: () => void
  onAnimeClick: (id: number) => void
}

export default function CharacterView({ id, onBack, onAnimeClick }: Props) {
  const [character, setCharacter] = useState<Character | null>(null)
  const [animeAppearances, setAnimeAppearances] = useState<{ role: string; anime: { mal_id: number; title: string; images: { jpg: { image_url: string } } } }[]>([])
  const [voices, setVoices] = useState<{ person: { name: string; images: { jpg: { image_url: string } } }; language: string }[]>([])
  const [pictures, setPictures] = useState<Picture[]>([])
  const [vaWiki, setVaWiki] = useState<VAWiki[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)

      let voicesData: { person: { name: string; images: { jpg: { image_url: string } } }; language: string }[] = []

      try {
        const charRes = await getCharacter(id)
        if (cancelled) return
        setCharacter(charRes.data)
      } catch {
        if (!cancelled) setCharacter(null)
      }

      try {
        const [animeRes, voicesRes, picRes] = await Promise.all([
          getCharacterAnime(id),
          getCharacterVoices(id),
          getCharacterPictures(id),
        ])
        if (cancelled) return
        setAnimeAppearances(animeRes.data)
        setVoices(voicesRes.data)
        setPictures(picRes.data)
        voicesData = voicesRes.data
      } catch {
        // secondary data is optional
      } finally {
        if (!cancelled) setLoading(false)
      }

      if (voicesData.length > 0) {
        const initial = voicesData.map(v => ({
          name: v.person.name,
          language: v.language,
          img: v.person.images?.jpg?.image_url || '',
          wikiTitle: null,
          wikiExtract: null,
          wikiUrl: null,
          loading: true,
        }))
        setVaWiki(initial)

        for (let i = 0; i < voicesData.length; i++) {
          const v = voicesData[i]
          const summary = await getWikipediaSummary(v.person.name)
          if (cancelled) return
          setVaWiki(prev => {
            const next = [...prev]
            next[i] = {
              ...next[i],
              wikiTitle: summary?.title ?? null,
              wikiExtract: summary?.extract ?? null,
              wikiUrl: summary?.content_urls?.desktop?.page ?? null,
              loading: false,
            }
            return next
          })
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) return <Loader />
  if (!character) return <p>Failed to load character details.</p>

  const charImg = character.images.jpg.large_image_url || character.images.jpg.image_url

  return (
    <>
      <button className="back-btn" onClick={onBack}>
        &larr; Back
      </button>

      <div className="detail-layout">
        <div className="detail-poster">
          <img src={charImg} alt={character.name} />
        </div>
        <div className="detail-info">
          <h1>{character.name}</h1>
          {character.name_kanji && <p className="subtitle"><strong>Japanese:</strong> {character.name_kanji}</p>}
          {character.nicknames?.length > 0 && (
            <p className="subtitle"><strong>Nicknames:</strong> {character.nicknames.join(', ')}</p>
          )}
          <div className="meta-grid" style={{ marginTop: '1em' }}>
            {character.favorites > 0 && (
              <div className="meta-box">
                <strong>Favorites</strong>
                <span>{character.favorites.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {character.about && (
        <section>
          <h2>About</h2>
          <p>{stripHtml(character.about)}</p>
        </section>
      )}

      {animeAppearances.length > 0 && (
        <section>
          <h2>Anime Appearances</h2>
          <div className="card-grid">
            {animeAppearances.map(a => (
              <div key={a.anime.mal_id} className="card card-sm" onClick={() => onAnimeClick(a.anime.mal_id)}>
                <img src={a.anime.images.jpg.image_url} alt={a.anime.title} />
                <div className="card-body">
                  <h3>{a.anime.title}</h3>
                  <p className="subtitle"><strong>Role:</strong> {a.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {voices.length > 0 && (
        <section>
          <h2>Voice Actors</h2>
          <div className="va-grid">
            {voices.map((v, i) => (
              <div key={v.person.name} className="va-card">
                <div className="va-header">
                  <img src={v.person.images?.jpg?.image_url || ''} alt={v.person.name} />
                  <div className="va-info">
                    <h3>{v.person.name}</h3>
                    <p className="subtitle"><strong>Language:</strong> {v.language}</p>
                  </div>
                </div>
                {vaWiki[i]?.loading && <p className="va-wiki-loading">Loading Wikipedia data...</p>}
                {vaWiki[i]?.wikiExtract && !vaWiki[i]?.loading && (
                  <div className="va-wiki">
                    <p>{vaWiki[i].wikiExtract!.slice(0, 600)}{vaWiki[i].wikiExtract!.length > 600 ? '...' : ''}</p>
                    {vaWiki[i].wikiUrl && (
                      <a href={vaWiki[i].wikiUrl!} target="_blank" rel="noopener noreferrer" className="va-wiki-link">
                        Read more on Wikipedia &rarr;
                      </a>
                    )}
                  </div>
                )}
                {!vaWiki[i]?.wikiExtract && !vaWiki[i]?.loading && (
                  <p className="va-wiki-none">No Wikipedia entry found.</p>
                )}
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
    </>
  )
}
