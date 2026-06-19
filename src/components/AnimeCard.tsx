import type { Anime } from '../utils/types'

interface Props {
  anime: Anime
  onClick: (id: number) => void
}

export default function AnimeCard({ anime, onClick }: Props) {
  return (
    <div className="card" onClick={() => onClick(anime.mal_id)}>
      <img
        src={anime.images.jpg.image_url}
        alt={anime.title}
        loading="lazy"
      />
      <div className="card-body">
        <h3>{anime.title}</h3>
        <div className="card-meta">
          <span>
            <strong>Score:</strong> {anime.score ?? 'N/A'}
          </span>
          <span>
            <strong>Episodes:</strong> {anime.episodes ?? 'N/A'}
          </span>
        </div>
      </div>
    </div>
  )
}
