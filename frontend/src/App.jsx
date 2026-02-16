import { useState } from 'react';
import Accueil from './pages/Accueil';
import TestPage from './pages/TestPage';
import { calculerScoresMock } from './utils/calculerGeometrie';
import './styles/App.css';

function App() {
  const [pageActuelle, setPageActuelle] = useState('accueil');
  const [resultatsFinaux, setResultatsFinaux] = useState(null);

  const demarrerTest = () => {
    setPageActuelle('test');
  };

  const retourAccueil = () => {
    setPageActuelle('accueil');
    setResultatsFinaux(null);
  };

  const terminerTest = (classements) => {
    console.log('📊 Classements utilisateur:', classements);
    
    // 🚧 MODE DÉVELOPPEMENT: Utiliser Mock
    const resultats = calculerScoresMock(classements);
    console.log('✅ Résultats calculés (MOCK):', resultats);
    
    // 🔜 MODE PRODUCTION: Appeler vrai backend
    // fetch('API_GATEWAY_URL/submit', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ rankings: classements })
    // })
    // .then(res => res.json())
    // .then(resultats => {
    //   setResultatsFinaux(resultats);
    //   setPageActuelle('resultat');
    // });
    
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

      {pageActuelle === 'resultat' && (
        <div className="page-temporaire">
          <h1>Résultats</h1>
          <p>Votre type principal: <strong>{resultatsFinaux?.typePrincipal}</strong></p>
          <pre>{JSON.stringify(resultatsFinaux, null, 2)}</pre>
          <button onClick={retourAccueil}>
            Retour à l'accueil
          </button>
        </div>
      )}
    </div>
  );
}

export default App;