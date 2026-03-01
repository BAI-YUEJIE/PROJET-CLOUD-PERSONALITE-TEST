import { geometryTypes } from '../data/geometryTypes';
import '../styles/AffichageResultat.css';

function AffichageResultat({ resultats }) {
  const { classement, scores, pourcentages, typePrincipal } = resultats;
  
  const typePrincipalData = geometryTypes[typePrincipal];

  return (
    <div className="affichage-resultat">
      {/* Type principal */}
      <div className="type-principal">
        <div className="forme-principale" style={{ color: typePrincipalData.color }}>
          {typePrincipalData.shape}
        </div>
        <h2>{typePrincipalData.name}</h2>
        <h3>{typePrincipalData.title}</h3>
        <p className="pourcentage-principal">{pourcentages[typePrincipal]}%</p>
      </div>

      {/* Description du type principal */}
      <div className="description-type">
        <p>{typePrincipalData.description}</p>
      </div>

      {/* Graphique de tous les types */}
      <div className="graphique-complet">
        <h3>Votre Profil Complet</h3>
        <div className="barres-graphique">
          {classement.map((item, index) => {
            const typeData = geometryTypes[item.type];
            return (
              <div key={item.type} className="ligne-graphique">
                <div className="info-type">
                  <span className="forme-graphique" style={{ color: typeData.color }}>
                    {typeData.shape}
                  </span>
                  <span className="nom-type">{typeData.name}</span>
                </div>
                <div className="barre-conteneur">
                  <div 
                    className="barre-remplissage"
                    style={{ 
                      width: `${item.pourcentage}%`,
                      backgroundColor: typeData.color
                    }}
                  />
                  <span className="valeur-pourcentage">{item.pourcentage}%</span>
                </div>
                <div className="score-brut">{item.score} pts</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Traits caractéristiques */}
      <div className="traits-caracteristiques">
        <h3>Vos Traits Caractéristiques</h3>
        <ul>
          {typePrincipalData.traits.map((trait, index) => (
            <li key={index}>{trait}</li>
          ))}
        </ul>
      </div>

      {/* Carrières suggérées */}
      <div className="carrieres-suggerees">
        <h3>Carrières Suggérées</h3>
        <div className="liste-carrieres">
          {typePrincipalData.careers.map((career, index) => (
            <span key={index} className="badge-carriere">{career}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AffichageResultat;