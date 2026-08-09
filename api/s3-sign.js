import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const allowedPrefixes = ["site-images/", "posts/"];

function isAllowedObjectPath(value) {
  return typeof value === "string" && value.length > 0 && value.length <= 1024 && !value.startsWith("/") && !value.includes("..") && allowedPrefixes.some((prefix) => value.startsWith(prefix));
}

function configuredClient() {
  // VITE_AWS_* is a temporary migration fallback for the existing Vercel
  // project. These names are never referenced by client code, so this function
  // can use them without bundling them. Replace them with AWS_* after rotating
  // the compromised key.
  const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || process.env.VITE_AWS_ACCESS_KEY_ID;
  const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || process.env.VITE_AWS_SECRET_ACCESS_KEY;
  const AWS_REGION = process.env.AWS_REGION || process.env.VITE_AWS_REGION || "us-east-1";
  const AWS_ENDPOINT = process.env.AWS_ENDPOINT || process.env.VITE_AWS_ENDPOINT;
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_ENDPOINT) return null;
  return new S3Client({
    region: AWS_REGION,
    endpoint: AWS_ENDPOINT,
    credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY },
  });
}

async function isAdminRequest(req) {
  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const SUPABASE_URL = process.env.SUPABASE_URL || "https://pwbhrnxmhxtmjshwvccn.supabase.co";
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3YmhybnhtaHh0bWpzaHd2Y2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDMxMTgsImV4cCI6MjA4OTA3OTExOH0.4URujnB9opUR0VqWpCR85n1RZ4L4SN_8SqK2Q_ab7jg";
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "dinmaybrahmaofficial@gmail.com";
  if (!token || !SUPABASE_URL || !SUPABASE_ANON_KEY || !ADMIN_EMAIL) return false;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_ANON_KEY },
  });
  if (!response.ok) return false;
  const user = await response.json();
  return user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { object_path: objectPath, mode, content_type: contentType } = req.body ?? {};
  if (!isAllowedObjectPath(objectPath) || !["read", "write"].includes(mode)) return res.status(400).json({ error: "Invalid signing request" });
  if (mode === "write" && !(await isAdminRequest(req))) return res.status(403).json({ error: "Administrator authentication is required for uploads" });

  const client = configuredClient();
  const bucket = process.env.AWS_BUCKET_NAME || process.env.VITE_AWS_BUCKET_NAME;
  if (!client || !bucket) return res.status(500).json({ error: "Storage signer is not configured" });

  const command = mode === "read"
    ? new GetObjectCommand({ Bucket: bucket, Key: objectPath })
    : new PutObjectCommand({ Bucket: bucket, Key: objectPath, ContentType: contentType || "application/octet-stream" });
  const expiresIn = mode === "read" ? 300 : 900;
  const url = await getSignedUrl(client, command, { expiresIn });
  return res.status(200).json({ url, expires_in: expiresIn, method: mode === "read" ? "GET" : "PUT" });
}
