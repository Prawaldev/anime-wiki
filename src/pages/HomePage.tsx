import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchCharacters, searchAnime } from '../services/jikan';
import type { Character, Anime } from '../services/jikan';
import { User, Heart, ChevronRight, Tv, Database } from 'lucide-react';

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchType, setSearchType] = useState<'character' | 'anime'>('character');
  const [results, setResults] = useState<(Character | Anime)[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);

      if (searchType === 'character') {
        const data = await searchCharacters(query);
        setResults(data);
      } else {
        const data = await searchAnime(query);
        setResults(data);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query, searchType]);

  return (
    <div>
      <section style={{ marginBottom: '3rem', textAlign: 'center', padding: '2rem 0' }}>
        <h1 style={{ borderBottom: 'none', fontSize: '3rem', marginBottom: '1rem' }}>
          Welcome to <span style={{ color: 'var(--accent-cyan)' }}>Anime Wiki</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
          The free encyclopedia of anime characters and series that anyone can read.
        </p>
      </section>

      <div style={{ 
        marginBottom: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          {searchType === 'character' ? <User size={24} color="var(--accent-cyan)" /> : <Tv size={24} color="var(--accent-cyan)" />}
          {query ? `Search results for "${query}"` : 'Popular Content'}
        </h2>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', padding: '0.25rem', border: '1px solid var(--border-wiki)' }}>
            <button 
              onClick={() => setSearchType('character')}
              style={{
                padding: '0.4rem 0.8rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: searchType === 'character' ? 'var(--accent-cyan)' : 'transparent',
                color: searchType === 'character' ? 'var(--bg-primary)' : 'var(--text-primary)',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              Characters
            </button>
            <button 
              onClick={() => setSearchType('anime')}
              style={{
                padding: '0.4rem 0.8rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: searchType === 'anime' ? 'var(--accent-cyan)' : 'transparent',
                color: searchType === 'anime' ? 'var(--bg-primary)' : 'var(--text-primary)',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              Anime
            </button>
          </div>
        </div>
      </div>


      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid var(--border-wiki)', 
            borderTopColor: 'var(--accent-cyan)', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Searching multiple APIs...</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {results && results.length > 0 ? results.map((item, idx) => {
            const isCharacter = 'name' in item;
            const title = isCharacter ? item.name : (item as Anime).title;
            const subTitle = isCharacter ? item.name_kanji : (item as Anime).title_japanese;
            const imageUrl = isCharacter ? item.images.jpg.image_url : (item as Anime).images.jpg.large_image_url || (item as Anime).images.jpg.image_url;

            return (
              <Link 
                key={`${item.mal_id}-${idx}`} 
                to={isCharacter ? `/character/${item.mal_id}` : `/anime/${item.mal_id}`}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-wiki)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, border-color 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-wiki)';
                }}
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
                <div style={{ height: '320px', overflow: 'hidden' }}>
                  <img 
                    src={imageUrl || '/placeholder.png'} 
                    alt={title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                  />
                </div>
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                      {subTitle}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--accent-purple)' }}>
                      <Heart size={14} fill="var(--accent-purple)" />
                      {item.favorites?.toLocaleString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--accent-cyan)' }}>
                      View Article <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          }) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              No results found. Try a different search term or type.
            </p>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
