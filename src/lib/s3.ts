import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { supabase } from "@/lib/supabase";

const SIGN_URL = `https://pwbhrnxmhxtmjshwvccn.supabase.co/functions/v1/s3-sign`;
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3YmhybnhtaHh0bWpzaHd2Y2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDMxMTgsImV4cCI6MjA4OTA3OTExOH0.4URujnB9opUR0VqWpCR85n1RZ4L4SN_8SqK2Q_ab7jg";

// AWS/B2 Credentials from environment variables
const ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const REGION = import.meta.env.VITE_AWS_REGION || "us-east-1";
const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME || "dimnay-portfolio-data";
const ENDPOINT = import.meta.env.VITE_AWS_ENDPOINT;

const hasDirectS3 = !!(ACCESS_KEY_ID && SECRET_ACCESS_KEY);

const s3Client = hasDirectS3
  ? new S3Client({
      region: REGION,
      endpoint: ENDPOINT || undefined,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
    })
  : null;

interface SignResult {
  url: string;
  expires_in: number;
  method: string;
}

async function getAuthHeader(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token ?? SUPABASE_ANON_KEY;
  return `Bearer ${token}`;
}

export async function signS3(object_path: string, mode: "read" | "write", fileType?: string): Promise<SignResult> {
  if (hasDirectS3 && s3Client) {
    if (mode === "read") {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: object_path,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 900 }); // Valid for 15 minutes
      return { url, expires_in: 900, method: "GET" };
    } else {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: object_path,
        ContentType: fileType || "application/octet-stream",
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // Valid for 1 hour
      return { url, expires_in: 3600, method: "PUT" };
    }
  }

  const res = await fetch(SIGN_URL, {
    method: "POST",
    headers: {
      Authorization: await getAuthHeader(),
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ object_path, mode }),
  });
  if (!res.ok) throw new Error(`Sign failed: ${await res.text()}`);
  return res.json();
}

// In-memory cache for read URLs (signed URLs valid ~15min; refresh after 12min)
const readCache = new Map<string, { url: string; expiresAt: number }>();
const TTL_MS = 12 * 60 * 1000;

export async function getReadUrl(object_path: string): Promise<string> {
  const now = Date.now();
  const cached = readCache.get(object_path);
  if (cached && cached.expiresAt > now) return cached.url;
  const { url } = await signS3(object_path, "read");
  readCache.set(object_path, { url, expiresAt: now + TTL_MS });
  return url;
}

/**
 * Persist object paths, never presigned URLs.  The latter include an expiry
 * timestamp and will eventually fail when reused from site content.
 */
export function toS3Reference(objectPath: string): string {
  return `s3:${objectPath.replace(/^\/+/, "")}`;
}

/**
 * Resolve both the current durable `s3:path` form and the old B2 presigned
 * URL form.  This keeps existing content working while new uploads are saved
 * as durable object references.
 */
export async function resolveStoredS3Url(value: string): Promise<string> {
  const objectPath = getStoredS3ObjectPath(value);
  return objectPath ? getReadUrl(objectPath) : value;
}

function getStoredS3ObjectPath(value: string): string | null {
  if (value.startsWith("s3:")) {
    const path = value.slice(3).replace(/^\/+/, "");
    return path || null;
  }

  try {
    const url = new URL(value);
    const isLegacyB2Url =
      url.hostname.endsWith("backblazeb2.com") &&
      url.searchParams.has("X-Amz-Algorithm");

    if (!isLegacyB2Url) return null;

    // B2 S3 URLs use /<bucket>/<object-path>. The bucket is configured by
    // the signer, so only the object path belongs in the stored reference.
    const [, , ...objectSegments] = url.pathname.split("/");
    const path = objectSegments.map(decodeURIComponent).join("/");
    return path || null;
  } catch {
    return null;
  }
}

export async function uploadToS3(file: Blob, object_path: string, onProgress?: (pct: number) => void): Promise<void> {
  const { url } = await signS3(object_path, "write", file.type);
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status} ${xhr.responseText}`)));
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });
}
