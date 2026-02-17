import { useState, useEffect } from 'react';
import '../styles/QuestionClassement.css';

function QuestionClassement({ module, classement, onChangementClassement }) {
  const [classementLocal, setClassementLocal] = useState(classement || {});
  const [erreur, setErreur] = useState('');


  useEffect(() => {
    console.log('Module changé:', module.id, 'Classement:', classement);
    setClassementLocal(classement || {});
  }, [module.id, classement]);


  const getRangsUtilises = () => {
    return Object.values(classementLocal)
      .filter(r => r !== null && r !== '')
      .map(r => parseInt(r));
  };


  const verifierComplet = (classement) => {
    const rangs = Object.values(classement)
      .filter(r => r !== null && r !== '');
    
    const complete = rangs.length === 6 && new Set(rangs).size === 6;
    
    console.log('Vérification:', {
      moduleId: module.id,
      rangs,
      length: rangs.length,
      unique: new Set(rangs).size,
      complete
    });
    
    return complete;
  };


  const handleChangementRang = (optionId, rang) => {
    const nouveauRang = rang === '' ? null : parseInt(rang);
    

    if (nouveauRang !== null) {
      const optionAvecCeRang = Object.entries(classementLocal).find(
        ([id, r]) => r === nouveauRang && id !== optionId
      );
      
      if (optionAvecCeRang) {
        setErreur(`Le rang ${nouveauRang} est déjà utilisé`);
        setTimeout(() => setErreur(''), 2000);
        return;
      }
    }

    const nouveauClassement = {
      ...classementLocal,
      [optionId]: nouveauRang
    };

    setClassementLocal(nouveauClassement);
    setErreur('');
    

    const estComplet = verifierComplet(nouveauClassement);
    onChangementClassement(nouveauClassement, estComplet);
  };

  return (
    <div className="question-classement">
      <div className="entete-question">
        <h2>{module.title}</h2>
        <p className="description">{module.description}</p>
      </div>

      <div className="liste-options">
        {module.options.map((option) => (
          <div key={option.id} className="ligne-option">
            <div className="info-option">
              <span className="forme-option">{option.shape}</span>
              <span className="texte-option">{option.text}</span>
            </div>
            
            <select
              className="selecteur-rang"
              value={classementLocal[option.id] || ''}
              onChange={(e) => handleChangementRang(option.id, e.target.value)}
            >
              <option value="">-</option>
              <option value="6">6</option>
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>
          </div>
        ))}
      </div>

      {erreur && (
        <div className="message-erreur">
          ⚠️ {erreur}
        </div>
      )}

      <div className="aide-classement">
        <p>
          💡 <strong>Conseil :</strong> Classez de 6 (plus important pour vous) à 1 (moins important)
        </p>
        <p className="rangs-restants">
          Rangs utilisés : {getRangsUtilises().sort((a, b) => b - a).join(', ') || 'Aucun'}
        </p>
      </div>
    </div>
  );
}

export default QuestionClassement;
