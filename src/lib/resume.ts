/** Turn an old, expiring B2 résumé URL into a stable link on this site. */
export function getResumeHref(value: string): string {
  try {
    const url = new URL(value);
    if (!url.hostname.endsWith(".backblazeb2.com")) return value;

    const segments = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);
    const objectPath = (url.hostname.startsWith("s3.") ? segments.slice(1) : segments).join("/");
    if (!/^site-images\/resume\.(pdf|doc|docx)$/i.test(objectPath)) return value;

    return `/api/resume?object_path=${encodeURIComponent(objectPath)}`;
  } catch {
    return value;
  }
}
