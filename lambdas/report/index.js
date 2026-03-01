import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.AWS_ENDPOINT_URL || "http://host.docker.internal:4566";

const ddb = new DynamoDBClient({ region: "us-east-1", endpoint });
const s3  = new S3Client({ region: "us-east-1", endpoint, forcePathStyle: true });

export const handler = async (event) => {
  // event.Records venant de SQS
  for (const record of event.Records || []) {
    const msg = JSON.parse(record.body);
    const resultId = msg.resultId;

    // 1) lire DynamoDB
    const res = await ddb.send(new GetItemCommand({
      TableName: process.env.DDB_TABLE,
      Key: { resultId: { S: resultId } }
    }));

    if (!res.Item) continue;

    const percent = JSON.parse(res.Item.percent.S);
    const createdAt = res.Item.createdAt.S;

    // 2) générer rapport JSON
    const report = {
      resultId,
      createdAt,
      percent,
      top3: Object.entries(percent)
        .sort((a,b) => b[1]-a[1])
        .slice(0,3)
        .map(([type, score]) => ({ type, score }))
    };

    const keyJson = `reports/${resultId}.json`;

    // 3) écrire dans S3
    await s3.send(new PutObjectCommand({
      Bucket: process.env.REPORTS_BUCKET,
      Key: keyJson,
      Body: JSON.stringify(report, null, 2),
      ContentType: "application/json"
    }));

    // 4) update DynamoDB status + s3Key
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
