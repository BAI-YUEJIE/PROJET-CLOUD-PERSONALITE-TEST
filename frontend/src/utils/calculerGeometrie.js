/**
 * 🚧 FICHIER TEMPORAIRE - Pour développement seulement
 * 
 * Cette fonction simule le calcul côté backend.
 * À SUPPRIMER ou DÉSACTIVER lors de l'intégration avec le vrai backend.
 */

/**
 * Calcule les scores pour chaque type géométrique (MOCK - simule backend)
 * @param {Object} tousLesClassements - Classements de tous les modules
 * @returns {Object} Scores et pourcentages pour chaque type
 */
export function calculerScoresMock(tousLesClassements) {
  console.log('⚠️ UTILISATION MOCK - Simulation backend');
  
  // Initialiser les scores
  const scores = {
    square: 0,
    triangle: 0,
    circle: 0,
    moon: 0,
    star: 0,
    cross: 0
  };

  // Pour chaque module (1-7)
  Object.values(tousLesClassements).forEach(classement => {
    // Pour chaque option classée
    Object.entries(classement).forEach(([typeId, rang]) => {
      // Le rang est le score : 6 = plus important, 1 = moins important
      scores[typeId] += rang;
    });
  });

  // Calculer le score total (toujours 168 pour 7 modules)
  const scoreTotal = Object.values(scores).reduce((sum, score) => sum + score, 0);

  // Calculer les pourcentages
  const pourcentages = {};
  Object.entries(scores).forEach(([type, score]) => {
    pourcentages[type] = parseFloat(((score / scoreTotal) * 100).toFixed(1));
  });

  // Trier par score décroissant
  const classement = Object.entries(scores)
    .map(([type, score]) => ({
      type,
      score,
      pourcentage: pourcentages[type]
    }))
    .sort((a, b) => b.score - a.score);

  // Générer un resultId fictif
  const resultId = 'mock-' + Date.now();

  return {
    resultId,
    scores,
    pourcentages,
    typePrincipal: classement[0].type,
    classement
  };
}
