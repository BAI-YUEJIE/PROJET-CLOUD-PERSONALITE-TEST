// lambdas/getQuestions/handler.js
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { createS3Client } = require("../../shared/awsClients");
const { json } = require("../../shared/http");

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

exports.handler = async () => {
  const s3 = createS3Client();

  const bucket = process.env.QUESTIONS_BUCKET || "personality-assets";
  const key = process.env.QUESTIONS_KEY || "questions.json";

  try {
    const resp = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const raw = await streamToString(resp.Body);
    const questions = JSON.parse(raw);

    return json(200, { questions });
  } catch (err) {
    console.error("getQuestions error:", err);
    return json(500, {
      message: "Failed to load questions",
      bucket,
      key,
      error: err?.message || String(err),
    });
  }
};
