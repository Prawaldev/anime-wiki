import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnimeById, getAnimeCharacters, getAnimeRecommendations } from '../services/jikan';
import type { Anime, AnimeCharacter, Recommendation } from '../services/jikan';
import { ExternalLink, ArrowLeft, Info, Star } from 'lucide-react';
import styles from './CharacterPage.module.css';
import infoStyles from '../components/Infobox.module.css';
import DescriptionSystem from '../components/DescriptionSystem';

const AnimePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [characters, setCharacters] = useState<AnimeCharacter[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        const [animeData, charData, recData] = await Promise.all([
          getAnimeById(parseInt(id)),
          getAnimeCharacters(parseInt(id)),
          getAnimeRecommendations(parseInt(id))
        ]);
        setAnime(animeData);
        setCharacters(charData.slice(0, 10));
        setRecommendations(recData.slice(0, 6));
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-secondary)' }}>Loading article...</h2>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--accent-purple)' }}>Not found</h2>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
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

        <h1>{anime.title}</h1>
        <p className={styles.subtitle}>
          From Anime Wiki, the free encyclopedia
        </p>

        <section className={styles.description}>
          <h2>Synopsis</h2>
          <DescriptionSystem 
            jikanDescription={anime.synopsis || ""} 
            characterName={anime.title} 
          />
        </section>

        <h2>Main Characters</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {characters && characters.length > 0 ? characters.map((char) => (
            <Link key={char.character.mal_id} to={`/character/${char.character.mal_id}`} style={{ textDecoration: 'none', textAlign: 'center' }}>
              <img 
                src={char.character.images.jpg.image_url || '/placeholder.png'} 
                alt={char.character.name} 
                style={{ width: '100%', borderRadius: '4px', aspectRatio: '2/3', objectFit: 'cover', border: '1px solid var(--border-wiki)' }}
                onError={(e) => (e.currentTarget.src = '/placeholder.png')}
              />
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>{char.character.name}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{char.role}</p>
            </Link>
          )) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No main characters listed.</p>
          )}
        </div>

        <h2>You May Also Like</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {recommendations && recommendations.length > 0 ? recommendations.map((rec) => (
            <Link key={rec.entry.mal_id} to={`/anime/${rec.entry.mal_id}`} style={{ textDecoration: 'none' }}>
              <img 
                src={rec.entry.images.jpg.image_url || '/placeholder.png'} 
                alt={rec.entry.title} 
                style={{ width: '100%', borderRadius: '4px', aspectRatio: '2/3', objectFit: 'cover', border: '1px solid var(--border-wiki)' }}
                onError={(e) => (e.currentTarget.src = '/placeholder.png')}
              />
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {rec.entry.title}
              </p>
            </Link>
          )) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No related anime found.</p>
          )}
        </div>

        <h2>External links</h2>
        <div className={styles.externalLinks}>
          <a href={anime.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ExternalLink size={16} /> MAL Profile
          </a>
        </div>
      </div>

      <aside>
        <div className={infoStyles.infobox}>
          <div className={infoStyles.header}>
            {anime.title}
          </div>

          <div className={infoStyles.imageContainer}>
            <img 
              src={anime.images.jpg.large_image_url || anime.images.jpg.image_url || '/placeholder.png'} 
              alt={anime.title} 
              className={infoStyles.image}
              onError={(e) => (e.currentTarget.src = '/placeholder.png')}
            />
          </div>

          <table className={infoStyles.table}>
            <tbody>
              <tr>
                <th>Japanese</th>
                <td>{anime.title_japanese}</td>
              </tr>
              <tr>
                <th>Type</th>
                <td>{anime.type}</td>
              </tr>
              <tr>
                <th>Episodes</th>
                <td>{anime.episodes || 'Unknown'}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{anime.status}</td>
              </tr>
              <tr>
                <th>MAL ID</th>
                <td>{anime.mal_id}</td>
              </tr>
              <tr>
                <th>Studios</th>
                <td>{anime.studios.map(s => s.name).join(', ')}</td>
              </tr>
              <tr>
                <th>Genres</th>
                <td>{anime.genres.map(g => g.name).join(', ')}</td>
              </tr>
              <tr>
                <th>Rating</th>
                <td>{anime.rating}</td>
              </tr>
              <tr>
                <th>Score</th>
                <td style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  {anime.score} ({anime.scored_by?.toLocaleString()} votes)
                </td>
              </tr>
              <tr>
                <th>Favorites</th>
                <td style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {anime.favorites.toLocaleString()}
                </td>
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

export default AnimePage;
