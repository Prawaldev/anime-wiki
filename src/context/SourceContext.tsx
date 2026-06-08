import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type DataSource = 'auto' | 'jikan' | 'anilist';

interface SourceContextType {
  source: DataSource;
  setSource: (source: DataSource) => void;
}

const SourceContext = createContext<SourceContextType | undefined>(undefined);

export const SourceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [source, setSource] = useState<DataSource>('auto');

  return (
    <SourceContext.Provider value={{ source, setSource }}>
      {children}
    </SourceContext.Provider>
  );
};

export const useSource = () => {
  const context = useContext(SourceContext);
  if (!context) {
    throw new Error('useSource must be used within a SourceProvider');
  }
  return context;
};
