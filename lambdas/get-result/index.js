import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const endpoint = process.env.AWS_ENDPOINT_URL || "http://host.docker.internal:4566";
const ddb = new DynamoDBClient({ region: "us-east-1", endpoint });

export const handler = async (event) => {
  const id = event?.pathParameters?.id || event?.queryStringParameters?.id;
  if (!id) return { statusCode: 400, body: JSON.stringify({ error: "missing id" }) };

  const res = await ddb.send(new GetItemCommand({
    TableName: process.env.DDB_TABLE,
    Key: { resultId: { S: id } }
  }));

  if (!res.Item) return { statusCode: 404, body: JSON.stringify({ error: "not found" }) };

  const item = {
    resultId: res.Item.resultId.S,
    createdAt: res.Item.createdAt.S,
    percent: JSON.parse(res.Item.percent.S),
    reportStatus: res.Item.reportStatus.S,
    reportKey: res.Item.reportKey?.S || null
  };

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(item)
  };
};
