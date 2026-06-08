import { decode } from "blurhash";

const cache = new Map<string, string>();

export function blurhashToDataUrl(hash: string, w = 32, h = 32): string {
  if (!hash) return "";
  const key = `${hash}_${w}_${h}`;
  const hit = cache.get(key);
  if (hit) return hit;
  try {
    const pixels = decode(hash, w, h);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.createImageData(w, h);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
    const url = canvas.toDataURL();
    cache.set(key, url);
    return url;
  } catch {
    return "";
  }
}
