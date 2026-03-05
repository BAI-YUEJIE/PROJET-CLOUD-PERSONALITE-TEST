import '../styles/Accueil.css';

function Accueil({ onDemarrer }) {
  return (
    <div className="accueil">
      <div className="carte-accueil">
        <h1>Test de Personnalité Géométrique</h1>
        <p className="sous-titre">
          Découvrez votre type de personnalité à travers 6 formes géométriques
        </p>
        
        <div className="formes-apercu">
          <span className="forme">⬜</span>
          <span className="forme">🔺</span>
          <span className="forme">⚪</span>
          <span className="forme">🌙</span>
          <span className="forme">⭐</span>
          <span className="forme">✚</span>
        </div>

        <div className="info-test">
          <h2>Comment ça marche ?</h2>
          <ul>
            <li>
              <strong>7 modules</strong> à compléter
            </li>
            <li>
              Pour chaque module, <strong>classez 6 options</strong> de 1 (plus important) à 6 (moins important)
            </li>
            <li>
              Chaque numéro ne peut être utilisé qu'<strong>une seule fois</strong>
            </li>
            <li>
              Durée estimée : <strong>5-10 minutes</strong>
            </li>
          </ul>
        </div>

        <button className="btn-demarrer" onClick={onDemarrer}>
          Commencer le Test
        </button>
      </div>
    </div>
  );
}

export default Accueil;