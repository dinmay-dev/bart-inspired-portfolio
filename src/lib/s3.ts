import { supabase } from "@/lib/supabase";

const SIGN_URL = `https://pwbhrnxmhxtmjshwvccn.supabase.co/functions/v1/s3-sign`;
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3YmhybnhtaHh0bWpzaHd2Y2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDMxMTgsImV4cCI6MjA4OTA3OTExOH0.4URujnB9opUR0VqWpCR85n1RZ4L4SN_8SqK2Q_ab7jg";

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

export async function signS3(object_path: string, mode: "read" | "write"): Promise<SignResult> {
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

export async function uploadToS3(file: Blob, object_path: string, onProgress?: (pct: number) => void): Promise<void> {
  const { url } = await signS3(object_path, "write");
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
