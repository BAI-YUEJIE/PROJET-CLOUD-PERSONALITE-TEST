import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import crypto from "crypto";

// En local avec LocalStack, définir AWS_ENDPOINT_URL=http://localhost:4566
// En production AWS, ne pas définir cette variable (le SDK utilise les endpoints natifs)
const endpoint = process.env.AWS_ENDPOINT_URL;

const ddb = new DynamoDBClient({ region: "us-east-1", ...(endpoint && { endpoint }) });
const sqs = new SQSClient({ region: "us-east-1", ...(endpoint && { endpoint }) });

function calculerGeometrie(tousLesClassements) {
  const scores = {
    square: 0,
    triangle: 0,
    circle: 0,
    moon: 0,
    star: 0,
    cross: 0,
  };

  // tousLesClassements = { "1": {square:6,...}, "2": {...}, ... }
 Object.values(tousLesClassements || {}).forEach((classement) => {
  if (!classement || typeof classement !== "object") return;

  Object.entries(classement).forEach(([typeId, rang]) => {
    if (scores[typeId] !== undefined) {
      scores[typeId] += Number(rang || 0);
    }
  });
});

  const scoreTotal = Object.values(scores).reduce((sum, s) => sum + s, 0) || 1;

  const pourcentages = {};
  Object.entries(scores).forEach(([type, score]) => {
    pourcentages[type] = parseFloat(((score / scoreTotal) * 100).toFixed(1));
  });

  const classement = Object.entries(scores)
    .map(([type, score]) => ({
      type,
      score,
      pourcentage: pourcentages[type],
    }))
    .sort((a, b) => b.score - a.score);

  return {
    scores,
    pourcentages,
    typePrincipal: classement[0]?.type,
    classement,
  };
}

export const handler = async (event) => {
  const body = event.body ? JSON.parse(event.body) : event;

  // Supporte 2 formats :
  // - { tousLesClassements: {...} } (recommandé)
  // - {...} directement (si elle envoie l'objet brut)
 const tousLesClassements = body?.tousLesClassements ?? body?.rankings ?? body;

  const calc = calculerGeometrie(tousLesClassements);

  const resultId = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  // Sauvegarde DynamoDB (mêmes champs que le front + statut rapport)
  await ddb.send(
    new PutItemCommand({
      TableName: process.env.DDB_TABLE,
      Item: {
        resultId: { S: resultId },
        createdAt: { S: createdAt },

        scores: { S: JSON.stringify(calc.scores) },
        pourcentages: { S: JSON.stringify(calc.pourcentages) },
        typePrincipal: { S: String(calc.typePrincipal || "") },
        classement: { S: JSON.stringify(calc.classement) },

        reportStatus: { S: "PENDING" },
      },
    })
  );

  // Déclenche génération rapport async
  await sqs.send(
    new SendMessageCommand({
      QueueUrl: process.env.SQS_QUEUE_URL,
      MessageBody: JSON.stringify({ resultId }),
    })
  );

  // Réponse EXACTE attendue par le frontend
  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      resultId,
      scores: calc.scores,
      pourcentages: calc.pourcentages,
      typePrincipal: calc.typePrincipal,
      classement: calc.classement,
    }),
  };
};
