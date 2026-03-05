import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const endpoint = process.env.AWS_ENDPOINT_URL;
const ddb = new DynamoDBClient({ region: "us-east-1", ...(endpoint && { endpoint }) });

export const handler = async (event) => {
  const id =
    event?.pathParameters?.id ||
    event?.queryStringParameters?.id ||
    (event?.rawPath ? event.rawPath.split("/").pop() : null);

  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ error: "missing id" }) };
  }

  const res = await ddb.send(
    new GetItemCommand({
      TableName: process.env.DDB_TABLE,
      Key: { resultId: { S: id } },
    })
  );

  if (!res.Item) {
    return { statusCode: 404, body: JSON.stringify({ error: "not found" }) };
  }

  // ✅ Champs stockés par scoring-fn (string JSON)
  const scores = res.Item.scores ? JSON.parse(res.Item.scores.S) : {};
  const pourcentages = res.Item.pourcentages ? JSON.parse(res.Item.pourcentages.S) : {};
  const typePrincipal = res.Item.typePrincipal ? res.Item.typePrincipal.S : null;
  const classement = res.Item.classement ? JSON.parse(res.Item.classement.S) : [];

  // (optionnel) infos de statut rapport
  const reportStatus = res.Item.reportStatus ? res.Item.reportStatus.S : null;
  const reportKey = res.Item.reportKey ? res.Item.reportKey.S : null;

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      resultId: id,
      scores,
      pourcentages,
      typePrincipal,
      classement,
      reportStatus,
      reportKey,
    }),
  };
};
