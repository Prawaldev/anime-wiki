import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchCharacters } from '../services/jikan';
import type { Character } from '../services/jikan';
import { User, Heart, ChevronRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      if (query) {
        const results = await searchCharacters(query);
        setCharacters(results);
      } else {
        // Fetch some popular characters for the home page
        const popular = await searchCharacters('');
        setCharacters(popular);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  return (
    <div>
      <section style={{ marginBottom: '3rem', textAlign: 'center', padding: '2rem 0' }}>
        <h1 style={{ borderBottom: 'none', fontSize: '3rem', marginBottom: '1rem' }}>
          Welcome to <span style={{ color: 'var(--accent-cyan)' }}>Anime Wiki</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
          The free encyclopedia of anime characters that anyone can read. 
          Discover details about your favorite characters from thousands of anime series.
        </p>
      </section>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={24} color="var(--accent-cyan)" />
          {query ? `Search results for "${query}"` : 'Popular Characters'}
        </h2>
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
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Searching Jikan API...</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {characters.length > 0 ? characters.map((char) => (
            <Link 
              key={char.mal_id} 
              to={`/character/${char.mal_id}`}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-wiki)',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'transform 0.2s, border-color 0.2s',
                display: 'flex',
                flexDirection: 'column'
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
              <div style={{ height: '320px', overflow: 'hidden' }}>
                <img 
                  src={char.images.jpg.image_url} 
                  alt={char.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{char.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>{char.name_kanji}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--accent-purple)' }}>
                    <Heart size={14} fill="var(--accent-purple)" />
                    {char.favorites.toLocaleString()}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--accent-cyan)' }}>
                    View Article <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          )) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              No characters found. Try a different search term.
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
