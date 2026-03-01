import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import crypto from "crypto";

const endpoint = process.env.AWS_ENDPOINT_URL || "http://localhost:4566";

const ddb = new DynamoDBClient({ region: "us-east-1", endpoint });
const sqs = new SQSClient({ region: "us-east-1", endpoint });

function toPercent(sums) {
  const total = Object.values(sums).reduce((a, b) => a + b, 0) || 1;
  const pct = {};
  for (const k of Object.keys(sums)) pct[k] = Math.round((sums[k] / total) * 100);
  return pct;
}

export const handler = async (event) => {
  const body = event.body ? JSON.parse(event.body) : event;
  const answers = body.answers || [];

  const sums = { T1: 0, T2: 0, T3: 0, T4: 0, T5: 0, T6: 0 };
  for (const a of answers) {
    if (sums[a.type] !== undefined) sums[a.type] += Number(a.value || 0);
  }

  const percent = toPercent(sums);
  const resultId = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  await ddb.send(new PutItemCommand({
    TableName: process.env.DDB_TABLE,
    Item: {
      resultId: { S: resultId },
      createdAt: { S: createdAt },
      sums: { S: JSON.stringify(sums) },
      percent: { S: JSON.stringify(percent) },
      reportStatus: { S: "PENDING" }
    },
  }));

  await sqs.send(new SendMessageCommand({
    QueueUrl: process.env.SQS_QUEUE_URL,
    MessageBody: JSON.stringify({ resultId }),
  }));

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ resultId, percent }),
  };
};
