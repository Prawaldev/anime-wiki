import type { Character } from '../utils/types'

interface Props {
  character: Character
  onClick: (id: number) => void
}

export default function CharacterCard({ character, onClick }: Props) {
  return (
    <div className="card" onClick={() => onClick(character.mal_id)}>
      <img
        src={character.images.jpg.image_url}
        alt={character.name}
        loading="lazy"
      />
      <div className="card-body">
        <h3>{character.name}</h3>
        {character.name_kanji && (
          <p className="subtitle">{character.name_kanji}</p>
        )}
      </div>
    </div>
  )
}
