import AffichageResultat from '../components/AffichageResultat';
import '../styles/Resultat.css';

function Resultat({ resultats, onRecommencer }) {
  return (
    <div className="page-resultat">
      <div className="conteneur-resultat">
        <div className="entete-resultat">
          <h1>Vos Résultats</h1>
          <p className="sous-titre-resultat">
            Découvrez votre profil de personnalité Process Communication
          </p>
        </div>

        <AffichageResultat resultats={resultats} />

        <div className="actions-resultat">
          <button className="btn-recommencer" onClick={onRecommencer}>
            ↻ Recommencer le Test
          </button>
        </div>

        <div className="note-finale">
          <p>
            💡 <strong>Note :</strong> Ce test est un outil d'exploration personnelle. 
            Les résultats reflètent vos préférences actuelles et peuvent évoluer avec le temps.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Resultat;