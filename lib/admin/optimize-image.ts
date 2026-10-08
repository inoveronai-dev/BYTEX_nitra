/** Client-side image resize/compress before upload (Vercel ~4.5 MB body limit). */

const MAX_DIMENSION = 2400;
const TARGET_MAX_BYTES = 2.5 * 1024 * 1024;
const MIN_QUALITY = 0.55;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Nepodarilo sa načítať obrázok."));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Resize long edge to ≤2400px and JPEG-compress until under ~2.5 MB when possible.
 * Non-images / tiny files are returned unchanged.
 */
export async function optimizeImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (file.size <= TARGET_MAX_BYTES && file.type === "image/webp") {
    // Still may need dimension clamp
  }

  try {
    const img = await loadImage(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);

    const outType = file.type === "image/png" ? "image/png" : "image/jpeg";
    let quality = 0.85;
    let blob = await canvasToBlob(canvas, outType, quality);

    if (outType === "image/jpeg") {
      while (blob && blob.size > TARGET_MAX_BYTES && quality > MIN_QUALITY) {
        quality -= 0.1;
        blob = await canvasToBlob(canvas, outType, quality);
      }
    }

    if (!blob) return file;

    // Prefer optimized only if smaller or we resized
    if (blob.size >= file.size && scale >= 1) return file;

    const base = file.name.replace(/\.[^.]+$/, "") || "image";
    const ext = outType === "image/png" ? ".png" : ".jpg";
    return new File([blob], `${base}${ext}`, { type: outType, lastModified: Date.now() });
  } catch {
    return file;
  }
}
