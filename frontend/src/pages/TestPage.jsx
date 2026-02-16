import { useState } from 'react';
import { geometryModules } from '../data/geometryQuestions';
import BarreProgres from '../components/BarreProgres';
import QuestionClassement from '../components/QuestionClassement';
import '../styles/TestPage.css';

function TestPage({ onTerminer, onRetour }) {
  const [moduleActuel, setModuleActuel] = useState(1);
  const [tousLesClassements, setTousLesClassements] = useState({});
  const [classementActuel, setClassementActuel] = useState({});
  const [estComplet, setEstComplet] = useState(false);

  const module = geometryModules[moduleActuel - 1];

  const handleChangementClassement = (nouveauClassement, complet) => {
    setClassementActuel(nouveauClassement);
    setEstComplet(complet);
  };

  const handleSuivant = () => {
    // Sauvegarder le classement actuel
    const nouveauxClassements = {
      ...tousLesClassements,
      [moduleActuel]: classementActuel
    };
    setTousLesClassements(nouveauxClassements);

    if (moduleActuel < 7) {
      // Passer au module suivant
      setModuleActuel(moduleActuel + 1);
      setClassementActuel(nouveauxClassements[moduleActuel + 1] || {});
      setEstComplet(false);
    } else {
      // Test terminé
      onTerminer(nouveauxClassements);
    }
  };

  const handlePrecedent = () => {
    if (moduleActuel > 1) {
      setModuleActuel(moduleActuel - 1);
      setClassementActuel(tousLesClassements[moduleActuel - 1] || {});
      setEstComplet(true); // Le module précédent était forcément complet
    }
  };

  return (
    <div className="page-test">
      <div className="conteneur-test">
        <BarreProgres actuel={moduleActuel} total={7} />
        
        <QuestionClassement
          module={module}
          classement={classementActuel}
          onChangementClassement={handleChangementClassement}
        />

        <div className="boutons-navigation">
          {moduleActuel > 1 && (
            <button className="btn-precedent" onClick={handlePrecedent}>
              ← Précédent
            </button>
          )}
          
          {moduleActuel === 1 && (
            <button className="btn-annuler" onClick={onRetour}>
              Annuler
            </button>
          )}

          <button 
            className="btn-suivant" 
            onClick={handleSuivant}
            disabled={!estComplet}
          >
            {moduleActuel < 7 ? 'Suivant →' : 'Terminer ✓'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestPage;