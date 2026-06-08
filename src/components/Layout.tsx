import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';

import styles from './SearchBar.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen flex flex-col">
      <header style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-wiki)',
        zIndex: 100,
        padding: '0.5rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
          width: '100%'
        }}>
          {/* Logo/Branding */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 'bold', flexShrink: 0 }}>
            <BookOpen className="text-cyan-400" size={24} color="var(--accent-cyan)" />
            <span>Anime <span style={{ color: 'var(--accent-cyan)' }}>Wiki</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.9rem', flexShrink: 0 }}>
            <Link to="/">Home</Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className={styles.form}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.input}
            />
          </form>

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle" onClick={toggleMenu} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', flexShrink: 0, padding: '0.25rem', display: 'flex', alignItems: 'center' }}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-wiki)',
            marginTop: '0.5rem'
          }}>
            <Link to="/top-characters" onClick={toggleMenu}>Top Characters</Link>
            <Link to="/top-anime" onClick={toggleMenu}>Top Anime</Link>
          </nav>
        )}
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
        <p>Data provided by Jikan API.</p>
        <p style={{ marginTop: '0.5rem' }}>© 2026 Anime Wiki - A Wikipedia-style Anime Encyclopedia</p>
      </footer>
    </div>
  );
};

export default Layout;
