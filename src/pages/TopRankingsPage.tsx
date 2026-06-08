import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTopCharacters, getTopAnime } from '../services/jikan';
import type { Character, Anime } from '../services/jikan';
import { Heart, Star, TrendingUp, Database } from 'lucide-react';

interface TopRankingsPageProps {
  type: 'characters' | 'anime';
}

const TopRankingsPage: React.FC<TopRankingsPageProps> = ({ type }) => {
  const [items, setItems] = useState<(Character | Anime)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const data = type === 'characters' ? await getTopCharacters(1) : await getTopAnime(1);
      setItems(data);
      setLoading(false);
      window.scrollTo(0, 0);
    };
    fetchItems();
  }, [type]);

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-secondary)' }}>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>
        {type === 'characters' ? 'Top Characters' : 'Top Anime'}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
        {items && items.length > 0 ? items.map((item, index) => {
          const isCharacter = 'name' in item;
          const title = isCharacter ? item.name : (item as Anime).title;
          const image = isCharacter ? item.images.jpg.image_url : (item as Anime).images.jpg.large_image_url;
          const score = isCharacter ? item.favorites : (item as Anime).score;
          const itemType = isCharacter ? 'Character' : (item as Anime).type;

          return (
            <Link 
              key={`${item.mal_id}-${index}`} 
              to={type === 'characters' ? `/character/${item.mal_id}` : `/anime/${item.mal_id}`}
              style={{ 
                textDecoration: 'none', 
                color: 'inherit',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid var(--border-wiki)',
                transition: 'transform 0.2s',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ 
                position: 'absolute', 
                top: '0.5rem', 
                right: '0.5rem', 
                backgroundColor: 'rgba(0,0,0,0.6)', 
                color: 'white', 
                fontSize: '0.65rem', 
                padding: '2px 6px', 
                borderRadius: '4px',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <Database size={10} /> {item._source}
              </div>
              <div style={{ position: 'relative' }}>
                <img 
                  src={image} 
                  alt={title}
                  style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
                />
                <div style={{ 
                  position: 'absolute', 
                  top: '0.5rem', 
                  left: '0.5rem', 
                  backgroundColor: 'rgba(0,0,0,0.7)', 
                  color: 'white', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <TrendingUp size={12} color="var(--accent-cyan)" /> #{index + 1}
                </div>
              </div>
              
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {title}
                </h3>
                
                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {isCharacter ? (
                      <Heart size={14} color="var(--accent-purple)" fill="var(--accent-purple)" />
                    ) : (
                      <Star size={14} color="#f59e0b" fill="#f59e0b" />
                    )}
                    {score?.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '0.7rem' }}>{itemType}</span>
                </div>
              </div>
            </Link>
          );
        }) : (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', gridColumn: '1 / -1' }}>No rankings found.</p>
        )}
      </div>
    </div>
  );
};

export default TopRankingsPage;
