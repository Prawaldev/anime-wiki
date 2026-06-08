import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DescriptionSystemProps {
  jikanDescription: string;
  characterName: string;
}

const DescriptionSystem: React.FC<DescriptionSystemProps> = ({ jikanDescription, characterName }) => {
  const [descriptions, setDescriptions] = useState<Record<string, { content: string, loading: boolean }>>({
    'Jikan': { content: jikanDescription, loading: false },
    'Wikipedia': { content: '', loading: true }
  });
  const [activeSource, setActiveSource] = useState('Jikan'); 

  useEffect(() => {
    // Reset descriptions on name change
    setDescriptions({ 
      'Jikan': { content: jikanDescription, loading: false },
      'Wikipedia': { content: '', loading: true }
    });
    setActiveSource('Jikan');

    const fetchWikipedia = async () => {
      try {
        const wikiResponse = await axios.get(`https://en.wikipedia.org/w/api.php`, {
          params: {
            action: 'query',
            prop: 'extracts',
            exintro: true,
            explaintext: true,
            titles: characterName,
            format: 'json',
            origin: '*'
          }
        });
        const pages = wikiResponse.data.query.pages;
        const pageId = Object.keys(pages)[0];
        const content = pages[pageId].extract || '';
        
        if (content) {
          setDescriptions(prev => ({ ...prev, 'Wikipedia': { content, loading: false } }));
        } else {
          setDescriptions(prev => ({ ...prev, 'Wikipedia': { content: 'No description available on Wikipedia.', loading: false } }));
        }
      } catch (error) {
        console.error('Error fetching Wikipedia description:', error);
        setDescriptions(prev => ({ ...prev, 'Wikipedia': { content: 'Failed to load from Wikipedia.', loading: false } }));
      }
    };

    fetchWikipedia();
  }, [characterName, jikanDescription]);

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
          Source:
        </span>
        {Object.entries(descriptions).map(([source, data]) => (
          <button
            key={source}
            onClick={() => setActiveSource(source)}
            disabled={data.loading}
            style={{
              padding: '0.2rem 0.6rem',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: '1px solid var(--border-wiki)',
              backgroundColor: activeSource === source ? 'var(--accent-cyan)' : 'var(--bg-secondary)',
              color: activeSource === source ? 'var(--bg-primary)' : 'var(--text-primary)',
              cursor: data.loading ? 'not-allowed' : 'pointer',
              fontWeight: activeSource === source ? 'bold' : 'normal',
              transition: 'all 0.2s'
            }}
          >
            {activeSource === source ? '✔ ' : ''}{source} {data.loading ? '...' : activeSource === source ? '(Active)' : ''}
          </button>
        ))}
      </div>
      
      <div style={{ whiteSpace: 'pre-line', position: 'relative' }}>
        {descriptions[activeSource]?.content || (descriptions[activeSource]?.loading ? "Loading..." : "No description available from this source.")}
      </div>
    </div>
  );
};

export default DescriptionSystem;
