import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCharacterById, getCharacterAnime, getCharacterVoiceActors, getAnimeCharacters } from '../services/jikan';
import type { Character, CharacterAnimeAppearance, VoiceActor, AnimeCharacter } from '../services/jikan';
import { ExternalLink, ArrowLeft, Info } from 'lucide-react';
import styles from './CharacterPage.module.css';
import infoStyles from '../components/Infobox.module.css';
import DescriptionSystem from '../components/DescriptionSystem';

const CharacterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [anime, setAnime] = useState<CharacterAnimeAppearance[]>([]);
  const [voices, setVoices] = useState<VoiceActor[]>([]);
  const [relatedCharacters, setRelatedCharacters] = useState<AnimeCharacter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChar = async () => {
      if (id) {
        setLoading(true);
        const [charData, animeData, voiceData] = await Promise.all([
          getCharacterById(parseInt(id)),
          getCharacterAnime(parseInt(id)),
          getCharacterVoiceActors(parseInt(id))
        ]);
        setCharacter(charData);
        setAnime(animeData);
        setVoices(voiceData);

        if (animeData.length > 0) {
          const firstAnimeId = animeData[0].anime.mal_id;
          const animeChars = await getAnimeCharacters(firstAnimeId);
          setRelatedCharacters(animeChars.filter((c: AnimeCharacter) => c.character.mal_id !== parseInt(id)).slice(0, 8));
        }

        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    fetchChar();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-secondary)' }}>Loading article...</h2>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--accent-purple)' }}>Character not found</h2>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <ArrowLeft size={18} /> Back
        </Link>
      </div>
    );
  }

  return (
    <div className={`${styles.pageContainer} container`}>
      <div className={styles.articleContent}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={16} /> Back
        </Link>

        <h1>{character.name}</h1>
        <p className={styles.subtitle}>
          From Anime Wiki, the free encyclopedia
        </p>

        <section className={styles.description}>
          <h2>Biography</h2>
          <DescriptionSystem 
            jikanDescription={character.about || ""} 
            characterName={character.name} 
          />
        </section>

        <h2>Appearances</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {anime && anime.length > 0 ? anime.slice(0, 8).map((item) => (
            <Link key={item.anime.mal_id} to={`/anime/${item.anime.mal_id}`} style={{ 
              textDecoration: 'none', 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '4px',
              border: '1px solid var(--border-wiki)',
              overflow: 'hidden'
            }}>
              <img 
                src={item.anime.images.jpg.image_url || '/placeholder.png'} 
                alt={item.anime.title} 
                style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
                onError={(e) => (e.currentTarget.src = '/placeholder.png')}
              />
              <div style={{ padding: '0.5rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.anime.title}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{item.role}</p>
              </div>
            </Link>
          )) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No appearances listed.</p>
          )}
        </div>

        {relatedCharacters && relatedCharacters.length > 0 && (
          <>
            <h2>Related Characters</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {relatedCharacters.map((char) => (
                <Link key={char.character.mal_id} to={`/character/${char.character.mal_id}`} style={{ textDecoration: 'none', textAlign: 'center' }}>
                  <img 
                    src={char.character.images.jpg.image_url || '/placeholder.png'} 
                    alt={char.character.name} 
                    style={{ width: '100%', borderRadius: '4px', aspectRatio: '2/3', objectFit: 'cover', border: '1px solid var(--border-wiki)' }}
                    onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                  />
                  <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {char.character.name}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{char.role}</p>
                </Link>
              ))}
            </div>
          </>
        )}

        <h2>Voice Actors</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {voices && voices.length > 0 ? voices.map((v, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <img 
                src={v.person.images.jpg.image_url || '/placeholder.png'} 
                alt={v.person.name} 
                style={{ width: '100%', borderRadius: '50%', aspectRatio: '1/1', objectFit: 'cover', border: '2px solid var(--border-wiki)', maxWidth: '80px' }}
                onError={(e) => (e.currentTarget.src = '/placeholder.png')}
              />
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>{v.person.name}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{v.language}</p>
            </div>
          )) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No voice actors listed.</p>
          )}
        </div>

        <h2>Nicknames</h2>
        <ul className={styles.list}>
          {character.nicknames && character.nicknames.length > 0 ? (
            character.nicknames.map((nick, idx) => <li key={idx}>{nick}</li>)
          ) : (
            <li>No nicknames listed.</li>
          )}
        </ul>

        <h2>External links</h2>
        <div className={styles.externalLinks}>
          <a href={character.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ExternalLink size={16} /> MAL Profile
          </a>
        </div>
      </div>

      <aside>
        <div className={infoStyles.infobox}>
          <div className={infoStyles.header}>
            {character.name}
          </div>

          <div className={infoStyles.imageContainer}>
            <img 
              src={character.images.jpg.image_url || '/placeholder.png'} 
              alt={character.name} 
              className={infoStyles.image}
              onError={(e) => (e.currentTarget.src = '/placeholder.png')}
            />
          </div>

          <table className={infoStyles.table}>
            <tbody>
              <tr>
                <th>Native Name</th>
                <td>{character.name_kanji}</td>
              </tr>
              <tr>
                <th>MAL ID</th>
                <td>{character.mal_id}</td>
              </tr>
              <tr>
                <th>Favorites</th>
                <td>{character.favorites.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div className={infoStyles.footer}>
            <Info size={12} /> Data synced from Jikan API
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CharacterPage;

