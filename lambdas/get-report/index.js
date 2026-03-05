import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.AWS_ENDPOINT_URL;
const s3 = new S3Client({ region: "us-east-1", ...(endpoint && { endpoint }), forcePathStyle: !!endpoint });

const streamToString = async (stream) =>
  await new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (c) => chunks.push(c));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });

export const handler = async (event) => {
  const id =
    event?.pathParameters?.id ||
    event?.queryStringParameters?.id ||
    (event?.rawPath ? event.rawPath.split("/").pop() : null);

  if (!id) return { statusCode: 400, body: JSON.stringify({ error: "missing id" }) };

  const key = `reports/${id}.json`;

  try {
    const res = await s3.send(new GetObjectCommand({
      Bucket: process.env.REPORTS_BUCKET,
      Key: key
    }));

    const body = await streamToString(res.Body);

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body
    };
  } catch {
    return { statusCode: 404, body: JSON.stringify({ error: "report not found" }) };
  }
};
