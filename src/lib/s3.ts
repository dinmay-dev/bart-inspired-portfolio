import { supabase } from "@/lib/supabase";

// This Vercel Function keeps the B2 credentials in server-side encrypted
// environment variables; nothing with a VITE_ prefix is used for storage.
const SIGN_URL = "/api/s3-sign";

interface SignResult {
  url: string;
  expires_in: number;
  method: string;
}

async function getAuthHeader(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ? `Bearer ${data.session.access_token}` : null;
}

export async function signS3(object_path: string, mode: "read" | "write", fileType?: string): Promise<SignResult> {
  const authorization = await getAuthHeader();
  const res = await fetch(SIGN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body: JSON.stringify({ object_path, mode, content_type: fileType }),
  });
  if (!res.ok) throw new Error(`Sign failed: ${await res.text()}`);
  return res.json();
}

// Cache URLs in memory but refresh before the five-minute server-side expiry.
const readCache = new Map<string, { url: string; expiresAt: number }>();
const TTL_MS = 4 * 60 * 1000;

export async function getReadUrl(object_path: string): Promise<string> {
  const now = Date.now();
  const cached = readCache.get(object_path);
  if (cached && cached.expiresAt > now) return cached.url;
  const { url } = await signS3(object_path, "read");
  readCache.set(object_path, { url, expiresAt: now + TTL_MS });
  return url;
}

/** Persist object paths, never expiring presigned URLs. */
export function toS3Reference(objectPath: string): string {
  return `s3:${objectPath.replace(/^\/+/, "")}`;
}

/**
 * Accepts the durable `s3:path` format and migrates legacy B2 presigned URLs
 * at read time, so the existing database value does not need manual repair.
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

    // B2 S3 URLs use /<bucket>/<object-path>.
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
