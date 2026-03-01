export const geometryModules = [
  {
    id: 1,
    title: "Quels sont vos points forts ?",
    description: "Classez ces options de 6 (plus important) à 1 (moins important)",
    options: [
      { id: "star", shape: "⭐", text: "Compatissant, sensible et chaleureux" },
      { id: "triangle", shape: "🔺", text: "Logique, responsable et organisé" },
      { id: "cross", shape: "✚", text: "Engagé, observateur, consciencieux" },
      { id: "circle", shape: "⚪", text: "Adaptable, persuasif et charmeur" },
      { id: "square", shape: "⬜", text: "Réfléchi, imaginatif, calme" },
      { id: "moon", shape: "🌙", text: "Spontané, créatif, drôle" }
    ]
  },
  {
    id: 2,
    title: "Pour vous sentir bien, vous avez besoin",
    description: "Classez ces options de 6 (plus important) à 1 (moins important)",
    options: [
      { id: "square", shape: "⬜", text: "De silence et de calme" },
      { id: "triangle", shape: "🔺", text: "D'être reconnu pour votre travail" },
      { id: "cross", shape: "✚", text: "D'être reconnu pour vos idées" },
      { id: "moon", shape: "🌙", text: "De vous amuser en toutes occasions" },
      { id: "circle", shape: "⚪", text: "D'excitation et de challenges" },
      { id: "star", shape: "⭐", text: "De vous sentir apprécié" }
    ]
  },
  {
    id: 3,
    title: "Vos caractéristiques",
    description: "Classez ces options de 6 (plus important) à 1 (moins important)",
    options: [
      { id: "square", shape: "⬜", text: "Doué pour l'introspection, vous aimez les tâches concrètes et vous avez une bonne habileté manuelle." },
      { id: "triangle", shape: "🔺", text: "« Je pense donc je suis ». Vous appréciez la cohérence et prônez l'intelligence." },
      { id: "moon", shape: "🌙", text: "« Carpe diem ». Vous aimez jouer et profiter de l'instant présent" },
      { id: "circle", shape: "⚪", text: "Vous savez être ferme et direct quand c'est nécessaire. Vous avez une bonne affirmation et vous avez confiance en vous." },
      { id: "cross", shape: "✚", text: "Vous formulez souvent vos opinions, convictions et vous avez du mal à être contredit" },
      { id: "star", shape: "⭐", text: "Vous êtes doué pour l'harmonie, vous donnez facilement et avez du mal à dire non." }
    ]
  },
  {
    id: 4,
    title: "Comment exprimez-vous vos ressentis ?",
    description: "Classez ces options de 6 (plus important) à 1 (moins important)",
    options: [
      { id: "circle", shape: "⚪", text: "C'est rare car exprimer ses sentiments c'est un signe de faiblesse" },
      { id: "star", shape: "⭐", text: "C'est facile, c'est même très utile pour se faire comprendre" },
      { id: "moon", shape: "🌙", text: "C'est souvent facile ! Et très spontané ! Les gens autour de vous savent toujours ce que vous ressentez grâce également à un non verbal fort. Vous oscillez le plus souvent entre la joie et le dégout." },
      { id: "triangle", shape: "🔺", text: "Exprimez ses sentiments, c'est inutile et inapproprié surtout dans le travail. De toutes façons, vous êtes tranquilles avec ça, vous ressentez peu d'émotions." },
      { id: "square", shape: "⬜", text: "Vous êtes si calme que vous ne vous mettez jamais en colère et vous riez difficilement. Votre humeur est très stable." },
      { id: "cross", shape: "✚", text: "Vous cachez une grande sensibilité mais vous jugez inapproprié de la montrer au travail. L'émotion la plus courante chez vous est la colère." }
    ]
  },
  {
    id: 5,
    title: "Vous êtes invité.e à une soirée que faites-vous ?",
    description: "Classez ces options de 6 (plus important) à 1 (moins important)",
    options: [
      { id: "square", shape: "⬜", text: "Je trouve un endroit tranquille où je peux me détendre et observer. Je participe aux conversations si on m'y invite." },
      { id: "cross", shape: "✚", text: "Je cherche des conversations profondes où je peux exprimer mes valeurs" },
      { id: "circle", shape: "⚪", text: "Conscient.e de mon charisme, je suis à mon aise au centre de l'attention. Je suis le premier à proposer des jeux ou des activités pour pimenter la soirée." },
      { id: "star", shape: "⭐", text: "Je m'assure que chacun se sente le bienvenu et à son aise. Je passe du temps à discuter avec les gens et je cherche à créer des liens." },
      { id: "moon", shape: "🌙", text: "Je suis venu.e pour rire et m'amuser ! Je fais des blagues, je taquine les autres et on compte sur moi pour rendre la soirée plus légère et amusante." },
      { id: "triangle", shape: "🔺", text: "Je me rends utile, que ce soit en aidant à organiser ou en prenant part à des conversations structurées et intéressantes." }
    ]
  },
  {
    id: 6,
    title: "Comment sont vos interactions ?",
    description: "Classez ces options de 6 (plus important) à 1 (moins important)",
    options: [
      { id: "star", shape: "⭐", text: "Vous ressentez en premier, les gens, les ambiances, les humeurs et vos relations aux autres sont souvent dictées par vos ressentis. Il vous arrive de vous suradapter pour convenir aux attentes des autres ou au moins de ne pas risquer de déplaire." },
      { id: "moon", shape: "🌙", text: "Vous êtes du genre réactif ! Si quelqu'un ne vous plait, il le saura vite ! Vous adorez ou vous détestez mais vous ne faites pas semblant (même par politesse)." },
      { id: "triangle", shape: "🔺", text: "Votre communication est souvent basée sur un échange d'informations concrètes et utiles." },
      { id: "square", shape: "⬜", text: "Face à de nouvelles rencontres, vous êtes souvent en difficulté. Vous n'allez pas ou très peu au-devant des gens et vous attendez d'être sollicité." },
      { id: "circle", shape: "⚪", text: "Vous êtes orienté vers l'action et peu porté sur les échanges « inutiles » Avec un objectif, vous serez charmeur, sans objectif, vous ne prenez pas de gant avec les gens. Vous êtes indépendant." },
      { id: "cross", shape: "✚", text: "Vous évaluez les gens selon vos opinions ; vous avez le jugement facile et vous pouvez être perçu comme autoritaire." }
    ]
  },
  {
    id: 7,
    title: "Dans une équipe, quel rôle avez-vous tendance à jouer ?",
    description: "Classez ces options de 6 (plus important) à 1 (moins important)",
    options: [
      { id: "moon", shape: "🌙", text: "J'injecte de la créativité et de la légèreté dans l'équipe pour maintenir la motivation." },
      { id: "cross", shape: "✚", text: "Je veille à ce que les décisions soient prises de manière juste et équitable." },
      { id: "circle", shape: "⚪", text: "J'encourage l'équipe à passer à l'action rapidement et efficacement." },
      { id: "triangle", shape: "🔺", text: "J'organise les tâches et m'assure que les objectifs soient atteints." },
      { id: "square", shape: "⬜", text: "J'analyse les situations et propose des idées réfléchies." },
      { id: "star", shape: "⭐", text: "Je m'assure que tout le monde se sente bien et que l'équipe est soudée." }
    ]
  }
];