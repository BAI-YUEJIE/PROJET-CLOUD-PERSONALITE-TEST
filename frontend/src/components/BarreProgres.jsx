import '../styles/BarreProgres.css';

function BarreProgres({ actuel, total }) {
  const pourcentage = (actuel / total) * 100;

  return (
    <div className="barre-progres-conteneur">
      <div className="info-progres">
        <span className="texte-module">Module {actuel} / {total}</span>
        <span className="texte-pourcentage">{Math.round(pourcentage)}%</span>
      </div>
      <div className="barre-progres">
        <div 
          className="remplissage-progres" 
          style={{ width: `${pourcentage}%` }}
        />
      </div>
    </div>
  );
}

export default BarreProgres;