import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCharacterById } from '../services/jikan';
import type { Character } from '../services/jikan';
import { ExternalLink, Heart, ArrowLeft, Info } from 'lucide-react';
import styles from './CharacterPage.module.css';
import infoStyles from '../components/Infobox.module.css';

const CharacterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChar = async () => {
      if (id) {
        setLoading(true);
        const data = await getCharacterById(parseInt(id));
        setCharacter(data);
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    fetchChar();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-secondary)' }}>Loading article...</h2>
      </div>
    );
  }

  if (!character) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--accent-purple)' }}>Character not found</h2>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <ArrowLeft size={18} /> Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.articleContent}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1>{character.name}</h1>
        <p className={styles.subtitle}>
          From Anime Wiki, the free encyclopedia
        </p>

        <section className={styles.description}>
          <p>
            {character.about || "No description available for this character."}
          </p>
        </section>

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
            <ExternalLink size={16} /> MyAnimeList Profile
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
              src={character.images.jpg.image_url} 
              alt={character.name} 
              className={infoStyles.image}
            />
          </div>

          <table className={infoStyles.table}>
            <tbody>
              <tr>
                <th>Japanese</th>
                <td>{character.name_kanji}</td>
              </tr>
              <tr>
                <th>Favorites</th>
                <td style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Heart size={14} fill="var(--accent-purple)" color="var(--accent-purple)" />
                  {character.favorites.toLocaleString()}
                </td>
              </tr>
              <tr>
                <th>MAL ID</th>
                <td>{character.mal_id}</td>
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
