import { useState } from 'react';
import Accueil from './pages/Accueil';
import './styles/App.css';

function App() {
  const [pageActuelle, setPageActuelle] = useState('accueil');
  // 'accueil' | 'test' | 'resultat'

  const demarrerTest = () => {
    setPageActuelle('test');
  };

  return (
    <div className="app">
      {pageActuelle === 'accueil' && (
        <Accueil onDemarrer={demarrerTest} />
      )}
      
      {pageActuelle === 'test' && (
        <div className="page-temporaire">
          <h1>Page de test</h1>
          <p>Module 1/7 - À développer prochainement</p>
          <button onClick={() => setPageActuelle('accueil')}>
            Retour à l'accueil
          </button>
        </div>
      )}

      {pageActuelle === 'resultat' && (
        <div className="page-temporaire">
          <h1>Page de résultat</h1>
          <p>À développer prochainement</p>
        </div>
      )}
    </div>
  );
}

export default App;