import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen } from 'lucide-react';

import styles from './SearchBar.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-wiki)',
        zIndex: 100,
        padding: '0.5rem 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 'bold' }}>
            <BookOpen className="text-cyan-400" size={24} color="var(--accent-cyan)" />
            <span>Anime <span style={{ color: 'var(--accent-cyan)' }}>Wiki</span></span>
          </Link>

          <form onSubmit={handleSearch} className={styles.form}>
            <input
              type="text"
              placeholder="Search characters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.input}
            />
            <Search 
              size={18} 
              className={styles.icon}
            />
          </form>

          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/">Home</Link>
            <a href="https://myanimelist.net" target="_blank" rel="noopener noreferrer">MAL</a>
          </nav>
        </div>
      </header>

      <main className="container" style={{ flex: 1 }}>
        {children}
      </main>

      <footer style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-wiki)',
        padding: '2rem',
        marginTop: 'auto',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem'
      }}>
        <p>Data provided by Jikan API (MyAnimeList unofficial API).</p>
        <p style={{ marginTop: '0.5rem' }}>© 2026 Anime Wiki - A Wikipedia-style Anime Encyclopedia</p>
      </footer>
    </div>
  );
};

export default Layout;
