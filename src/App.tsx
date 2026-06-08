import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CharacterPage from './pages/CharacterPage';
import AnimePage from './pages/AnimePage';
import TopRankingsPage from './pages/TopRankingsPage';
import { SourceProvider } from './context/SourceContext';

function App() {
  return (
    <SourceProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/character/:id" element={<CharacterPage />} />
            <Route path="/anime/:id" element={<AnimePage />} />
            <Route path="/top-characters" element={<TopRankingsPage type="characters" />} />
            <Route path="/top-anime" element={<TopRankingsPage type="anime" />} />
          </Routes>
        </Layout>
      </Router>
    </SourceProvider>
  );
}

export default App;
