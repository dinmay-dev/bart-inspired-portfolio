import imageCompression from "browser-image-compression";
import { encode } from "blurhash";

export interface ProcessedImage {
  blob: Blob;
  width: number;
  height: number;
  blurhash: string;
  mime: string;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function getImageData(img: HTMLImageElement, maxDim = 32): ImageData {
  const ratio = img.width / img.height;
  const w = ratio >= 1 ? maxDim : Math.round(maxDim * ratio);
  const h = ratio >= 1 ? Math.round(maxDim / ratio) : maxDim;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}

export async function processImage(file: File, isCertificate = false): Promise<ProcessedImage> {
  const compressed = await imageCompression(file, {
    maxSizeMB: isCertificate ? 1.2 : 0.5,
    maxWidthOrHeight: isCertificate ? 2400 : 1920,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: isCertificate ? 0.88 : 0.82,
  });

  const url = URL.createObjectURL(compressed);
  try {
    const img = await loadImage(url);
    const data = getImageData(img);
    const hash = encode(data.data, data.width, data.height, 4, 3);
    return {
      blob: compressed,
      width: img.naturalWidth,
      height: img.naturalHeight,
      blurhash: hash,
      mime: compressed.type || "image/webp",
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}
