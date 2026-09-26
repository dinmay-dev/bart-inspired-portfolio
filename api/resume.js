import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  if (req.method !== "GET") return res.status(405).end();

  const objectPath = req.query?.object_path;
  if (typeof objectPath !== "string" || !/^site-images\/resume\.(pdf|doc|docx)$/i.test(objectPath)) {
    return res.status(400).end();
  }

  const accessKeyId = process.env.VITE_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.VITE_AWS_SECRET_ACCESS_KEY;
  const endpoint = process.env.VITE_AWS_ENDPOINT;
  const bucket = process.env.VITE_AWS_BUCKET_NAME;
  if (!accessKeyId || !secretAccessKey || !endpoint || !bucket) {
    return res.status(500).end();
  }

  try {
    const client = new S3Client({
      region: process.env.VITE_AWS_REGION || "us-east-1",
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });
    const url = await getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: objectPath }), { expiresIn: 300 });
    return res.redirect(302, url);
  } catch (error) {
    console.error("Résumé signing failed", error);
    return res.status(500).end();
  }
}
