import { useState } from 'react';
import Accueil from './pages/Accueil';
import TestPage from './pages/TestPage';
import Resultat from './pages/Resultat';
import { calculerScoresMock } from './utils/calculerGeometrie';
import './styles/App.css';

function App() {
  const [pageActuelle, setPageActuelle] = useState('accueil');
  const [resultatsFinaux, setResultatsFinaux] = useState(null);

  const demarrerTest = () => {
    setPageActuelle('test');
    setResultatsFinaux(null);
  };

  const retourAccueil = () => {
    setPageActuelle('accueil');
    setResultatsFinaux(null);
  };

  const API_URL = import.meta.env.VITE_API_URL; // defined in .env or via Vite

  const terminerTest = async (classements) => {
    console.log('📊 Classements utilisateur:', classements);

    if (API_URL) {
      try {
        const res = await fetch(`${API_URL}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rankings: classements })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setResultatsFinaux(data);
        setPageActuelle('resultat');
        return;
      } catch (err) {
        console.error('❌ erreur appel backend :', err);
        // éventuellement afficher message d'erreur à l'utilisateur
      }
    }

    // fallback mock (développement local sans backend)
    const resultats = calculerScoresMock(classements);
    console.log('✅ Résultats calculés (MOCK):', resultats);
    setResultatsFinaux(resultats);
    setPageActuelle('resultat');
  };

  return (
    <div className="app">
      {pageActuelle === 'accueil' && (
        <Accueil onDemarrer={demarrerTest} />
      )}
      
      {pageActuelle === 'test' && (
        <TestPage 
          onTerminer={terminerTest}
          onRetour={retourAccueil}
        />
      )}

      {pageActuelle === 'resultat' && resultatsFinaux && (
        <Resultat 
          resultats={resultatsFinaux}
          onRecommencer={retourAccueil}
        />
      )}
    </div>
  );
}

export default App;