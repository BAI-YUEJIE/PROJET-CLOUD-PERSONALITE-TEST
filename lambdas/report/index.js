import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.AWS_ENDPOINT_URL;

const ddb = new DynamoDBClient({ region: "us-east-1", ...(endpoint && { endpoint }) });
const s3  = new S3Client({ region: "us-east-1", ...(endpoint && { endpoint }), forcePathStyle: !!endpoint });

export const handler = async (event) => {
  for (const record of event.Records || []) {
    const msg = JSON.parse(record.body);
    const resultId = msg.resultId;

    // 1) Lire le résultat depuis DynamoDB (format mock)
    const res = await ddb.send(new GetItemCommand({
      TableName: process.env.DDB_TABLE,
      Key: { resultId: { S: resultId } }
    }));
    if (!res.Item) continue;

    const createdAt = res.Item.createdAt?.S || new Date().toISOString();
    const scores = res.Item.scores ? JSON.parse(res.Item.scores.S) : {};
    const pourcentages = res.Item.pourcentages ? JSON.parse(res.Item.pourcentages.S) : {};
    const typePrincipal = res.Item.typePrincipal?.S || null;
    const classement = res.Item.classement ? JSON.parse(res.Item.classement.S) : [];

    // 2) Construire le rapport JSON (S3)
    const report = {
      resultId,
      createdAt,
      scores,
      pourcentages,
      typePrincipal,
      classement
    };

    const keyJson = `reports/${resultId}.json`;

    // 3) Ecrire dans S3
    await s3.send(new PutObjectCommand({
      Bucket: process.env.REPORTS_BUCKET,
      Key: keyJson,
      Body: JSON.stringify(report, null, 2),
      ContentType: "application/json"
    }));

    // 4) Update statut + clé rapport dans DynamoDB
    await ddb.send(new UpdateItemCommand({
      TableName: process.env.DDB_TABLE,
      Key: { resultId: { S: resultId } },
      UpdateExpression: "SET reportStatus = :s, reportKey = :k",
      ExpressionAttributeValues: {
        ":s": { S: "READY" },
        ":k": { S: keyJson }
      }
    }));
  }

  return { statusCode: 200 };
};
